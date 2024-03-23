import json
import os
import re
from smtplib import SMTPException

from django.contrib.auth import authenticate, login, logout
from django.http import BadHeaderError, HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.db.models import Count
from django.core.mail import send_mail

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .forms import SignupForm, LoginForm, PostForm
from .models import Category, CustomUser, Profile, Post, Comment

from rest_framework_simplejwt.tokens import RefreshToken

from .profanity import load_model_and_vectorizer, predict_hate_speech
trained_model, vectorizer = load_model_and_vectorizer()

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(json.loads(request.body))

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'isAuthenticated': True
                })
            else:
                return JsonResponse({'error': 'User is not authenticated', 'isAuthenticated': False}, status=401)
        else:
            return JsonResponse({'error': 'Form is not valid', 'isAuthenticated': False}, status=401)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@api_view(['POST'])
def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(json.loads(request.body))

        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
        
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
                
            if len(password) < 8 or not re.search(r"[A-Z]", password) or not re.search(r"[a-z]", password) or not re.search(r"[0-9]", password) or not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
                return JsonResponse({'error': 'Password must be 8+ characters long with uppercase, lowercase, number, and special character'}, status=400)
            
            new_user = CustomUser(username=username, email=email)
            new_user.set_password(password)
            new_user.save()

            new_profile = Profile(user_acc=new_user)
            new_profile.save()

            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'isAuthenticated': True
                })
            else:
                return JsonResponse({'error': 'Authentication failed', 'isAuthenticated': False}, status=401)
            
        else:
            return JsonResponse({'error': 'Form is not valid', 'isAuthenticated': False}, status=401)

@csrf_exempt
def logout_view(request: HttpRequest) -> HttpResponse:
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'logout': True})
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    user_object = CustomUser.objects.get(id=request.user.id)
    user_profile = Profile.objects.get(user_acc=user_object.id)
    if user.is_authenticated:
        profile_data = {
            'username': user.username,
            'email': user.email,
            'profile_image': request.build_absolute_uri(user_profile.profile_image.url) if user_profile and user_profile.profile_image else None,
        }
        return JsonResponse(profile_data)
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=403)
    
@csrf_exempt
@api_view(['GET'])
def get_user_id(request):
    if request.user.is_authenticated:
        user_object = CustomUser.objects.get(id=request.user.id)
        return JsonResponse({'user_id': user_object.id}, status=200)
    return JsonResponse({'message': 'user not logged in'})

@csrf_exempt
@permission_classes([IsAuthenticated])
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated:
            username = request.POST.get('username')
            currentPassword = request.POST.get('currentPassword')
            newPassword = request.POST.get('newPassword')
            profile_image = request.FILES.get('profile_image')
            if username:
                if CustomUser.objects.filter(username=username).exists() == False:
                    user.username = username
                else:
                    return JsonResponse({'error': 'Username already exists'}, status=400)
            if currentPassword:
                if user.check_password(currentPassword):
                    if newPassword and len(newPassword) > 8 and re.search(r"[A-Z]", newPassword) and re.search(r"[a-z]", newPassword) and re.search(r"[0-9]", newPassword) and re.search(r"[!@#$%^&*(),.?\":{}|<>]", newPassword):
                        user.set_password(newPassword)
                    else:
                        return JsonResponse({'error': 'New password must be 8+ characters long with uppercase, lowercase, number, and special character'}, status=400)
                else:
                    return JsonResponse({'error': 'Password is invalid'}, status=400)
            
            if profile_image:
                fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'profile_images'))
                filename = fs.save(profile_image.name, profile_image)
                user_object = CustomUser.objects.get(id=request.user.id)
                user_profile = Profile.objects.get(user_acc=user_object.id)
                user_profile.profile_image = 'profile_images/' + filename
                user_profile.save()
            
            user.save()

            return JsonResponse({'message': 'Profile updated successfully'})
        else:
            return JsonResponse({'error': 'User not authenticated'}, status=403)
    else:
        return JsonResponse({'error': 'Empty request body'}, status=400)

def get_categories(request):
    if request.method == 'GET':
        base_icon_url = "http://localhost:8000" + settings.MEDIA_URL
        categories = Category.objects.all().values('id', 'name', 'icon')
        categories_data = []
        for category in categories:
            category_data = {
                'id': category['id'],
                'name': category['name'],
                'icon': base_icon_url + category['icon'] if category['icon'] else None
            }
            categories_data.append(category_data)
        return JsonResponse(categories_data, safe=False)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_recent_posts(request):
    if request.method == 'GET':
        recent_posts = Post.objects.all().order_by('-created_at')[:5]
        serialized_posts = []

        for post in recent_posts:
            user_object = CustomUser.objects.get(id=post.writer.id)
            user_profile = Profile.objects.get(user_acc=user_object.id)
            serialized_post = {
                'id': post.id,
                'title': post.title,
                'type': post.get_post_type_display(),
                'category': post.category.name,
                'profile_image': request.build_absolute_uri(user_profile.profile_image.url) if user_profile and user_profile.profile_image else None,
                'saved_by': post.saved_by.count(),
                'comments': post.comments.count(),
            }
            serialized_posts.append(serialized_post)
        return JsonResponse(serialized_posts, safe=False)
    
def get_popular_posts(request):
    most_interacted_posts = Post.objects.annotate(num_comments=Count('comments'), num_saves=Count('saved_by')).order_by('-num_comments', '-num_saves')[:5]
    serialized_posts = []

    for post in most_interacted_posts:
        user_object = CustomUser.objects.get(id=post.writer.id)
        user_profile = Profile.objects.get(user_acc=user_object.id)
        serialized_post = {
            'id': post.id,
            'title': post.title,
            'type': post.get_post_type_display(),
            'category': post.category.name,
            'profile_image': request.build_absolute_uri(user_profile.profile_image.url) if user_profile and user_profile.profile_image else None,
            'saved_by': post.saved_by.count(),
            'comments': post.comments.count(),
        }
        serialized_posts.append(serialized_post)
    return JsonResponse(serialized_posts, safe=False)

def get_posts_by_category(request, category_name):
    if request.method == 'GET':
        try:
            category = Category.objects.get(name=category_name)
            posts = Post.objects.filter(category=category)
            serialized_posts = []

            for post in posts:
                user_object = CustomUser.objects.get(id=post.writer.id)
                user_profile = Profile.objects.get(user_acc=user_object.id)
                serialized_post = {
                    'id': post.id,
                    'title': post.title,
                    'type': post.get_post_type_display(),
                    'image': post.image.url if post.image else None,
                    'writer': post.writer.username,
                    'profile_image': request.build_absolute_uri(user_profile.profile_image.url) if user_profile and user_profile.profile_image else None,
                    'saved_by': post.saved_by.count(),
                    'comments': post.comments.count(),
                    'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
                }
                serialized_posts.append(serialized_post)
            return JsonResponse(serialized_posts, safe=False)
        except Category.DoesNotExist:
            return JsonResponse({'error': f'Category "{category_name}" does not exist'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
def get_post(request, category_name, post_id):
    if request.method == 'GET':
        try:
            category = Category.objects.get(name=category_name)
            post = Post.objects.get(id=post_id, category=category)
            user_object = CustomUser.objects.get(id=post.writer.id)
            user_profile = Profile.objects.get(user_acc=user_object.id)
            serialized_posts = {
                'id': post.id,
                'title': post.title,
                'category': post.category.name,
                'type': post.get_post_type_display(),
                'body': post.body,
                'image':request.build_absolute_uri(post.image.url) if post.image else None,
                'writer': post.writer.username,
                'writer_id': post.writer.id,
                'profile_image': request.build_absolute_uri(user_profile.profile_image.url) if user_profile and user_profile.profile_image else None,
                'saved_by': [user.username for user in post.saved_by.all()],
                'comments': [Comment.to_dict(comment, request) for comment in post.comments.all()],
                'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            return JsonResponse(serialized_posts, safe=False)
        except Category.DoesNotExist:
            return JsonResponse({'error': f'Category "{category_name}" does not exist'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@permission_classes([IsAuthenticated])
def get_user_posts(request):
    if request.method == 'GET':
        posts = Post.objects.filter(writer=request.user)
        serialized_posts = []
        for post in posts:
            serialized_post = {
                'id': post.id,
                'title': post.title,
                'category': post.category.name,
                'category_id': post.category.id,
                'type': post.get_post_type_display(),
                'body': post.body,
                'image': request.build_absolute_uri(post.image.url) if post.image else None,
                'saved_by': [user.username for user in post.saved_by.all()],
                'comments': [Comment.to_dict(comment, request) for comment in post.comments.all()],
                'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            serialized_posts.append(serialized_post)
        return JsonResponse(serialized_posts, safe=False)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@permission_classes([IsAuthenticated])
def create_post(request):
    if request.method == 'POST':
        user = request.user
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post_text = form.cleaned_data['title'] + ' ' + form.cleaned_data['body']
            
            if predict_hate_speech(post_text, trained_model, vectorizer) == 0:
                return JsonResponse({'error': 'Post contains hate speech'}, status=400)
            elif predict_hate_speech(post_text, trained_model, vectorizer) == 1:
                return JsonResponse({'error': 'Post contains offensive language'}, status=400)
            else:
                print('no profanity')

            # if contains_profanity(post_text, trained_model, vectorizer):
            #     return JsonResponse({'error': 'Post contains profanity'}, status=400)
            # else:
            #     print('no profanity')
            
            new_post = Post(
                writer=user,
                title=form.cleaned_data['title'],
                category=form.cleaned_data['category'],
                post_type=form.cleaned_data['post_type'],
                body=form.cleaned_data['body']
            )

            # Handle image upload
            image = request.FILES.get('image')
            if image:
                fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'posts'))
                filename = fs.save(image.name, image)
                new_post.image = 'posts/' + filename

            new_post.save()
            return JsonResponse({'message': 'Post created successfully', 'post_id': new_post.id, 'category': new_post.category.name})
        else:
            return JsonResponse({'error': 'All fields need to be filled'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@permission_classes([IsAuthenticated])
def edit_post(request, post_id):
    if request.method == 'POST':
        user = request.user
        form = PostForm(request.POST, request.FILES)
        post = Post.objects.get(id=post_id)
        if post.writer == request.user:
            if form.is_valid():
                post_text = form.cleaned_data['title'] + ' ' + form.cleaned_data['body']
                if predict_hate_speech(post_text, trained_model, vectorizer) == 0:
                    return JsonResponse({'error': 'Post contains hate speech'}, status=400)
                if predict_hate_speech(post_text, trained_model, vectorizer) == 1:
                    return JsonResponse({'error': 'Post contains offensive language'}, status=400)

                post.writer = user
                post.title = form.cleaned_data['title']
                post.body=form.cleaned_data['body']
                
                # Handle image upload
                image = request.FILES.get('image')
                if image:
                    # Delete previous image if exists
                    if post.image:
                        # Delete previous image file
                        if os.path.isfile(post.image.path):
                            os.remove(post.image.path)
                        # Clear previous image reference
                        post.image = None
                    # Save new image
                    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'posts'))
                    filename = fs.save(image.name, image)
                    post.image = 'posts/' + filename

                category_instance = form.cleaned_data['category']
                print(category_instance)  # Check if it's a single instance
                post_type_instance=form.cleaned_data['post_type']
                print(post_type_instance)


                if isinstance(category_instance, Category):
                    if post_type_instance == 'Q' or post_type_instance == 'A':
                        post.category = category_instance
                        post.post_type = post_type_instance
                        post.save()
                        return JsonResponse({'message': 'Post updated successfully', 'post_id': post.id, 'category': post.category.name})
                    else:
                        return JsonResponse({'error': 'Invalid post type instance'}, status=400)
                else:
                    # Handle the case where the category_instance is not an instance of Category
                    return JsonResponse({'error': 'Invalid category instance'}, status=400)
            else:
                return JsonResponse({'errors': form.errors}, status=400)
                # return JsonResponse({'error': 'All fields need to be filled'}, status=400)
        else:
            return JsonResponse({'error': 'You can only edit your own posts'}, status=403)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@permission_classes([IsAuthenticated])    
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        if post.writer == request.user:
            post.delete()
            return JsonResponse({'message': 'Post deleted'})
        else:
            return JsonResponse({'error': 'You are not authorized to delete this post.'}, status=403)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['GET'])
def get_comments(request, category_name, post_id):
    category = Category.objects.get(name=category_name)
    post = Post.objects.get(id=post_id, category=category)
    comments = post.comments.all()
    comments_list = list(comments.values())
    return JsonResponse(comments_list, safe=False)

from django.template.loader import render_to_string

@csrf_exempt
@permission_classes([IsAuthenticated])
def create_comment(request, category_name, post_id):
    if request.method == 'POST':
        user = request.user
        if user.is_authenticated:
            category = Category.objects.get(name=category_name)
            post = Post.objects.get(id=post_id, category=category)
            data = json.loads(request.body)

            if predict_hate_speech(data['text'], trained_model, vectorizer) == 0:
                return JsonResponse({'error': 'Oops! Your comment has been detected to include hate speech, this is not permitted '}, status=400)
            elif predict_hate_speech(data['text'], trained_model, vectorizer) == 1:
                return JsonResponse({'error': 'Oops! Your comment includes offensive language. Please rephrase and submit '}, status=400)
            else:
                print('no profanity detected')
            # if contains_profanity(data['text'], trained_model, vectorizer):
            #     return JsonResponse({'error': 'Comment contains profanity'}, status=400)
            # else:
            #     print('no profanity')

            comment = Comment.objects.create(
                post=post,
                author=user,
                text=data['text']
            )
            try:
                html_content = render_to_string('email/reply_notification.html', {
                    'username': post.writer.username,
                    'post_title': post.title,
                    'reply_author': comment.author.username,
                    'reply_content': comment.text,
                    'link_to_post': f'http://localhost:3000/discussion/{post.category.name}/{post.id}/',  # Modified URL with post.category and post.id
                })
                send_mail(
                    subject=post.title + ' received a comment!',
                    message='You have received a new comment on your post. Check it out!',
                    html_message=html_content,
                    from_email='our.pursuit.web@gmail.com',
                    recipient_list=[post.writer.email]
                )
            except BadHeaderError:
                # Handle BadHeaderError (invalid header in email)
                return JsonResponse({'error': 'Invalid email header'}, status=500)
            except SMTPException as e:
                # Handle SMTPException (error in sending email)
                print(f'Error sending email: {e}')
                return JsonResponse({'error': 'Error sending email'}, status=500)

            return JsonResponse({'comment_id': comment.id}, status=201)
        else:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@csrf_exempt
@permission_classes([IsAuthenticated])
def update_comment(request, post_id, comment_id):
    if request.method == "POST":
        comment = Comment.objects.get(id=comment_id, post_id=post_id)
        data = json.loads(request.body)
        edited_text = data.get('editedText')
        if not edited_text:
            return JsonResponse({'error': 'No text provided for the comment.'}, status=400)
        if request.user != comment.author:
            return JsonResponse({'error': 'You can only edit your own comments.'}, status=403)
        
        if predict_hate_speech(edited_text, trained_model, vectorizer) == 0:
            return JsonResponse({'error': 'Post contains hate speech'}, status=400)
        elif predict_hate_speech(edited_text, trained_model, vectorizer) == 1:
            return JsonResponse({'error': 'Post contains offensive language'}, status=400)
        else:
            print('no profanity detected')
        # if contains_profanity(data['text'], trained_model, vectorizer):
        #     return JsonResponse({'error': 'Comment contains profanity'}, status=400)
        # else:
        #     print('no profanity')

        comment.text = edited_text
        comment.save()
        return JsonResponse({'message': 'Comment updated successfully.'})


@csrf_exempt
@permission_classes([IsAuthenticated])
def delete_comment(request, post_id, comment_id):
    if request.method == "DELETE":
        comment = Comment.objects.get(id=comment_id, post_id=post_id)
        print('user', request.user, ' comment', comment.author)
        if request.user != comment.author:
            return JsonResponse({'error': 'You can only delete your own comments.'}, status=404)
        comment.delete()
        return JsonResponse({'message': 'Comment deleted successfully.'})

@csrf_exempt
@permission_classes([IsAuthenticated])
def save_post(request, post_id):
    if request.method == 'POST':
        try:
            post = Post.objects.get(pk=post_id)
            user = request.user
            if user in post.saved_by.all():
                post.saved_by.remove(user)
                return JsonResponse({'message': 'Post removed from saved.', 'is_saved': False}, status=200)
            else:
                post.saved_by.add(user)
                return JsonResponse({'message': 'Post saved successfully.', 'is_saved': True}, status=201)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post does not exist.'}, status=404)

@csrf_exempt
def check_saved_post(request, post_id):
    user = request.user
    if user.is_authenticated:
        user_id = user.id
        post = Post.objects.get(pk=post_id)
        is_saved = post.saved_by.filter(id=user_id).exists()

        return JsonResponse({'is_saved': is_saved})
    else:
        return JsonResponse({'message': 'User not authenticated', 'is_saved': False})
    
@csrf_exempt
@permission_classes([IsAuthenticated])
def get_user_saved_posts(request):
    user = request.user
    saved_posts = user.saved_posts.all()

    serialized_posts = []
    for post in saved_posts:
        user_object = CustomUser.objects.get(id=post.writer.id)
        user_profile = Profile.objects.get(user_acc=user_object.id)
        serialized_post = {
            'id': post.id,
            'title': post.title,
            'type': post.get_post_type_display(),
            'category': post.category.name,
            'profile_image': request.build_absolute_uri(user_profile.profile_image.url) if user_profile and user_profile.profile_image else None,
            'saved_by': post.saved_by.count(),
            'comments': post.comments.count(),
        }
        serialized_posts.append(serialized_post)

    return JsonResponse(serialized_posts, safe=False)
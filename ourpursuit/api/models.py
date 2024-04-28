from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    profile = models.OneToOneField(
        to='Profile',
        blank=True,
        null=True,
        on_delete=models.CASCADE
    )

    groups = models.ManyToManyField(
        to=Group,
        blank=True,
        related_name='custom_user_groups'
    )

    user_permissions = models.ManyToManyField(
        to=Permission,
        blank=True,
        related_name='custom_user_permissions'
    )

    REQUIRED_FIELDS = ['email'] 

    def to_dict(self):
        return {
            'profile': self.profile.to_dict() if self.profile else None,
        }
    
def upload(instance, filename):
    return 'profile_images/{filename}'.format(filename=filename)

class Profile(models.Model):
    profile_image = models.ImageField(upload_to=upload, blank=True, null=True)
    
    user_acc = models.ForeignKey(
        to=CustomUser,
        blank=True,
        null=True,
        related_name="of",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"({self.member_check})"
    
    def to_dict(self):
        return {
            'profile_image': self.profile_image.url if self.profile_image else None,
        }

    @property
    def has_member(self):
        return hasattr(self, 'member') and self.member is not None
    
    @property
    def member_check(self):
        return str(self.member) if self.has_member else 'NONE'

def upload_category(instance, filename):
    return 'categories/{filename}'.format(filename=filename)

class Category(models.Model):
    name = models.CharField(max_length=200)
    icon = models.ImageField(upload_to=upload_category, null=True, blank=True)

    def __str__(self):
        return self.name

def upload_post(instance, filename):
    return 'posts/{filename}'.format(filename=filename)

class Post(models.Model):
    writer = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    title = models.CharField(max_length=70)
    category = models.ForeignKey(
        to=Category,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    POST_TYPES = [
        ('Q', 'Question'),
        ('A', 'Advice'),
    ]
    post_type = models.CharField(
        max_length=1,
        choices=POST_TYPES,
        blank=True,
    )
    body = models.TextField()
    image = models.ImageField(upload_to=upload_post, blank=True, null=True)
    saved_by = models.ManyToManyField(
        to=CustomUser,
        blank=True,
        related_name='saved_posts'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(
        to=Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author.user_acc.username}: {self.text}'
    
    @staticmethod
    def to_dict(comment, request):
        author_profile = Profile.objects.get(user_acc=comment.author.id)
        return {
            'id': comment.id,
            'user_id': comment.author.id,
            'post_id': comment.post.id,
            'author': comment.author.username,
            'text': comment.text,
            'profile_image': request.build_absolute_uri(author_profile.profile_image.url) if author_profile and author_profile.profile_image else None,
        }


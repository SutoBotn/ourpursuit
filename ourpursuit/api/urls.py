"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import edit_post, get_posts_by_category, signup_view, login_view, logout_view, get_profile, update_profile, create_post, delete_post, get_categories, get_post, create_comment, get_comments, update_comment, delete_comment, get_user_id, get_recent_posts, get_popular_posts, check_saved_post, save_post, get_user_saved_posts, get_user_posts

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', get_profile, name='profile'),
    path('update-profile/', update_profile, name='update-profile'),
    path('user_id/', get_user_id, name='user-id'),
    path('user-posts/', get_user_posts, name='user-posts'),
    path('saved-posts/', get_user_saved_posts, name='saved-posts'),

    path('create-post/', create_post, name='create-post'),
    path('edit-post/<int:post_id>/', edit_post, name='edit-post'),
    path('delete-post/<int:post_id>/', delete_post, name='delete-post'),
    path('recent-posts/', get_recent_posts, name='recent-posts'),
    path('popular-posts/', get_popular_posts, name='popular-posts'),
    path('get-categories/', get_categories, name='get-categories'),
    path('posts/<str:category_name>/', get_posts_by_category, name='posts_by_category'),
    path('posts/<str:category_name>/<int:post_id>', get_post, name='post'),
    path('posts/<str:category_name>/<int:post_id>/create-comment/', create_comment, name='create-comment'),
    path('posts/<str:category_name>/<int:post_id>/get-comments/', get_comments, name='get-comments'),
    path('posts/<int:post_id>/<int:comment_id>/update-comment/', update_comment, name='update_comment'),
    path('posts/<int:post_id>/<int:comment_id>/delete-comment/', delete_comment, name='delete_comment'),
    path('posts/<int:post_id>/check-saved/', check_saved_post, name='check-saved'),
    path('posts/<int:post_id>/save-post/', save_post, name='save-post'),
]

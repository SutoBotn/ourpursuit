from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile, Category, Post, Comment

admin.site.register(CustomUser, UserAdmin)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['display_email']
    search_fields = ['user__email']

    def display_email(self, obj):
        return obj.user_acc.email if obj.user_acc else None

    display_email.short_description = 'Email'
    display_email.admin_order_field = 'user__email'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'writer', 'title', 'category', 'post_type', 'body', 'image']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'author', 'text', 'created_at']
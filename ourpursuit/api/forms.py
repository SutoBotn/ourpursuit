from django import forms
from .models import Category

class LoginForm(forms.Form):
    '''Form for user login'''

    username = forms.CharField(
        label='Username',
        max_length=50,
        widget=forms.TextInput(attrs={'autocomplete': 'username'})
    )
    password = forms.CharField(
        label='Password',
        max_length=50,
        widget=forms.PasswordInput(attrs={'autocomplete': 'password'})
    )


class SignupForm(forms.Form):
    '''Form for user signup'''

    username = forms.CharField(
        label='Username',
        max_length=50,
        widget=forms.TextInput(
            attrs={
                'autocomplete': 'username',
            }
        )
    )
    email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(
            attrs={
                'autocomplete': 'username',
            }
        )
    )
    password = forms.CharField(
        label='Password',
        max_length=50,
        widget=forms.PasswordInput(attrs={'autocomplete': 'password'})
    )


class PostForm(forms.Form):
    ''' Form for creating a new post '''

    title = forms.CharField(
        label='Title',
        max_length=70,
        widget=forms.TextInput(attrs={'placeholder': 'Enter Title'})
    )
    category = forms.ModelChoiceField(
        label='Category',
        queryset=Category.objects.all(),
        empty_label='Select Category'
    )
    post_type = forms.ChoiceField(
        label='Post Type',
        choices=[('', 'Select Post Type'), ('Q', 'Question'), ('A', 'Advice')],
        widget=forms.Select()
    )
    body = forms.CharField(
        label='Body',
        widget=forms.Textarea(attrs={'placeholder': 'Enter body'})
    )
    image = forms.ImageField(
        label='Image',
        required=False
    )
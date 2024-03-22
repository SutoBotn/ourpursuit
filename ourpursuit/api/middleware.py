from django.contrib.auth.middleware import get_user
from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: self.authenticate(request))
        return self.get_response(request)

    def authenticate(self, request):
        user = get_user(request)
        if user.is_authenticated:
            return user

        try:
            user_jwt = JWTAuthentication().authenticate(request)
            if user_jwt is not None:
                return user_jwt[0]
        except:
            pass

        return user

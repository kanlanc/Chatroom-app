from flask_restful import Api, Resource
from flask_pymongo import PyMongo
from flask_cors import CORS
from uuid import uuid4
import bcrypt
import jwt
from functools import wraps
import os


def authenticate(username, password):
    """Authenticate user.

    Args:
        username (str): Username of the user.
        password (str): Password of the user.

    Returns:
        dict: User details if authentication successful, else None.
    """
    account_details = users.find_one({'username': username})
    if account_details and bcrypt.checkpw(password.encode('utf-8'), account_details["hashed_password"]):
        return account_details

def token_required( f ):                                                                    
    """Decorator to verify JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return {'message': 'Token is missing'}, 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users.find_one({'username': data['username']})
            if not current_user:
                return {'message': 'Token is invalid'}, 401
        except:
            return {'message': 'Token is invalid'}, 401
        return f(*args, **kwargs)
    return decorated

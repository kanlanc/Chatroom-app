from flask import Flask, request
from flask_restful import Api, Resource
from flask_pymongo import PyMongo
from flask_cors import CORS
from uuid import uuid4
import bcrypt
import jwt
from functools import wraps
import os


app = Flask(__name__)
app.config['SECRET_KEY'] = str(uuid4())

api = Api(app)

# Configuration for MongoDB connection
app.config['MONGO_URI'] = os.environ.get('MONGODB_URL', 'mongodb://localhost:27017/ChatRoomDB')
mongo = PyMongo(app)
users = mongo.db.Users
messages = mongo.db.Messages

CORS(app)

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

class SignUp(Resource):
    """Resource to handle user sign-up."""
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']
        if users.find_one({'username': username}):
            return {'message': 'Username already exists'}, 409
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users.insert_one({'username': username, 'hashed_password': hashed_password})
        return {'message': 'User created successfully'}, 201
    
class Login(Resource):
    """Resource to handle user login."""
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']
        user = authenticate(username, password)
        if user:
            access_token = jwt.encode({'username': username}, app.config['SECRET_KEY'], algorithm="HS256")
            return {'access_token': access_token}, 200
        else:
            return {'message': 'Invalid username or password'}, 401

class Messages(Resource):
    """Resource to handle messages."""
    @token_required
    def get(self):
        username = request.args.get('username')
        message_history = list(messages.find())
        for message in message_history:
            if message['username'] != username:
                message['userVote'] = 'none'
        return message_history, 200

    @token_required
    def post(self):
        data = request.get_json()
        content = data.get('content')
        username = data.get('username')
        new_message = {'_id': str(uuid4()), 'username': username, 'content': content, 'upvotes': 0, 'downvotes': 0, 'userVote': 'none'}
        messages.insert_one(new_message)
        return new_message, 201
    
class Vote(Resource):
    """Resource to handle voting on messages."""
    @token_required
    def put(self, message_id):
        data = request.get_json()
        vote_type = data["voteType"]
        user_vote = data["userVote"]
        message = messages.find_one({'_id': message_id})
        if message:
            upvote_inc = 0
            downvote_inc = 0

            if user_vote == 'upvote':
                if vote_type == 'downvote':
                    downvote_inc = 1
                upvote_inc = -1
            elif user_vote == 'downvote':
                if vote_type == 'upvote':
                    upvote_inc = 1
                downvote_inc = -1
            else:
                if vote_type == 'upvote':
                    upvote_inc = 1
                else:
                    downvote_inc = 1

            user_vote = 'none' if user_vote == vote_type else vote_type
            messages.update_one({'_id': message_id}, {'$inc': {'upvotes': upvote_inc, 'downvotes': downvote_inc}, '$set': {'userVote': user_vote}})
            return {'message': 'Vote updated successfully'}, 200
        else:
            return {'error': 'Message not found'}, 404

api.add_resource(SignUp, '/api/signup')
api.add_resource(Login, '/api/login')
api.add_resource(Messages, '/api/messages')
api.add_resource(Vote, '/api/messages/<string:message_id>')

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from flask_cors import CORS
from models import db, User, BlogPost, Comment


app = Flask(__name__)

# Replace this with your actual database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to your actual secret key

# Initialize the database, migration, and JWT
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
# Blueprint for authentication routes
# AUTH ROUTES

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'token': access_token}), 200

@app.route('/auth/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({'email': user.email}), 200

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# BLOG ROUTES

@app.route('/blog/posts', methods=['GET'])
def get_posts():
    """Fetch all blog posts."""
    posts = BlogPost.query.all()
    result = [{'id': post.id, 'title': post.title, 'content': post.content} for post in posts]
    return jsonify(result), 200

@app.route('/blog/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Fetch a single blog post by its ID."""
    post = BlogPost.query.get_or_404(post_id)
    return jsonify({
        'id': post.id,
        'title': post.title,
        'content': post.content
    }), 200

@app.route('/blog/posts', methods=['POST'])
@jwt_required()
def create_post():
    """Create a new blog post (protected by JWT)."""
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({'message': 'Title and content are required'}), 400

    new_post = BlogPost(title=title, content=content)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Blog post created successfully'}), 201

@app.route('/blog/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    """Add a comment to a blog post (protected by JWT)."""
    post = BlogPost.query.get_or_404(post_id)
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Comment content is required'}), 400

    new_comment = Comment(content=content, post_id=post.id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment added successfully'}), 201

@app.route('/blog/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    """Fetch all comments for a specific blog post."""
    post = BlogPost.query.get_or_404(post_id)
    comments = Comment.query.filter_by(post_id=post.id).all()
    result = [{'id': comment.id, 'content': comment.content} for comment in comments]
    return jsonify(result), 200


# Run the Flask app
if __name__ == "__main__":
    app.run()

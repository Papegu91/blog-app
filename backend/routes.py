from flask import Blueprint, request, jsonify
from models import db, BlogPost, Comment
from flask_jwt_extended import jwt_required

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/posts', methods=['GET'])
def get_posts():
    posts = BlogPost.query.all()
    return jsonify([post.serialize() for post in posts])

@api_blueprint.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    return jsonify(post.serialize())

@api_blueprint.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    content = request.json.get('content')
    comment = Comment(content=content, post_id=post_id)
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.serialize())

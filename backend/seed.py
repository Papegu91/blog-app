from models import db, User, BlogPost, Comment
from app import app
from werkzeug.security import generate_password_hash

def seed_data():
    with app.app_context():
        db.create_all()  # Create tables if they don't exist

        # Add some initial data
        user = User(email='admin@example.com', password=generate_password_hash('password', method='pbkdf2:sha256'))
        db.session.add(user)
        db.session.commit()  # Commit to assign user an ID
        
        post = BlogPost(title='First Post', content='This is the content of the first post.')
        db.session.add(post)
        db.session.commit()  # Commit to assign post an ID

        comment = Comment(post_id=post.id, content='This is a comment.')
        db.session.add(comment)
        
        db.session.commit()

if __name__ == "__main__":
    seed_data()

from flask import Flask
from .extensions import *
from .routes import index_blueprint, discover_blueprint, community_blueprint, about_us_blueprint, api_blueprint
from .domain.User import User

def create_app():
    app = Flask(__name__, instance_relative_config=True,
                template_folder="ui/templates", static_folder="ui/static")

    @app.context_processor
    def inject_user():
        user = get_current_user()
        return dict(user=user)

    def get_current_user():
        # logic to get the user
        user = User('Angel Q.')
        return user

    with app.app_context():
        
        app.register_blueprint(index_blueprint)
        app.register_blueprint(discover_blueprint)
        app.register_blueprint(community_blueprint)
        app.register_blueprint(about_us_blueprint)
        app.register_blueprint(api_blueprint)
    
    return app

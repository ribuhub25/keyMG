from flask import Blueprint
from .controllers import *

index_blueprint = Blueprint("index", "index", url_prefix="/")
index_blueprint.add_url_rule("", "", index)

discover_blueprint = Blueprint("discover", "discover", url_prefix="/discover")
discover_blueprint.add_url_rule("", "", discover)

community_blueprint = Blueprint("community", "community", url_prefix="/community")
community_blueprint.add_url_rule("", "", community)

about_us_blueprint = Blueprint("about_us", "about_us", url_prefix="/about-us")
about_us_blueprint.add_url_rule("", "", about_us)

api_blueprint = Blueprint("api", "api", url_prefix="/api")
@api_blueprint.route('/autocomplete', methods=['GET'])
def endpoint_handler_autocomplete():
    return autocomplete()

@api_blueprint.route('/search', methods=['GET'])
def endpoint_handler_search():
    return search()

@api_blueprint.route('/spotify-playlist', methods=['GET'])
def endpoint_handler_spotify_playlist():
    return spotify_playlist()

@api_blueprint.route('/playlists', methods=['GET'])
def endpoint_handler_playlist():
    return playlists()
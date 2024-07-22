from flask import jsonify, render_template, request
from .extensions import *
from .service.spotifyapi import *

def index():
    return render_template("index.html")

def discover():
    return render_template("discover.html")

def community():
    return render_template("community.html")

def about_us():
    return render_template("about_us.html")

def autocomplete():
    data = request.args.get('query')
    token = get_token()
    response = search_for_id_track(token=token,name_song=data)
    return jsonify(response)

def search():
    data = request.args.get('id')
    token = get_token()
    info_song = get_info_song(token=token,id_song=data)
    harmonic_camelot_key, harmonic_key_mode, min_bpm, max_bpm = harmonic_search_key_bpm(token, info_song['key'], info_song['mode'], info_song['bpm'], 5)
    songs_harmonic = search_songs_for_key_bpm(token, info_song, harmonic_key_mode, min_bpm, max_bpm, info_song['genres_to_search'])
    data = {}
    data['song'] = info_song
    data['suggestions'] = songs_harmonic
    return jsonify(data)

def spotify_playlist():
    data = request.args.get('playlist')
    token = get_token()
    response = check_playlist(token=token,url=data)
    if (response == None):
        return jsonify(message='Ups! There is an error with the URL or is already added')
    if (response == True):
        return jsonify(message='Playlist successfully created')
    else:
        data = {}
        data['message'] = 'Ups! Some songs do not mix harmonically'
        data['songs'] = response
        return jsonify(data)
    
def playlists():
    return jsonify(load_playlists())
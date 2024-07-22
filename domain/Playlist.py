import os
import json
from dataclasses import dataclass
from .User import User
from .Song import Song

@dataclass
class Playlist:
    name: str
    description: str
    user: User
    songs: list[Song]
    link: str

    def save_json(self, dir):
        data = {
            'name': self.name,
            'description': self.description,
            'user': {
                'username': self.user.username,
            },
            'songs': [song.to_dict() for song in self.songs],
            'link': self.link,
        }
        json_data = json.dumps(data, indent=4)

        filename = f'{self.name}.json'
        filepath = os.path.join(dir, filename)

        with open(filepath, 'w+') as file:
            file.write(json_data)

    @staticmethod
    def from_json(filepath):
        with open(filepath, 'r+') as file:
            json_data = json.load(file)

        name = json_data['name']
        description = json_data['description']
        user = User(json_data['user']['username'])
        songs = [Song.from_dict(song_data) for song_data in json_data['songs']]
        link = json_data['link']
        playlist = Playlist(name, description, user, songs, link)

        return playlist
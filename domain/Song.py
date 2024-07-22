from dataclasses import dataclass
from datetime import datetime

@dataclass
class Song:
    id: str
    name: str
    artist: str
    album: str
    key: str
    bpm: str
    duration: str
    image: str
    url: str

    def __post_init__(self) -> None:
        minutes, seconds = self.duration.split(':')
        if len(minutes) == 1:
            minutes = '0' + minutes
        if len(seconds) == 1:
            seconds = '0' + seconds
        self.duration = minutes + ':' + seconds

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'artist': self.artist,
            'album': self.album,
            'key': self.key,
            'bpm': self.bpm,
            'duration': self.duration,
            'image': self.image,
            'url': self.url
        }
    
    @staticmethod
    def from_dict(song_dict):
        id = song_dict['id']
        name = song_dict['name']
        artist = song_dict['artist']
        album = song_dict['album']
        key = song_dict['key']
        bpm = song_dict['bpm']
        duration = song_dict['duration']
        image = song_dict['image']
        url = song_dict['url']

        return Song(id, name, artist, album, key, bpm, duration, image, url)
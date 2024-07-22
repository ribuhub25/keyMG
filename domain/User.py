from dataclasses import dataclass

@dataclass
class User:
    username: str
    is_authenticated: bool = True
    url: str = 'https://i1.sndcdn.com/artworks-qgDxcNwCp7tK4zKa-fyzB1w-t500x500.jpg'
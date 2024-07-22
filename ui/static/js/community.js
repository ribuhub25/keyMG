const modal = document.getElementById("spotifyModal");
const btnOpenModal = document.getElementById("spotify");
const spanClose = document.getElementsByClassName("close")[0];
const btnCancel = document.getElementById("btnCancel");
const btnSave = document.getElementById("btnSave");
const plusButton = document.getElementById('plus');
const button2 = document.getElementById('discover');
const playlistUrl = document.getElementById('playlist');
const message = document.getElementById('message');
const songs = document.getElementById('songs');
const playlistContainer = document.getElementById("playlist-container"); 

const request = (url) => {
  const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  request.open("GET", url, true);
  request.send();
  request.onload = () => {
    var objData = JSON.parse(request.responseText);
    playlistResponse(objData);
  }
}

plusButton.addEventListener('click', function() {
  btnOpenModal.classList.toggle('visible');
  button2.classList.toggle('visible');
})

function openModal() {
  plusButton.click();
  modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    btnSave.style.display = 'block';
    btnCancel.style.display = 'block';
    message.innerHTML = "";
    playlistUrl.value = '';
}

function createPlaylist() {
  btnSave.style.display = 'none';
  btnCancel.style.display = 'none';
  spanClose.style.display = 'none';

  message.innerHTML = "Wait a moment please...";

  var pattern = /playlist\/([a-zA-Z0-9]+)$/;
  url = playlistUrl.value;
  if (url.match(pattern)){
    sendDataToAPI(url)
  }
}

function sendDataToAPI(inputValue) {
  request("/api/spotify-playlist?playlist="+ inputValue)
}

function playlistResponse(objData){
  if(objData.message.includes("Ups")){
    btnSave.style.display = 'block';
    btnCancel.style.display = 'block';
    spanClose.style.display = 'block';
    message.innerHTML = objData.message;
    if(objData.songs){
      objData.songs.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        songs.appendChild(listItem);
      });
    }
  } else{
    spanClose.style.display = 'block';
    message.innerHTML = objData.message;
    loadPlaylists()
  }
  
}

btnOpenModal.addEventListener("click", openModal);
spanClose.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);
btnSave.addEventListener("click", createPlaylist);

function loadPlaylists(){
  url = "/api/playlists"
  const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  request.open("GET", url, true);
  request.send();
  request.onload = () => {
    var objData = JSON.parse(request.responseText);
    populateTrackList(objData);
  }
}

function populateTrackList(data){
  playlistContainer.innerHTML = '<h2>Trending right now!</h2>'
  data.forEach(element => {
    const playlistElement = document.createElement("div");
    playlistElement.innerHTML = `
      <div class="playlist">
        <div class="user">
          <div class="user-details">
            <div class="user-img">
              <img src="${element.user.url}" alt="${element.user.username}" />
            </div>
            <span>${element.user.username}</span>
          </div>
          <div class="buttons">
            <a><img id="favorite" src="/static/img/heart.svg" alt="Favorite" /></a>
            <a><img id="share" src="/static/img/share-outline.svg" alt="Share" /></a>
            <a href=${element.link} target="_blank"><img id="link" src="/static/img/link-outline.svg" alt="Spotify" /></a>
          </div>
        </div>
        <div class="details">
          <h3>${element.name}</h3>
          <p>${element.description}</p>
          <div class="tracks">
            <h4>Tracks</h4>
            ${element.songs
              .map(
                track => `
                <div class="track">
                  <div class="left">
                    <div class="cover-art">
                      <img src="${track.image}" alt="Cover Art" />
                    </div>
                    <span>${track.artist + " - " + track.name}</span>
                  </div>
                  <div class="right">
                    <p>${track.key}</p>
                    <p>${track.bpm}BPM</p>
                    <p>${track.duration}</p>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    playlistContainer.appendChild(playlistElement);
  })
}

loadPlaylists()
let timerId;

const inputField = document.getElementById('search'); 
const songElement = document.getElementById('song'); 
const suggestionsElement = document.getElementById('suggestions'); 
const searchButton = document.getElementById('search-button'); 

const requestAutocomplete = (url) => {
  const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  request.open("GET", url, true);
  request.send();
  request.onload = () => {
    var objData = JSON.parse(request.responseText);
    createAutocompleteList(objData);
  }
}

const requestSuggestions = (url) => {
  const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  request.open("GET", url, true);
  request.send();
  request.onload = () => {
    var objData = JSON.parse(request.responseText);
    populateSuggestions(objData);
  }
}

function fetchDataFromAPI(inputValue) {
  requestAutocomplete("/api/autocomplete?query="+ inputValue)
}

function fetchSuggestionsFromAPI(inputValue) {
  requestSuggestions("/api/search?id="+ inputValue)
}

function createAutocompleteList(response) {
  const autocompleteContainer = document.getElementById('autocomplete-container');

  autocompleteContainer.innerHTML = '';

  response.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="cover">
        <img src="${item.url}" alt="${item.name_song}" />
      </div>
      <span>${item.name_artist[0] + ' - ' + item.name_song}</span>
    `; 
    
    listItem.addEventListener('click', () => {
      clearSuggestions()
      clearContent()
      startLoading()
      fetchSuggestionsFromAPI(item.id_song)
    });
    
    autocompleteContainer.appendChild(listItem);
  });
}

function transitionScreen(){
  var section = document.querySelector(".banner");
  var results = document.querySelector(".results");
  var bg = document.querySelector(".banner .background");
  var mask = document.querySelector(".banner .mask");
  if(section != null){
    var content = section.querySelector(".content");
  }
  var elementsToRemove = content.querySelectorAll(":not(.search-container):not(#autocomplete-container)");
  const autocompleteContainer = document.getElementById('autocomplete-container');

  autocompleteContainer.innerHTML = '';
  section.removeChild(bg);
  section.removeChild(mask);
  elementsToRemove.forEach(function(element) {
    if (element.parentNode === content) {
      content.removeChild(element);
    }
  })
  section.classList.remove('banner')
  section.classList.add('search')
  inputField.value = ''
  results.style.display = "block";
}

function populateSuggestions(data){
  stopLoading()
  var section = document.querySelector(".banner");
  if(section != null){
    transitionScreen()
  }
  setSong(data.song)
  setSuggestions(data.suggestions)
}

function setSong(song){
  songElement.innerHTML = `
        <div class="card added">
          <div class="left">
            <h3>${song.artists.join(", ")}</h3>
            <a href="${song.url}" target="blank"><h2>${song.name_song}</h2></a>
            <h4>${song.name_album}</h4>
            <ul>
            ${song.genres_to_search
              .map(
                genre => `
                <li>${genre}</li>
              `
              )
              .join("")}
            </ul>
            <div class="details">
              <p>Key: <span>${song.camelot_key}</span></p>
              <p>BPM: <span>${song.bpm}</span></p>
              <p>Duration: <span>${song.duration}</span></p>
            </div>
          </div>
          <div class="right">
            <img
              src="${song.image}"
              alt="${song.name_song}"
            />
          </div>
        </div>`
}

function setSuggestions(suggestions){
  suggestions.forEach(element => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add('card');
    suggestionItem.innerHTML = `
          <div class="left">
            <h3>${element.artists.join(", ")}</h3>
            <a href="${element.url}" target="blank"><h2>${element.name_song}</h2></a>
            <h4>${element.name_album}</h4>
            <div class="details">
              <p>Key: <span>${element.camelot_key}</span></p>
              <p>BPM: <span>${element.bpm}</span></p>
              <p>Duration: <span>${element.duration}</span></p>
            </div>
            <button>Add to list</button>
          </div>
          <div class="right">
            <img
              src="${element.image}"
              alt="${element.name_song}"
            />
          </div>`
    suggestionsElement.appendChild(suggestionItem);
  })
}

inputField.addEventListener('input', (event) => {
  const inputValue = event.target.value;
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    fetchDataFromAPI(inputValue);
  }, 500);
});

searchButton.addEventListener('click', (event) => {
  const inputValue = inputField.value;
  fetchDataFromAPI(inputValue);
});

function clearContent() {
  const autocompleteContainer = document.getElementById('autocomplete-container');

  autocompleteContainer.innerHTML = '';
}

function clearSuggestions() {
  suggestionsElement.innerHTML = '';
}

function handleClickOutside(event) {
  const autocompleteContainer = document.getElementById('autocomplete-container');
  if (!autocompleteContainer.contains(event.target)) {
    clearContent();
  }
}

document.addEventListener("click", handleClickOutside);
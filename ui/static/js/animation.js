// Dynamic Text

var words = ["search", "mix", "play"];
var colors = ["#3f84e5", "#06D6A0", "#E84855"];
var currentIndex = 0;

function changeDynamicText() {
  var dynamicText = document.getElementById("dynamicText");
  if(dynamicText != null){
    dynamicText.textContent = words[currentIndex];
    dynamicText.style.color = colors[currentIndex];
    currentIndex = (currentIndex + 1) % words.length;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var dynamicText = document.getElementById("dynamicText");
  if(dynamicText != null){
    setInterval(changeDynamicText, 2000);
  }
});

// Blur Effect

document.addEventListener('mousemove', function(e) {
  var dynamicText = document.getElementById("dynamicText");
  if(dynamicText != null){
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var circle = document.querySelector('.circle');
    
    circle.setAttribute('cx', mouseX);
    circle.setAttribute('cy', mouseY - 80);
  }
});

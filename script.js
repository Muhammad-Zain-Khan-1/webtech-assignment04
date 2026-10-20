var markdownInput = document.getElementById("markdown-input");
var preViewSection = document.querySelector(".preview-section");
var slideContent = document.getElementById("slide-content");
var prevBtn = document.getElementById("prev-btn");
var nextBtn = document.getElementById("next-btn");
var slideCounter = document.getElementById("slide-counter");
var saveBtn = document.getElementById("save-btn");
var fullScreenBtn = document.getElementById("fullscreen-btn");

var currentSlideIndex = 0;
var slides = [];

// Set initial text from browser history in textarea
var savedData = localStorage.getItem("slides_data");
if (savedData) {
  markdownInput.value = savedData;
}


function splitIntoSlides(text) {
  return text.split(/^\s*---\s*$/m);
}

function convertMarkdownToHtml(markdownText) {
  if (!markdownText) {
    return "";
  }

  var html = markdownText;
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>");
  html = html.replace(/\n/gim, "<br>");
  html = html.replace(/<\/(h[1-3])><br>/g, "</$1>");

  return html;
}

// Function to display current slide
function displaySlide() {
  // Split text into slides array
  slides = splitIntoSlides(markdownInput.value);
  // Keep slide index within valid boundary
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = slides.length - 1;
  }
  if (currentSlideIndex < 0) {
    currentSlideIndex = 0;
  }
  // Display current slide HTML
  var currentMarkdown = slides[currentSlideIndex].trim();
  slideContent.innerHTML = convertMarkdownToHtml(currentMarkdown);
  // 1.counter text 
  slideCounter.innerText = (currentSlideIndex + 1) + " / " + slides.length;
  // 2. Disable Left button on the first slide
  if (currentSlideIndex === 0) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
  // 3. Disable Right button on the last slide
  if (currentSlideIndex === slides.length - 1) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

// Left (Previous) button
prevBtn.addEventListener("click", function () {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    displaySlide();
  }
});

// Right (Next) button
nextBtn.addEventListener("click", function () {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    displaySlide();
  }
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    if (preViewSection.requestFullscreen) {
      preViewSection.requestFullscreen();
    } else if (preViewSection.webkitRequestFullscreen) {
      preViewSection.webkitRequestFullscreen();
    } else if (preViewSection.msRequestFullscreen) {
      preViewSection.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement) {
    fullScreenBtn.innerText = "Exit Full Screen";
  } else {
    fullScreenBtn.innerText = "Full Screen";
  }
});

function saveSlides() {
  localStorage.setItem("slides_data", markdownInput.value);
  alert("Slides saved successfully in browser memory!");
}
// Keyboard Event Listener
document.addEventListener("keydown", function (event) {

  // 1. F11 Key for Full Screen 
  if (event.key === "F11") {
    event.preventDefault();
    toggleFullScreen();
    return;
  }

  // 2. Ctrl + S Key for Save 
  if (event.ctrlKey && event.key.toLowerCase() === "s") {
    event.preventDefault(); // Stop browser "Save Page As" popup
    saveSlides();
    return;
  }

  // 3. Arrow Keys Stop if user is currently typing in the markdown editor
  if (document.activeElement === markdownInput) {
    return;
  }

  // Left Arrow key
  if (event.key === "ArrowLeft") {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      displaySlide();
    }
  }

  // Right Arrow key
  if (event.key === "ArrowRight") {
    if (currentSlideIndex < slides.length - 1) {
      currentSlideIndex++;
      displaySlide();
    }
  }
});


saveBtn.addEventListener("click", function () {
  saveSlides();
});

fullScreenBtn.addEventListener("click", function () {
  toggleFullScreen();
});


markdownInput.addEventListener("input", function () {
  displaySlide();
});

// Initial display
displaySlide();
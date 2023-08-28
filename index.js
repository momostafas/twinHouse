document.addEventListener('DOMContentLoaded', function () {

jQuery(document).ready(function (jQuery) {
    var fileURL = './content-1.txt';

    fetch(fileURL)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error loading file.');
            }
        })
        .then(function (fileContent) {
            let content = fileContent.split("\n");
            document.getElementById("ProjectDetailsTitle").innerHTML = content[0];
            document.getElementById("testElement").innerHTML = content[1];
            for (let i = 2; i < content.length; i++) {
                var li = document.createElement("li");
                li.className = "ProjectDetailsListItem";
                let cont = content[i].split(":");
                let data = `  <span  class="ProjectDetailsListItemContent">
                                                              ${cont[0]} :
                                                            </span>${cont[1]}`
                li.innerHTML = data;
                document.getElementById("ProjectDetailsList").appendChild(li);
            }
            ;

        })
        .catch(function (error) {
            console.log(error.message);
        });
});
function submitFormCoronado(e) {

    // Prevent default form submission
    e.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById("myForm"));

    // AJAX request using fetch API
    fetch("https://script.google.com/macros/s/AKfycbyXSnb287apunYFHv9hrBDBxT-IqGWzI4w5IBEUHaDbOExk5R9Fc5drEYltWiuIDDu3/exec", {
        method: "POST",
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            // Clear the form fields after successful submission
            document.getElementById("myForm").reset();
            alert("submitted!");
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const indicatorsContainer = document.getElementById('dynamic-indicators');
let currentIndex = 0;

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentIndex = index;
    updateSlider();
}

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();
}

function updateIndicators() {
    indicatorsContainer.innerHTML = ''; // Clear existing indicators

    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === currentIndex ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });
}

updateSlider(); // Initialize slider position

// Optionally, add automatic sliding:
setInterval(nextSlide, 5000); // Slide every 5 seconds
});

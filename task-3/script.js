// Image Carousel Logic
const images = [
    "https://picsum.photos/id/10/600/300",
    "https://picsum.photos/id/20/600/300",
    "https://picsum.photos/id/30/600/300"
];
let currentIndex = 0;

const carouselImage = document.getElementById('carouselImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    carouselImage.src = images[currentIndex];
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    carouselImage.src = images[currentIndex];
});

// API Data Fetching Logic
const fetchApiBtn = document.getElementById('fetchApiBtn');
const apiDataBox = document.getElementById('apiDataBox');

fetchApiBtn.addEventListener('click', async () => {
    apiDataBox.textContent = "Loading data from API...";
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const data = await response.json();
        apiDataBox.textContent = '"' + data.setup + '" — ' + data.punchline;
    } catch (error) {
        apiDataBox.textContent = "Failed to fetch data. Please check your internet connection.";
    }
});

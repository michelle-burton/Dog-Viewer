const button = document.getElementById('load-dog')
const breedInput = document.getElementById('breed-input')
const breedsDatalist = document.getElementById('breeds')
const gallery = document.getElementById('gallery')
const favorites = document.getElementById('favorites')
const loadingIndicator = document.getElementById('loading-indicator')

let currentBreed = '';
let isLoading = false;
let page = 1;
const favoritesList = new Set();

// Fetch all available breeds
async function fetchBreeds() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        const breeds = Object.keys(data.message);
        
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            breedsDatalist.appendChild(option);
        });
    } catch (err) {
        console.error('Error fetching breeds:', err);
    }
}

// Create a dog card element
function createDogCard(imageUrl, breed) {
    const card = document.createElement('div');
    card.className = 'dog-card';
    
    const img = new Image();
    img.src = imageUrl;
    img.alt = `Random ${breed || 'Dog'}`;
    
    const favBtn = document.createElement('button');
    favBtn.className = 'fav-btn';
    favBtn.innerHTML = '💖';
    if (favoritesList.has(imageUrl)) {
        favBtn.classList.add('active');
    }
    
    favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(imageUrl, favBtn);
    });
    
    card.appendChild(img);
    card.appendChild(favBtn);
    
    img.onload = () => {
        setTimeout(() => {
            img.classList.add('loaded');
        }, 50);
    };
    
    return card;
}

// Toggle favorite status
function toggleFavorite(imageUrl, button) {
    if (favoritesList.has(imageUrl)) {
        favoritesList.delete(imageUrl);
        button.classList.remove('active');
    } else {
        favoritesList.add(imageUrl);
        button.classList.add('active');
    }
    updateFavoritesDisplay();
}

// Update favorites display
function updateFavoritesDisplay() {
    favorites.innerHTML = '';
    if (favoritesList.size === 0) {
        favorites.innerHTML = '<p>No favorites yet. Click the heart icon to add some!</p>';
        return;
    }
    favoritesList.forEach(imageUrl => {
        const card = createDogCard(imageUrl, currentBreed);
        favorites.appendChild(card);
    });
}

// Load more dogs
async function loadMoreDogs() {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.classList.add('visible');

    try {
        const url = currentBreed 
            ? `https://dog.ceo/api/breed/${currentBreed}/images/random/6`
            : 'https://dog.ceo/api/breeds/image/random/6';
            
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        const images = Array.isArray(data.message) ? data.message : [data.message];
        images.forEach(imageUrl => {
            const card = createDogCard(imageUrl, currentBreed);
            gallery.appendChild(card);
        });

        page++;
    } catch (err) {
        console.error('Error loading more dogs:', err);
    } finally {
        isLoading = false;
        loadingIndicator.classList.remove('visible');
    }
}

// Handle search
async function handleSearch() {
    currentBreed = breedInput.value.trim();
    if (!currentBreed) {
        alert('Please select a breed');
        return;
    }

    gallery.innerHTML = '';
    page = 1;
    await loadMoreDogs();
}

// Infinite scroll handler
function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreDogs();
    }
}

// Event listeners
button.addEventListener('click', handleSearch);
breedInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
window.addEventListener('scroll', handleScroll);

// Initial load
fetchBreeds();
loadMoreDogs();
updateFavoritesDisplay(); // Initialize favorites display
const button = document.getElementById('load-dog')
const container = document.getElementById('dog-container')

async function handleClick() {
    container.innerHTML = 'Loading...';

    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();

        // Clear container
        container.textContent = '';

        // Create and append the image
        const img = document.createElement('img');
        img.src = data.message;
        img.alt = 'Random Dog';
        img.style.maxWidth = '400px';
        img.style.borderRadius = '10px';

        container.appendChild(img);

    } catch (err) {
        container.innerHTML = 'Oops! Could not fetch a dog 😢';
        console.log(err);
    }
}

button.addEventListener('click', handleClick);
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API
const count =10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function updateDOM(){
    resultsArray.forEach((result)=>{
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image'
        link.target = '_blank';
        // Image
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.src = result.url;
        img.alt = 'NASA Picture of the Day';
        img.loading ='lazy';
        link.appendChild(img);
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Add to Favorites
        const favorites = document.createElement('p');
        favorites.classList.add('clickable');
        favorites.textContent = 'Add To Favorites';
        favorites.setAttribute('onclick',`saveFavorite('${result.url}')`);
        // Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Date & Copyright Info
        const textMuted = document.createElement('small');
        textMuted.classList.add('text-muted');
        const dateStyle = document.createElement('strong');
        dateStyle.textContent = result.date;

        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = " " + copyrightResult;
        // Appending Date & Copyright to textMuted
        textMuted.append(dateStyle,copyright);
        // Append all child element to card body
        cardBody.append(cardTitle,favorites,cardText,textMuted);

        card.append(link,cardBody);

        imagesContainer.append(card);
    });
}

// Get 10 Images from NASA API

async function getNasaPictures(){
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM();
    } catch (error) {
        console.log(error);
    }
}

// Add result to Favorites
function saveFavorite(itemUrl){
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item)=>{
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;

            // Show Save Confirmation for 2 secs
            saveConfirmed.hidden = false;
            setTimeout(()=>{
                saveConfirmed.hidden = true;
            },2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        }
    });
}

// On Load

getNasaPictures();
const ads = ['/assets/img/ad-1.JPG', '/assets/img/ad-2.JPG'];

async function getAllNames() {
    const data = await getData();
    const festivals = data.festivals;
    const names = festivals.map(festival => festival.name);
    const uniqueNames = new Set(names);

    return Array.from(uniqueNames);
}

async function getAllDates() {
    const data = await getData();
    const festivals = data.festivals;
    const date = festivals.map(festival => festival.date);
    const uniqueDate = new Set(date);

    return Array.from(uniqueDate);
}

async function getAllLocations() {
    const data = await getData();
    const festivals = data.festivals;
    const locations = festivals.map(festival => festival.location);
    const uniqueLocations = new Set(locations);

    return Array.from(uniqueLocations);
}

async function getAllGenres() {
    const data = await getData();
    const festivals = data.festivals;
    const genres = festivals.map(festival => festival.genre);
    const uniqueGenres = new Set(genres);

    return Array.from(uniqueGenres);
}

async function loadContent() {
    loadFilters();
    loadEventCards();
}

function loadFilters() {
    const filterContainer = $('#filter-container');
    filterContainer.innerHTML = /*html*/ `
        <div class="filters row flex-center">
            <button id="name">Name</button>
            <button id="date">Datum</button>
            <button id="location">Ort</button>
            <button id="genre">Genre</button>
        </div>
    `;

    addClickToFilterButtons();
}

function addClickToFilterButtons() {
    $('#name').addEventListener('click', async function() {
        const names = await getAllNames();
        log(names);
    });
    
    $('#date').addEventListener('click', async function() {
        const dates = await getAllDates();
        log(dates);
    });
    
    $('#location').addEventListener('click', async function() {
        const locations = await getAllLocations();
        log(locations);
    });
    
    $('#genre').addEventListener('click', async function() {
        const genres = await getAllGenres();
        log(genres);
    });
}



async function loadEventCards() {
    const data = await getData();
    const festivals = data.festivals;
    let allEventCardsHTML = '';
    let counter = 0;

    festivals.forEach(festival => {
        allEventCardsHTML += renderEvents(festival);
        counter++;
        allEventCardsHTML = checkAd(allEventCardsHTML, counter);
    });

    const eventCardsContainer = $('#event-cards-container');
    eventCardsContainer.innerHTML = allEventCardsHTML;
}


function checkAd(allEventCardsHTML, counter) {
    if (counter % 4 === 0) {
        const adIndex = Math.floor((counter / 4 - 1) % ads.length);
        const adUrl = ads[adIndex];
        return allEventCardsHTML + renderAdBlock(adUrl);
    }
    return allEventCardsHTML;
}


function renderEvents({ id, name, date, location, genre }) {
    return /*html*/ `
        <div class="event-card column" onclick="openSelectedFestival('${id}')">
            <span class="event-name">${name}</span>
            <div class="row gap-20 card-info">
                <span class="event-date">${date}</span>
                <div class="column gap-10">
                    <span class="event-location">${location}</span>
                    <span class="event-genre">${genre}</span>
                    <span class="event-lineup">Lineup</span>
                    <span class="event-tickets">Tickets</span>
                </div>
            </div>
        </div>
    `;
}

function renderAdBlock(adUrl) {
    return /*html*/ `
        <div class="ad-container">
            <img src="${adUrl}">
        </div>
    `;
}

async function openSelectedFestival(id) {
    const selectedFestival = await checkFestivalId(id);

    renderSelectedFestival(selectedFestival);
}

async function checkFestivalId(id) {
    const festivalId = parseInt(id);
    const dataset = await getData();
    const festivals = dataset.festivals;
    const festivalExists = festivals.find(festival => festival.id === festivalId);    
    
    if(festivalExists) return festivalExists;
    if(!festivalExists) return log(`No festival found!`);    
}

function renderSelectedFestival(selectedFestival) {
    const selectedFestivalContainer = $('#selected-festival-container-upper');
    $('#selected-festival-container-upper').classList.remove('d-none');

    selectedFestivalContainer.innerHTML = selectedFestivalTemplate(selectedFestival);
}

function selectedFestivalTemplate({ id, name, date, location, genre }) {
    return /*html*/ `
        <div class="selected-festival-container-lower flex-center">
            <div class="selected-event-card column" onclick="closeSelectedFestival()">
                <span class="selected-event-name">${name}</span>
                <div class="row selected-card-info">
                    <div class="selected-event-date-container grid-center">
                        <span class="selected-event-date">${date}</span>
                    </div>
                    <div class="column gap-10">
                        <span class="selected-event-location">${location}</span>
                        <span class="selected-event-genre">${genre}</span>
                        <span class="selected-event-lineup">Lineup</span>
                        <span class="selected-event-tickets">Tickets</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function closeSelectedFestival() {
    $('#selected-festival-container-upper').classList.add('d-none');
    $('#selected-festival-container-upper').innerHTML = '';
}
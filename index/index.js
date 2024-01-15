const ads = ['../assets/img/ad-1.JPG', '../assets/img/ad-2.JPG'];

const monthMap = {
    'Jan.': 1, 'Feb.': 2, 'März': 3, 'Apr.': 4, 'Mai': 5, 'Juni': 6,
    'Juli': 7, 'Aug.': 8, 'Sept.': 9, 'Okt.': 10, 'Nov.': 11, 'Dez.': 12
};

const getFestivals = async () => {
    const data = await getData();

    const updatedData = data.map((festival, index) => {
        return {
            ...festival,
            id: index + 1
        };
    });

    return updatedData;
};

async function loadContent() {
    loadFilters();
    loadEventCards();
}

function loadFilters() {
    const filterContainer = $('#filter-container');
    filterContainer.innerHTML = /*html*/ `
        <div class="open-filter-btn-containter row">
            <button onclick="openFilterButtons()">Filter</button>
            <button id="reset-filter-btn" class="d-none" onclick="resetSelectedFilter()">Filter löschen</button>
        </div>
        <div class="filters filters-closed row flex-center">
            <button id="country">Land</button>
            <button id="name">Name</button>
            <button id="date">Datum</button>
            <button id="location">Stadt</button>
            <button id="genre">Genre</button>
        </div>
    `;

    addClickToFilterButtons();
}

function openFilterButtons() {
    $('.filters').classList.toggle('filters-closed');
}

async function resetSelectedFilter() {
    currentInput = '';
    $('#header-img .input-wrapper').classList.remove('show-close');   
    $('.input-wrapper input').value = '';
    await loadEventCards();
    $('#reset-filter-btn').classList.add('d-none');
}

async function fetchData(attribute) {
    const data = (await getFestivals()).map(festival => festival[attribute]);
    return Array.from(new Set(data));
}

function addClickListener(id, attribute, sortFunction) {
    $(`#${id}`).addEventListener('click', async function() {
        const data = await fetchData(attribute);
        const sortedList = sortFunction ? sortFunction(data) : data;
        openFilterList(sortedList);
    });
}

function addClickToFilterButtons() {
    addClickListener('country', 'LAND', sortByFirstLetter);
    addClickListener('name', 'NAME', sortByFirstLetter);
    addClickListener('date', 'DATUM', sortDates);
    addClickListener('location', 'STADT', sortByFirstLetter);
    addClickListener('genre', 'GENRES', sortByFirstLetter);
}

function sortByFirstLetter(array) {
    return array.sort((a, b) => a[0].localeCompare(b[0]));
}

async function getAllDates() {
    const date = (await getFestivals()).map(festival => festival.DATUM);
    const uniqueDate = new Set(date);

    return Array.from(uniqueDate);
}

function getDates() {
    $('#date').addEventListener('click', async function() {
        const dates = await getAllDates();
        const sortedList = sortDates(dates);
        openFilterList(sortedList);
    });
}

function sortDates(dates) {
    return dates.sort((a, b) => {
        let [monthA, dayA] = a.split('-');
        let [monthB, dayB] = b.split('-');

        monthA = monthMap[monthA];
        monthB = monthMap[monthB];

        return monthA === monthB ? parseInt(dayA, 10) - parseInt(dayB, 10) : monthA - monthB;
    });
}

function openFilterList(sortedList) {
    const filterListContainer = $('#filter-list-container'); 
    filterListContainer.classList.remove('d-none');
    const filterListItems = $('#filter-list-items');
    filterListItems.innerHTML = '';
    filterListItems.innerHTML += renderFilterList(sortedList);

    const allListItems = $$('.list-item-container');
    allListItems.forEach((listItem) => {
        listItem.addEventListener('click', function() {
            searchForItems(this);          
        });
    });

    checkNumberOfItems();
}

function renderFilterList(sortedList) {
    return sortedList.map((listItem, index) => {
        return /*html*/ `
            <div class="list-item-container" id="list-item-${index}">
                <span>${listItem}</span>
            </div>
        `;
    }).join('');
}

async function searchForItems(clickedItem) {
    $('#reset-filter-btn').classList.remove('d-none');
    $('.filters').classList.add('filters-closed');

    const spanValue = clickedItem.querySelector('span').textContent;
    currentInput = spanValue;
    const input = spanValue.toLowerCase();
    const items = (await getFestivals());
  
    const filteredItems = items.filter(({LAND, BUNDESLAND, NAME, STADT, DATUM, GENRES}) => 
        [LAND, BUNDESLAND, NAME, STADT, DATUM, GENRES].some(attr => attr.toLowerCase().includes(input))
    );

    searchItems(filteredItems);
}

function searchItems(filteredItems) {
    loadSelectedItems(filteredItems);
    closeFilter();
}

function loadSelectedItems(filteredItems) {
    let allEventCardsHTML = '';
    let counter = 0;

    filteredItems.forEach(festival => {
        allEventCardsHTML += renderEvents(festival);
        counter++;
        allEventCardsHTML = checkAd(allEventCardsHTML, counter);
    });

    const eventCardsContainer = $('#event-cards-container');
    eventCardsContainer.innerHTML = allEventCardsHTML;
}

function checkNumberOfItems() {
    const filterListContainer = $('#filter-list-items');
    let filterList = [...$$('.list-item-container')];

    if (filterList.length >= 10) filterListContainer.style.justifyContent = "flex-start";
    if (filterList.length < 10) filterListContainer.style.justifyContent = "center";   
}

function closeFilter() {
    const filterListContainer = $('#filter-list-container');
    $('#filter-list-items').innerHTML = ''; 
    filterListContainer.classList.add('d-none');
}

async function loadEventCards() {
    const festivals = await getFestivals();
    let allEventCardsHTML = '';
    let counter = 0;

    festivals.forEach(festival => {
        allEventCardsHTML += renderEvents(festival);
        // log(festival)
        counter++;
        allEventCardsHTML = checkAd(allEventCardsHTML, counter);
    });

    const eventCardsContainer = $('#event-cards-container');
    eventCardsContainer.innerHTML = allEventCardsHTML;
}

async function loadFilteredEventCards(festivals) {
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

function renderEvents({ LAND, id, NAME, DATUM, STADT, KATEGORIE }) {
    return /*html*/ `
        <div class="event-card column" onclick="openSelectedFestival(${id})">
            <span class="event-name">${highlightIfContains(NAME, currentInput)}</span>
            <div class="row gap-20 card-info">
                <span class="event-date">${processDate(DATUM)}</span>
                <p></p>
                <div class="column gap-10">
                    <span class="event-country">${highlightIfContains(LAND, currentInput)}</span>
                    <span class="event-location">${highlightIfContains(STADT, currentInput)}</span>
                    <span class="event-genre">${highlightIfContains(KATEGORIE, currentInput)}</span>
                </div>
            </div>
        </div>
    `;
}

function processDate(DATUM) {
    if (DATUM.includes('-')) {
        const [start, end] = DATUM.split('-').map(s => s.trim());
        return `${highlightIfContains(start, currentInput)} - ${highlightIfContains(end, currentInput)}`;
    }
    return highlightIfContains(DATUM, currentInput);
}

function renderAdBlock(adUrl) {
    return /*html*/ `
        <div class="ad-container">
            <a href="https://www.austrian.com/at/de/homepage">
                <img src="${adUrl}">
            </a>
        </div>
    `;
}

async function openSelectedFestival(id) {
    const selectedFestival = await checkFestivalId(id);
    renderSelectedFestival(selectedFestival);
}

async function checkFestivalId(id) {
    const festivalId = parseInt(id);
    const festivals = await getFestivals();
    log(festivalId)
    log(festivals)
    const festivalExists = festivals.find(festival => festival.id === festivalId);    
    
    if(festivalExists) return festivalExists;
    if(!festivalExists) return error(`No festival found!`);    
}

function renderSelectedFestival(selectedFestival) {
    const selectedFestivalContainer = $('#selected-festival-container-upper');
    $('#selected-festival-container-upper').classList.remove('d-none');

    selectedFestivalContainer.innerHTML = selectedFestivalTemplate(selectedFestival);
    log(selectedFestival)
}

function selectedFestivalTemplate({ LAND, BUNDESLAND, NAME, DATUM, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER }) {
    return /*html*/ `
        <div class="selected-festival-container-lower flex-center">
            <div class="selected-event-card column">
                <img class="selected-event-card-close grid-center" src="/assets/icons/close.svg" alt="X" onclick="closeSelectedFestival()">
                <span class="selected-event-name">${NAME}</span>

                <div class="row selected-card-info">${renderSelectedCardInfo(LAND, BUNDESLAND, DATUM, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER)}</div>

                <div class="selected-event-tickets-container">
                    <a class="selected-event-tickets flex-center" href="https://www.oeticket.com/events">Tickets</a>
                </div>
            </div>
        </div>
    `;
}

function renderSelectedCardInfo(LAND, BUNDESLAND, DATUM, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER) {
    return /*html*/ `
        <div class="selected-event-date-container grid-center">
            <div class="flex-center">
                <span class="selected-event-date">${processDate(DATUM)}</span>
            </div>
        </div>
        <div class="selected-event-info-container row">
            <div class="column gap-20">
                <span class="selected-event-country">Land: </span>
                <span class="selected-event-state">Bundesland: </span>
                <span class="selected-event-location">Stadt: </span>
                <span class="selected-event-genre">Genre: </span>
                <span class="selected-event-category">Kategorie: </span>
                <span class="selected-event-where">Wo: </span>
                <span class="selected-event-duration">Dauer: </span>
                <span class="selected-event-visitors">Besucher: </span>
            </div>
            <div class="column gap-30">
                <span class="selected-event-country">${LAND}</span>
                <span class="selected-event-state">${BUNDESLAND}</span>
                <span class="selected-event-location">${STADT}</span>
                <span class="selected-event-genre">${GENRES}</span>
                <span class="selected-event-category">${KATEGORIE}</span>
                <span class="selected-event-where">${WO}</span>
                <span class="selected-event-duration">${DAUER}</span>
                <span class="selected-event-visitors">${BESUCHER}</span>
            </div>
        </div>
    `;
}

function closeSelectedFestival() {
    $('#selected-festival-container-upper').classList.add('d-none');
    $('#selected-festival-container-upper').innerHTML = '';
}
let darkModeActive = false;

const getFestivals = async () => {
    const data = await getData();
    const eventserie = data.eventserie;
    // log(eventserie)
    return eventserie;
};

async function loadContent() {
    // loadFilters();
    loadEventCards();
}

// function loadFilters() {
//     const filterContainer = $('#filter-container');
//     filterContainer.innerHTML = /*html*/ `
//         <div class="open-filter-btn-containter row">
//             <button onclick="openFilterButtons()">Filter</button>
//             <button id="reset-filter-btn" class="d-none" onclick="resetSelectedFilter()">Filter löschen</button>
//         </div>
//         <div class="filters filters-closed row flex-center">
//             <button id="country">Land</button>
//             <button id="name">Name</button>
//             <button id="date">Datum</button>
//             <button id="location">Stadt</button>
//             <button id="genre">Genre</button>
//         </div>
//     `;

//     addClickToFilterButtons();
// }

// function openFilterButtons() {
//     $('.filters').classList.toggle('filters-closed');
// }

// async function resetSelectedFilter() {
//     currentInput = '';
//     $('#header-img .input-wrapper').classList.remove('show-close');   
//     $('.input-wrapper input').value = '';
//     await loadEventCards();
//     $('#reset-filter-btn').classList.add('d-none');
// }

// async function fetchData(attribute) {
//     const data = (await getFestivals()).map(festival => festival[attribute]);
//     return Array.from(new Set(data));
// }

// function addClickListener(id, attribute, sortFunction) {
//     $(`#${id}`).addEventListener('click', async function() {
//         const data = await fetchData(attribute);
//         const sortedList = sortFunction ? sortFunction(data) : data;
//         openFilterList(sortedList);
//     });
// }

// function addClickToFilterButtons() {
//     addClickListener('country', 'LAND', sortByFirstLetter);
//     addClickListener('name', 'NAME', sortByFirstLetter);
//     addClickListener('date', 'DATUM', sortDates);
//     addClickListener('location', 'STADT', sortByFirstLetter);
//     addClickListener('genre', 'GENRES', sortByFirstLetter);
// }

// function sortByFirstLetter(array) {
//     return array.sort((a, b) => a[0].localeCompare(b[0]));
// }

// async function getAllDates() {
//     const date = (await getFestivals()).map(festival => festival.DATUM);
//     const uniqueDate = new Set(date);

//     return Array.from(uniqueDate);
// }

// function getDates() {
//     $('#date').addEventListener('click', async function() {
//         const dates = await getAllDates();
//         const sortedList = sortDates(dates);
//         openFilterList(sortedList);
//     });
// }

// function sortDates(dates) {
//     return dates.sort((a, b) => {
//         let [monthA, dayA] = a.split('-');
//         let [monthB, dayB] = b.split('-');

//         monthA = monthMap[monthA];
//         monthB = monthMap[monthB];

//         return monthA === monthB ? parseInt(dayA, 10) - parseInt(dayB, 10) : monthA - monthB;
//     });
// }

// function openFilterList(sortedList) {
//     const filterListContainer = $('#filter-list-container'); 
//     filterListContainer.classList.remove('d-none');
//     const filterListItems = $('#filter-list-items');
//     filterListItems.innerHTML = '';
//     filterListItems.innerHTML += renderFilterList(sortedList);

//     const allListItems = $$('.list-item-container');
//     allListItems.forEach((listItem) => {
//         listItem.addEventListener('click', function() {
//             searchForItems(this);          
//         });
//     });

//     checkNumberOfItems();
//     filterListDarkMode();
// }

// function renderFilterList(sortedList) {
//     return sortedList.map((listItem, index) => {
//         return /*html*/ `
//             <div class="list-item-container" id="list-item-${index}">
//                 <span>${listItem}</span>
//             </div>
//         `;
//     }).join('');
// }

// async function searchForItems(clickedItem) {
//     $('#reset-filter-btn').classList.remove('d-none');
//     $('.filters').classList.add('filters-closed');

//     const spanValue = clickedItem.querySelector('span').textContent;
//     currentInput = spanValue;
//     const input = spanValue.toLowerCase();
//     const items = (await getFestivals());
  
//     const filteredItems = items.filter(({LAND, BUNDESLAND, NAME, STADT, DATUM, GENRES}) => 
//         [LAND, BUNDESLAND, NAME, STADT, DATUM, GENRES].some(attr => attr.toLowerCase().includes(input))
//     );

//     searchItems(filteredItems);
//     applyDarkModeToEventCards();
// }

// function searchItems(filteredItems) {
//     loadSelectedItems(filteredItems);
//     closeFilter();
// }

// function loadSelectedItems(filteredItems) {
//     let allEventCardsHTML = '';
//     let counter = 0;

//     filteredItems.forEach(festival => {
//         allEventCardsHTML += renderEvents(festival);
//         counter++;
//         allEventCardsHTML = checkAd(allEventCardsHTML, counter);
//     });

//     const eventCardsContainer = $('#event-cards-container');
//     eventCardsContainer.innerHTML = allEventCardsHTML;
// }

// function checkNumberOfItems() {
//     const filterListContainer = $('#filter-list-items');
//     let filterList = [...$$('.list-item-container')];

//     if (filterList.length >= 10) filterListContainer.style.justifyContent = "flex-start";
//     if (filterList.length < 10) filterListContainer.style.justifyContent = "center";   
// }

// function closeFilter() {
//     const filterListContainer = $('#filter-list-container');
//     $('#filter-list-items').innerHTML = ''; 
//     filterListContainer.classList.add('d-none');
// }

async function loadEventCards() {
    const festivals = await getFestivals();
    let allEventCardsHTML = '';
    let counter = 0;

    festivals.forEach(festival => {
        festival.events.forEach(singleEvent => {
            allEventCardsHTML += renderEvents(festival, singleEvent);
            counter++;
            allEventCardsHTML = checkAd(allEventCardsHTML, counter);
        });
    });

    const eventCardsContainer = document.getElementById('event-cards-container');
    eventCardsContainer.innerHTML = allEventCardsHTML;

    applyDarkModeToEventCards();
}


// function getSingleEventData(festival) {
//     return festival.events
// }

// async function loadFilteredEventCards(festivals) {
//     let allEventCardsHTML = '';
//     let counter = 0;

//     festivals.forEach(festival => {
//         allEventCardsHTML += renderEvents(festival);
//         counter++;
//         allEventCardsHTML = checkAd(allEventCardsHTML, counter);
//     });

//     const eventCardsContainer = $('#event-cards-container');
//     eventCardsContainer.innerHTML = allEventCardsHTML;

//     applyDarkModeToEventCards();
// }

function checkAd(allEventCardsHTML, counter) {
    if(counter % 6 === 0) {
        const adIndex = Math.floor((counter / 6 - 1) % ads.length);
        const ad = ads[adIndex];
        return allEventCardsHTML + renderAdBlock(ad);
    }
    return allEventCardsHTML;
}

function renderEvents(festival, singleEvent) {
    const transformedDate = transformDateFormat(singleEvent.eventDateIso8601);

    return /*html*/ `
        <div class="event-card column" onclick="openSelectedFestival(${festival.esId})">
            <div class="column card-info">
                <div class="card-image">
                    <img class ="card-image-main" src="${festival.esPictureBig}">
                    <img class ="card-image-background" src="${festival.esPictureBig}">
                </div>
                <div class="column gap-10">
                    <span class="event-name">${highlightIfContains(festival.esName, currentInput)}</span>
                    <div class="row event-country-container gap-5">
                        <img src="${renderFlags(singleEvent.eventCountry)}">
                        <span class="event-country">${highlightIfContains(singleEvent.eventCountry, currentInput)}</span>
                    </div>
                    <div class="row event-location-date-container">
                        <span class="event-location">${highlightIfContains(singleEvent.eventCity, currentInput)}</span>
                        <span class="event-date">${transformedDate}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function transformDateFormat(dateStr) {
    const date = new Date(dateStr);  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDate = `${day}.${month}.`;
    
    return formattedDate;
}

// <!-- <span class="event-genre">${highlightIfContains(KATEGORIE, currentInput)}</span> -->



// ##################################################################
// LEAVE IT THERE IN CASE SOME EVENTS HAVE NO IMAGE
// ##################################################################

// async function renderCardImages(imagePath) {
//     const eventImage = await getFestivals().esPictureBig;
//     log(eventImage)

//     return eventImage

//     // const imagePath = cardImages[imageIndex];
//     // imageIndex = (imageIndex + 1) % cardImages.length;
//     // return imagePath;
// }

function renderFlags(eventCountry) {
    return countryFlags[eventCountry] || '';
}

function renderAdBlock(ad) {
    return /*html*/ `
        <div class="ad-container">
            <a href="${ad.src}">
                <img src="${ad.img}">
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
    const festivalExists = festivals.find(festival => festival.id === festivalId);    
    
    if(festivalExists) return festivalExists;
    if(!festivalExists) return error(`No festival found!`);    
}

function renderSelectedFestival(selectedFestival) {
    const selectedFestivalContainer = $('#selected-festival-container-upper');
    $('#selected-festival-container-upper').classList.remove('d-none');

    selectedFestivalContainer.innerHTML = selectedFestivalTemplate(selectedFestival);
    selectedCardDarkMode();
}

function selectedFestivalTemplate({ LAND, BUNDESLAND, NAME, DATUM, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER, URL }) {
    return /*html*/ `
        <div class="selected-festival-container-lower flex-center">
            <div class="selected-event-card column">
                <img class="selected-event-card-close grid-center" src="../assets/icons/close.svg" alt="X" onclick="closeSelectedFestival()">
                <span class="selected-event-name">${NAME}</span>

                <div class="row selected-card-info gap-30">${renderSelectedCardInfo(LAND, BUNDESLAND, DATUM, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER)}</div>

                <div class="selected-event-tickets-container">
                    <a class="selected-event-tickets flex-center" target="_blank" href="${URL}">Tickets</a>
                </div>
            </div>
        </div>
    `;
}

function renderSelectedCardInfo(LAND, BUNDESLAND, DATUM, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER) {
    return /*html*/ `
        <div class="selected-card-container column">
            <div class="selected-event-date-container grid-center">
                <div class="flex-center">
                    <span class="selected-event-date">${processDate(DATUM)}</span>
                </div>
            </div>

            <div class="selected-event-info-container row">${renderSelectedEventInfo(LAND, BUNDESLAND, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER)}</div>
        </div>
        <div class="selected-card-image">
            <img src="${renderCardImages()}">
        </div>
    `;
}

function renderSelectedEventInfo(LAND, BUNDESLAND, STADT, GENRES, DAUER, KATEGORIE, WO, BESUCHER) {
    return /*html*/ `
        <div class="column gap-5">
            <div class="selected-event-info row">
                <span class="selected-event-country">Land: </span><span class="selected-event-country">${LAND}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-state">Bundesland: </span><span class="selected-event-state">${BUNDESLAND}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-location">Stadt: </span><span class="selected-event-location">${STADT}</span>
            </div>
            <div class="selected-event-info row">
                <span>Genre: </span><span class="selected-event-genre">${GENRES}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-category">Kategorie: </span><span class="selected-event-category">${KATEGORIE}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-where">Wo: </span><span class="selected-event-where">${WO}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-duration">Dauer: </span><span class="selected-event-duration">${DAUER}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-visitors">Besucher: </span><span class="selected-event-visitors">${BESUCHER}</span>
            </div>
        </div>
    `;
}

function closeSelectedFestival() {
    $('#selected-festival-container-upper').classList.add('d-none');
    $('#selected-festival-container-upper').innerHTML = '';
}



// ################################################################################
// DARK MODE SECTION
// ################################################################################

function checkDarkMode() {
    if(!darkModeActive) return activateDarkMode();
    if(darkModeActive) return deactivateDarkMode();
}

function activateDarkMode() {
    darkModeActive = true;
    const allEventCards = $$('.event-card');
    const allFilters = $$('.filters button');

    $('body').classList.add('dark-mode-body');
    $('#header-img').classList.add('dark-mode-header');

    allEventCards.forEach(eventCard => eventCard.classList.add('dark-mode-card'));
    allFilters.forEach(filter => filter.classList.add('dark-mode-filter'));
}

function deactivateDarkMode() {
    darkModeActive = false;
    const allEventCards = $$('.event-card');
    const allFilters = $$('.filters button');

    $('body').classList.remove('dark-mode-body');
    $('#header-img').classList.remove('dark-mode-header');

    allEventCards.forEach(eventCard => eventCard.classList.remove('dark-mode-card'));
    allFilters.forEach(filter => filter.classList.remove('dark-mode-filter'));
}

function selectedCardDarkMode() {
    if(darkModeActive) return $('.selected-event-card').classList.add('dark-mode-selected-card');
    if(!darkModeActive) return $('.selected-event-card').classList.remove('dark-mode-selected-card'); 
}

function filterListDarkMode() {
    const allItems = $$('.list-item-container span');

    if(darkModeActive) {
        $('#filter-list-card').classList.add('dark-mode-filter-list-card');
        allItems.forEach(item => item.classList.add('dark-mode-filter-list-item')); 
    } 

    if(!darkModeActive) {
        $('#filter-list-card').classList.remove('dark-mode-filter-list-card');
        allItems.forEach(item => item.classList.remove('dark-mode-filter-list-item'));
    } 
}

function applyDarkModeToEventCards() {
    if(darkModeActive) {
        const allEventCards = $$('.event-card');
        allEventCards.forEach(eventCard => eventCard.classList.add('dark-mode-card'));
    }
}
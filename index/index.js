let darkModeActive = false;

async function loadContent() {
    loadFilteredEventCards();
    loadFilters();
}


// ################################################################################
// FILTERS SECTION
// ################################################################################

function loadFilters() {
    const filterContainer = $('#filter-container');

    filterContainer.innerHTML = /*html*/ `
        <div class="open-filter-btn-container row">
            <div class="row">
                <button onclick="openFilter()">Filter</button>
                <button id="reset-filter-btn" class="d-none" onclick="resetSelectedFilter()">Filter löschen</button>
            </div>
            <button class="dark-mode-btn row gap-5" onclick="checkDarkMode()"></button>
        </div>
    `;
}

async function openFilter() {
    const festivals = await getFestivals();

    $('#filter-popup-container').classList.remove('d-none');
    $('#filter-popup-container').innerHTML = renderFilterSelection(festivals);
}

function renderFilterSelection() {
    return /*html*/ `
        <div class="filter-popup-content column gap-30">
            <img class="selected-event-card-close grid-center" src="../assets/icons/close.svg" alt="X" onclick="closeFilter()">

            <div class="single-filter column">
                <div class="column">
                    <span>Name</span>
                    <input type="text">
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column">
                    <span>Datum</span>
                    <input type="text">
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column">
                    <span>Land</span>
                    <input type="text">
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column">
                    <span>Stadt</span>
                    <input type="text">
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column">
                    <span>Preis min.</span>
                    <input type="text">
                    <span>Preis max.</span>
                    <input type="text">
                </div> 
            </div>
        </div>
    `; 
}

function closeFilter() {
    $('#filter-popup-container').classList.add('d-none');
}



// ################################################################################
// EVENT CARD SECTION (RENDERING & SELECTION)
// ################################################################################

async function loadFilteredEventCards(festivals) {
    festivals = festivals || await getFestivals();

    let allEventCardsHTML = '';
    let counter = 0;

    festivals.forEach(festival => {
        const {esId, esPictureBig, esText, esName} = festival;

        festival.events.forEach(singleEvent => {
            const event = {...singleEvent, esPictureBig, esName, esText, esId};
            allEventCardsHTML += renderEvent(event);
            counter++;
            allEventCardsHTML = checkAd(allEventCardsHTML, counter);
        });
    });

    const eventCardsContainer = $('#event-cards-container');
    eventCardsContainer.innerHTML = allEventCardsHTML;

    applyDarkModeToEventCards();
}

function checkAd(allEventCardsHTML, counter) {
    if(counter % 6 === 0) {
        const adIndex = Math.floor((counter / 6 - 1) % ads.length);
        const ad = ads[adIndex];
        return allEventCardsHTML + renderAdBlock(ad);
    }

    return allEventCardsHTML;
}

function renderEvent(event) {
    const transformedDate = transformDateFormat(event.eventDateIso8601);
    const transformedCountryName = transformCountryName(event.eventCountry);

    return /*html*/ `
        <div class="event-card column" onclick="openSelectedFestival('${event.eventId}', '${event.esId}')">
            <div class="column card-info">
                <div class="card-image">
                    <img class ="card-image-main" src="${event.esPictureBig}">
                    <img class ="card-image-background" src="${event.esPictureBig}">
                </div>
                <div class="column gap-10">
                    <span class="event-name">${highlightIfContains(event.esName, currentInput)}</span>
                    <div class="row event-country-container gap-5">
                        <img src="${renderFlags(event.eventCountry)}">
                        <span class="event-country">${highlightIfContains(transformedCountryName, currentInput)}</span>
                    </div>
                    <div class="row event-location-date-container">
                        <span class="event-location">${highlightIfContains(event.eventCity, currentInput)}</span>
                        <span class="event-date">${transformedDate.dayName}. ${transformedDate.formattedDate}</span>
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

    const dayOfWeekNumber = date.getDay();
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const dayName = days[dayOfWeekNumber];

    return { formattedDate, dayName };
}

function transformCountryName(eventCountry) {
    if(eventCountry === 'AT') return eventCountry.replace('AT', 'Österreich');
    if(eventCountry === 'DE') return eventCountry.replace('DE', 'Deutschland');
    if(eventCountry === 'CH') return eventCountry.replace('CH', 'Schweiz');
}

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

async function openSelectedFestival(eventId, esId) {
    document.body.classList.add('no-scroll');
     
    const selectedEvent = await checkFestivalId(eventId, esId);
    renderSelectedFestival(selectedEvent);
}

async function checkFestivalId(_eventId, _esId) {
    const festivals = await getFestivals();
    
    const festival = festivals.find(({esId}) => esId == _esId);
    const {esPictureBig, esText, esName} = festival;
    const event = festival.events.find(({eventId}) => eventId == _eventId);

    return {...event, esPictureBig, esName, esText};
}

function renderSelectedFestival(selected) {
    const selectedFestivalContainer = $('#selected-festival-container-upper');
    $('#selected-festival-container-upper').classList.remove('d-none');

    selectedFestivalContainer.innerHTML = selectedFestivalTemplate(selected);
    selectedCardDarkMode();
}

function selectedFestivalTemplate(selected) {
    return /*html*/ `
        <div class="selected-festival-container-lower flex-center">
            <div class="selected-event-card column">
                <img class="selected-event-card-close grid-center" src="../assets/icons/close.svg" alt="X" onclick="closeSelectedFestival()">
                <span class="selected-event-name">${selected.eventName}</span>
                <div class="column gap-15">
                    <div class="row selected-card-info gap-30">${renderSelectedCardInfo(selected)}</div>
    
                    <div class="row selected-event-text-container">
                        <div class="selected-event-text column">${selected.esText}</div>
                    </div>
    
                    <div class="selected-event-tickets-container">
                        <a class="selected-event-tickets flex-center" target="_blank" href="${selected.evoLink}">Tickets</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSelectedCardInfo(selected) {
    const transformedDate = transformDateFormat(selected.eventDateIso8601);
    
    return /*html*/ `
        <div class="selected-card-container column">
            <div class="selected-event-date-container row">
                <div class="flex-center column gap-10">
                    <span class="selected-event-date">${transformedDate.dayName}</span>
                    <span class="selected-event-date">${transformedDate.formattedDate}</span>
                </div>
                <div class="selected-card-image flex-center">
                    <img src="${selected.esPictureBig}">
                </div>
            </div>

            <div class="selected-event-info-container row">${renderSelectedEventInfo(selected)}</div>
        </div>
    `;
}

function renderSelectedEventInfo({eventCountry, eventCity, eventZip, eventStreet, minPrice}) {
    const transformedCountryName = transformCountryName(eventCountry);
    
    return /*html*/ `
        <div class="column gap-5">
            <div class="selected-event-info row">
                <span class="selected-event-country">Land: </span><span class="selected-event-country">${transformedCountryName}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-location">PLZ/Stadt: </span><span class="selected-event-location">${eventZip}, ${eventCity}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-state">Adresse: </span><span class="selected-event-state">${eventStreet}</span>
            </div>
            <div class="selected-event-info row">
                <span class="selected-event-category">Tickets: </span><span class="selected-event-category">ab ${minPrice} €</span>
            </div>
        </div>
    `;
}

function closeSelectedFestival() {
    $('#selected-festival-container-upper').classList.add('d-none');
    $('#selected-festival-container-upper').innerHTML = '';
    document.body.classList.remove('no-scroll')
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



// ################################################################################
// INTERSECTION OBSERVER FOR SCROLL UP BUTTON
// ################################################################################

function toggleScrollUpButton() {
    $('#scroll-up').classList.toggle('d-none');
}

const intObserver = new IntersectionObserver((entries) => {
    toggleScrollUpButton();
}, { threshold: 0, rootMargin: "250px" });


function intObserverSetup() {
    const el = $('header');
    intObserver.observe(el);
}







// ################################################################################
// OLD FILTER FUNCTIONS
// ################################################################################

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

















// ################################################################################
// AD WATCHTIME OBSERVER / EXPERIMENTAL
// ################################################################################

// class Timer {
//     secondsPassed = 0;
//     timerId = null;
//     isRunning = false;

//     toggle() {
//         this.isRunning = !this.isRunning;
//         this.isRunning ? this.pause() : this.start();
//     }

//     start() {
//         this.timerId = setInterval(() => {
//             this.secondsPassed++;
//             log(this.secondsPassed);
//         }, 1000);
//     }

//     pause() {
//         clearInterval(this.timerId);
//     }
// }

// const timer = new Timer();

// let adWatchTime = 0;

// const adObserver = new IntersectionObserver((entries) => {

//     const adsVisible = entries.some((entry) => entry.isIntersecting);
//     adsVisible ? timer.start()
// });
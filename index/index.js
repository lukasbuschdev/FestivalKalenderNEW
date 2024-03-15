let darkModeActive = false;

async function loadContent() {
    loadFilteredEventCards();
    loadFilters();
    getAllDates();
    loadDarkModeSetting();
}


// ################################################################################
// FILTERS SECTION
// ################################################################################

function loadFilters() {
    const filterContainer = $('#filter-container');

    filterContainer.innerHTML = /*html*/ `
        <div class="open-filter-btn-container row">
            <div class="row gap-15">
                <button onclick="openFilter()">Filter</button>
                <button id="reset-filter-btn" class="d-none" onclick="resetFilter()">Filter löschen</button>
            </div>
            <img class="dark-mode-btn row gap-5" src="../assets/icons/moon.png" onclick="checkDarkMode()">
        </div>
    `;
}

async function openFilter() {
    const festivals = await getFestivals();
    $('body').classList.add('no-scroll');

    deleteInput();

    $('#filter-popup-container').classList.remove('d-none');
    $('#filter-popup-container').innerHTML = renderFilterSelection(festivals);

    // DON'T FOLLOW THIS ROUTE ... JUST DON'T
    truncateSelectOptionText('.single-filter select', 25);

    checkSelectValueStyling();
    filterDarkMode();
}

function renderFilterSelection(festivals) {
    return /*html*/ `
        <div class="filter-popup-content column gap-35" onclick="event.stopPropagation()">
            <img class="selected-event-card-close grid-center" src="../assets/icons/close.svg" alt="X" onclick="closeFilter()">

            <div class="single-filter column">
                <div class="column filter-name">
                    <span>Name</span>
                    <div class="row gap-15">
                        <select id="name">
                            ${getNameOptions(festivals)}
                        </select>
                        <img id="reset-name" class="reset-filter grid-center" src="../assets/icons/close.svg" alt="X" onclick="resetSelection('name')">
                    </div>
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column filter-country">
                    <span>Land</span>
                    <div class="row gap-15">
                        <select id="country">
                            ${getCountryOptions(festivals)}
                        </select>
                        <img id="reset-country" class="reset-filter grid-center" src="../assets/icons/close.svg" alt="X" onclick="resetSelection('country')">
                    </div>
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column filter-city">
                    <span>Stadt</span>
                    <div class="row gap-15">
                        <select id="city">
                            ${getCityOptions(festivals)}
                        </select>
                        <img id="reset-city" class="reset-filter grid-center" src="../assets/icons/close.svg" alt="X" onclick="resetSelection('city')">
                    </div>
                </div> 
            </div>

            <div class="single-filter column">
                <div class="column filter-date">
                    <span>Datum</span>
                    <div class="row gap-15">
                        <div class="date-container">
                            <input id="date" type="text" placeholder="TT.MM.JJJJ">
                            <img src="../assets/icons/calendar.png" onclick="openCalendar()">
                        </div>
                        <img id="reset-date" class="reset-filter grid-center" src="../assets/icons/close.svg" alt="X" onclick="resetSelection('date')">
                    </div>
                </div> 
            </div>

            <div id="calendar-container" onclick="closeCalendar()" class="d-none">
                <div id="calendar" onclick="event.stopPropagation()"></div>
            </div>

            <div class="single-filter column">
                <div class="column filter-price">
                    <span>Preis</span>
                    <div class="price-input row gap-10">
                        <input id="priceMin" type="number" placeholder="Von">
                        <input id="priceMax" type="number" placeholder="Bis">
                    </div>
                </div> 
            </div>

            <div class="flex-center search-button-container gap-10">
                <button onclick="search()">Suchen</button>
                <button onclick="resetAllFilters()">Löschen</button>
            </div>
        </div>
    `; 
}

function getNameOptions(festivals) {
    const placeholderOption = '<option value="" disabled selected>Wähle einen Namen...</option>';

    const eventNames = festivals.flatMap(festival => festival.events.map(event => event.eventName));
    const uniqueNames = [...new Set(eventNames)];
    const sortedNames = sortAlphabetically(uniqueNames);
    const options = sortedNames.map(name => `<option value="${name}">${name}</option>`).join('');

    return placeholderOption + options;
}

function getCountryOptions(festivals) {
    const placeholderOption = '<option value="" disabled selected>Wähle ein Land...</option>';

    const eventCountries = festivals.flatMap(festival => festival.events.map(event => transformCountryName(event.eventCountry)));
    const uniqueCountries = [...new Set(eventCountries)];
    const sortedCountries = sortAlphabetically(uniqueCountries);
    const options = sortedCountries.map(country => `<option value="${country}">${country}</option>`).join('');
    
    return placeholderOption + options;
}

function getCityOptions(festivals) {
    const placeholderOption = '<option value="" disabled selected>Wähle eine Stadt...</option>';

    const eventCities = festivals.flatMap(festival => festival.events.map(event => event.eventCity));
    const uniqueCities = [...new Set(eventCities)];
    const sortedCities = sortAlphabetically(uniqueCities)
    const options = sortedCities.map(city => `<option value="${city}">${city}</option>`).join();

    return placeholderOption + options;
}

function sortAlphabetically(array) {
    return array.sort((a, b) => a.localeCompare(b));
}

function checkSelectValueStyling() {
    $$('.single-filter select').forEach(select => {
        const resetButtonId = 'reset-' + select.id;
        const resetButton = $('#' + resetButtonId);

        const toggleClasses = () => {
            const isEmpty = select.value === "";
            select.classList.toggle('gray-text', isEmpty);
            resetButton.classList.toggle('d-none', isEmpty);
        };

        select.addEventListener('change', toggleClasses);
        toggleClasses(); 
    });

    checkDateInput();
}

function checkDateInput() {
    const dateInput = $('#date');
    const dateResetButton = $('#reset-date');

    const toggleDateClasses = () => {
        const isDateEmpty = dateInput.value === "";
        dateInput.classList.toggle('gray-text', isDateEmpty);
        dateResetButton.classList.toggle('d-none', isDateEmpty);
    };

    dateInput.addEventListener('input', toggleDateClasses);
    toggleDateClasses();
}

function resetSelection(selectElementId) {
    $('#' + selectElementId).value = "";
    checkSelectValueStyling();
}

function resetAllFilters() {
    ['name', 'country', 'city', 'date', 'priceMin', 'priceMax'].forEach(resetSelection);
    checkSelectValueStyling();
}

function search() {
    const inputs = getInputs();
    closeFilter();

    if(inputs !== undefined) {
        filter(inputs);
    }
}

function getInputs() {
    const inputs = {
        name: $('#name').value.toLowerCase(),
        country: $('#country').value.toLowerCase(),
        city: $('#city').value.toLowerCase(),
        date: $('#date').value.toLowerCase(),
        priceMin: $('#priceMin').value || '0',
        priceMax: $('#priceMax').value || '1000'
    };

    transformInputDate(inputs);

    const anyInputFilled = Object.values(inputs).some((input, index) => {
        const key = Object.keys(inputs)[index];
        if (key === 'priceMin' || key === 'priceMax') {
            return (key === 'priceMin' && input !== '0') || (key === 'priceMax' && input !== '1000');
        }
        return input !== '';
    });
    $('#reset-filter-btn').classList.toggle('d-none', !anyInputFilled);

    return anyInputFilled ? inputs : undefined;
}

function transformInputDate(inputs) {
    const indexOfSecondDot = inputs.date.indexOf('.', inputs.date.indexOf('.') + 1);
    if(indexOfSecondDot !== -1) return inputs.date = inputs.date.slice(0, indexOfSecondDot + 1);
}

async function filter({ name, country, city, date, priceMin, priceMax }) {
    const festivals = await getFestivals();
    const filteredFestivals = festivals.reduce((acc, festival) => {
        const filteredEvents = festival.events.filter(event => {
            const transformedDateObj = transformDateFormat(event.eventDateIso8601);
            const transformedCountryName = transformCountryName(event.eventCountry);
            const transformedDate = `${transformedDateObj.formattedDate} ${transformedDateObj.dayName}`;

            const matchesName = !name || event.eventName.toLowerCase().includes(name);
            const matchesCountry = !country || transformedCountryName.toLowerCase().includes(country);
            const matchesCity = !city || event.eventCity.toLowerCase().includes(city);
            const matchesDate = !date || transformedDate.toLowerCase().includes(date);
            const matchesPrice = (priceMin === '' && priceMax === '') ||
                                 (event.minPrice >= parseFloat(priceMin) && event.maxPrice <= parseFloat(priceMax));

            return matchesName && matchesCountry && matchesCity && matchesDate && matchesPrice;
        });

        if(filteredEvents.length > 0) acc.push({...festival, events: filteredEvents});
        return acc;
    }, []);

    // log(filteredFestivals)
    checkInputAndResults(filteredFestivals);
}

function resetFilter() {
    $('#reset-filter-btn').classList.add('d-none');
    deleteInput();
    loadFilteredEventCards();
}

function closeFilter() {
    $('body').classList.remove('no-scroll');
    $('#filter-popup-container').classList.add('d-none');
}



// ################################################################################
// CALENDAR SECTION / EXPERIMENTAL
// ################################################################################

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function openCalendar() {
    const container = $('#calendar');
    $('#calendar-container').classList.toggle('d-none');

    if(!container.classList.contains('d-none')) {
        container.innerHTML = '';

        const markedDates = await getAllDates();
        generateCalendar(container, currentMonth, currentYear, markedDates);
    }
}

async function generateCalendar(container, month, year, markedDates) {
    container.innerHTML = '';

    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    const headerHtml = /*html*/ `
        <div class="calendar-header">
            <button id="prevBtn" onclick="changeMonth(-1)"><</button>
            <span id="monthYearLabel">${monthNames[month]} ${year}</span>
            <button id="nextBtn" onclick="changeMonth(1)">></button>
        </div>
    `;

    container.innerHTML = headerHtml;

    window.changeMonth = async function(increment) {
        currentMonth += increment;
        if(currentMonth < 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else if(currentMonth > 11) {
            currentMonth = 0;
            currentYear += 1;
        }
        const markedDates = await getAllDates();
        generateCalendar(container, currentMonth, currentYear, markedDates);
    };

    generateDays(container, month, year, markedDates);
}

function generateDays(container, month, year, markedDates) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for(let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;

        const formattedDay = i.toString().padStart(2, '0');
        const formattedMonth = (month + 1).toString().padStart(2, '0');
        const currentDate = `${formattedDay}.${formattedMonth}.${year}`;

        if(markedDates.has(currentDate)) {
            dayElement.classList.add('marked');
        }

        container.appendChild(dayElement);
        
        dayElement.onclick = () => {
            const selectedDate = `${formattedDay}.${formattedMonth}.${year}`;
            insertSelectedDate(selectedDate);
            closeCalendar();
        };
    }
}



// ########################################################
// GENERATE DAYS MODIFICATION/REPLACEMENT -> EXPERIMENTAL
// ########################################################

// function generateDays(container, month, year, markedDates) {
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     container.innerHTML = Array(daysInMonth)
//         .map((n, i) => i + 1)
//         .reduce((day) => {
//             const currentDate = getCurrentDate(day, month, year);
//             const isDayMarked = markedDates.has(currentDate);
//             dayTemplate(day, currentDate, isDayMarked);
//         }, '');
// }

// function getCurrentDate(day, month, year) {
//     const formattedDay = day.toString().padStart(2, '0');
//     const formattedMonth = (month + 1).toString().padStart(2, '0');
//     return `${formattedDay}.${formattedMonth}.${year}`;
// }

// function clickFunction(selectedDate) {
//     insertSelectedDate(selectedDate);
//     closeCalendar();
// };

// function dayTemplate(day, selectedDate, isDayMarked) {
//     return /*html*/`
//         <div onclick="clickFunction(${selectedDate})" class="calendar-day${isDayMarked ? ' marked' : ''}">
//             ${day}
//         </div>
//     `;
// }



async function changeMonth(container, increment) {
    currentMonth += increment;
    if(currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if(currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }
    const markedDates = await getAllDates();
    generateCalendar(container, currentMonth, currentYear, markedDates);
}

function insertSelectedDate(selectedDate) {
    $('.date-container input').value = selectedDate;
}

function closeCalendar() {
    checkSelectValueStyling();
    $('#calendar-container').classList.toggle('d-none');
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
    if(screen.width > 600) return renderWebAds(allEventCardsHTML, counter);
    if(screen.width <= 600) return renderMobileAds(allEventCardsHTML, counter);
}

function renderWebAds(allEventCardsHTML, counter) {
    if(counter % 6 === 0) {
        const adIndex = Math.floor((counter / 6 - 1) % ads.length);
        const ad = ads[adIndex];
        return allEventCardsHTML + renderAdBlock(ad);
    }

    return allEventCardsHTML;
}

function renderMobileAds(allEventCardsHTML, counter) {
    if(counter % 3 === 0) {
        const adIndex = Math.floor((counter / 3 - 1) % ads.length);
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
            <a href="${ad.src}" target="_blank">
                <img src="${ad.img}">
            </a>
        </div>
    `;
}

async function openSelectedFestival(eventId, esId) {
    $('body').classList.add('no-scroll');
     
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
        <div class="selected-festival-container-lower flex-center" onclick="closeSelectedFestival()">
            <div class="selected-event-card column" onclick="event.stopPropagation()">
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

function renderSelectedEventInfo({eventCountry, eventCity, eventZip, eventVenue, minPrice}) {
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
                <span class="selected-event-state">Ort: </span><span class="selected-event-state">${eventVenue}</span>
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
    $('body').classList.remove('no-scroll')
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
    
    $('.dark-mode-btn').setAttribute('src', '../assets/icons/sun.png'); 
    $('body').classList.add('dark-mode-body');
    $('#header-img').classList.add('dark-mode-header');

    allEventCards.forEach(eventCard => eventCard.classList.add('dark-mode-card'));

    saveDarkModeSetting();
}

function deactivateDarkMode() {
    darkModeActive = false;
    const allEventCards = $$('.event-card');
    
    $('.dark-mode-btn').setAttribute('src', '../assets/icons/moon.png'); 
    $('body').classList.remove('dark-mode-body');
    $('#header-img').classList.remove('dark-mode-header');

    allEventCards.forEach(eventCard => eventCard.classList.remove('dark-mode-card'));

    saveDarkModeSetting();
}

function selectedCardDarkMode() {
    if(darkModeActive) return $('.selected-event-card').classList.add('dark-mode-selected-card');
    if(!darkModeActive) return $('.selected-event-card').classList.remove('dark-mode-selected-card'); 
}

function filterDarkMode() {
    $('.filter-popup-content').classList.toggle('dark-mode-filter', darkModeActive);
    $('#calendar').classList.toggle('dark-mode-calendar', darkModeActive);
    $$('.single-filter > div input').forEach(input => input.classList.toggle('dark-mode-filter-input', darkModeActive));
}

function applyDarkModeToEventCards() {
    if(darkModeActive) {
        const allEventCards = $$('.event-card');
        allEventCards.forEach(eventCard => eventCard.classList.add('dark-mode-card'));
    }
}

// ################################################################################
// SAVE DARK MODE TO LOCAL STORAGE / EXPERIMENTAL
// ################################################################################

function saveDarkModeSetting() {
    localStorage.setItem('darkMode', darkModeActive.toString());
}

function loadDarkModeSetting() {
    const storedValue = localStorage.getItem('darkMode');
    darkModeActive = storedValue === 'true';

    darkModeActive ? activateDarkMode() : deactivateDarkMode();
}

// ################################################################################
// ################################################################################



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
// MARK DATES IN CALENDAR / EXPERIMENTAL
// ################################################################################

async function getAllDates() {
    const festivals = await getFestivals();
    const dates = new Set();

    festivals.forEach(festival => {
        festival.events.forEach(event => dates.add(transformDate(event.eventDateIso8601)))
    });

    return dates
}

function transformDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

// ################################################################################
// LIMIT <OPTION> OF <SELECT> TO 20 CHARACTERS
// ################################################################################

function truncateSelectOptionText(selector, maxLength) {
    const selects = document.querySelectorAll(selector);
  
    selects.forEach((select) => {
        Array.from(select.options).forEach((option) => {
            if(option.text.length > maxLength) {
                option.text = option.text.substring(0, maxLength) + '...';
            }
        });
    });
}


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
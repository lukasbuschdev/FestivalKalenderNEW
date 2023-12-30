function loadContent() {
    loadFilters();
    loadEventCards();
}

function loadFilters() {
    const filterContainer = $('#filter-container');
    filterContainer.innerHTML = /*html*/ `
        <div class="filters row flex-center">
            <input type="text" placeholder="Datum">
            
            <input type="text" placeholder="Ort">
            
            <input type="text" placeholder="Genre">
            
            <input type="text" placeholder="Band">
        </div>
    `;
}

async function loadEventCards() {
    const data = await getData();
    const festivals = data.festivals;
    let allEventCardsHTML = '';

    festivals.forEach(festival => {
        allEventCardsHTML += renderEvents(festival);
    });

    const eventCardsContainer = $('#event-cards-container');
    eventCardsContainer.innerHTML = allEventCardsHTML;
}

function renderEvents({ id, name, date, location, genre }) {
    return /*html*/ `
        <div class="event-card column" onclick="openEvent('${id}')">
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

async function openEvent(id) {
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
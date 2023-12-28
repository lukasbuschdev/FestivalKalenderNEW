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

function renderEvents({ name, date, location, genre }) {
    return /*html*/ `
        <div class="event-card column">
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







// async function loadEventCards() {
//     const data = await getData();
//     const festivals = data.festivals;

//     festivals.forEach(festival => {
//         log(festival)
//     });

//     const eventCardsContaier = $('#event-cards-container');
//     eventCardsContaier.innerHTML = renderEvents(festivals);
// }

// function renderEvents({name, date, location, genre}) {
//     return /*html*/ `
//         <div class="event-card">
//             <span class="event-name">${name}</span>
//             <span class="event-date">${date}</span>
//             <div>
//                 <span class="event-location">${location}</span>
//                 <span class="event-genre">${genre}</span>
//                 <span class="event-line"></span>
//                 <span class="event-tickets">Tickets</span>
//             </div>
//         </div>
//     `;
// }


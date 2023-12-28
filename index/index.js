function loadContent() {
    loadFilters();
    loadEventCards();
}

function loadFilters() {
    const filterContainer = $('#filter-container');
    filterContainer.innerHTML = /*html*/ `
        <div class="filters row flex-center">
            <div class="filter-box flex-center">
                <img src="/assets/icons/loupe.svg">
                <input type="text">
            </div>
            <div class="filter-box flex-center">
                <img src="/assets/icons/loupe.svg">
                <input type="text">
            </div>
            <div class="filter-box flex-center">
                <img src="/assets/icons/loupe.svg">
                <input type="text">
            </div>
            <div class="filter-box flex-center">
                <img src="/assets/icons/loupe.svg">
                <input type="text">
            </div>
        </div>
    `;
}

function loadEventCards() {
    // get event cards data
    const eventCardsContaier = $('#event-cards-container');
    eventCardsContaier.innerHTML = /*html*/ `

    `;
}


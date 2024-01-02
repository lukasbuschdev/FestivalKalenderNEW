const dataSet = async () => {
    return await getData();
};

function loadHeader() {
    const headerContainer = $('#header-container');

    const headerContent = /*html*/ `
        <header class="bg-white flex-center">
            <div id="header-img">
                <h1>Festivalkalender</h1>
                <input type="text">
            </div>
        </header>
    `;

    includeTemplate(headerContainer, headerContent);
};

document.addEventListener('DOMContentLoaded', function() {  
    setTimeout(() => {
        const inputField = $('#header-img input');
        inputField.addEventListener('input', function() {
            filterAndSearch();
        });
    }, 1000)
});

async function filterAndSearch() {
    const input = $('#header-img input').value.toLowerCase();
    const filteredFestivals = (await dataSet()).festivals.filter(festival => {
        return festival.name.toLowerCase().includes(input) ||
               festival.location.toLowerCase().includes(input) ||
               festival.date.toLowerCase().includes(input) ||
               festival.genre.toLowerCase().includes(input);
    });

    search(filteredFestivals);
}

function search(filteredData) {
    log(filteredData);
    loadFilteredEventCards(filteredData);
}

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

// async function filterAndSearch() {
//     const input = $('#header-img input').value.toLowerCase();
//     const filteredFestivals = (await dataSet()).festivals.filter(festival => {
//         return festival.name.toLowerCase().includes(input) ||
//                festival.location.toLowerCase().includes(input) ||
//                festival.date.toLowerCase().includes(input) ||
//                festival.genre.toLowerCase().includes(input);
//     });

//     search(filteredFestivals);
// }

async function filterAndSearch() {
    const input = $('#header-img input').value.toLowerCase();
    const festivals = (await dataSet()).festivals;
  
    const filteredFestivals = (await festivals).filter(({name, location, date, genre}) => 
        [name, location, date, genre].some(attr => attr.toLowerCase().includes(input))
    );

    search(filteredFestivals);
}

function search(filteredData) {
    log(filteredData);
    loadFilteredEventCards(filteredData);
}

function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const inputField = $('#header-img input');
        
        if(!inputField) return error("Input field not found");
        if (inputField) {
            inputField.addEventListener('input', debounce(function() {
                filterAndSearch();
            }, 250));
        }
    }, 250);
});
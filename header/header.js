const dataSet = async () => {
    return await getData();
};

let currentInput = '';

function loadHeader() {
    const headerContainer = $('#header-container');

    const headerContent = /*html*/ `
        <header class="bg-white flex-center">
            <div id="header-img">
                <h1>Festivalkalender</h1>
                <input type="text" oninput="checkHeaderInput()">
            </div>
        </header>
    `;

    includeTemplate(headerContainer, headerContent);
};

async function filterAndSearch() {
    const input = $('#header-img input').value.toLowerCase();
    const festivals = (await dataSet()).festivals;
    currentInput = input;
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

function checkHeaderInput() {
    const inputField = $('#header-img input');
    
    if(!inputField) return error("Input field not found");
    if (inputField) {
        inputField.addEventListener('input', debounce(function() {
            filterAndSearch();
        }, 250));
    }
}

function highlightIfContains(text, input) {
    const dataString = text;

    if (input && dataString.toLowerCase().includes(input.toLowerCase())) {
        return `<span class="highlight">${text}</span>`;
    }
    return text;
}
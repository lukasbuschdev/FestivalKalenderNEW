let currentInput = '';

function loadHeader() {
    const headerContainer = $('#header-container');

    const headerContent = /*html*/ `
        <header class="flex-center">
            <div id="header-img">
                <h1>Festivalkalender</h1>
                <div class="input-wrapper">
                    <input type="text" placeholder="Suchen...">
                    <div onclick="deleteInput()" id="close-icon"></div>
                </div>
            </div>
        </header>
    `;

    includeTemplate(headerContainer, headerContent);
};

async function filterAndSearch() {
    const input = $('#header-img input').value.toLowerCase();
    checkInput(input);
    currentInput = input;
    const filteredFestivals = (await getFestivals()).filter(({LAND, NAME, STADT, DATUM, GENRES}) => 
        [LAND, NAME, STADT, DATUM, GENRES].some(attr => attr.toLowerCase().includes(input))
    );
    log(filteredFestivals);
    loadFilteredEventCards(filteredFestivals);
}

function deleteInput() {
    const closeIcon = $('#close-icon');
    
    if(closeIcon) {
        const inputField = $('#header-img input');
        inputField.value = '';
        checkInput('');
        filterAndSearch();
    }
}

function checkInput(input) {
    const inputWrapper = $('#header-img .input-wrapper');
    if(input.length < 1) inputWrapper.classList.remove('show-close');
    if(input.length >= 1) inputWrapper.classList.add('show-close');
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
        if(inputField) {
            inputField.addEventListener('input', debounce(function() {
                filterAndSearch();
            }, 250));
        }
    }, 250);
})

function highlightIfContains(text, input) {
    const dataString = text;

    if (input && dataString.toLowerCase().includes(input.toLowerCase())) {
        return `<span class="highlight">${text}</span>`;
    }
    return text;
}
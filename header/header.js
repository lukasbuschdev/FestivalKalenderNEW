let currentInput = '';

function loadHeader() {
    const headerContainer = $('#header-container');

    const headerContent = /*html*/ `
        <header class="flex-center">
            <div class="presented-logo row gap-10">
                <img id="presented-by" src="../assets/icons/presentedby.png">
                <a href="https://www.vamida.at/"><img id="vamida-logo" src="../assets/icons/vamidalogo.png"></a>
            </div>
            <div id="header-img" class="column">
                <img src="../assets/icons/icon-text.svg" alt="Festivalkalender">
                <div class="input-wrapper">
                    <input type="text" placeholder="Suchen...">
                    <div onclick="deleteInput()" id="close-icon"></div>
                </div>
            </div>
        </header>
    `;

    includeTemplate(headerContainer, headerContent);
    initHeaderInput();
    intObserverSetup();
};

async function filterAndSearch() {
    const input = $('#header-img .input-wrapper input').value.toLowerCase();
    checkInput(input);
    currentInput = input;

    const festivals = await getFestivals();
    const filteredFestivals = festivals.reduce((acc, festival) => {
        const filteredEvents = festival.events.filter(event => {
            const transformedDateObj = transformDateFormat(event.eventDateIso8601);
            const transformedCountryName = transformCountryName(event.eventCountry);
            const transformedDate = `${transformedDateObj.formattedDate} ${transformedDateObj.dayName}`;
 
            return [event.eventCity, transformedCountryName, transformedDate, event.eventName, event.eventSearchText]
                .some(attr => attr && attr.toLowerCase().includes(input));
        });

        if(filteredEvents.length > 0) {
            const festivalCopy = {...festival, events: filteredEvents};
            acc.push(festivalCopy);
        }

        return acc;
    }, []);

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

function initHeaderInput() {
    const inputField = $('#header-img input');
    
    if(!inputField) return error("Input field not found");
    inputField.addEventListener('input', debounce(function() {
        checkInput(inputField.value);
        checkInputLength(inputField);
    }, 150));
}

function checkInputLength(inputField) {
    if(inputField.value.length < 1) return deleteInput();
    if(inputField.value.length >= 3) return filterAndSearch();
}

function highlightIfContains(text, input) {
    const dataString = text;

    if(input && dataString.toLowerCase().includes(input.toLowerCase())) {
        return `<span class="highlight">${text}</span>`;
    }
    return text;
}
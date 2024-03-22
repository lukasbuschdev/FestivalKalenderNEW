// ##########################################################
// INCLUDING THE TEMPLATE
// ##########################################################

const includeTemplate = (selector, htmlContent) => {
    const targetElement = selector;

    if(!targetElement) return error(`Element with selector '${selector}' not found.`);
    if(targetElement) return targetElement.innerHTML += htmlContent;
};



// ##########################################################
// ADS, MONTHS, IMAGES, FLAGS
// ##########################################################

const ads = [
    {
        "img": '../assets/img/AD1.webp',
        "src": 'https://www.vamida.at/b1-salts-strong-as-f-k.html' 
    },
    {
        "img": '../assets/img/AD2.webp',
        "src": 'https://www.vamida.at/thomaduo-filmtabletten-400-100mg.html?mtm_campaign=vamida_thomaduo_pdm&mtm_kwd=banner&mtm_medium=header&mtm_group=202309_banner_intern'
    },
    {
        "img": '../assets/img/AD3.webp',
        "src": 'https://www.vamida.at/catalogsearch/result/?q=kaloba'
    }
];

const countryFlags = {
    "CH": '../assets/icons/flag-swiss.png',
    "DE": '../assets/icons/flag-german.png',
    "AT": '../assets/icons/flag-austrian.png'
};
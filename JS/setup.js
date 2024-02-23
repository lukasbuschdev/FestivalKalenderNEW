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

// const cardImages = [
//     '../assets/img/img1.jpg',
//     '../assets/img/img2.jpg',
//     '../assets/img/img3.jpg',
//     '../assets/img/img4.jpg',
//     '../assets/img/img5.jpg',
//     '../assets/img/img6.jpg',
//     '../assets/img/img7.jpg',
//     '../assets/img/img8.jpg',
//     '../assets/img/img9.jpg',
//     '../assets/img/img10.jpg',
//     '../assets/img/img11.jpg',
//     '../assets/img/img12.jpg',
//     '../assets/img/img13.jpg',
//     '../assets/img/img14.jpg',
//     '../assets/img/img15.jpg',
//     '../assets/img/img16.jpg'
// ];

// let imageIndex = 0;

const countryFlags = {
    "CH": '../assets/icons/flag-swiss.png',
    "DE": '../assets/icons/flag-german.png',
    "AT": '../assets/icons/flag-austrian.png'
};


const monthMap = {
    'Jan.': 1, 'Feb.': 2, 'März': 3, 'Apr.': 4, 'Mai': 5, 'Juni': 6,
    'Juli': 7, 'Aug.': 8, 'Sept.': 9, 'Okt.': 10, 'Nov.': 11, 'Dez.': 12
};
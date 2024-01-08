const includeTemplate = (selector, htmlContent) => {
    const targetElement = selector;

    if(!targetElement) return error(`Element with selector '${selector}' not found.`);
    if(targetElement) return targetElement.innerHTML += htmlContent;
};

// async function getData() {
//     const url = '/database.json';
//     const data = await (await fetch(url)).json();
//     return data;
// }
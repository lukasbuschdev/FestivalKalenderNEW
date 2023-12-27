async function init() {
    loadHeader();
    loadFooter();
    await getData();
}

async function getData() {
    const url = '/database.json';
    const data = await (await fetch(url)).json();
    return data;
}
async function init() {
    loadHeader();
    loadFooter();
    loadContent();
    await getData();
}


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
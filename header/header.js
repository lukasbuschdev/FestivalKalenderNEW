function loadHeader() {
    const headerContainer = $('#header-container');

    const headerContent = /*html*/ `
        <header class="bg-white">

        </header>
    `;

    includeTemplate(headerContainer, headerContent);
};
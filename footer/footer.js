function loadFooter() {
    const footerContainer = $('#footer-container');

    const footerContent = /*html*/ `
        <footer class="bg-dark">

        </footer> 
    `;

    includeTemplate(footerContainer, footerContent);
}
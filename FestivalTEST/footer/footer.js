function loadFooter() {
    const footerContainer = $('#footer-container');

    const footerContent = /*html*/ `
        <footer class="row">
            <div class="copyright column gap-20">
                <a href="https://www.vamida.at/"><img src="../assets/icons/vamidalogo.png"></a>
                <span>© 2024 Vamida - Versandapotheke</span>
            </div>

            <div class="links-container column gap-15">
                <div>
                    <a target="_blank" href="https://www.vamida.at/agb">AGB</a>
                </div>
                <div>
                    <a target="_blank" href="https://www.vamida.at/impressum">Impressum</a>
                </div>
                <div>
                    <a target="_blank" href="https://www.vamida.at/datenschutzerklarung">Datenschutz</a>
                </div>
            </div>
        </footer> 
    `;

    includeTemplate(footerContainer, footerContent);
}
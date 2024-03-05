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

                <!-- <div class="references">
                    <a href="https://www.flaticon.com/free-icons/up-arrow" title="up arrow icons">Up arrow icon created by 'Freepik' - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/sun" title="sun icons">Sun icons created by Good Ware - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/moon" title="moon icons">Moon icons created by Good Ware - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/calendar" title="calendar icons">Calendar icons created by Freepik - Flaticon</a>



                    OLD DARK MODE ICON

                    <a href="https://www.flaticon.com/authors/rizal2109" title="rizal2109">Darkmode icon created by 'rizal2109' - Flaticon</a>
                </div> -->
            </div>
        </footer> 
    `;

    includeTemplate(footerContainer, footerContent);
}
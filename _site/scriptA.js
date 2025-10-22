/* =========================================================
   🧠 Fuhrmanns Hof – Zentrales Skript (Variante A)
   =========================================================
   Dieses Skript übernimmt:
   1. Laden der Navigationsleiste (nav.html)
   1b. Laden des Footers (footer.html)
   2. Markierung der aktiven Seite
   3. Einblenden des Weihnachtsmarkt-Hinweises (Querfurter Weihnachtszauber)
   4. Chrome/macOS-Hintergrund-Fix

   ➤ Ablageort: /fuhrmanns-hof-webseite/script.js
   ➤ Eingebunden in allen Seiten über:
         <script src="/fuhrmanns-hof-webseite/script.js"></script>
========================================================= */


/* ---------------------------------------------------------
   Aktive Seite hervorheben
--------------------------------------------------------- */
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-inner a');
  const current = window.location.pathname.split('/').pop();
  links.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
}


/* ---------------------------------------------------------
   Weihnachtsmarkt-Hinweis – Variante A (sachlich)
--------------------------------------------------------- */
(function () {
  const isHome =
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname === '/fuhrmanns-hof-webseite/' ||
    window.location.pathname === '/';

  if (!isHome) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // 4. Advent (letzter Sonntag vor Weihnachten)
  let christmas = new Date(year, 11, 25);
  let fourthAdvent = new Date(christmas);
  while (fourthAdvent.getDay() !== 0) fourthAdvent.setDate(fourthAdvent.getDate() - 1);

  // Freitag bis Sonntag berechnen
  let friday = new Date(fourthAdvent); friday.setDate(fourthAdvent.getDate() - 2);

  const months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  const dateRange = `${friday.getDate()}. bis ${fourthAdvent.getDate()}. ${months[fourthAdvent.getMonth()]} ${year}`;

  if (month >= 10 && month <= 12) {
    const el = document.getElementById('announcement');
    if (el) {
      el.innerHTML =
        `🎄✨ Der <strong>Querfurter Weihnachtszauber</strong> findet in diesem Jahr vom <strong>${dateRange}</strong> statt. ` +
        `Auch der <strong>Fuhrmanns Hof</strong> öffnet an diesem Wochenende seine Tore und ist Teil des festlichen Geschehens rund um Markt und Altstadt.`;
      el.style.display = 'block';
    }
  }

  // 🩹 Chrome/macOS-Fix
  window.addEventListener('load', () => document.body.classList.add('show-bg'));
})();
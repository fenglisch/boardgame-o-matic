///////////////////////////////////////////////////////////////////////
// DEFINITIONEN *** DEFINITIONS
// http://www.mat-o-wahl.de

// FUNKTION / FUNCTION
// * Klappt 1-n Ergebnisse am Ende bereits aus.
//   So müssen die Nutzer nicht extra auf die erste(n) Partei(en) klicken und wissen, dass es noch mehr Informationen gibt.
// * Unfolds 1-n results at the end.
//   Like this, users don't have to click on a party and know that there's more information hidden.

// 1.) Allgemeine Angaben
//     General Settings

// Anzahl der Ergebnisse zum Anzeigen
// Number of results to show
const SHOW_DETAILLED_RESULTS_AT_END = 1;

// 2.) In der DEFINITION.JS in den Erweiterten Einstellungen das Add-On eintragen.
// Add the add-on to the advanced settings in DEFINITION.JS
// var addons = ["extras/addon_show_first_results.js"]

// 3.) Fertig.
// That's it.

///////////////////////////////////////////////////////////////////////

// Hier kommt nur noch Quellcode. Bitte gehen Sie weiter. Hier gibt es nichts zu sehen.
// That's just source code. Please move on. Nothing to see here.

///////////////////////////////////////////////////////////////////////

// MutationObserver starten - prüft Änderungen im DOM
// https://medium.com/better-programming/js-mutationobserver-1d7aed479da2
// https://developer.mozilla.org/de/docs/Web/API/MutationObserver
function mow_addon_show_first_results_MutationObserver() {
  // zu überwachende Zielnode (target) auswählen
  var target = document.querySelector("#resultsHeading");

  // eine Instanz des Observers erzeugen und Callback-Funktion aufrufen
  var observer = new MutationObserver(mow_addon_show_first_results);

  // Konfiguration des Observers: alles melden - Änderungen an Daten, Kindelementen und Attributen
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  // eigentliche Observierung starten und Zielnode und Konfiguration übergeben
  observer.observe(target, config);

  // später: Observation wieder einstellen
  // observer.disconnect();
}

// Auf
function mow_addon_show_first_results() {
  // id "#resultsHeading" wird in fnStart() am Anfang geleert (empty()).
  // -> mutationObserver erkennt Änderung und aktiviert diese Funktion :(
  // -> prüfen, ob Inhalt in DIV existiert
  if (
    !document.querySelector("#resultsHeading").textContent ||
    window.screen.width < 768
  )
    return;

  setTimeout(() => {
    const nodelistVisibleResults = document.querySelectorAll(
      "[id^='resultsShortPartyClamp']:not([class*='hidden-by'])"
    );
    for (let i = 0; i < SHOW_DETAILLED_RESULTS_AT_END; i++) {
      nodelistVisibleResults[i]
        .querySelector("[id^='resultsShortPartyDescriptionButton']")
        .click();
    }
  }, 100);
}

// Start
window.addEventListener("load", mow_addon_show_first_results_MutationObserver);

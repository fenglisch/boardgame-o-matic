///////////////////////////////////////////////////////////////////////
// DEFINITIONEN *** DEFINITIONS
// http://www.mat-o-wahl.de

// FUNKTION / FUNCTION
// * Filtert Text in den Ergebnislisten anhand eines Zeichens / Zeichenkette.
// Nützlich für mehrere Wahlen, z.B. Bürgermeister + Stadtrat
// * Filters text in the results based on a character or string.
// Useful for multiple elections (Mayor + Council)

// 3.) Filter-Sonderzeichen in PARTEIEN-ANTWORTEN.CSV einfügen. Beispiel:
// Put the filter character(s) in PARTY-ANSWERS.CSV. Example:
// Partei_kurz:;"&#x1F464; APPD &#8203; &#8206;"
// Partei_kurz:;"Bananen &#8203; &#8205;"

// 4.) In der DEFINITION.JS in den Erweiterten Einstellungen das Add-On eintragen.
// Add the add-on to the advanced settings in DEFINITION.JS

// 5.) Fertig.
// That's it.

///////////////////////////////////////////////////////////////////////

// Hier kommt nur noch Quellcode. Bitte gehen Sie weiter. Hier gibt es nichts zu sehen.
// That's just source code. Please move on. Nothing to see here.

///////////////////////////////////////////////////////////////////////

// MutationObserver starten - prüft Änderungen im DOM
// https://medium.com/better-programming/js-mutationobserver-1d7aed479da2
// https://developer.mozilla.org/de/docs/Web/API/MutationObserver
function mow_addon_textfilter_MutationObserver() {
  // zu überwachende Zielnode (target) auswählen
  var target = document.querySelector("#resultsHeading");

  // eine Instanz des Observers erzeugen und Callback-Funktion aufrufen
  var observer = new MutationObserver(mow_addon_textfilter_create_buttons);

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

// Buttons in Addon-DIV in INDEX.HTML schreiben
function mow_addon_textfilter_create_buttons() {
  // alten Inhalt (jedes Mal) löschen
  $("#resultsAddonTop").empty();

  // id "#resultsHeading" wird in fnStart() am Anfang geleert (empty()).
  // -> mutationObserver erkennt Änderung und aktiviert diese Funktion :(
  // -> prüfen, ob Inhalt in DIV existiert
  resultsHeadingContent = $("#resultsHeading").text();

  if (resultsHeadingContent) {
    let filterContainer = document.createElement("span");
    filterContainer.setAttribute("id", "filter-container");
    let filterContainerHtml = `<label id="textfilter-label" for="textfilter-dropdown">${TEXTFILTER_LABEL}</label>`;
    filterContainerHtml +=
      '<select name="filter" id="textfilter-dropdown" onchange="mow_addon_textfilter_filter_tables()">';
    for (i = 0; i < TEXTFILTER_OPTIONS_TEXTS.length; i++) {
      filterContainerHtml += `<option value="${TEXTFILTER_KEYWORDS[i]}");">${TEXTFILTER_OPTIONS_TEXTS[i]}</option>`;
    }

    filterContainerHtml += "</select>";
    filterContainer.innerHTML = filterContainerHtml;

    document.querySelector("#resultsAddonTop").prepend(filterContainer);
  }
}

// Filter-Funktion
// "search_keyword" und "status" kommen vom Button
// Status = Suchbegriff anzeigen (1) oder ausblenden (0)
function mow_addon_textfilter_filter_tables() {
  var search_keyword = document
    .querySelector("#textfilter-dropdown")
    .value.toUpperCase();

  // obere Tabelle filtern - kurze Übersicht der Ergebnisse mit Prozentbalken
  mow_addon_textfilter_hide_show_row(search_keyword, "resultsShortTable");

  // untere Tabelle 1 filtern - Ergebnisse sortiert nach Antworten
  // Das Filter-Suchwort steht im TBODY mit der ID "resultsByThesisAnswersToQuestion"+j".
  // Die Frage steht in der Zeile darüber.
  for (j = 0; j <= intQuestions - 1; j++) {
    mow_addon_textfilter_hide_show_row(
      search_keyword,
      "resultsByThesisAnswersToQuestion" + j
    );
  }
}

// die eigentliche Filter-Funktion
// https://www.w3schools.com/howto/howto_js_filter_table.asp
function mow_addon_textfilter_hide_show_row(search_keyword, tableID) {
  table = document.getElementById(tableID);
  zeile = table.getElementsByClassName("row-with-one-result");

  // Durch alle Zeilen gehen und diejenigen verstecken, ohne Suchbegriff.
  for (i = 0; i < zeile.length; i++) {
    {
      txtValue = zeile[i].textContent || zeile[i].innerText;
      // wenn Suchbegriff gefunden, dann Klasse zum Verstecken der Zeile entfernen
      if (txtValue.toUpperCase().indexOf(search_keyword) > -1) {
        zeile[i].classList.remove("hidden-by-filter-addon");
      }
      // wenn Suchbegriff gefunden, dann Klasse zum Verstecken der Zeile hinzufügen
      else {
        zeile[i].classList.add("hidden-by-filter-addon");
      }
    }
  }
}

// Start
window.addEventListener("load", mow_addon_textfilter_MutationObserver);

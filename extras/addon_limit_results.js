///////////////////////////////////////////////////////////////////////
// DEFINITIONEN *** DEFINITIONS
// http://www.mat-o-wahl.de

/*  FUNKTION / FUNCTION
	In der Ergebnisübersicht werden X Parteien SOFORT angezeigt. Der Rest bei Klick auf [+]
	Show only X parties in the list of results RIGHT AWAY. The rest is visible on click.
*/

/*
	1.) Anzahl der Parteien (Ergebnisse) definieren
 		 Define number of parties (results) 

	Hinweis für Deutschland: Beim Einsatz als "Wahl-o-Mat" bitte
	"Beschluss vom 20.05.2019" (6 L 1056/19) des VG Köln beachten! 
	-> Chancengleichheit gewährleisten, indem alle Parteien angezeigt werden.
	Bei einem anderem Einsatzzweck ist das *vermutlich* irrelevant.
	
	********************************************************************
	
	Beispiele / Examples:
	var INT_RESULTS_SHOWN = 25; // 25 Ergebnisse anzeigen, bei Klick 25 weitere nachladen
	
*/

// 3.) In der DEFINITION.JS in den Erweiterten Einstellungen das Add-On eintragen.
// Add the add-on to the advanced settings in DEFINITION.JS

// 4.) Fertig.
// That's it.

///////////////////////////////////////////////////////////////////////

// Hier kommt nur noch Quellcode. Bitte gehen Sie weiter. Hier gibt es nichts zu sehen.
// That's just source code. Please move on. Nothing to see here.

///////////////////////////////////////////////////////////////////////

let intPartiesCurrentlyShowing = INT_RESULTS_SHOWN;

// MutationObserver starten - prüft Änderungen im DOM
// https://medium.com/better-programming/js-mutationobserver-1d7aed479da2
// https://developer.mozilla.org/de/docs/Web/API/MutationObserver
function mow_addon_limit_results__MutationObserver() {
  // zu überwachende Zielnode (target) auswählen
  var target = document.querySelector("#resultsHeading");

  // eine Instanz des Observers erzeugen und Callback-Funktion aufrufen
  var observer = new MutationObserver(mow_addon_limit_results_create_buttons);

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

// Buttons in INDEX.HTML schreiben (nur 1x am Anfang)
// Write buttons into INDEX.HTML (only once in the beginning)
function mow_addon_limit_results_create_buttons() {
  /* id "#resultsHeading" wird in fnStart() am Anfang geleert (empty()).
	   -> mutationObserver erkennt Änderung und aktiviert diese Funktion :(
	   -> prüfen, ob Inhalt in DIV existiert 
	   
	   id "#resultsHeading" is beeing emptied in fnStart() at the beginning
	   -> mutationObserver checks for changes and activates this function 
	   -> check if there's any content in the DIV 
	 */

  // resultsHeadingContent = $("#resultsHeading").text()
  resultsHeadingContent = document.getElementById("resultsHeading").innerText;

  if (resultsHeadingContent) {
    // Inhalt der Buttons
    // Content of buttons

    buttonContent_Minus =
      '<button type="button" class="Buttons_showPartiesAtEnd_minus btn btn-outline-dark btn-sm btn-block" onclick="fnCalculate_Minus(0,0)">' +
      TEXT_RESULTS_BUTTON_SHOW_LESS +
      "</button>";
    // intParties wird dynamisch berechnet, kann also erst jetzt hinzugefügt werden
    buttonContent_Plus = `<button type="button" class="Buttons_showPartiesAtEnd_plus  btn btn-outline-dark btn-sm btn-block"  onclick="fnCalculate_Plus(0,0)">${TEXT_RESULTS_BUTTON_SHOW_MORE} (${TEXT_RESULTS_BUTTON_SHOW_MORE_PREPOSITION} ${intParties})</button>`;

    // Erstelle eine neue Zeile mit Bootstrap-Klassen
    // -> 1. ROW -> 2a.) COL (links / left) + 2b.) COL (rechts / right)
    // Create a new line with Bootstrap-classes

    // A. obere Tabelle / upper list - resultsShortTable
    // 1. ROW
    var element_resultsShortTable_col = document
      .getElementById("resultsShortTable")
      .getElementsByClassName("col")[0];
    var div_element = document.createElement("div");
    resultsShortTable_col_row =
      element_resultsShortTable_col.appendChild(div_element);
    resultsShortTable_col_row.className = "row showAlwaysIsTrue"; // "showAlwaysIsTrue" ist eine Pseudo-CSS-Klasse. -> nur für andere Addons als Warnung, z.B. "addon_results_textfilter.js"

    // 2a COL left
    var div_element = document.createElement("div");
    resultsShortTable_col_row_col_left =
      resultsShortTable_col_row.appendChild(div_element);
    resultsShortTable_col_row_col_left.className = "col";
    resultsShortTable_col_row_col_left.innerHTML = buttonContent_Minus;

    // 2b COL right
    var div_element = document.createElement("div");
    resultsShortTable_col_row_col_right =
      resultsShortTable_col_row.appendChild(div_element);
    resultsShortTable_col_row_col_right.className = "col text-center";
    resultsShortTable_col_row_col_right.innerHTML = buttonContent_Plus;

    // B. Untere Tabelle - resultsByThesis
    // 1. ROW
    // ALT: bis August 2021: Buttons unter die Tabelle schreiben
    // var element_resultsByThesisTable_col = document.getElementById("resultsByThesisTable").getElementsByClassName("col")[0]
    // NEU: ab August 2021: Buttons unter jede Frage schreiben "resultsByThesisAnswersToQuestionX"
    for (i = 0; i <= intQuestions - 1; i++) {
      var element_resultsByThesisTable_col = document
        .getElementById("resultsByThesisAnswersToQuestion" + i)
        .getElementsByClassName("col")[0];
      var div_element = document.createElement("div");
      element_resultsByThesisTable_col_row =
        element_resultsByThesisTable_col.appendChild(div_element);
      element_resultsByThesisTable_col_row.className = "row showAlwaysIsTrue"; // "showAlwaysIsTrue" ist eine Pseudo-CSS-Klasse. -> nur für andere Addons als Warnung, z.B. "addon_results_textfilter.js"

      // 2a COL left
      var div_element = document.createElement("div");
      element_resultsByThesisTable_col_row_col_left =
        element_resultsByThesisTable_col_row.appendChild(div_element);
      element_resultsByThesisTable_col_row_col_left.className = "col";
      element_resultsByThesisTable_col_row_col_left.innerHTML =
        buttonContent_Minus;

      // 2b COL right
      var div_element = document.createElement("div");
      element_resultsByThesisTable_col_row_col_right =
        element_resultsByThesisTable_col_row.appendChild(div_element);
      element_resultsByThesisTable_col_row_col_right.className =
        "col text-center";
      element_resultsByThesisTable_col_row_col_right.innerHTML =
        buttonContent_Plus;
    }

    if (
      addons.some((item) => item.includes("extras/addon_results_textfilter.js"))
    ) {
      document
        .querySelector("#textfilter-dropdown")
        .addEventListener("change", () => {
          fnCalculate_Buttons(0, intPartiesCurrentlyShowing);
        });
    }

    // setze Werte auf Buttons / set values for buttons
    fnCalculate_Buttons(0, INT_RESULTS_SHOWN);
  } // end: else
}

/*
	Berechne die neuen Werte für die PLUS + MINUS-Buttons 
	Calculate new values for PLUS + MINUS-buttons 

	Das Skript berechnet die Werte anhand des vorherigen Wertes
	z.B. 12 Ergebnisse, Start: 5 + 5 = 10 + 5 = 12 (max.) 
	12 (max.) - 5 = 7 - 5 = 02 - 5 = 01 (min.) 
	01 (min.) + 5 = 6 + 5 = 11 + 5 = 12 (max.) 
*/
function fnCalculate_Buttons(rowStart, rowEnd) {
  //		rowStartMinus = 0
  //		rowStartPlus  = 0
  rowEndMinus = rowEnd - INT_RESULTS_SHOWN;
  rowEndPlus = rowEnd + INT_RESULTS_SHOWN;
  intPartiesCurrentlyShowing = rowEnd;
  // verhindere negative Werte
  // prevent negative values
  if (rowEndMinus <= 0) rowEndMinus = 1;

  const intMaxPartiesToShow = addons.some((item) =>
    item.includes("extras/addon_results_textfilter.js")
  )
    ? document.querySelectorAll(
        "#resultsShortTable .row-with-one-result:not(.hidden-by-filter-addon)"
      ).length
    : intParties;

  // Normalerweise würde man einfach nur Anfang und Ende an die Funktion "fnCalculate_Buttons(start,end)" übergeben.
  // Aber das Addon "addon_results_textfilter.js" setzt alle Filter zurück.
  // Deshalb übergebe ich stattdessen ein Array der zu filternden Zeilen. fnCalculate_Buttons("[0,1,2,3,4,5,6]")

  // finde alle (Pseudo)-Klassen für die Buttons um die Buttons später zu verändern
  // find all (pseudo)-classes for the buttons to change the buttons later
  var buttons_minus = document.getElementsByClassName(
    "Buttons_showPartiesAtEnd_minus"
  );
  var buttons_plus = document.getElementsByClassName(
    "Buttons_showPartiesAtEnd_plus"
  );

  // Klick-Funktionen mit neuen Werten auf die Buttons legen
  // change click-event with new values
  for (var i = 0; i < buttons_plus.length; i++) {
    buttons_plus[i].setAttribute(
      "onclick",
      "fnCalculate_Buttons(" + rowStart + "," + rowEndPlus + ")"
    );
    // console.log("BTN+ "+i+" Start: "+rowStart+" Ende: "+rowEndPlus)
    buttons_plus[
      i
    ].innerHTML = `${TEXT_RESULTS_BUTTON_SHOW_MORE} (${TEXT_RESULTS_BUTTON_SHOW_MORE_PREPOSITION} ${intMaxPartiesToShow})`;
  }
  for (var i = 0; i < buttons_minus.length; i++) {
    buttons_minus[i].setAttribute(
      "onclick",
      "fnCalculate_Buttons(" + rowStart + "," + rowEndMinus + ")"
    );
    // console.log("BTN- "+i+" Start: "+rowStart+" Ende: "+rowEndMinus)
  }

  // wenn WENIGER Parteien (Zeilen) angezeigt werden sollten, als eigentlich vorhanden sind ...
  // if the script wants to show FEWER parties (lines) than exists ...
  if (rowEnd <= 1) {
    // ... blende den Button aus / ... hide button
    for (var i = 0; i < buttons_minus.length; i++) {
      fnFadeOut(buttons_minus[i], 500, 1);
    }
  } else {
    // ... ansonsten zeige den Button / ... otherwise show the button
    for (var i = 0; i < buttons_minus.length; i++) {
      fnFadeIn(buttons_minus[i], 500, 1);
    }
  }

  // wenn MEHR Parteien (Zeilen) angezeigt werden sollten, als eigentlich vorhanden sind ...
  // if the script wants to show MORE parties (lines) than exists ...

  if (rowEnd >= intMaxPartiesToShow) {
    // ... blende den Button aus /  ... hide button
    for (var i = 0; i < buttons_plus.length; i++) {
      fnFadeOut(buttons_plus[i], 500, 1);
    }
  } else {
    // ... ansonsten zeige den Button / ... otherwise show the button
    for (var i = 0; i < buttons_plus.length; i++) {
      fnFadeIn(buttons_plus[i], 500, 1);
    }
  }

  // Zeige / verstecke die Zeilen
  // Show / hide lines
  fnShowOnlyIntPartiesAtEnd(rowStart, rowEnd);
}

// Zeige / verstecke die Zeilen
// Show / hide lines
function fnShowOnlyIntPartiesAtEnd(rowStart, rowEnd) {
  const resultsShortTable_rows = document.querySelectorAll(
    "#resultsShortTable .row-with-one-result:not(.hidden-by-filter-addon)"
  );

  const intTableLength = addons.some((item) =>
    item.includes("extras/addon_results_textfilter.js")
  )
    ? resultsShortTable_rows.length
    : intParties;
  // 1. obere (erste) Tabelle #resultsShort + 2. Tabelle sortiert nach Parteien (rechts) #resultsByParty
  // 1. upper (first) list #resultsShort + 2. list sorted by parties (right) #resultsByParty
  for (i = 0; i < intTableLength; i++) {
    if (i >= rowStart && i < rowEnd) {
      resultsShortTable_rows[i].classList.remove(
        "hidden-by-limit-results-addon"
      );
    }

    // Alle Zeilen, die außerhalb des Limits liegen -> ausblenden!
    else {
      resultsShortTable_rows[i].classList.add("hidden-by-limit-results-addon");
    }
  } // end: for-intParties

  // 3. Tabelle sortiert nach Fragen (links) / 3. list sorted by questions (left) #resultsByThesis
  for (i = 0; i < intQuestions; i++) {
    const resultsByThesisTableRows = document.querySelectorAll(
      `#resultsByThesisAnswersToQuestion${i} .row-with-one-result:not(.hidden-by-filter-addon)`
    );

    for (j = 0; j < intTableLength; j++) {
      if (j >= rowStart && j < rowEnd) {
        resultsByThesisTableRows[j].classList.remove(
          "hidden-by-limit-results-addon"
        );
      } else {
        resultsByThesisTableRows[j].classList.add(
          "hidden-by-limit-results-addon"
        );
      }
    } // // end: for-intParties
  } // end: for-intQuestions
}

// Start
window.addEventListener("load", mow_addon_limit_results__MutationObserver);

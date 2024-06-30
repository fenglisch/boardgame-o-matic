// OUTPUT.JS http://www.mat-o-wahl.de
// Output of information / Ausgabe der Informationen
// License: GPL 3
// Mathias Steudtner http://www.medienvilla.com
/* eslint-disable */

function fnStart() {
  // alte Inhalte loeschen bzw. ausblenden

  // 1. Bereich -  Überschriften, Erklärung zur Wahl
  // sectionDescription
  $("#descriptionHeading1").empty().append(`<h1>${descriptionHeading1}</h1>`);
  $("#descriptionHeading2").empty().append(`<h2>${descriptionHeading2}</h2>`);
  $("#descriptionExplanation").empty().append(descriptionExplanation);
  $("#descriptionButtonStart").html(TEXT_START);
  $("#descriptionAddonTop").empty();
  $("#descriptionAddonBottom").empty();

  // 2. Bereich - Anzeige der Fragen - am Anfang ausblenden
  $("#sectionShowQuestions").hide();
  $("#showQuestionsHeader").empty();
  $("#showQuestionsQuestion").empty();

  // 3. Voting Buttons
  $("#sectionVotingButtons").hide();
  $("#votingPro").html(TEXT_VOTING_PRO);
  $("#votingNeutral").html(TEXT_VOTING_NEUTRAL);
  $("#votingContra").html(TEXT_VOTING_CONTRA);
  $("#votingBack").html(TEXT_VOTING_BACK);
  $("#votingSkip").html(TEXT_VOTING_SKIP);
  $("#votingDouble").html(TEXT_VOTING_DOUBLE);

  // 4. Navigation
  $("#sectionNavigation").hide();

  // Bereich - Ergebnisse
  $("#sectionResults").hide();
  $("#resultsHeading").empty();
  $("#resultsShort").empty();
  $("#resultsByThesis").empty();
  $("#resultsByParty").empty();
  $("#resultsAddonTop").empty();
  $("#resultsAddonBottom").empty();

  // Bereich - Footer
  //	$("#keepStatsQuestion").empty();
  $("#statisticsModalLabel").html(TEXT_ALLOW_STATISTIC_TITLE);
  $("#statisticsModalBody").html(TEXT_ALLOW_STATISTIC_TEXT);
  $("#statisticsModalButtonNo").html(TEXT_ALLOW_STATISTIC_NO);
  $("#statisticsModalButtonYes").html(TEXT_ALLOW_STATISTIC_YES);

  // Nach jedem Klick auf einen Button den Fokus wieder entfernen, um bleibende Hervorhebungen (Unterstreichungen) zu vermeiden
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      document.activeElement.blur();
    });
  });

  //////////////////////////////////////////////////////////////////
  // FOOTER

  // Impressum auf Startseite ersetzen
  // Text aus i18n einfügen
  $("#privacy").html(TEXT_PRIVACY);
  // Link aus definition.js einfügen
  if (privacyExternalPageLink)
    $("#privacy")
      .attr("href", privacyExternalPageLink)
      .attr("target", "_blank");
  else $("#privacy").attr("onclick", "fnShowPrivacy()");

  // Impressum auf Startseite ersetzen
  // Text aus i18n einfügen
  $("#imprint").html(TEXT_IMPRINT);
  // Link aus definition.js einfügen
  $("#imprint").attr("href", imprintLink);

  // Neustart / Wiederholung
  var jetzt = new Date();
  var sekunden = jetzt.getTime();
  $("#restart").attr("href", `index.html?${sekunden}`);
  $("#restart").html(TEXT_RESTART);

  //////////////////////////////////////////////////////////////////
  // Anzahl der Parteien berechnen

  // FRAGEN UND ANTWORTEN in Arrays einlesen und Folgefunktionen aufrufen
  // (a) Fragen
  fnReadCsv(`data/${fileQuestions}`, fnShowQuestions);

  // (b) Antworten der Parteien und Partei-Informationen
  fnReadCsv(`data/${fileAnswers}`, fnReadPositions);

  // arVotingDouble initialisieren
  /* for (let i = 0; i < intQuestions; i++) {
    arVotingDouble[i] = false;
    arPersonalPositions[i] = 99;
  } */
  $("#votingDouble").attr("checked", false);

  // Wenn "descriptionShowOnStart = 0" in DEFINITION.JS, dann gleich die Fragen anzeigen
  if (!descriptionShowOnStart) {
    // Das System ist am Anfang noch nicht fertig geladen. Deshalb müssen wir einen Moment warten. :(
    $("#descriptionHeading1").empty().append("<h1>Loading / Lädt</h1>");
    $("#descriptionHeading2")
      .empty()
      .append("<h2>Please wait a moment / Bitte einen Moment warten</h2>");

    let descriptionExplanationContent = `
      <div class="progress">
         <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      This message disappears in less than 5 seconds. If not, something went wrong. / <br>
      Diese Nachricht verschwindet in weniger als 5 Sekunden. Andernfalls ist etwas schief gelaufen.
     `;

    $("#descriptionExplanation").empty().append(descriptionExplanationContent);

    window.setTimeout(fnHideWelcomeMessage, 2500);
  }
}

// Ausblenden der Willkommensmeldung (#sectionDescription)
// und direkt in die Fragen gehen
// neu ab v.0.6
// Aufruf aus fnStart() wenn "descriptionShowOnStart = 0" ODER beim Klick auf Start-Button
function fnHideWelcomeMessage() {
  document.querySelector("#restart").classList.remove("d-none");
  fnShowQuestionNumber(-1);
}

// (a) Anzeige von Frage Nummer XY
// (b) Weiterleitung zur Auswertung
// Aufruf aus fnStart() -> fnShowQuestions(csvData)
function fnShowQuestionNumber(questionNumber) {
  // Nummer der Frage im Array um eins erhöhen
  questionNumber++;

  $("#votingPro").unbind("click");
  $("#votingNeutral").unbind("click");
  $("#votingContra").unbind("click");
  $("#votingBack").unbind("click");
  $("#votingSkip").unbind("click");

  $("#sectionNavigation").show();

  // solange Fragen gestellt werden -> Anzeigen (sonst Auswertung)
  if (questionNumber < arQuestionsLong.length) {
    function appendQuestion(questionNumber) {
      let questionTitle = "<h2>";
      questionTitle += showQuestionNumberOnCard
        ? `${questionNumber + 1}/${intQuestions}: `
        : "";
      questionTitle += arQuestionsShort[questionNumber];
      questionTitle += "</h2>";
      $("#showQuestionsHeader").empty().append(questionTitle);
      $("#showQuestionsQuestion")
        .empty()
        .append(arQuestionsLong[questionNumber]);
    }

    if (animateQuestionsCard) {
      function fnAnimateSectionShowQuestions(movementDirection) {
        document
          .querySelector("#sectionShowQuestions")
          .classList.add(movementDirection);
        setTimeout(() => {
          appendQuestion(questionNumber);
        }, 400);
        setTimeout(() => {
          document
            .querySelector("#sectionShowQuestions")
            .classList.remove(movementDirection);
        }, 800);
      }
      if (
        document.querySelector("#sectionDescription").style.display !== "none"
      ) {
        document
          .querySelector("#sectionDescription")
          .classList.add("flyOutLeft");
        setTimeout(() => {
          document.querySelector("#sectionDescription").style.display = "none";
          document.querySelector("#sectionShowQuestions").style.display = "";
          document.querySelector("#sectionVotingButtons").style.display = "";
          appendQuestion(questionNumber);
          document
            .querySelector("#sectionShowQuestions")
            .classList.add("flyInRight");
        }, 400);
        setTimeout(() => {
          document
            .querySelector("#sectionShowQuestions")
            .classList.remove("flyInRight");
        }, 800);
      } else if (questionNumber > activeQuestion)
        fnAnimateSectionShowQuestions("flyOutLeftFlyInRight");
      else if (questionNumber < activeQuestion)
        fnAnimateSectionShowQuestions("flyOutRightFlyInLeft");
    } else {
      if (
        document.querySelector("#sectionDescription").style.display !== "none"
      ) {
        $("#sectionDescription").hide().empty();
        $("#sectionShowQuestions").show();
        $("#sectionVotingButtons").show();
      }
      appendQuestion(questionNumber);
    }

    activeQuestion = questionNumber; // globale Variable

    if (activeQuestion > 0) $("#votingBack").show();
    else $("#votingBack").hide();

    // Aufbau der Liste zum Vor/Zurückgehen bei den Fragen
    fnJumpToQuestionNumber(questionNumber);

    // Klick-Funktion auf Bilder/Buttons legen.
    $("#votingPro").click(function () {
      arPersonalPositions[questionNumber] = 1;
      fnShowQuestionNumber(questionNumber);
    });

    $("#votingNeutral").click(function () {
      arPersonalPositions[questionNumber] = 0;
      fnShowQuestionNumber(questionNumber);
    });

    $("#votingContra").click(function () {
      arPersonalPositions[questionNumber] = -1;
      fnShowQuestionNumber(questionNumber);
    });

    $("#votingBack").click(function () {
      if (activeQuestion > 0) fnShowQuestionNumber(activeQuestion - 2);
    });

    $("#votingSkip").click(function () {
      arPersonalPositions[questionNumber] = 99;
      fnShowQuestionNumber(questionNumber);
    });

    // Checkbox für doppelte Bewertung
    $("#votingDouble").attr("checked", arVotingDouble[questionNumber]);
    // Button nur zuruecksetzen, wenn Frage nicht doppelt gewertet (relevant fürs Zurückspringen)
    if (!arVotingDouble[questionNumber])
      $("#votingDouble").removeClass("btn-dark").addClass("btn-outline-dark");
    else
      $("#votingDouble").addClass("btn-dark").removeClass("btn-outline-dark");
  }

  // Alle Fragen durchgelaufen -> Auswertung
  else {
    // SPEZIAL
    if (arPersonalPositions[2] === -1) {
      arPersonalPositions[2] = 99;
    }
    // END SPEZIAL

    // Show loading icon
    const loadingAnimation = document.createElement("div");
    loadingAnimation.classList.add("lds-default");
    loadingAnimation.innerHTML =
      "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
    document.body.appendChild(loadingAnimation);

    setTimeout(() => {
      arResults = fnEvaluation();

      //Parteien sortieren
      arSortParties = new Array();
      //		for (i = 0; i < arPartyFiles.length; i++)
      for (i = 0; i < intParties; i++) {
        arSortParties[i] = i;
      }
      // Sortieren der Parteien nach Uebereinstimmung
      arSortParties.sort(function (a, b) {
        return arResults[b] - arResults[a];
      });

      // Übergabe an Tabellen zur Darstellung/Ausgabe
      fnEvaluationShort(arResults); // Kurzüberblick mit Progress-bar
      fnEvaluationByThesis(arResults); // Thesen + Partei-Antworten

      // Buttons einblenden für detaillierte Ergebnisse
      $("#resultsButtons").fadeIn(0);

      // Hide loading icon
      document.querySelector(".lds-default").classList.add("d-none");

      // Abfrage zur Statistik einblenden (v.0.6.)
      if (statsRecord) {
        $("#statisticsModal").modal("show");
        // Klick-Funktion mit den Ergebnissen zum Senden auf "Ja" legen
        document
          .getElementById("statisticsModalButtonYes")
          .addEventListener("click", function () {
            fnSendResults(arResults, arPersonalPositions);
            $("#statisticsModal").modal("toggle");
          });
      }
    }, 0);
  }
}

// 02/2015 BenKob
function fnChangeVotingDouble() {
  arVotingDouble[activeQuestion] = !arVotingDouble[activeQuestion];
  strBtnSrc = $("#votingDouble").hasClass("btn-outline-dark");

  if (strBtnSrc) {
    // wenn vorher unwichtig -> jetzt doppelt werten
    $("#votingDouble").removeClass("btn-outline-dark").addClass("btn-dark");
    $(`#jumpToQuestionNr${activeQuestion + 1}`).css("font-weight", "bold");
  }
  // wenn vorher wichtig -> jetzt wieder auf normal setzen
  else {
    $("#votingDouble").removeClass("btn-dark").addClass("btn-outline-dark");
    $(`#jumpToQuestionNr${activeQuestion + 1}`).css("font-weight", "normal");
  }
}

// Springe zu Frage Nummer XY (wird in fnShowQuestionNumber() aufgerufen)
function fnJumpToQuestionNumber(questionNumber) {
  // alten Inhalt ausblenden und loeschen
  $("#navigationJumpToQuestion").fadeOut(0).empty().hide();

  // Durchlauf des Arrays bis zur ausgewählten Frage und Setzen der 99, falls NaN
  for (i = 0; i < questionNumber; i++) {
    if (isNaN(arPersonalPositions[i])) {
      arPersonalPositions[i] = 99;
    }
  }

  var maxQuestionsPerLine = 12; // z.B. 16

  // Wenn mehr als XY Fragen vorhanden, dann erstelle eine zweite/dritte/... Zeile
  if (intQuestions >= maxQuestionsPerLine) {
    var tableRows =
      arQuestionsLong.length /
      maxQuestionsPerLine; /* z.B. nicht mehr als 16 Fragen pro Zeile */
    tableRows =
      Math.ceil(
        tableRows
      ); /* 17 Fragen / 16 = 1,06 ### 31 Fragen / 16 = 1,9 -> 2 Zeilen */
    var questionsPerLine =
      arQuestionsLong.length /
      tableRows; /* 23 Fragen / 2 Zeilen = 12 & 11 Fragen/Zeile */
    questionsPerLine = Math.ceil(questionsPerLine);
  } else {
    questionsPerLine = maxQuestionsPerLine;
  }

  // Tabelle aufbauen
  let tableContentJumpToQuestion =
    "<table width='100%' class='table table-bordered table-striped table-hover' aria-role='presentation'>";
  for (i = 1; i <= arQuestionsLong.length; i++) {
    const modulo = i % questionsPerLine;
    // neue Zeile
    if (modulo == 1) tableContentJumpToQuestion += "<tr>";
    tableContentJumpToQuestion += `
    <td align='center' id='jumpToQuestionNr${i}' title='${
      arQuestionsShort[i - 1]
    } - ${arQuestionsLong[i - 1]}'>
      <a href='javascript:fnShowQuestionNumber(${
        i - 2
      })' style='display:block;'>${i} </a>
    </td>`;
    if (modulo == 0) tableContentJumpToQuestion += "</tr>";
  }
  tableContentJumpToQuestion += "</table>";
  $("#navigationJumpToQuestion").append(tableContentJumpToQuestion).fadeIn(0);

  // alte Meinungen farblich hervorheben und aktuelle Frage markieren
  for (i = 1; i <= arQuestionsLong.length; i++) {
    // beantwortete Fragen farblich markieren
    let positionColor = fnTransformPositionToColor(arPersonalPositions[i - 1]);

    if (
      isActivated("addon_custom_voting_buttons.js") &&
      (correspondingCustomQuestion = CUSTOM_POSITION_BUTTONS.find(
        (obj) => obj.questionNr === i
      ))
    ) {
      const index = correspondingCustomQuestion.arPositionValues.indexOf(
        arPersonalPositions[i - 1]
      );
      if (index === -1) positionColor = "transparent";
      else {
        positionColor =
          correspondingCustomQuestion.arBackgroundColor?.[index] ||
          CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.backgroundColor;
        const textColor =
          correspondingCustomQuestion.arTextColor?.[index] ||
          CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.textColor;
        document.querySelector(`#jumpToQuestionNr${i} a`).style.color =
          textColor;
      }
    }
    $(`#jumpToQuestionNr${i}`).css("background", positionColor);

    // aktuelle Frage markieren
    if (i - 1 === questionNumber)
      document
        .querySelector(`#jumpToQuestionNr${i}`)
        .classList.add("currentQuestion");
    else
      document
        .querySelector(`#jumpToQuestionNr${i}`)
        .classList.remove("currentQuestion");

    if (arVotingDouble[i - 1]) {
      $(`#jumpToQuestionNr${i}`).css("font-weight", "bold");
    }
  }
}

// Anzeige der Ergebnisse - zusammengefasst (Prozentwerte) - nur Parteien
// Array arResults kommt von fnEvaluation
function fnEvaluationShort(arResults) {
  // Alten Inhalt des DIVs loeschen

  $("#sectionShowQuestions").empty().hide();

  // Anzeige der Ergebnisse
  $("#resultsHeading").append(
    `<h1>${TEXT_RESULTS_HEADING}</h1><h2>${TEXT_RESULTS_SUBHEADING}</h2>`
  );

  if (showInfoBoxAboveResultsShortTable) {
    $("#resultsHeading").append(
      `<div id='resultsIntro'><div id='infoIcon'>&#9432;</div><div>${textInfoBox}`
    );
  }

  var numberOfQuestions = arQuestionsShort.length;
  //Anzahl der Maximalpunkte ermitteln
  const maxPoints = calculateMaxPoints();

  let tableContentResultsShort = `<div class='row' id='resultsShortTable' role='table'>
        <div class='col'>`;

  for (i = 0; i <= intParties - 1; i++) {
    let partyNum = arSortParties[i];
    let percent = fnPercentage(arResults[partyNum], maxPoints);

    // "Klammer" um den Inhalt.
    // Wenn ein Addon (z.B. addon_contacts_in_results.js) eine neue Zeile unter die Zeile #resultsShortParty einfügt,
    // bleiben die Zebrastreifen aus der Klasse ".mow-row-striped" in der richtigen Reihenfolge.
    tableContentResultsShort += `<div class='border rounded mow-row-striped row-with-one-result' id='resultsShortPartyClamp${partyNum}' role='row'>
     <div class='row' id='resultsShortParty${partyNum}' role='row'>
        <div class='col col-2 col-md-1' role='cell'>
          <img src='${
            arPartyLogosImg[partyNum]
          }' class='rounded img-fluid' alt='Logo ${
      arPartyNamesLong[partyNum]
    }' />
        </div>
        <div class='col col-10 col-md-7' role='cell'>
            <strong>${arPartyNamesLong[partyNum]}</strong>
            <br />
            <span class="tagline">${arPartyInternet[partyNum]}</span>
            <br /> 
            <button type="button" class="btn btn-sm btn-outline-secondary" 
              id="resultsShortPartyDescriptionButton${partyNum}">
              ${TEXT_SHOW_PARTY_DESCRIPTION}</button>
        </div> 
        <div class='col col-12 col-md-4' role='cell'>
            <div class='progress'>
                <div class='progress-bar' role='progressbar' id='partyBar${partyNum}' style='width:${percent}%;'
                      aria-valuenow='${percent}' aria-valuemin='0' aria-valuemax='100'>JUST_A_PLACEHOLDER_TEXT - SEE FUNCTION fnReEvaluate()
                </div>
            </div>
        </div>
      </div>
      <div id="resultsShortPartyDetails${partyNum}">
        <div id='resultsShortPartyDescription${partyNum}'>
        <br /> 
        <span id="internet-above-description"><a href='https://boardgamegeek.com/boardgame/${
          arPartyNamesShort[partyNum]
        }' target='_blank' alt='Link: ${arPartyNamesLong[partyNum]}'
                  title='Link: ${arPartyNamesLong[partyNum]}'>
                  ${TEXT_LINK_TO_EXTERNAL_PAGE}</a>
        <br / ></span>
            ${
              arPartyDescription[partyNum] ? arPartyDescription[partyNum] : null
            }
        <br /> 
        <span id="internet-below-description"><a href='https://boardgamegeek.com/boardgame/${
          arPartyNamesShort[partyNum]
        }' target='_blank' alt='Link: ${arPartyNamesLong[partyNum]}'
                  title='Link: ${arPartyNamesLong[partyNum]}'>
                  ${TEXT_LINK_TO_EXTERNAL_PAGE}</a>
        <br / ></span>
        </div>
        <div id="containerForAddonGeneratedElements"></div>
        <div style='text-align: center; width: 100%;'>
        <button id='resultsByPartyAnswers${partyNum}collapse' class='nonexpanded btn btn-sm btn-outline-secondary' type='button'>
            ${TEXT_SHOW_PARTY_ANSWERS}
        </button>
        <span id='resultsByPartyAnswersToQuestion${partyNum}'> <!-- Hilfs-SPAN für Textfilter -->
            <div class='row border rounded'>
              <div class='col'>`;

    // $(`#resultsByPartyAnswersToQuestion${  i  }`).css("display", "none");

    jStart = partyNum * intQuestions; // z.B. Citronen Partei = 3. Partei im Array[2] = 2 * 5 Fragen = 10
    jEnd = jStart + intQuestions - 1; // 10 + 5 Fragen -1 = 14

    // Anzeige der Partei-Antworten
    for (j = jStart; j <= jEnd; j++) {
      // 1./4 Zellen - Frage
      modulo = j % intQuestions; // z.B. arPartyPositions[11] % 5 Fragen = 1 -> arQuestionsShort[1] = 2. Frage

      tableContentResultsShort += `
                    <div class='row mow-row-striped' role='row'>
                        <div class='col col-10 col-md-5' role='cell'>
                            ${modulo + 1}. <strong>${
        arQuestionsShort[modulo]
      }</strong> - ${arQuestionsLong[modulo]}
                        </div>`;
      // 2./4 Zellen - Icon für eigene Meinung [+] [0] [-]
      var positionButton = fnTransformPositionToButton(
        arPersonalPositions[modulo]
      );
      var positionIcon = fnTransformPositionToIcon(arPersonalPositions[modulo]);
      var positionText = fnTransformPositionToText(arPersonalPositions[modulo]);

      tableContentResultsShort += `<div class='col col-4 col-md-2' id='selfPositionContainer${modulo}' role='cell'>
                          <button type='button' id='' class='btn ${positionButton} btn-sm selfPosition${modulo}' 
                                  onclick='fnToggleSelfPosition(${modulo})' alt='${TEXT_ANSWER_USER} : ${positionText}'
                                  title='${TEXT_ANSWER_USER} : ${positionText}' data-value='${arPersonalPositions[modulo]}'>
                              ${positionIcon}
                          </button>
                      </div>`;

      // 3./4 Zellen - Icons für Postion der Parteien [+] [0] [-]
      var positionIcon = fnTransformPositionToIcon(arPartyPositions[j]);
      var positionButton = fnTransformPositionToButton(arPartyPositions[j]);
      var positionText = fnTransformPositionToText(arPartyPositions[j]);

      tableContentResultsShort += `<div class='col col-4 col-md-2' id='partyPositionContainer${modulo}' role='cell'>
                          <button type='button' class='btn ${positionButton} partyPositionToQuestion${modulo} btn-sm' disabled data-value="${arPartyPositions[j]}"
                                  alt='${TEXT_ANSWER_PARTY} : ${positionText}' title='${TEXT_ANSWER_PARTY} : ${positionText}'>
                              ${positionIcon}
                          </button>
                      </div>
                      <div class='col col-6 col-md-3' role='cell' headers='resultsByPartyHeading${i}'>
                          ${arPartyOpinions[j]}
                          <!-- die Beschreibung der Partei in einem VERSTECKTEN DIV -> ein Workaround für das Addon "Textfilter" (siehe /EXTRAS) :( -->
                      </div>
                  </div> <!-- end: row Anzeige der Partei-Antworten -->`;
    } // end: for-j
    tableContentResultsShort += `</div> <!-- end col -->
                </div> <!-- end row resultsByPartyAnswersToQuestion -->
              </span> <!-- end span resultsByPartyAnswersToQuestion -->
              </div> <!-- end span resultsShortPartyDetails -->
            </div> <!-- end: row .mow-row-striped + #resultsShortPartyClampX -->
        </div> <!-- row #resultsShortPartyX -->`;
  } // end for
  tableContentResultsShort += `</div>
      </div> <!-- end: col (resultsShortTable) -->
    </div> <!-- end: row (resultsShortTable) -->`;

  // Daten in Browser schreiben
  $("#resultsShort").append(tableContentResultsShort).fadeIn(0);

  for (let i = 0; i <= intParties - 1; i++) {
    $(`#resultsShortPartyClamp${i} .nonexpanded`).click(function () {
      var $this = $(this);
      $(`#resultsByPartyAnswersToQuestion${i}`).toggle(500);
      $this.toggleClass("expanded");
      $this.toggleClass("nonexpanded");

      if ($this.hasClass("expanded")) {
        $this.html(TEXT_HIDE_PARTY_ANSWERS);
      } else {
        $this.html(TEXT_SHOW_PARTY_ANSWERS);
      }
    });
    $(`#resultsByPartyAnswersToQuestion${i}`).css("display", "none");
  }

  for (let i = 0; i <= intParties - 1; i++) {
    // Klickfunktion - bei Überschrift
    $(`#resultsShortPartyDescriptionButton${i}`).click(() => {
      $(`#resultsByPartyAnswers${i}collapse`).toggle(500);
      const btnCollapse = document.querySelector(
        `#resultsByPartyAnswers${i}collapse`
      );
      if (btnCollapse.classList.contains("expanded")) {
        btnCollapse.textContent = TEXT_SHOW_PARTY_ANSWERS;
        btnCollapse.classList.remove("expanded");
        btnCollapse.classList.add("nonexpanded");
      }
      $(`#resultsByPartyAnswersToQuestion${i}`).hide(500);
    });

    // am Anfang ausblenden
    $(`#resultsByPartyAnswers${i}collapse`).hide(500);
  }

  // Funktion zur Berechnung der "Doppelten Wertung" aufrufen
  // -> enthält Aufruf für farbliche Progressbar (muss hier ja nicht extra wiederholt werden)
  fnReEvaluate();

  for (let i = 0; i <= intParties - 1; i++) {
    $(`#resultsShortPartyDescriptionButton${i}`).click(function () {
      var $this = $(this);
      $(`#resultsShortPartyDetails${i}`).toggle(500);

      $this.toggleClass("expanded");

      if ($this.hasClass("expanded")) {
        $this.html(TEXT_HIDE_PARTY_DESCRIPTION); // MINUS
      } else {
        $this.html(TEXT_SHOW_PARTY_DESCRIPTION); // PLUS
      }
    });

    // am Anfang die Antworten ausblenden
    $(`#resultsShortPartyDetails${i}`).fadeOut(0);
  }

  // $("#results").fadeIn(500);
  $("#sectionResults").fadeIn(0);
}

// Anzeige der Ergebnisse - detailliert, Fragen und Antworten der Parteien
// Array arResults kommt von fnEvaluation
function fnEvaluationByThesis(arResults) {
  var tableContentResultsByThesis = `${TEXT_RESULTS_INFO_THESES}
    <div class='row' id='resultsByThesisTable' role='table'>
      <div class='col'>`;
  for (i = 0; i <= intQuestions - 1; i++) {
    var positionButton = fnTransformPositionToButton(arPersonalPositions[i]);
    var positionIcon = fnTransformPositionToIcon(arPersonalPositions[i]);
    var positionText = fnTransformPositionToText(arPersonalPositions[i]);

    tableContentResultsByThesis += `<div class='row border' role='row'>
              <div class='col col-2' role='cell'>
                  <button type='button' id='' class='btn ${positionButton} btn-sm selfPosition${i}' onclick='fnToggleSelfPosition(${i})' 
                          alt='${TEXT_ANSWER_USER} : ${positionText}' title='${TEXT_ANSWER_USER} : ${positionText}' data-value="${
      arPersonalPositions[i]
    }">
                      ${positionIcon}
                  </button>
                  <button type='button' class='btn btn-sm ${
                    arVotingDouble[i] ? "btn-dark" : "btn-outline-dark"
                  }' id='doubleIcon${i}'
                        onclick='fnToggleDouble(${i})' title='${
      arVotingDouble[i] ? TEXT_ANSWER_DOUBLE : TEXT_ANSWER_NORMAL
    }'>
                      x2
                  </button>
              </div>
              <div class='col col-10' id='resultsByThesisQuestion${i}' role='cell'>
                  <div>
                      <strong>${i + 1}. ${arQuestionsShort[i]}</strong>: ${
      arQuestionsLong[i]
    }
                  </div>
                  <button id='resultsByThesisQuestion${i}collapse' class='nonexpanded btn btn-sm btn-outline-secondary' type='button'>
                      ${TEXT_SHOW_THESIS_ANSWERS}
                  </button>
              </div>
          </div> <!-- row Fragen -->
          <!-- darunterliegende Zeile - Parteipositionen anzeigen -->
          <div class='row border rounded' id='resultsByThesisAnswersToQuestion${i}'>
              <div class='col'>`;

    // darunterliegende Zeile - Parteipositionen anzeigen
    for (j = 0; j <= intParties - 1; j++) {
      var partyNum = arSortParties[j];
      var partyPositionsRow = partyNum * intQuestions + i;
      var positionButton = fnTransformPositionToButton(
        arPartyPositions[partyPositionsRow]
      );
      var positionIcon = fnTransformPositionToIcon(
        arPartyPositions[partyPositionsRow]
      );
      var positionText = fnTransformPositionToText(
        arPartyPositions[partyPositionsRow]
      );

      // Inhalt der Zelle
      tableContentResultsByThesis += `<div class='row mow-row-striped row-with-one-result' role='row'>
                      <div class='col col-2' role='cell'>
                          <button type='button' class='btn ${positionButton} partyPositionToQuestion${i} btn-sm' disabled data-value="${
        arPartyPositions[partyPositionsRow]
      }"
                                  alt='${TEXT_ANSWER_PARTY} : ${positionText}' title='${TEXT_ANSWER_PARTY} : ${positionText}'>
                              ${positionIcon}
                          </button>
                      </div>
                      <div class='col col-10' role='cell'>
                          <strong>${arPartyNamesLong[partyNum]}</strong>${
        arPartyOpinions[partyPositionsRow] ? ":" : ""
      } ${arPartyOpinions[partyPositionsRow]}
                      <!-- die Beschreibung der Partei in einem VERSTECKTEN DIV -> ein Workaround für das Addon "Textfilter" (siehe /EXTRAS) :( -->
                          <span style='visibility:hidden; display:none;' aria-hidden='true'>${
                            arPartyDescription[partyNum]
                          }</span>
                      </div>
                  </div>`;
    }
    tableContentResultsByThesis += `</div> <!-- col (Partei-Antworten) -->
          </div> <!-- row (Partei-Antworten) -->`;
  } // end if

  tableContentResultsByThesis += `</div> <!-- col -->
  </div> <!-- row -->`;

  // Daten in Browser schreiben
  $("#resultsByThesis").append(tableContentResultsByThesis);

  // Click-Funktion auf FRAGE-(und ANTWORT)-Zeile legen zum Anzeigen der ANTWORT-Zeile (direkt darunter)
  // "[In a FOR-loop] you can use the let keyword, which makes the i variable local to the loop instead of global"
  // 	https://stackoverflow.com/questions/4091765/assign-click-handlers-in-for-loop
  for (let i = 0; i <= intQuestions - 1; i++) {
    /*		
		// Klickfunktion - bei Überschriftenzeile
		$("#resultsByThesisQuestion"+i).click(function () {
				$("#resultsByThesisAnswersToQuestion"+i+"").toggle(500);

				// Wechsel des PLUS und MINUS-Symbols beim Klick (siehe auch DEFAULT.CSS)
				// *** ToDo: Button mit Inhalt füllen für ARIA, kein CSS ***
				// $("#resultsByThesisQuestion"+i+" .resultsByThesisQuestionCollapsePlus").toggleClass("resultsByThesisQuestionCollapseMinus")				
				
			});
		*/

    $("#resultsByThesisQuestion" + i + " .nonexpanded").click(function () {
      var $this = $(this);
      $("#resultsByThesisAnswersToQuestion" + i + "").toggle(500);

      $this.toggleClass("expanded");

      if ($this.hasClass("expanded")) {
        $this.html(TEXT_HIDE_THESIS_ANSWERS); // MINUS
      } else {
        $this.html(TEXT_SHOW_THESIS_ANSWERS); // PLUS
      }
    });

    // am Anfang die Antworten ausblenden
    //		$("#resultsByThesisAnswersToQuestion"+i).fadeOut(500);	// irgendwie verrutschen die Zeilen bei fadeOut() -> deshalb die css()-Lösung
    $(`#resultsByThesisAnswersToQuestion${i}`).css("display", "none");
  }

  // Nach jedem Klick auf einen Button den Fokus wieder entfernen, um bleibende Hervorhebungen (Unterstreichungen) zu vermeiden
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      document.activeElement.blur();
    });
  });
} // end function

// 02/2015 BenKob
// Aktualisierung der Ergebnisse in der oberen Ergebnistabelle (short)
// Aufruf heraus in:
// (a) fnEvaluationShort() nach dem Aufbau der oberen Tabelle
// (b) in den Buttons in der detaillierten Auswertung (fnToggleSelfPosition() und fnToggleDouble())
function fnReEvaluate() {
  //Ergebniss neu auswerten und Anzeige aktualisieren
  arResults = fnEvaluation();

  //Anzahl der Maximalpunkte ermitteln
  const maxPoints = calculateMaxPoints();

  //	for (i = 0; i <= (arPartyFiles.length-1); i++)
  for (i = 0; i <= intParties - 1; i++) {
    var percent = fnPercentage(arResults[i], maxPoints);

    // bis v.0.3 mit PNG-Bildern, danach mit farblicher Bootstrap-Progressbar
    var barImage = fnBarImage(percent);

    // neu ab v.0.3 - Bootstrap-Progressbar
    $(`#partyBar${i}`).width(`${percent}%`);
    $(`#partyBar${i}`).text(`${percent}% (${arResults[i]} / ${maxPoints})`);
    $(`#partyBar${i}`)
      .removeClass("bg-success bg-warning bg-danger")
      .addClass(barImage);

    $(`#partyPoints${i}`).html(`${arResults[i]}/${maxPoints}`);
  }
}

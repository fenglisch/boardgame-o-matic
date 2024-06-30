// DEUTSCHE TEXTE http://www.mat-o-wahl.de

const DESCRIPTION_HEADING1 = "Demo Brettspiel-O-Mat";
const DESCRIPTION_HEADING2 = "Spielerisch das passende Brettspiel finden";
const DESCRIPTION_EXPLANATION =
  "Beantwortet die kurzen Fragen und findet heraus, welche Spiele aus unserer Sammlung am besten zu euren Interessen passen.</p><p><em>Dieses Beispiel-Tool demonstriert, wie der Brettspiel-O-Mat funktioniert. Du kannst deine eigene Version kostenlos aufsetzen, s. <a href='https://github.com/fenglisch/boardgame-o-matic' target='_blank'>https://github.com/fenglisch/boardgame-o-matic</a></em>";

// Buttons
const TEXT_START = "Los geht's!";
const TEXT_VOTING_PRO = "Gefällt mir";
const TEXT_VOTING_NEUTRAL = "Teils teils";
const TEXT_VOTING_CONTRA = "Gefällt mir nicht";
const TEXT_VOTING_BACK = "&larr;&nbsp;Zurück";
const TEXT_VOTING_SKIP = "Egal&nbsp;/ Überspringen &rarr;";
const TEXT_VOTING_DOUBLE = "Doppelt gewichten";

// Privacy modal (only shown if privacyExternalPageLink is FALSE in definition.js)
const PRIVACY_MODAL_TITLE = `Datenschutzerklärung für den Demo Brettspiel-O-Mat`;
const PRIVACY_MODAL_BODY = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

// Statistic
const TEXT_ALLOW_STATISTIC_TITLE = "Bevor dein Ergebnis erscheint ...";
const TEXT_ALLOW_STATISTIC_TEXT = `Genehmigst Du uns die Übertragung deiner <strong>anonymisierten</strong> Antworten für statistische Zwecke gemäß unserer <a ${
  privacyExternalPageLink
    ? `href="${privacyExternalPageLink}" target="_blank"`
    : `href="#" onclick="fnShowPrivacy()"`
}>Datenschutzerklärung</a>? Damit hilfst du uns, den Digitalen Guru in Zukunft zu verbessern.`;
const TEXT_ALLOW_STATISTIC_YES = "Ja klar!";
const TEXT_ALLOW_STATISTIC_NO = "Nein, danke.";

// Footer
const TEXT_IMPRINT = "Impressum";
const TEXT_PRIVACY = "Datenschutzerklärung";
const TEXT_RESTART = "Neu starten";

const TITLE_MATOMO_MODAL = "";
const TEXT_MATOMO_MODAL = `Erlaubst Du uns, für statistische Zwecke Daten über Deinen Besuch zu erfassen, um anhand der Besucherzahlen und Nutzung den Digitalen Guru weiterzuentwickeln? Näheres, wie die Möglichkeit zum jederzeitigen Widerruf Deiner Einwilligung, findest Du in der <a ${
  privacyExternalPageLink
    ? `href="${privacyExternalPageLink}" target="_blank"`
    : `href="#" onclick="fnShowPrivacy()"`
}>Datenschutzerklärung</a>.`;

// Results
const TEXT_RESULTS_HEADING = "Deine Top-Matches";
const TEXT_RESULTS_SUBHEADING =
  "Mit diesen Spielen hast Du die höchste Übereinstimmung";

// Info box is only shown if showInfoBoxAboveResultsShortTable is set to true in definition.js
const TEXT_INFO_BOX =
  "Dieses Demo-Tool basiert nicht auf einer echten Spiele-Sammlung. Stattdessen wird das Matching mit den Spielen aus der BoardGameGeek Top 200 durchgeführt (Stand März 2024).";

const TEXT_LINK_TO_EXTERNAL_PAGE =
  "<i class='fa-solid fa-link'></i> Auf BoardGameGeek anschauen";

const TEXT_RESULTS_INFO_THESES =
  "<h2>Die Antworten aller Spiele zu den Fragen</h2>";
const TEXT_SHOW_PARTY_DESCRIPTION = `<i class="fa-solid fa-chevron-down"></i> Weitere Infos anzeigen`;
const TEXT_HIDE_PARTY_DESCRIPTION = `<i class="fa-solid fa-chevron-up"></i> Weitere Infos verbergen`;
const TEXT_SHOW_PARTY_ANSWERS = `<i class="fa-solid fa-chevron-down"></i> Antworten vergleichen`;
const TEXT_HIDE_PARTY_ANSWERS = `<i class="fa-solid fa-chevron-up"></i> Antworten verstecken`;
const TEXT_SHOW_THESIS_ANSWERS = TEXT_SHOW_PARTY_ANSWERS;
const TEXT_HIDE_THESIS_ANSWERS = TEXT_HIDE_PARTY_ANSWERS;

// The following words may be used as ALT-Text or headers on the results-page
const TEXT_QUESTION = "Frage";
const TEXT_POSITION_PARTY = "Position des Spiels";
const TEXT_ANSWER_PARTY = "Antwort des Spiels";
const TEXT_ANSWER_USER = "Ihre Antwort";
const TEXT_IMAGE = "Logo oder Bild";
const TEXT_PARTY = "Spiel";
const TEXT_ANSWER_NORMAL = "Frage einfach gewertet";
const TEXT_ANSWER_DOUBLE = "Frage doppelt gewertet";

// addon_limit_results.js (only relevant if addon file is added to array "addons" in definition.js)

// Label of the buttons (displayed in the detail section of each result)
CR_CONTACT_BUTTON_EMAIL = "";

// Subject of the email. The name of the result is automatically appended
// 1. - if the result DOES have an data-email tag in the CSV file
CR_CONTACT_SUBJECT_EMAIL_DATATAG = "";
// 2. - Fallback, if the result has NO data-email tag in the CSV file
CR_CONTACT_SUBJECT_EMAIL_DEFAULT = "";

// Content of the email
// 1. - if the result DOES have an data-email tag in the CSV file
CONTACT_TEXT_EMAIL_DATATAG = ``;
// 2. - Fallback, if the result has NO data-email tag in the CSV file

CONTACT_TEXT_EMAIL_DEFAULT = "";

// addon_limit_results.js (only relevant if addon file is added to array "addons" in definition.js)

TEXT_RESULTS_BUTTON_SHOW_MORE = "<strong>+</strong> Mehr anzeigen";
// The show more button also tells the total number of results that can be shown (potentially subject to filter restrictions)
// For this, it needs a preposition. In English, this is "of". The button could say "Show more (of 123)"
TEXT_RESULTS_BUTTON_SHOW_MORE_PREPOSITION = "von";
TEXT_RESULTS_BUTTON_SHOW_LESS = "<strong>-</strong> Weniger anzeigen";

// addon_permalink_to_personal_results.js (only relevant if addon file is added to array "addons" in definition.js)

// Text in the button
PERMALINK_BUTTON_TEXT = `<i class="fa-solid fa-floppy-disk"></i>&nbsp; Ergebnisse speichern/teilen`;
// Explanatory text, which is shown for a couple of seconds after the button is pressed
PERMALINK_DESCRIPTION_TEXT =
  "Es wurde ein Permalink generiert und in deine Zwischenablage kopiert. Teile oder speichere diesen Link und rufe ihn später wieder auf, um direkt zu dieser Ergebnisseite zu gelangen.";
// Method for copying to clipboard is not supported in all browsers. Fallback: Show URL and tell user to copy it
PERMALINK_BUTTON_TEXT_ALT =
  "Kopiere den folgenden Link und speichere ihn an einem Ort deiner Wahl oder teile ihn. Dieser Link führt wieder zu dieser persönlichen Ergebnisseite.";

// addon_results_textfilter.js (only relevant if addon file is added to array "addons" in definition.js)

// Label of the dropdown filter
TEXTFILTER_LABEL = `<i class="fa-solid fa-filter"></i>&nbsp; Nach Spieler:innenzahl filtern`;

// Text of each option, corresponding to the string in TEXTFILTER_KEYWORDS with the same array index
TEXTFILTER_OPTIONS_TEXTS = [
  "Alle&nbsp;anzeigen",
  "Solo",
  "2",
  "3",
  "4",
  "5",
  "6",
  "≥ 7",
];

// addon_tooltips.js (only relevant if addon file is added to array "addons" in definition.js)

// If a tooltip should not be shown, give the variable a falsy value
// Text of the tooltip explaining the Voting Double button
TOOLTIP_VOTING_DOUBLE =
  "Du kannst manche Fragen doppelt gewichten. Klicke dafür auf &quot;Doppelt gewichten&quot;, <strong style='text-decoration:underline;'>bevor</strong> du deine Antwort auswählst.";
// Text of the tooltip explaining the buttons in the Results Short Table, with which you can change your answer
TOOLTIP_RESULTS_SHORT = "Klicke auf das Icon, um deine Antwort zu ändern.";
// Text of the tooltip explaining the buttons in the Results By Thesis Table, with which you can change or double your answer
TOOLTIP_RESULTS_BY_THESIS =
  "Klicke auf die Buttons, um deine Antwort zu ändern bzw. doppelt zu gewichten.";

// addon_set_filter_at_start.js (only relevant if addon file is added to array "addons" in definition.js)

// Title and text of the card which users see before the first real question, asking them to choose a filter option already
CARD_TO_SET_FILTER_HEADING = "Anzahl an Spieler:innen";
CARD_TO_SET_FILTER_BODY = "Kurze Frage vorab: Zu wievielt wollt ihr spielen?";

// addon_make_questions_optional.js (only relevant if addon file is added to array "addons" in definition.js)

// Title and body of the modal asking the user whether to continue with optional questions or skip to results
OPTIONAL_QUESTIONS_MODAL_TITLE =
  "Ab zur Auswertung &ndash; oder noch ein paar Fragen mehr?";
OPTIONAL_QUESTIONS_MODAL_BODY = `Du hast die Basis-Fragen beantwortet. Jetzt kannst du dir aussuchen:
  <ul>
    <li>Willst du die ${
      intQuestions - FIRST_OPTIONAL_QUESTION
    } Zusatzfragen beantworten,\
     in denen es um Spielmechaniken geht?</li>
    <li>Oder direkt zur Auswertung (und die Zusatzfragen bei Bedarf nachträglich beantworten)?</li>
  </ul>`;
// Text of modal button that leads to continuing with optional questions
OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS = "Zusatzfragen beantworten";
// Text of modal button that leads to jumping to results
OPTIONAL_QUESTIONS_MODAL_TO_RESULTS = "Zur Auswertung";
// Text of buttons on the results page, which allow users to subsequently answer the optional questions
BTNS_GO_BACK_TO_OPTIONAL_QUESTIONS =
  OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS;

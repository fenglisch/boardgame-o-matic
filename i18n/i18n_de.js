// DEUTSCHE TEXTE http://www.mat-o-wahl.de

// Buttons
const TEXT_START = "Los geht's!";
const TEXT_VOTING_PRO = "Gefällt mir";
const TEXT_VOTING_NEUTRAL = "Teils teils";
const TEXT_VOTING_CONTRA = "Gefällt mir nicht";
const TEXT_VOTING_BACK = "&larr;&nbsp;Zurück";
const TEXT_VOTING_SKIP = "Egal&nbsp;/ Überspringen &rarr;";
const TEXT_VOTING_DOUBLE = "Doppelt gewichten";

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

// DEUTSCHE TEXTE http://www.mat-o-wahl.de

// Welcome Screen / Description on Start (only shown if descriptionShowOnStart is TRUE in definition.js)

// The title of the page, which is displayed in the browser tab, must be changed directly in the index.html (<title> and meta property "og:title")
const DESCRIPTION_HEADING1 = "Demo Boardgame-O-Matic";
const DESCRIPTION_HEADING2 = "Playfully finding your matching board game";
const DESCRIPTION_EXPLANATION =
  "Answer the short questions to find out, which board games of our collection best match your preferences.</p><p><em>This example tool demonstrates, how the Boardgame-O-Matic works. You can setup your own version for free, see <a href='https://github.com/fenglisch/boardgame-o-matic' target='_blank'>https://github.com/fenglisch/boardgame-o-matic</a></em>";

// Buttons
const TEXT_START = "Let's go!";
const TEXT_VOTING_PRO = "Like";
const TEXT_VOTING_NEUTRAL = "Partly";
const TEXT_VOTING_CONTRA = "Dislike";
const TEXT_VOTING_BACK = "&larr;&nbsp;Back";
const TEXT_VOTING_SKIP = "No matter&nbsp;/ Skip &rarr;";
const TEXT_VOTING_DOUBLE = "Double weight";

// Privacy modal (only shown if privacyExternalPageLink is FALSE in definition.js)
const PRIVACY_MODAL_TITLE = `Privacy policy for the Demo Boardgame-O-Matic`;
const PRIVACY_MODAL_BODY = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

// Statistic
const TEXT_ALLOW_STATISTIC_TITLE = "Before you see your results...";
const TEXT_ALLOW_STATISTIC_TEXT = `Do you authorise us to transfer your <strong>anonymised</strong> answers for statistical purposes in accordance with our <a ${
  privacyExternalPageLink
    ? `href="${privacyExternalPageLink}" target="_blank"`
    : `href="#" onclick="fnShowPrivacy()"`
}>privacy policy</a>? By doing so, you will help us to improve the Boardgame-O-Matic in the future.`;
const TEXT_ALLOW_STATISTIC_YES = "Yeah, sure!";
const TEXT_ALLOW_STATISTIC_NO = "No, thanks.";

// Footer
const TEXT_IMPRINT = "Imprint";
const TEXT_PRIVACY = "Privacy Policy";
const TEXT_RESTART = "&#x21BB; Restart";

const TITLE_MATOMO_MODAL = "";
const TEXT_MATOMO_MODAL = `Do you authorise us to collect data about your visit for statistical purposes in order to further develop the Boardgame-O-Matic? You can find more details, such as the option to revoke your consent at any time, in the <a ${
  privacyExternalPageLink
    ? `href="${privacyExternalPageLink}" target="_blank"`
    : `href="#" onclick="fnShowPrivacy()"`
}>privacy policy</a>.`;

// Results
const TEXT_RESULTS_HEADING = "Your Top Matches";
const TEXT_RESULTS_SUBHEADING = "You have the highest match with these games";

// Info box is only shown if showInfoBoxAboveResultsShortTable is TRUE in definition.js
const TEXT_INFO_BOX =
  "This demo tool is not based on a real board game collection. Instead, the matching simply uses the BoardGameGeek Top 200 games (as of March 2024).";

const TEXT_LINK_TO_EXTERNAL_PAGE =
  "<i class='fa-solid fa-link'></i> View at BoardGameGeek";

const TEXT_RESULTS_INFO_THESES =
  "<h2>The answers of all games to the questions</h2>";
const TEXT_SHOW_PARTY_DESCRIPTION = `<i class="fa-solid fa-chevron-down"></i> Show details`;
const TEXT_HIDE_PARTY_DESCRIPTION = `<i class="fa-solid fa-chevron-up"></i> Hide details`;
const TEXT_SHOW_PARTY_ANSWERS = `<i class="fa-solid fa-chevron-down"></i> Compare answers`;
const TEXT_HIDE_PARTY_ANSWERS = `<i class="fa-solid fa-chevron-up"></i> Hide answers`;
const TEXT_SHOW_THESIS_ANSWERS = TEXT_SHOW_PARTY_ANSWERS;
const TEXT_HIDE_THESIS_ANSWERS = TEXT_HIDE_PARTY_ANSWERS;

// The following words may be used as ALT-Text or headers on the results-page
const TEXT_QUESTION = "Question";
const TEXT_POSITION_PARTY = "Position of the game";
const TEXT_ANSWER_PARTY = "Answer of the game";
const TEXT_ANSWER_USER = "Your answer";
const TEXT_IMAGE = "Image";
const TEXT_PARTY = "Board game";
const TEXT_ANSWER_NORMAL = "Question is single-weighted";
const TEXT_ANSWER_DOUBLE = "Question is double-weighted";

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

TEXT_RESULTS_BUTTON_SHOW_MORE = "<strong>+</strong> Show more";
// The show more button also tells the total number of results that can be shown (potentially subject to filter restrictions)
// For this, it needs a preposition. In English, this is "of". The button could say "Show more (of 123)"
TEXT_RESULTS_BUTTON_SHOW_MORE_PREPOSITION = "of";
TEXT_RESULTS_BUTTON_SHOW_LESS = "<strong>-</strong> Show less";

// addon_permalink_to_personal_results.js (only relevant if addon file is added to array "addons" in definition.js)

// Text in the button
PERMALINK_BUTTON_TEXT = `<i class="fa-solid fa-floppy-disk"></i>&nbsp; Save/share results`;
// Explanatory text, which is shown for a couple of seconds after the button is pressed
PERMALINK_DESCRIPTION_TEXT =
  "A permalink has been generated and copied to your clipboard. Share or save this link and open it again later to go directly to this results page.";
// Method for copying to clipboard is not supported in all browsers. Fallback: Show URL and tell user to copy it
PERMALINK_BUTTON_TEXT_ALT =
  "Copy the following link and save it to a location of your choice or share it. This link will take you back to this personal results page.";

// addon_results_textfilter.js (only relevant if addon file is added to array "addons" in definition.js)

// Label of the dropdown filter
TEXTFILTER_LABEL = `<i class="fa-solid fa-filter"></i>&nbsp; Filter by player count`;

// Text of each option, corresponding to the string in TEXTFILTER_KEYWORDS with the same array index
TEXTFILTER_OPTIONS_TEXTS = [
  "Show&nbsp;all",
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
  "If a question is particularly important to you, click on &quot;Double weight&quot; <strong>before</strong> you select your answer.";
// Text of the tooltip explaining the buttons in the Results Short Table, with which you can change your answer
TOOLTIP_RESULTS_SHORT = "Click on the icon to change your answer.";
// Text of the tooltip explaining the buttons in the Results By Thesis Table, with which you can change or double your answer
TOOLTIP_RESULTS_BY_THESIS =
  "Click on the buttons to change or double-weight your answer.";

// addon_set_filter_at_start.js (only relevant if addon file is added to array "addons" in definition.js)

// Title and text of the card which users see before the first real question, asking them to choose a filter option already
CARD_TO_SET_FILTER_HEADING = "Number of players";
CARD_TO_SET_FILTER_BODY =
  "Quick question in advance: How many people do you want to play with?";

// addon_make_questions_optional.js (only relevant if addon file is added to array "addons" in definition.js)

// Title and body of the modal asking the user whether to continue with optional questions or skip to results
OPTIONAL_QUESTIONS_MODAL_TITLE =
  "Off to the results &ndash; or a few more questions?";
OPTIONAL_QUESTIONS_MODAL_BODY = `You have answered the basic questions. Now you can choose:
  <ul>
    <li>Do you want to answer the ${
      intQuestions - FIRST_OPTIONAL_QUESTION
    } additional questions regarding board game mechanics?</li>
    <li>Or jump to the results (and maybe answer the additional questions subsequently)?</li>
  </ul>`;
// Text of modal button that leads to continuing with optional questions
OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS = "Answer additional questions";
// Text of modal button that leads to jumping to results
OPTIONAL_QUESTIONS_MODAL_TO_RESULTS = "To the results";
// Text of buttons on the results page, which allow users to subsequently answer the optional questions
BTNS_GO_BACK_TO_OPTIONAL_QUESTIONS =
  OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS;

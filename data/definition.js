// This is the central configuration file of the Boardgame-O-Matic
// If possible, all adjustments should be made through variables in this file

// Separator used in CSV files
const separator = ";";

// Name of the CSV file with the questions in the /data directory
const fileQuestions = "demo-questions.csv";

// Number of questions
const intQuestions = 16;

// Name of the CSV file with the board games in the /data directory
const fileAnswers = "demo-games.csv";

// File paths to system and CSS files
// If you have several instances of this tool running, you can use absolute references to global files (therefore, these are not hardcoded)
const pathToOutputJs = "system/output.js";
const pathToGeneralJs = "system/general.js";
const pathToPrivacyJs = "system/privacy.js";
const design = [
  "styles/global.css",
  "styles/demo.css",
  "system/fontawesome/css/fontawesome.css",
  "system/fontawesome/css/solid.css",
  "system/fontawesome/css/regular.css",
];

// Changes to how Matomo is implemented can be made directly in system/privacy.js
const matomoTracking = "off"; // "on" / "optin" / "off"
const matomoUrl = "";
const matomoSiteId = "";

// Logo in top left corner for branding (not recommended if embedded as iframe)
const showMainLogoInTopLeftCorner = true;
const mainLogoPath = "./demo-logo.jpeg";
const mainLogoHref = ""; // The link opens in a new tab
const mainLogoTitle = "Demo logo"; // This is just used for the title attribute of the image, it is not displayed

// Welcome and info screen before the first question
const descriptionShowOnStart = true;
// The title of the page, which is displayed in the browser tab, must be changed directly in the index.html (<title> and meta property "og:title")
const descriptionHeading1 = "Demo Boardgame-O-Matic";
const descriptionHeading2 = "Playfully finding your matching board game";
const descriptionExplanation =
  "Answer the short questions to find out, which board games of our collection best match your preferences.</p><p><em>This example tool demonstrates, how the Boardgame-O-Matic works. You can setup your own version for free, see GITHUB LINK</em>";

// Right to left slide animations when a new question is shown - OR - immediate cuts
const animateQuestionsCard = true;

// Show "Current question number/total question number" (e. g. "3/15") before title of question
// Not recommended if addon_make_questions_optional.js is active
const showQuestionNumberOnCard = false;

// Optional box with info icon and text, displayed on results page between headings and results table
const showInfoBoxAboveResultsShortTable = true;
const textInfoBox =
  "This demo tool is not based on a real board game collection. Instead, the matching simply uses the BoardGameGeek Top 200 games (as of March 2024).";

// Defines which i18n/i18n_xx.js file is used
const language = "en";

// Save anonymous data about how users answered the questions and which results they got?
// If active, users see a modal before they get their results, asking them for permission (opt-in)
// If they agree, their data is sent to a database
// Defined in extras/statistics/db_settings.php
const statsRecord = false;
const statsServer = "extras/statistics/vote_db.php";

// URL of imprint
// If tool is embedded as iframe in a page which links to the imprint in its footer, the tool itself must not link to imprint as well
// In this case, leave empty and set --display-imprint in the CSS file to "none"
const imprintLink = "";

// See comment to imprintLink
const privacyExternalPageLink = false;

// Instead of linking to a privacy policy page, you can also create on
// If privacyExternalPageLink is falsy, the privacy button will open open a full screen modal
const privacyModalTitle = `Privacy policy for the Demo Boardgame-O-Matic`;
const privacyModalGeneral = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

// Addons can vastly enhance the functionality of your tool
// Add the paths of the addon files you want to activate to the array
// If you have several instances of this tool running, you can use absolute references to global files
const addons = [
  "extras/addon_results_textfilter.js",
  "extras/addon_limit_results.js",
  "extras/addon_tooltips.js",
  "extras/addon_custom_voting_buttons.js",
  "extras/addon_permalink_to_personal_results.js",
  "extras/addon_show_first_results.js",
  "extras/addon_set_filter_at_start.js",
  "extras/addon_make_questions_optional.js",
];

// Addon-specific variables are set in this configuration file as well
// For better clarity, the variables are ordered in blocks corresponding to their plugin
// The variables in each block are only relevant if the addon is active, i. e. if it is added to the "addons" array
// Variables are declared without "let" or "const", this would make them block-scoped and therefore not accessible in the addon files

function isActivated(addonFileName) {
  // Helper function allowing us to use an easier to read shortcut
  return addons.some((item) => item.includes(addonFileName));
}

//
if (isActivated("addon_contacts_in_results.js")) {
  // Show a button, allowing the user to establish contact
  CR_CONTACT_ACTIVE_EMAIL = true;

  // Label of the buttons (displayed in the detail section of each result)
  CR_CONTACT_BUTTON_EMAIL = "";

  // Global email address
  // Only used if the result has NO data-email tag in the csv file
  CR_CONTACT_ADDRESS_EMAIL = "";

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
}

if (isActivated("addon_limit_results.js")) {
  // Number of results displayed at first
  // Also the number of results added to the table with each press of the show more button
  INT_RESULTS_SHOWN = 5;
  TEXT_RESULTS_BUTTON_SHOW_MORE = "<strong>+</strong> Show more";
  // The show more button also tells the total number of results that can be shown (potentially subject to filter restrictions)
  // For this, it needs a preposition. In English, this is "of". The button could say "Show more (of 123)"
  TEXT_RESULTS_BUTTON_SHOW_MORE_PREPOSITION = "of";
  TEXT_RESULTS_BUTTON_SHOW_LESS = "<strong>-</strong> Show less";
}

if (isActivated("addon_permalink_to_personal_results.js")) {
  // Text in the button
  PERMALINK_BUTTON_TEXT = `<i class="fa-solid fa-floppy-disk"></i>&nbsp; Save/share results`;
  // Explanatory text, which is shown for a couple of seconds after the button is pressed
  PERMALINK_DESCRIPTION_TEXT =
    "A permalink has been generated and copied to your clipboard. Share or save this link and open it again later to go directly to this results page.";
  // Method for copying to clipboard is not supported in all browsers. Fallback: Show URL and tell user to copy it
  PERMALINK_BUTTON_TEXT_ALT =
    "Copy the following link and save it to a location of your choice or share it. This link will take you back to this personal results page.";
  // How many seconds is the explanatory text shown after each button click before it disappears again?
  PERMALINK_DESCRIPTION_DURATION = 8;
}

if (isActivated("addon_results_textfilter.js")) {
  // Label of the dropdown filter
  TEXTFILTER_LABEL = `<i class="fa-solid fa-filter"></i>&nbsp; Filter by player count`;
  // Define strings for filter mechanism. Can by (invisible) HTML symbols
  // If a string is present in the description of a result (coming from the CSV file), the result is shown if the corresponding filter is selected
  TEXTFILTER_KEYWORDS = [
    " ",
    "&#8203;1",
    "&#8203;2",
    "&#8203;3",
    "&#8203;4",
    "&#8203;5",
    "&#8203;6",
    "&#8203;7",
  ];

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
}

if (isActivated("addon_tooltips.js")) {
  // If a tooltip should not be shown, give the variable a falsy value
  // Text of the tooltip explaining the Voting Double button
  TOOLTIP_VOTING_DOUBLE =
    "If a question is particularly important to you, click on &quot;Double weight&quot; <strong>before</strong> you select your answer.";
  // Text of the tooltip explaining the buttons in the Results Short Table, with which you can change your answer
  TOOLTIP_RESULTS_SHORT = "Click on the icon to change your answer.";
  // Text of the tooltip explaining the buttons in the Results By Thesis Table, with which you can change or double your answer
  TOOLTIP_RESULTS_BY_THESIS =
    "Click on the buttons to change or double-weight your answer.";

  // Number of the question where the TOOLTIP_RESULTS_BY_THESIS is displayed
  // This is relevant, if the first question(s) are custom questions (see addon_custom_voting_buttons.js) where hideVotingDouble is true
  // If this is the case, this variable should be the number of the first question where the Voting Double button is displayed
  // Otherwise, this can just be set to 1
  TOOLTIP_RESULTS_BY_THESIS_QUESTION_NUMBER = 3;
}

if (isActivated("addon_custom_voting_buttons.js")) {
  CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES = {
    backgroundColor: "var(--secondary-color)",
    textColor: "var(--text-on-secondary)",
    // To overwrite the default values for a question, set the key arBackgroundColor / arTextColor in an object of CUSTOM_POSITION_BUTTONS
    // The value of arBackgroundColor / arTextColor must be an array with as many elements as there are values of the button
  };
  const full = "<i class='fa-solid fa-star'></i>";
  const empty = "<i class='fa-regular fa-star'></i>";
  // For each question that should be customized, add an object to the array CUSTOM_POSITION_BUTTONS
  // The following keys are required (x = number of options/buttons for this question, should be an odd number)
  //    questionNr (integer; 1-indexed)
  //    arButtonLabels (array of x strings; texts of the voting buttons)
  //    arButtonAltTexts (array of x strings; alternative texts & titles of the buttons, e. g. same as arButtonLabels without HTML symbols)
  //    arPositionIcons (array of x strings; content of buttons/icons on the results page, must be super short, ideally symbols)
  //    arPositionValues (array of x integers; value for each button/option; the value of the middle option should be 0)
  // The following keys are optional
  //    votingDoubleByDefault (boolean; default: false; meaning: Should the voting double button be in the active state by default?)
  //    hideVotingDouble (boolean; default: false; meaning: Should the voting double button be hidden on the question card and in the results tables, so that the default state cannot be changed?)
  //    treatThirdOptionLikeSkipped (boolean; default: false; meaning: If true, the option with the value -1 [not necessarily the third option], cannot be selected. If the user selects it on the question card or changes to it in a results table, it automatically changes to the skipped state. Should only be used, if selecting the option with value -1 means, that the issue of the question is not relevant)
  //    iconLabelForSkipped (string, should be very short; overrides the skipped symbol "↷" as button content in the results tables. Should be used together with treatThirdOptionLikeSkipped. Without it, users could be confused why they get the skipped icon when they try to choose the option with the value -1)
  //    arBackgroundColor (array of x strings, each a hex value/rgb value/CSS color keyword representing the background color of the jumpToQuestion table cell and the icons in the results tables, if the corresponding option is selected; if not set, all options get CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.backgroundColor)
  //    arTextColor (array of x strings, same as arBackgroundColor; consider the contrast to the corresponding background color)

  CUSTOM_POSITION_BUTTONS = [
    {
      questionNr: 1,
      arButtonLabels: [
        "Super easy",
        "Beginner-friendly",
        "Moderate",
        "Advanced",
        "For experts",
      ],
      arButtonAltTexts: [
        "Super easy",
        "Beginner-friendly",
        "Moderate",
        "Advanced",
        "For experts",
      ],
      arPositionIcons: [
        `${full}${empty}${empty}${empty}${empty}`,
        `${full}${full}${empty}${empty}${empty}`,
        `${full}${full}${full}${empty}${empty}`,
        `${full}${full}${full}${full}${empty}`,
        `${full}${full}${full}${full}${full}`,
      ],
      arPositionValues: [2, 1, 0, -1, -2],
      votingDoubleByDefault: true,
      hideVotingDouble: true,
    },
    {
      questionNr: 2,
      arButtonLabels: [
        "Up to 45&nbsp;min",
        "45&nbsp;&ndash;&nbsp;90&nbsp;min",
        "90&nbsp;&ndash;&nbsp;120&nbsp;min",
        "120&nbsp;&ndash;&nbsp;180&nbsp;min",
        "More than 180&nbsp;min",
      ],
      arButtonAltTexts: [
        "Up to 45 min",
        "45 - 90 min",
        "90 - 120 min",
        "120 - 180 min",
        "More than 180 min",
      ],
      arPositionIcons: [
        "<&nbsp;45&prime;",
        "45&prime;&nbsp;- 90&prime;",
        "90&prime;&nbsp;- 120&prime;",
        "120&prime;&nbsp;- 180&prime;",
        ">&nbsp;180&prime;",
      ],
      arPositionValues: [2, 1, 0, -1, -2],
      votingDoubleByDefault: true,
      hideVotingDouble: true,
    },
    {
      questionNr: 3,
      arPositionValues: [1, 0, -1],
      arButtonLabels: [
        "As&nbsp;little text as possible",
        "Some text is fine",
        "It may be lots of text",
      ],
      arButtonAltTexts: [
        "As little text as possible",
        "Some text is fine",
        "It may be lots of text",
      ],
      arPositionIcons: ["Little text", "Some text", "Lots of text"],
      treatThirdOptionLikeSkipped: true,
      iconLabelForSkipped: "No matter",
    },
    {
      questionNr: 4,
      arPositionValues: [1, 0, -1],
      arButtonLabels: [
        "Low conflict level",
        "Moderate conflict level",
        "High conflict level",
      ],
      arButtonAltTexts: [
        "Low conflict level",
        "Moderate conflict level",
        "High conflict level",
      ],
      arPositionIcons: [
        `${full}${empty}${empty}`,
        `${full}${full}${empty}`,
        `${full}${full}${full}`,
      ],
    },
    {
      questionNr: 5,
      arPositionValues: [1, 0, -1],
      arButtonLabels: ["Cooperative", "Semi-cooperative", "Competetive"],
      arButtonAltTexts: ["Cooperative", "Semi-cooperative", "Competetive"],
      arPositionIcons: ["Coop", "Semi-coop", "Competetive"],
    },
  ];
}

if (isActivated("addon_set_filter_at_start.js")) {
  // Title and text of the card which users see before the first real question, asking them to choose a filter option already
  CARD_TO_SET_FILTER_HEADING = "Number of players";
  CARD_TO_SET_FILTER_BODY =
    "Quick question in advance: How many people do you want to play with?";
}

if (isActivated("addon_make_questions_optional.js")) {
  // Number of the question before which users get asked, whether they want to continue or skip to the results
  FIRST_OPTIONAL_QUESTION = 6;
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
  OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS =
    "Answer additional questions";
  // Text of modal button that leads to jumping to results
  OPTIONAL_QUESTIONS_MODAL_TO_RESULTS = "To the results";
  // Text of buttons on the results page, which allow users to subsequently answer the optional questions
  BTNS_GO_BACK_TO_OPTIONAL_QUESTIONS =
    OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS;
}

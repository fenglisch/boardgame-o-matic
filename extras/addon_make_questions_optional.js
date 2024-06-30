let hasModalBeenShownAlready = false;

function hideOptionalQuestionsInTables() {
  // By default, optional questions are hidden from jumpToQuestionTable and from results tables
  const stylesheet = document.createElement("style");
  stylesheet.setAttribute("id", "makeQuestionsOptionalCSS");
  for (let i = FIRST_OPTIONAL_QUESTION; i <= intQuestions; i++) {
    stylesheet.textContent += `#jumpToQuestionNr${i} {
          display: none;
        }`;
  }
  stylesheet.textContent += `#resultsByThesisTable > .col > div:nth-child(n+${
    (FIRST_OPTIONAL_QUESTION - 1) * 2
  }) {
      display: none;
    }
    [id^="resultsByPartyAnswersToQuestion"] .mow-row-striped:nth-child(n+${FIRST_OPTIONAL_QUESTION}) {
      display: none;
    }`;
  document.head.appendChild(stylesheet);
}

function showOptionalQuestionsInTables() {
  const stylesheet = document.querySelector("#makeQuestionsOptionalCSS");
  stylesheet.parentNode.removeChild(stylesheet);
}

function checkUrlForLinkToOptionalQuestions() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get("posbasequest")) return;
  const personalPositionsFromUrl = decodeURIComponent(
    urlParams.get("posbasequest")
  ); // arPersonalPositions and arVotingDouble are global arrays
  arPersonalPositions = personalPositionsFromUrl
    .split(",")
    .map((value) => +value);
  const votingDoubleFromUrl = decodeURIComponent(urlParams.get("double"));
  // Decode numbers to boolean values
  arVotingDouble = votingDoubleFromUrl.split(",").map((element) => !!+element);

  if (statsRecord) {
    // The stats modal shall not be shown
    // This is hard to achieve. Toggling it, simulating a click on the No-button or setting display:none don't work (partly due to timing)
    // Therefore, remove the modal
    document
      .querySelector("#statisticsModal")
      .parentNode.removeChild(document.querySelector("#statisticsModal"));
    // Without modal, output.js would throw an error because of a missing button, which would stop this function
    // Therefore, create a fake button to avoid the error
    const fakeElement = document.createElement("div");
    fakeElement.setAttribute("id", "statisticsModalButtonYes");
    fakeElement.classList.add("d-none");
    document.body.append(fakeElement);
  }
  document.querySelector("#sectionDescription")?.classList.add("d-none");

  setTimeout(() => {
    hasModalBeenShownAlready = true;
    // Jump to directly to first optional question. Without timeout, not everything would be ready
    fnShowQuestionNumber(FIRST_OPTIONAL_QUESTION - 2);
    document.querySelector("#restart").classList.remove("d-none");
    showOptionalQuestionsInTables();
    if (addons.some((item) => item.includes("addon_results_textfilter.js"))) {
      // Save filter value and set the dropdown as soon as it appears
      window.filterFromUrl = decodeURIComponent(urlParams.get("filter"));
      if (!window.filterFromUrl) return;

      const observerResults = new MutationObserver(setFilter);
      observerResults.observe(document.querySelector("#resultsHeading"), {
        childList: true,
      });
      function setFilter() {
        if (!document.querySelector("#resultsHeading").textContent) return;
        document.querySelector("#textfilter-dropdown").value =
          window.filterFromUrl;
        // Change event must be actively triggered; otherwise, the dropdown would show the right filter value, but filter would not be applied
        const eventSetFilter = new Event("change", { bubbles: true });
        document
          .querySelector("#textfilter-dropdown")
          .dispatchEvent(eventSetFilter);
      }
    }
  }, 500);
}

function checkUrlForConventionalPermalink() {
  // Scenario: User skipped to results without answering optional questions & generated permalink or refreshed ranking
  // Now, the user should not see the optional questions in the results tables, which he also did not see before, but the btnsToGoBackToOptionalQuestions instead
  // How do we know if user answered optional questions or jumped to results?
  // If all optional questions are skipped, the user (most likely) jumped to the results
  const urlParams = new URLSearchParams(window.location.search);

  if (!urlParams.get("pos")) return;
  const strPermalinkAddonPersonalPositions = decodeURIComponent(
    urlParams.get("pos")
  );
  const arPermalinkAddonPersonalPositions = strPermalinkAddonPersonalPositions
    .split(",")
    .map((value) => +value);
  const arPersonalPositionsToOptionalQuestions =
    arPermalinkAddonPersonalPositions.slice(FIRST_OPTIONAL_QUESTION - 1);
  if (arPersonalPositionsToOptionalQuestions.every((value) => value === 99)) {
    createBtnsToGoBackToOptionalQuestions();
  } else {
    showOptionalQuestionsInTables();
  }
}

function askIfOptionalQuestionsOrResults() {
  if (
    activeQuestion !== FIRST_OPTIONAL_QUESTION - 1 ||
    hasModalBeenShownAlready
  )
    return;
  hasModalBeenShownAlready = true;

  const container = document.querySelector(".container");
  const optionalQuestionsModal = document.createElement("div");
  optionalQuestionsModal.innerHTML = `
<div data-backdrop="static" class="modal fade show" id="optionalQuestionsModal" tabindex="-1" role="dialog" aria-labelledby="optionalQuestionsModalLabel" aria-modal="true">
<div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h2>${OPTIONAL_QUESTIONS_MODAL_TITLE}</h2>
    </div>
    <div class="modal-body" id="optionalQuestionsModalBody">${OPTIONAL_QUESTIONS_MODAL_BODY}
    </div>
    <div class="modal-footer">
      <button type="button" id="optionalQuestionsModalToOptionalQuestions" class="btn">
      ${OPTIONAL_QUESTIONS_MODAL_TO_OPTIONAL_QUESTIONS}
      </button>
      <button type="button" id="optionalQuestionsModalToResults" class="btn">
      ${OPTIONAL_QUESTIONS_MODAL_TO_RESULTS}
      </button>
    </div>
  </div>
</div>
</div>`;
  container.classList.add("d-none");
  document.body.append(optionalQuestionsModal);
  $("#optionalQuestionsModal").modal("show");
  optionalQuestionsModal
    .querySelector("#optionalQuestionsModalToResults")
    .addEventListener("click", () => {
      // Treat all optional questions as skipped
      for (let i = FIRST_OPTIONAL_QUESTION - 1; i < intQuestions; i++) {
        arPersonalPositions[i] = 99;
      }
      // Jump tp results
      fnShowQuestionNumber(intQuestions);
      $("#optionalQuestionsModal").modal("hide");
      container.classList.remove("d-none");
      createBtnsToGoBackToOptionalQuestions();
    });
  optionalQuestionsModal
    .querySelector("#optionalQuestionsModalToOptionalQuestions")
    .addEventListener("click", () => {
      showOptionalQuestionsInTables();
      $("#optionalQuestionsModal").modal("hide");
      container.classList.remove("d-none");
    });
}

function createBtnsToGoBackToOptionalQuestions() {
  const btnToOptionalQuestions = document.createElement("button");
  btnToOptionalQuestions.classList.add("to-optional-questions");
  btnToOptionalQuestions.textContent = BTNS_GO_BACK_TO_OPTIONAL_QUESTIONS;
  btnToOptionalQuestions.classList.add("btn");
  document
    .querySelector("#sectionResults")
    .insertBefore(
      btnToOptionalQuestions.cloneNode(true),
      document.querySelector("#results").nextSibling
    );
  setTimeout(() => {
    document
      .querySelector("#resultsByThesis")
      .appendChild(btnToOptionalQuestions.cloneNode(true));
    document.querySelectorAll(".to-optional-questions").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.open(generateLinkWithUserAnswersToBaseQuestions(), "_self");
      });
    });
  }, 1000);
}

function generateLinkWithUserAnswersToBaseQuestions() {
  let link = window.location.origin + window.location.pathname;
  // Add parameter with personal positions
  link += "?posbasequest=" + encodeURIComponent(arPersonalPositions.join(","));
  // Add parameter with voting double values, encode to numbers to avoid confusing strings like "false,false,false..." in the URL
  link +=
    "&double=" +
    encodeURIComponent(arVotingDouble.map((element) => +element).join(","));
  if (addons.some((item) => item.includes("addon_results_textfilter.js"))) {
    const selectedFilterOption = document.querySelector(
      "#textfilter-dropdown"
    ).value;
    link += "&filter=" + encodeURIComponent(selectedFilterOption);
  }
  return link;
}

window.addEventListener("load", () => {
  checkUrlForLinkToOptionalQuestions();

  if (
    addons.some((item) =>
      item.includes("addon_permalink_to_personal_results.js")
    )
  )
    checkUrlForConventionalPermalink();

  hideOptionalQuestionsInTables();

  const observerQuestion = new MutationObserver(
    askIfOptionalQuestionsOrResults
  );
  observerQuestion.observe(document.querySelector("#showQuestionsQuestion"), {
    childList: true,
  });
});

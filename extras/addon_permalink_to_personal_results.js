// Dieses Addon muss im Array addons in der definition.js NACH dem addon_custom_voting_buttons.js eingetragen werden
// Sonst wird der refresh button bei den custom questions am Ende nicht getriggered

// FUNKTION
// Erzeuge über der Ergebnistabelle einen Button, der einen Permalink kopiert, mit man zurück zu der persönlichen Ergebnisseite gelangt

// 1.) Allgemeine Angaben -> In definition.js

// 2.) In der DEFINITION.JS in den Erweiterten Einstellungen das Add-On eintragen.
// Add the add-on to the advanced settings in DEFINITION.JS
// var addons = ["extras/addon_contacts_in_results.js"]

// 3.) Fertig.
// That's it.

/// ////////////////////////////////////////////////////////////////////

// Hier kommt nur noch Quellcode. Bitte gehen Sie weiter. Hier gibt es nichts zu sehen.
// That's just source code. Please move on. Nothing to see here.

/// ////////////////////////////////////////////////////////////////////

function checkIfUrlIsPermalink() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("pos")) processPermalink(urlParams);
}

function processPermalink(urlParams) {
  // Restart button would be only visible element (except loading animation) that is visible while processing
  document.querySelector("#restart").classList.add("d-none");

  // arPersonalPositions and arVotingDouble are global arrays
  const personalPositionsFromUrl = decodeURIComponent(urlParams.get("pos"));
  arPersonalPositions = personalPositionsFromUrl
    .split(",")
    .map((value) => +value);

  const votingDoubleFromUrl = decodeURIComponent(urlParams.get("double"));
  arVotingDouble = votingDoubleFromUrl.split(",").map((element) => !!+element); // Convert Ones and Zeros to boolean values

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
    // Jump to results. Without timeout, not everything would be ready
    fnShowQuestionNumber(intQuestions);
    selectFilterFromUrl(urlParams);
  }, 500);

  setTimeout(() => {
    document.querySelector("#restart").classList.remove("d-none");
  }, 2000);
}

function selectFilterFromUrl(urlParams) {
  if (!addons.some((item) => item.includes("addon_results_textfilter.js")))
    return;
  const filterFromUrl = decodeURIComponent(urlParams.get("fil"));
  if (!filterFromUrl) return;
  setTimeout(() => {
    // Without timeout, element would not be found
    document.querySelector("#textfilter-dropdown").value = filterFromUrl;
    // Change event must be actively triggered; otherwise, the dropdown would show the right filter value, but filter would not be applied
    document
      .querySelector("#textfilter-dropdown")
      .dispatchEvent(new Event("change", { bubbles: true }));
  }, 300);
}
function generateLinkWithCurrentUserAnswers() {
  let link = window.location.origin + window.location.pathname;
  // Add parameter with personal positions
  link += "?pos=" + encodeURIComponent(arPersonalPositions.join(","));
  // Add parameter with voting double values, turn bool to numbers to avoid confusing strings like "false,false,false..." in the URL
  link +=
    "&double=" +
    encodeURIComponent(arVotingDouble.map((element) => +element).join(","));
  if (addons.some((item) => item.includes("addon_results_textfilter.js"))) {
    const selectedFilterOption = document.querySelector(
      "#textfilter-dropdown"
    ).value;
    link += "&fil=" + encodeURIComponent(selectedFilterOption);
  }
  return link;
}

function checkIfResultsChange() {
  function showOrHighlightBtnRefresh() {
    let btnRefresh;
    if (!isBtnRefreshShowingAlready) {
      isBtnRefreshShowingAlready = true;
      btnRefresh = document.createElement("a");
      btnRefresh.setAttribute("id", "refresh-button");
      btnRefresh.innerHTML =
        window.REFRESH_BUTTON_TEXT !== undefined
          ? REFRESH_BUTTON_TEXT
          : "&#8634; Ranking aktualisieren";
      btnRefresh.addEventListener("click", () => {
        window.open(generateLinkWithCurrentUserAnswers(), "_self");
      });
      document.body.appendChild(btnRefresh);
      if (
        addons.some((item) =>
          item.includes("addon_check_iframe_resize_client.js")
        )
      ) {
        // In iframe, the button is (re-)positioned whenever the parent window scrolls
        // This must happen as soon as the button is created
        // Message is listened to by addon_check_iframe_resize_host.js, sends scroll event with position values back
        parent.postMessage(["triggerScrollEvent", null], "*");
      }
      // Animation: button glides in
      btnRefresh.classList.add("show-refresh-button");
      setTimeout(() => {
        btnRefresh.classList.remove("show-refresh-button");
      }, 400);
    } else {
      btnRefresh = document.querySelector("#refresh-button");
      // Animation: button jumps
      btnRefresh.classList.add("highlight-refresh-button");
      setTimeout(() => {
        btnRefresh.classList.remove("highlight-refresh-button");
      }, 400);
    }
  }

  let isBtnRefreshShowingAlready = false;
  const nodelistResultChangingButtons = document.querySelectorAll(
    "[class*='selfPosition'], [id^='doubleIcon']"
  );
  nodelistResultChangingButtons.forEach((btn) => {
    btn.addEventListener("click", showOrHighlightBtnRefresh);
  });

  // In iframe, position:fixed does not work, because from the viewpoint of the iframe page, the window is much larger than the actual users' screen
  // This workaround positions the button at the actual button of the users' screen
  if (
    addons.some((item) => item.includes("addon_check_iframe_resize_client.js"))
  ) {
    // The addon_check_iframe_resize_host.js sends message with all required values from parent window whenever it's scrolled
    window.addEventListener("message", (event) => {
      if (!isBtnRefreshShowingAlready || event.data.type !== "scroll") return;
      const btnRefresh = document.querySelector("#refresh-button");
      btnRefresh.style.bottom = "unset"; // Without iframe, the button is positioned with "bottom"; here, we use "top"
      const scrollYRelativeToIframe =
        event.data.scrollY - event.data.distanceDocTopToIframe;
      const viewportBottomRelativeToIframe =
        scrollYRelativeToIframe + event.data.viewportHeight;
      let valueOfCssPropertyTop = viewportBottomRelativeToIframe - 60;
      valueOfCssPropertyTop = Math.max(300, valueOfCssPropertyTop);
      valueOfCssPropertyTop = Math.min(
        window.innerHeight - 150,
        valueOfCssPropertyTop
      );
      btnRefresh.style.top = valueOfCssPropertyTop + "px";
    });
  }
}

window.addEventListener("load", () => {
  checkIfUrlIsPermalink();

  const observerResults = new MutationObserver(createBtnPermalink);
  observerResults.observe(document.querySelector("#resultsHeading"), {
    childList: true,
  });

  // It is an inner function, so that it can access observerResults (in order to disconnect it)
  function createBtnPermalink() {
    // mutationObserver is triggered at the very start, because resultsHeading is emptied. This first trigger is ignored
    if (!document.querySelector("#resultsHeading").textContent) return;

    // Without disconnecting, the mutation would for some reason be triggered twice, leading to 2 buttons
    observerResults.disconnect();

    if (window.SHOW_REFRESH_BUTTON === undefined || SHOW_REFRESH_BUTTON)
      checkIfResultsChange();

    const permalinkButton = document.createElement("button");
    permalinkButton.setAttribute("id", "permalink-button");
    permalinkButton.classList.add("btn", "btn-secondary");
    permalinkButton.innerHTML = PERMALINK_BUTTON_TEXT;
    const permalinkDescription = document.createElement("p");
    permalinkDescription.setAttribute("id", "permalink-description");
    permalinkDescription.innerHTML = PERMALINK_DESCRIPTION_TEXT;

    permalinkButton.addEventListener("click", () => {
      const permalinkUrl = generateLinkWithCurrentUserAnswers();
      // Method for copying to clipboard is not supported in all browsers. Fallback: Show URL and tell user to copy it
      navigator.clipboard.writeText(permalinkUrl).catch((error) => {
        permalinkButton.innerHTML = `${
          window.PERMALINK_BUTTON_TEXT_ALT !== undefined
            ? PERMALINK_BUTTON_TEXT_ALT
            : "Kopiere den folgenden Link und speichere ihn an einem Ort deiner Wahl oder teile ihn. Dieser Link führt wieder zu dieser persönlichen Ergebnisseite"
        }: <small><a href="${permalinkUrl}" target="_blank">${permalinkUrl}</a></small>`;
      });
      // Animating the appearance and disappearance of the description box
      permalinkDescription.classList.add("permalink-description-visible");
      setTimeout(() => {
        permalinkDescription.classList.remove("permalink-description-visible");
      }, PERMALINK_DESCRIPTION_DURATION * 1000);
    });

    document
      .querySelector("#resultsAddonTop")
      .append(permalinkButton, permalinkDescription);
  }
});

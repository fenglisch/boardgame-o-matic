/*
This file seems to be long and complex, and it kind of is, because it must accommodate a variety of different filter types and configurations as well as their interactions
However, the procedure for each filter type (started by setupFilters()) is the same:
  * createFilterHtml (of course, highly different HTML for each filter type)
  * addFilterNodeToDOM (the same for each filter type, only difference is display above resultsShortTable (#resultsAddonTop) vs. in popup modal (which triggers createAndAppendSharedFilterModal))
  * addEventListenerToFilter (little differences depending on filter type)
  * Now, after the filter is triggered:
    * validateFilter (only required for filter types where input can be invalid; if input is invalid, error message is displayed)
    * hideResults (logic is highly different for each filter type)
    * checkIfAnyResultsLeft (always the same; if not, explanatory message is displayed)
    * sendMessageToLimitResultsAddon (always the same; ensures compatability of both addons)

Other functions:
  * setFiltersAtStart (incl. internal functions) & setPreselectedFilter: Only called if any of the filters are to be set at the beginning before the first question
  * setupButtonResetAllFilters: Only called if button shall be displayed

*/

window.addEventListener("load", setupFilters);

function setupFilters() {
  setFiltersAtStart();
  const filtersTab = document.createElement("div");
  filtersTab.setAttribute("id", "filters");
  filtersTab.classList.add("col", "d-none");
  filtersTab.innerHTML = `<div id="filtersHeading" class="tabHeading">
      <h1>${TEXT_FILTERS_HEADING}</h1>
      <h2>${TEXT_FILTERS_SUBHEADING}</h2>
    </div>
    <div id="filtersContainer"></div>`;
  document
    .querySelector("#sectionResults")
    .insertBefore(filtersTab, document.querySelector("#results"));

  // Start mutation observer to recognize when the results page is displayed
  const target = document.querySelector("#resultsHeading");
  const observer = new MutationObserver(() => {
    FILTERS.forEach((filter) => {
      const nodeFilter = createFilterHtml(filter);
      addFilterNodeToDOM(nodeFilter, filter);
    });
    if (
      FILTERS.some(
        (filter) => filter.displayFilterValuesInResultDetails?.isWanted
      )
    )
      displayFilterValuesInResultDetails();
  });
  var config = {
    childList: true,
  };
  observer.observe(target, config);
  if (BUTTON_RESET_ALL_FILTERS?.showButton) setupButtonResetAllFilters();
}

function createFilterHtml(filter) {
  // All filters, regardless of type, have the container in common
  const containerOfFilter = document.createElement("div");
  containerOfFilter.classList.add("filter-container");
  containerOfFilter.setAttribute(
    "id",
    `filter-container-${filter.internalName}`
  );
  let divContent = "";
  // Content of container highly differs depending on filter type
  if (filter.type === "dropdown") {
    containerOfFilter.classList.add("filter-container-dropdown");
    if (filter.label)
      divContent += `<i class="bx bx-fw ${filter.icon}"></i>
      <label id="filter-label-dropdown-${filter.internalName}" class="filter-label" for="filter-dropdown-${filter.internalName}">${filter.label}</label>`;
    divContent += `<select name="filter-dropdown-${filter.internalName}" id="filter-dropdown-${filter.internalName}" class="filter-dropdown-select">`;
    divContent += `<option value="show-all">${filter.textOfOptionToShowAll}</option>`; // the 1st option is always a "show all" option (applies no filter to results)
    filter.options.forEach((option) => {
      divContent += `<option value="${option.value}">${option.text}</option>`;
    });
    divContent += "</select>";
  } else if (filter.type === "input-datalist") {
    containerOfFilter.classList.add("filter-container-input-datalist");
    if (filter.label)
      divContent += `<label for="filter-input-${filter.internalName}">${filter.label}</label>`;
    divContent += `
    <input
      type="text"
      placeholder="${filter.placeholder}"
      id="filter-input-${filter.internalName}"
      list="datalist-${filter.internalName}"
    />`; // the input type is not relevant, because it is not actually submitted and sent to a server , "text" works just fine for all cases
    // If the filter is in the modal, the modal button acts as submit button
    if (
      !filter.displayInSharedModal &&
      !filter.displayInIndividualModal?.isWanted
    )
      divContent += `<button id='submit-filter-${filter.internalName}'>${filter.textButtonSubmit}</button>`;

    divContent += `<p class='error-message' id='error-message-filter-${filter.type}-${filter.internalName}'></p>
    <datalist id="datalist-${filter.internalName}">`;
    // The datalist generates a dropdown which is filtered by the input and therefore allows auto-complete
    filter.datalist.forEach((item) => {
      divContent += `<option value="${item}"></option>`;
    });
    divContent += "</datalist>";
  } else if (filter.type === "distance") {
    containerOfFilter.classList.add("filter-container-distance");
    divContent += `
    <label for="filter-distance-${filter.internalName}">${filter.label}</label><br>
    <input
      type="text"
      placeholder="${filter.placeholderLocation}"
      id="filter-distance-location-${filter.internalName}"
      list="datalist-${filter.internalName}"
    />`;

    divContent += `<datalist id="datalist-${filter.internalName}">`;
    // The datalist generates a dropdown which is filtered by the input and therefore allows auto-complete
    filter.datalist.forEach((item) => {
      divContent += `<option value="${item.text}"></option>`;
    });
    divContent += "</datalist>";
    divContent += `
    <input
      type="number"
      placeholder="${filter.placeholderDistance}"
      id="filter-distance-distance-${filter.internalName}"
    /> km
    <p class='error-message' id='error-message-filter-${filter.type}-${filter.internalName}'></p>`;
    // If the filter is in the modal, the modal button acts as submit button
    if (
      !filter.displayInSharedModal &&
      !filter.displayInIndividualModal?.isWanted
    ) {
      divContent += `<button id='submit-filter-${filter.internalName}'>${filter.textButtonSubmit}</button>`;
    }
  } else if (filter.type === "checkbox-list") {
    if (filter.heading)
      divContent += `<p id="filter-heading-checkbox-list-${filter.internalName}" class="filter-heading">${filter.heading}</p>`;
    divContent += `<div id="container-${filter.internalName}" class='container-checkbox-list' style='padding-left: 20px'>`;
    for (let i = 0; i < filter.options.length; i++) {
      const isChecked =
        filter.allCheckedByDefault || filter.options[i].checkedByDefault;
      const isActive =
        (isChecked && !filter.checkedMeansExcluded) ||
        (!isChecked && filter.checkedMeansExcluded);
      divContent += `<div class="checkbox-container flex-center">
      <input type="checkbox" id="filter-checkbox-list-${
        filter.internalName
      }-option${i}" ${isChecked ? "checked" : ""} value="${
        filter.options[i].value
      }" onchange="toggleStylesOfLabel(this, ${
        filter.strikethroughOptionsThatGetHidden
      })">
      <label class="checkbox-list-label" for="filter-checkbox-list-${
        filter.internalName
      }-option${i}">
        <i class='bx bx-${isActive ? "check" : "x"} bx-sm bx-border ${
        isActive ? "bg-color-success" : "bg-color-danger"
      }'></i>
        <span ${
          !isActive && filter.strikethroughOptionsThatGetHidden
            ? "class='line-through'"
            : ""
        }>${filter.options[i].label}</span>
      </label>`;
      if (filter.options[i].help) {
        divContent += `<button class="bx bx-help-circle icon-help" id="icon-help-${filter.internalName}-option${i}" onclick='showHelpModalExplainingFilterOption("${filter.options[i].label}",
          "${filter.options[i].help}")'></button>`;
      }
      divContent += `</div>`;
    }
    divContent += "</div>";
    divContent += `<p class="error-message" id='error-message-filter-${filter.type}-${filter.internalName}'></p>`;
    // If the filter is in the modal, the modal button acts as submit button
    if (
      !filter.displayInSharedModal &&
      !filter.displayInIndividualModal?.isWanted
    ) {
      divContent += `<button id='submit-filter-${filter.internalName}'>${filter.textButtonSubmit}</button>`;
    }
  } else if (filter.type === "single-checkbox") {
    if (filter.heading)
      divContent += `<p id="filter-heading-single-checkbox-${filter.internalName}" class="filter-heading">${filter.heading}</p>`;
    divContent += `<input type="checkbox" id="filter-single-checkbox-${
      filter.internalName
    }" ${filter.checkedByDefault ? "checked" : ""}>
    <label for="filter-single-checkbox-${filter.internalName}"> ${
      filter.label
    }</label>`;
  } else if (filter.type === "number-comparison") {
  }
  containerOfFilter.innerHTML = divContent;
  return containerOfFilter;
}

function addFilterNodeToDOM(nodeFilter, filter) {
  if (!document.querySelector("#resultsHeading").textContent) return;
  if (filter.displayInSharedModal) {
    if (!document.querySelector("#sharedFilterModal"))
      createAndAppendSharedFilterModal();
    document.querySelector("#sharedFilterModalBody").appendChild(nodeFilter);
  } else if (filter.displayInIndividualModal?.isWanted) {
    createAndAppendIndividualFilterModal(nodeFilter, filter);
  } else document.querySelector("#filtersContainer").appendChild(nodeFilter);

  addEventListenerToFilter(filter);
  if (filter.setAtStart?.isWanted) setPreselectedFilter(filter);
}

function toggleStylesOfLabel(element, strikethroughOptionsThatGetHidden) {
  const icon = element.nextElementSibling.querySelector("i");
  ["bx-check", "bx-x", "bg-color-success", "bg-color-danger"].forEach((cls) =>
    icon.classList.toggle(cls)
  );
  if (strikethroughOptionsThatGetHidden) {
    element.nextElementSibling
      .querySelector("span")
      .classList.toggle("line-through");
  }
}

function displayFilterValuesInResultDetails() {
  function createLookupTableForAnswersToCustomQuestionsResultDetails() {
    window.lookupTableForCustomQuestions = {};
    DISPLAY_ANSWERS_TO_QUESTIONS_IN_RESULT_DETAILS.questionsToBeDisplayed.forEach(
      (question) => {
        if (
          !isActivated("addon_custom_voting_buttons.js") ||
          !question.isCustomQuestion
        )
          return;
        const lookupTableEntry = {};
        objCustomQuestion = CUSTOM_POSITION_BUTTONS.find(
          (obj) => obj.questionNr === question.questionNr
        );
        objCustomQuestion.arPositionValues.forEach((value, index) => {
          lookupTableEntry[value] = objCustomQuestion.arButtonLabels[index];
        });
        window.lookupTableForCustomQuestions[question.questionNr] =
          lookupTableEntry;
      }
    );
  }
  function addAnswersToDivContent(divContent, description) {
    const resultNr = +description
      .getAttribute("id")
      .replace("resultsShortPartyDescription", "");

    DISPLAY_ANSWERS_TO_QUESTIONS_IN_RESULT_DETAILS.questionsToBeDisplayed.forEach(
      (question) => {
        const answerIndex = resultNr * intQuestions + (question.questionNr - 1);
        const answerValue = +arPartyPositions[answerIndex];
        let answerText = "";
        if (answerValue === 99) answerText = TEXT_NO_DATA;
        else {
          if (
            isActivated("addon_custom_voting_buttons.js") &&
            question.isCustomQuestion
          )
            answerText =
              window.lookupTableForCustomQuestions[question.questionNr][
                answerValue
              ];
          else
            answerText =
              arIcons[answerValue === 1 ? "0" : answerValue === 0 ? "1" : "2"];
        }
        divContent += `<li class="flex-center"><i class="bx ${
          arQuestionsIcon[question.questionNr - 1]
        }"></i>`;
        if (question.displayQuestionHeading)
          divContent += `${arQuestionsShort[question.questionNr - 1]}: `;
        divContent += answerText;
        divContent += "</li>";
      }
    );
    return divContent;
  }
  function addFilterValuesToDivContent(divContent, description) {
    FILTERS.forEach((filter) => {
      if (!filter.displayFilterValuesInResultDetails?.isWanted) return;
      const presentFilterValueStrings = description
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");
      if (
        presentFilterValueStrings.length === 1 &&
        presentFilterValueStrings[0] === ""
      ) {
        return;
      }
      const presentFilterOptions = presentFilterValueStrings.map(
        (presentValue) =>
          filter.options.find((option) => option.value === presentValue)
      );
      divContent += `<li>`;
      divContent += `<span class="flex-center" style="display: inline-flex"><i class="bx ${filter.icon}"></i> ${filter.displayFilterValuesInResultDetails.label}:</span> `;
      if (filter.displayFilterValuesInResultDetails.bulletList) {
        divContent += "<ul>";
        presentFilterOptions.forEach((option) => {
          divContent += `<li>${
            option[filter.type === "dropdown" ? "text" : "label"]
          }`;
          if (option.help) {
            divContent += `<button class="bx bx-help-circle icon-help icon-help-result-details-${
              filter.internalName
            }-option${filter.options.indexOf(
              option
            )}" onclick='showHelpModalExplainingFilterOption(
              "${option[filter.type === "dropdown" ? "text" : "label"]}",
              "${option.help}")'></button>`;
          }
          divContent += `</li>`;
        });
        divContent += "</ul>";
      } else
        divContent += presentFilterOptions
          .map(
            (option) => option[filter.type === "dropdown" ? "text" : "label"]
          )
          .join("; ");
    });
    return divContent;
  }
  if (!document.querySelector("#resultsHeading").textContent) return;
  if (DISPLAY_ANSWERS_TO_QUESTIONS_IN_RESULT_DETAILS?.isWanted)
    createLookupTableForAnswersToCustomQuestionsResultDetails();
  document
    .querySelectorAll("div[id^='resultsShortPartyDescription']")
    .forEach((description) => {
      const nodeAnswersAndFilterValues = document.createElement("div");
      let divContent =
        "<ul class='list-answers-and-filter-values-in-result-details'>";
      divContent = addAnswersToDivContent(divContent, description);
      divContent = addFilterValuesToDivContent(divContent, description);
      divContent += "</ul>";
      nodeAnswersAndFilterValues.innerHTML = divContent;
      description.insertBefore(
        nodeAnswersAndFilterValues,
        description.querySelector("#internet-below-description")
      );
    });
}

function showHelpModalExplainingFilterOption(heading, body) {
  let helpModal = document.querySelector("#help-modal-filter-option");
  if (helpModal) {
    helpModal.querySelector(".modal-header h2").innerHTML = heading;
    helpModal.querySelector(".modal-body").innerHTML = body;
  } else {
    helpModal = document.createElement("div");
    helpModal.classList.add("modal", "fade");
    helpModal.setAttribute("id", "help-modal-filter-option");
    helpModal.setAttribute("role", "dialog");
    helpModal.setAttribute("aria-modal", "true");
    helpModal.setAttribute("tabindex", "-1");
    let divContent = `<div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${heading}</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">${body}</div>
            </div>
        </div>`;
    helpModal.innerHTML = divContent;
    document.body.append(helpModal);

    $("#help-modal-filter-option").on("hide.bs.modal", () => {
      const otherOpenModal = document.querySelector(
        ".modal.show:not(#help-modal-filter-option)"
      );
      if (!otherOpenModal) return;
      // Reset other modal's z-index to be in front of its own backdrop (z-index: 1040), but still behind #help-modal-filter-option (z-index: 1050)
      otherOpenModal.style.zIndex = "1045";
      setTimeout(() => {
        document.body.classList.add("modal-open");
      }, 500);
    });
  }
  $("#help-modal-filter-option").modal("show");
  const otherOpenModal = document.querySelector(
    ".modal.show:not(#help-modal-filter-option)"
  );
  if (otherOpenModal) {
    // Put the other modal behind its own backdrop (resetted when top modal is closed)
    otherOpenModal.style.zIndex = "1040";
    setTimeout(() => {
      // Make the backdrop of the top modal invisible
      document.querySelectorAll(".modal-backdrop")[1].style.opacity = "0";
    }, 0);
  }
}

function addEventListenerToFilter(filter) {
  let selector;
  let event;
  if (filter.type === "dropdown" || filter.type === "single-checkbox") {
    selector = `#filter-${filter.type}-${filter.internalName}`;
    event = "change";
  } else if (
    filter.type === "input-datalist" ||
    filter.type === "distance" ||
    filter.type === "checkbox-list"
  ) {
    // If not in a modal, each of these filter types have their own submit button; otherwise, the modal button acts as global submit button for all filters it contains
    selector = filter.displayInSharedModal
      ? "#shared-filter-modal-confirm"
      : filter.displayInIndividualModal?.isWanted
      ? `#individual-filter-modal-confirm-${filter.internalName}`
      : `#submit-filter-${filter.internalName}`;
    event = "click";
  }

  document.querySelector(selector).addEventListener(event, () => {
    const isFilterValid = validateFilter(filter);
    if (!isFilterValid) {
      if (filter.displayInSharedModal)
        window.allFiltersInSharedModalCorrect = false; // This causes the modal not to close
      else if (filter.displayInIndividualModal?.isWanted)
        window[`${filter.internalName}FilterCorrectIsValid`] = false; // This causes the modal not to close
      return;
    }
    hideResults(filter);
    checkIfAnyResultsLeft();
    sendMessageToLimitResultsAddon();
    showBtnGoToUpdatedResults();
  });
  if (filter.type === "single-checkbox" || filter.type === "checkbox-list") {
    // In case filters are set by default, a first check must be done upfront
    document.querySelector(selector).dispatchEvent(new Event(event));
  }
}

function showBtnGoToUpdatedResults() {
  if (
    !document.querySelector("#filters").classList.contains("activeTab") || // If the filters tab is not active, the filter was not manually changed, but this function was triggered initially at startup
    document.querySelector("#btn-see-updated-results")
  )
    return;
  const btnSeeUpdatedResults = document.createElement("button");
  btnSeeUpdatedResults.setAttribute("id", "btn-see-updated-results");
  btnSeeUpdatedResults.classList.add(
    "btn",
    "flex-center",
    "off-screen",
    "btn-secondary"
  );
  btnSeeUpdatedResults.innerHTML = REFRESH_BUTTON_TEXT;
  document.querySelector("#sectionResults").appendChild(btnSeeUpdatedResults);
  setTimeout(() => {
    btnSeeUpdatedResults.classList.remove("off-screen");
  }, 0);
  const resultsTabBtn = document.querySelector("#resultsTabBtn");
  btnSeeUpdatedResults.addEventListener("click", () => {
    resultsTabBtn.click();
  });
  resultsTabBtn.addEventListener("click", () => {
    btnSeeUpdatedResults.remove();
  });
}

function validateFilter(filter) {
  if (filter.type === "dropdown" || filter.type === "single-checkbox")
    return true;
  const nodeErrorMessage = document.querySelector(
    `#error-message-filter-${filter.type}-${filter.internalName}`
  );
  nodeErrorMessage.innerHTML = "";
  if (filter.type === "input-datalist") {
    const inputValue = document.querySelector(
      `#filter-input-${filter.internalName}`
    ).value;
    // If the input is empty, the validation succeeds (no filter is applied)
    if (inputValue && !filter.datalist.includes(inputValue)) {
      nodeErrorMessage.innerHTML = filter.errorMessage;
      return false;
    } else return true;
  } else if (filter.type === "distance") {
    const inputValueLocation = document.querySelector(
      `#filter-distance-location-${filter.internalName}`
    ).value;
    const inputValueDistance = document.querySelector(
      `#filter-distance-distance-${filter.internalName}`
    ).value;
    // If both inputs are empty, the validation succeeds (no filter is applied)
    if (!inputValueLocation && !inputValueDistance) return true;
    // If one of the inputs is empty and the other one is not, the validation fails
    if (!inputValueLocation) {
      nodeErrorMessage.innerHTML = filter.errorMessageNoLocation;
      return false;
    } else if (
      !filter.datalist.some((item) => item.text === inputValueLocation)
    ) {
      nodeErrorMessage.innerHTML = filter.errorMessageWrongLocation;
      return false;
    } else if (!inputValueDistance) {
      // Since the input has "type='number'", any non-numerical input resolves to ""  (empty string)
      nodeErrorMessage.innerHTML = filter.errorMessageDistance;
      return false;
    } else return true;
  } else if (filter.type === "checkbox-list") {
    const checkboxes = document.querySelectorAll(
      `[id^="filter-checkbox-list-${filter.internalName}-option"]`
    );
    const areNoneChecked = !Array.from(checkboxes).some(
      (checkbox) => checkbox.checked
    );
    const areAllChecked = Array.from(checkboxes).every(
      (checkbox) => checkbox.checked
    );
    if (
      (filter.checkedMeansExcluded && areAllChecked) ||
      (!filter.checkedMeansExcluded && areNoneChecked)
    ) {
      nodeErrorMessage.innerHTML = filter.errorMessage;
      return false;
    } else return true;
  }
}

function hideResults(filter) {
  const nodelistAllResults = document.querySelectorAll(".row-with-one-result");
  if (filter.type === "dropdown") {
    const selectedOption = document.querySelector(
      `#filter-dropdown-${filter.internalName}`
    ).value;
    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const arCorrespondingFilterValues = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");

      if (
        selectedOption !== "show-all" &&
        (!arCorrespondingFilterValues ||
          !arCorrespondingFilterValues.includes(selectedOption))
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  } else if (filter.type === "input-datalist") {
    const inputValue = document.querySelector(
      `#filter-input-${filter.internalName}`
    ).value;
    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const arCorrespondingFilterValues = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");

      if (
        inputValue &&
        (!arCorrespondingFilterValues ||
          !arCorrespondingFilterValues.includes(inputValue))
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  } else if (filter.type === "distance") {
    const inputValueLocation = document.querySelector(
      `#filter-distance-location-${filter.internalName}`
    ).value;

    const inputValueDistance = +document.querySelector(
      `#filter-distance-distance-${filter.internalName}`
    ).value;
    // If both are empty, the validation succeeded, but no filter shall be applied
    if (!inputValueLocation && !inputValueDistance) return;

    const correspondingDatalistItem = filter.datalist.filter(
      (item) => item.text === inputValueLocation
    )[0];
    const latUser = +correspondingDatalistItem.lat;
    const lonUser = +correspondingDatalistItem.lon;

    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const latResult = +nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}-lat`);
      const lonResult = +nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}-lon`);

      if (
        !latResult ||
        !lonResult ||
        +haversineDistance(latUser, lonUser, latResult, lonResult) >
          inputValueDistance
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);

      function haversineDistance(latUser, lonUser, latParty, lonParty) {
        // Radius of the Earth in kilometers
        const R = 6371;
        // Convert latitude and longitude from degrees to radians
        const dLat = ((latParty - latUser) * Math.PI) / 180;
        const dLon = ((lonParty - lonUser) * Math.PI) / 180;
        // Haversine formula
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latUser * Math.PI) / 180) *
            Math.cos((latParty * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Distance in kilometers
        const distance = R * c;
        return distance;
      }
    });
  } else if (filter.type === "checkbox-list") {
    const selectedOptions = [];
    for (let i = 0; i < filter.options.length; i++) {
      if (
        document.querySelector(
          `#filter-checkbox-list-${filter.internalName}-option${i}`
        ).checked
      )
        selectedOptions.push(filter.options[i].value);
    }

    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const arCorrespondingFilterValues = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");
      const doFiltersValuesIncludeSelectedOption = selectedOptions.some(
        (item) => arCorrespondingFilterValues.includes(item)
      );

      if (
        !arCorrespondingFilterValues ||
        (filter.checkedMeansExcluded && doFiltersValuesIncludeSelectedOption) ||
        (!filter.checkedMeansExcluded && !doFiltersValuesIncludeSelectedOption)
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  } else if (filter.type === "single-checkbox") {
    const isChecked = document.querySelector(
      `#filter-single-checkbox-${filter.internalName}`
    ).checked;
    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const correspondingFilterValue = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`);
      // If checkedMeansExcluded is false, all results are shown when the box is checked. If the box is unchecked, those results with the corresponding value are hidden
      // If checkedMeansExcluded is true, vice versa (results with the value are hidden when box is checked)
      // if correspondingFilterValue is undefined, the result is not hidden; therefore, the attribute is only required on results to be hidden by this filter
      if (
        correspondingFilterValue === filter.value &&
        ((!filter.checkedMeansExcluded && !isChecked) ||
          (filter.checkedMeansExcluded && isChecked))
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  }
}

function checkIfAnyResultsLeft() {
  const nodelistResultsNotHiddenByFilters = document.querySelectorAll(
    ".row-with-one-result:not([class*='hidden-by-filter'])"
  );
  if (nodelistResultsNotHiddenByFilters.length === 0) {
    if (document.querySelector("#error-message-no-filter-results")) return;
    const nodeErrorMessage = document.createElement("div");
    nodeErrorMessage.classList.add("error-message");
    nodeErrorMessage.setAttribute("id", "error-message-no-filter-results");
    nodeErrorMessage.innerHTML = `<p>${ERROR_MESSAGE_NO_FILTER_RESULTS}</p>\
    <button id="no-filter-results-change-filters" class="btn btn-primary flex-center"><i class="bx bx-chevron-left bx-sm"></i> Change filters</button>`;
    nodeErrorMessage
      .querySelector("#no-filter-results-change-filters")
      .addEventListener("click", () => {
        document.querySelector("#filtersTabBtn").click();
      });
    document.querySelector("#resultsShort").appendChild(nodeErrorMessage);
  } else document.querySelector("#error-message-no-filter-results")?.remove();
}

function sendMessageToLimitResultsAddon() {
  window.postMessage("filter changed", "*");
}

function createAndAppendSharedFilterModal() {
  const containerBtnOpenSharedFilterModal = document.createElement("div");
  containerBtnOpenSharedFilterModal.setAttribute(
    "id",
    "container-button-open-shared-filter-modal"
  );
  containerBtnOpenSharedFilterModal.innerHTML = `<i class="bx bx-fw ${SHARED_MODAL.iconButtonOpenModal}"></i><button id="button-open-shared-filter-modal" class="btn-open-filter-modal">
    ${SHARED_MODAL.textButtonOpenModal}
  </button>`;
  document
    .querySelector("#filtersContainer")
    .appendChild(containerBtnOpenSharedFilterModal);

  const sharedFilterModal = document.createElement("div");
  sharedFilterModal.setAttribute("data-backdrop", "static");
  sharedFilterModal.classList.add("modal", "fade");
  sharedFilterModal.setAttribute("id", "sharedFilterModal");
  sharedFilterModal.setAttribute("role", "dialog");
  sharedFilterModal.setAttribute("aria-modal", "true");
  let divContent = `
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${SHARED_MODAL.heading}</h2>
                </div>
                <div class="modal-body" id="sharedFilterModalBody"></div>
                <div class="modal-footer">
                    <button type="button" id="shared-filter-modal-confirm" class="btn btn-primary">
                        ${SHARED_MODAL.buttonShowResults}
                    </button>
                </div>
            </div>
        </div>`;
  sharedFilterModal.innerHTML = divContent;
  document.body.append(sharedFilterModal);
  document
    .querySelector("#button-open-shared-filter-modal")
    .addEventListener("click", () => {
      $("#sharedFilterModal").modal("show");
    });
  document
    .querySelector("#shared-filter-modal-confirm")
    .addEventListener("click", () => {
      window.allFiltersInSharedModalCorrect = true;
      // If a filter in the modal fails validation, this is set to false, preventing the closing of the modal
      setTimeout(() => {
        if (window.allFiltersInSharedModalCorrect)
          $("#sharedFilterModal").modal("hide");
      }, 100);
    });
}

function createAndAppendIndividualFilterModal(nodeFilter, filter) {
  const containerBtnOpenIndividualFilterModal = document.createElement("div");
  containerBtnOpenIndividualFilterModal.setAttribute(
    "id",
    `container-button-open-individual-filter-modal-${filter.internalName}`
  );
  containerBtnOpenIndividualFilterModal.innerHTML = `
  <i class="bx bx-fw ${filter.icon}"></i>
  <button id="button-open-individual-filter-modal-${filter.internalName}"  class="btn-open-filter-modal">
    ${filter.displayInIndividualModal.textButtonOpenModal}
  </button>`;
  document
    .querySelector("#filtersContainer")
    .appendChild(containerBtnOpenIndividualFilterModal);

  const individualFilterModal = document.createElement("div");
  individualFilterModal.setAttribute("data-backdrop", "static");
  individualFilterModal.classList.add("modal", "fade");
  individualFilterModal.setAttribute(
    "id",
    `individualFilterModal-${filter.internalName}`
  );
  individualFilterModal.setAttribute("role", "dialog");
  individualFilterModal.setAttribute("aria-modal", "true");
  let divContent = `
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h2>${filter.displayInIndividualModal.heading}</h2>
                  </div>
                  <div class="modal-body" id="individualFilterModalBody-${filter.internalName}"></div>
                  <div class="modal-footer">
                      <button type="button" id="individual-filter-modal-confirm-${filter.internalName}" class="btn btn-primary">
                          ${filter.displayInIndividualModal.buttonShowResults}
                      </button>
                  </div>
              </div>
          </div>`;
  individualFilterModal.innerHTML = divContent;
  individualFilterModal
    .querySelector(`#individualFilterModalBody-${filter.internalName}`)
    .appendChild(nodeFilter);
  document.body.append(individualFilterModal);
  document
    .querySelector(
      `#button-open-individual-filter-modal-${filter.internalName}`
    )
    .addEventListener("click", () => {
      $(`#individualFilterModal-${filter.internalName}`).modal("show");
    });
  document
    .querySelector(`#individual-filter-modal-confirm-${filter.internalName}`)
    .addEventListener("click", () => {
      window[`${filter.internalName}FilterCorrectIsValid`] = true;
      // If the filter in the modal fails validation, this is set to false, preventing the closing of the modal
      setTimeout(() => {
        if (window[`${filter.internalName}FilterCorrectIsValid`])
          $(`#individualFilterModal-${filter.internalName}`).modal("hide");
      }, 100);
    });
}

function setFiltersAtStart() {
  const arFiltersToSetAtStart = FILTERS.filter(
    (filter) => filter.setAtStart?.isWanted
  );
  if (arFiltersToSetAtStart.length === 0) return;
  const elementsToHide = document.querySelectorAll(
    "#sectionShowQuestions, #sectionNavigation, #restart"
  );
  document
    .querySelector("#descriptionButtonStart")
    .addEventListener("click", () => {
      elementsToHide.forEach((element) => {
        element.classList.add("d-none");
      });
      showNextCardToSetFilter(0);
    });

  // From here it is just function declarations, nothing directly happening in setFiltersAtStart()

  function showNextCardToSetFilter(index) {
    if (index >= arFiltersToSetAtStart.length) {
      // All filters are set (or skipped), therefore show first question
      if (animateQuestionsCard) {
        setTimeout(() => {
          elementsToHide.forEach((element) => {
            element.classList.remove("d-none");
          });
          document
            .querySelector("#sectionShowQuestions")
            .classList.add("flyInRight");
        }, 400);
        setTimeout(() => {
          document
            .querySelector("#sectionShowQuestions")
            .classList.remove("flyInRight");
        }, 800);
      } else {
        elementsToHide.forEach((element) => {
          element.classList.remove("d-none");
        });
      }
      return;
    }

    const filter = arFiltersToSetAtStart[index];
    if (filter.type !== "dropdown") return; // So far, only dropdown filters are supported; other filters can be added in the future if needed
    const cardToSetFilter = document.createElement("div");
    cardToSetFilter.classList.add("card");
    cardToSetFilter.setAttribute(
      "id",
      `card-to-set-filter-${filter.internalName}`
    );
    cardToSetFilter.style.cssText = "margin: 1rem 15px 0 15px;";
    let divContent = `<div class="card-header"><h2 class="flex-center"><i class="bx ${filter.icon}"></i>${filter.setAtStart.cardHeading}</h2></div>
            <hr>
            <div class="card-body">
              <p class="card-text lead">${filter.setAtStart.cardBody}</p>
            </div>
            <section>
                    <div class="row">`;
    for (let i = 0; i < filter.options.length; i++) {
      divContent += `<div class="col">
            <button type="button" data-value="${filter.options[i].value}" class="btn btn-lg btn-block btn-voting btn-set-filter-${filter.internalName}">${filter.options[i].text}</button>
          </div>`;
    }
    divContent += `</div></section>
        <div class="w-100"></div>
        <div class="col">
                        <button type="button" style="background-color: transparent; color: var(--text-on-primary)" id="skip-set-filter-${filter.internalName}" class="btn btn-secondary btn float-right flex-center">${TEXT_VOTING_SKIP}</button>
                      </div>`;

    cardToSetFilter.innerHTML = divContent;
    addCardToSetFilterToDOM(cardToSetFilter, filter, index);

    function addCardToSetFilterToDOM(cardToSetFilter, filter, index) {
      if (animateQuestionsCard) {
        setTimeout(() => {
          sectionShowQuestions.parentNode.insertBefore(
            cardToSetFilter,
            sectionShowQuestions
          );
          cardToSetFilter.classList.add("flyInRight");
        }, 400);
        setTimeout(() => {
          cardToSetFilter.classList.remove("flyInRight");
          addEventListenersToButtons(filter, index);
        }, 800);
      } else {
        sectionShowQuestions.parentNode.insertBefore(
          cardToSetFilter,
          sectionShowQuestions
        );
        addEventListenersToButtons(filter, index);
      }
    }
    function addEventListenersToButtons(filter, index) {
      const buttonsSetFilter = document.querySelectorAll(
        `#card-to-set-filter-${filter.internalName} .btn-set-filter-${filter.internalName}`
      );
      buttonsSetFilter.forEach((button) => {
        button.addEventListener("click", (e) => {
          window[`setFilter${filter.internalName}`] =
            e.target.getAttribute("data-value");
          hideCardToSetFilter(index);
        });
      });
      document
        .querySelector(
          `#card-to-set-filter-${filter.internalName} #skip-set-filter-${filter.internalName}`
        )
        .addEventListener("click", () => {
          window[`setFilter${filter.internalName}`] = null;
          hideCardToSetFilter(index);
        });
    }
    function hideCardToSetFilter(index) {
      const cardToSetFilter = document.querySelector(
        `#card-to-set-filter-${arFiltersToSetAtStart[index].internalName}`
      );
      if (animateQuestionsCard) {
        cardToSetFilter.classList.add("flyOutLeft");
        setTimeout(() => {
          cardToSetFilter.classList.add("d-none");
          showNextCardToSetFilter(index + 1);
        }, 400);
      } else {
        cardToSetFilter.classList.add("d-none");
        showNextCardToSetFilter(index + 1);
      }
    }
  }
}

function setPreselectedFilter(filter) {
  if (window.allFiltersResetted) {
    // If BUTTON_RESET_ALL_FILTERS.showButton is true and the button has been clicked already, window.allFiltersResetted is set to true
    // This prevents setting preselected filters again (reset all filters overwrites preselected filters)
    return;
  }

  const selectedFilter = window[`setFilter${filter.internalName}`];
  if (selectedFilter) {
    document.querySelector(`#filter-dropdown-${filter.internalName}`).value =
      selectedFilter;
    document
      .querySelector(`#filter-dropdown-${filter.internalName}`)
      .dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function setupButtonResetAllFilters() {
  const target = document.querySelector("#resultsHeading");
  const observer = new MutationObserver(createButtonResetAllFilters);
  var config = {
    childList: true,
  };
  observer.observe(target, config);
  function createButtonResetAllFilters() {
    if (!document.querySelector("#resultsHeading").textContent) return;
    const containerBtn = document.createElement("div");
    containerBtn.setAttribute("id", "container-reset-all-filters");
    containerBtn.innerHTML = `<button id="reset-all-filters">
      <i class="bx bx-fw ${BUTTON_RESET_ALL_FILTERS.iconButton}"></i>
      ${BUTTON_RESET_ALL_FILTERS.textButton}
    </button>`;
    document.querySelector("#filtersContainer").appendChild(containerBtn);
    document
      .querySelector("#reset-all-filters")
      .addEventListener("click", () => {
        window.allFiltersResetted = true; // This prevents that the preselected filters from the start are set again by setPreselectedFilter()
        // Instead of manually resetting each filter, we just delete and re-create them all
        document
          .querySelectorAll(
            `.filter-container, \
            #container-button-open-shared-filter-modal, \
            [id^='container-button-open-individual-filter-modal'], \
            #sharedFilterModal, [id^='individualFilterModal'], \
            #container-reset-all-filters, \
            #error-message-no-filter-results`
          )
          .forEach((node) => {
            node.remove();
          });
        FILTERS.forEach((filter) => {
          const nodeFilter = createFilterHtml(filter);
          addFilterNodeToDOM(nodeFilter, filter);
        });
        document
          .querySelectorAll(".row-with-one-result[class*='hidden-by-filter']")
          .forEach((result) => {
            Array.from(result.classList).forEach((className) => {
              if (className.startsWith("hidden-by-filter")) {
                result.classList.remove(className);
              }
            });
          });
        createButtonResetAllFilters();
        sendMessageToLimitResultsAddon();
      });
  }
}

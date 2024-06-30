// This addon must be loaded before addon_permalink_to_personal_results.js in array "addons" in definition.js
// Otherwise, changing the position of a custom question at the end does not trigger the refresh button of the permalink addon

function createCustomVotingButtons() {
  document
    .querySelector("#sectionShowQuestions")
    .setAttribute("data-question-number", activeQuestion); // To add custom CSS, if needed

  // Show voting double button, might have been hidden from previous question
  const colVoteDouble = document.querySelector("#votingDouble").parentNode;
  colVoteDouble.classList.remove("d-none");

  // Remove all custom buttons (from previous question), except those for the active question
  document
    .querySelectorAll(`.btn-custom:not(.btn-custom-${activeQuestion})`)
    .forEach((btn) => {
      btn.parentNode.parentNode.removeChild(btn.parentNode);
    });
  const nodelistStandardVotingButtons = document.querySelectorAll(
    "#votingPro, #votingNeutral, #votingContra"
  );

  // Check if active question should be customized, directly assign matching object to variable
  if (
    (correspondingCustomQuestion = CUSTOM_POSITION_BUTTONS.find(
      (obj) => obj.questionNr === activeQuestion + 1
    )) &&
    // Check if start screen is showing, because otherwise it could trigger this block, since it has activeQuestion = 0
    window.getComputedStyle(document.querySelector("#sectionDescription"))
      .display === "none"
  ) {
    if (correspondingCustomQuestion.hideVotingDouble)
      colVoteDouble.classList.add("d-none");

    nodelistStandardVotingButtons.forEach((btn) =>
      btn.parentNode.classList.add("d-none")
    );

    for (
      let i = 0;
      i < correspondingCustomQuestion.arButtonLabels.length;
      i++
    ) {
      const newBtn = document.createElement("div");
      newBtn.classList.add("col");
      newBtn.innerHTML = `<button type="button" class="btn btn-lg btn-custom btn-custom-${activeQuestion} btn-block btn-voting">${correspondingCustomQuestion.arButtonLabels[i]}</button>`;
      newBtn.querySelector("button").addEventListener("click", () => {
        arPersonalPositions[activeQuestion] =
          correspondingCustomQuestion.arPositionValues[i];
        fnShowQuestionNumber(activeQuestion);
      });

      const referenceNode = document.querySelector(
        "#sectionVotingButtons .w-100"
      );
      referenceNode.parentNode.insertBefore(newBtn, referenceNode);
    }
  } else {
    // Active question is not to be customized -> Show standard voting buttons (in case they are hidden from previous custom question)
    nodelistStandardVotingButtons.forEach((btn) =>
      btn.parentNode.classList.remove("d-none")
    );
  }
}

function createInitialCustomPositionButtons() {
  // mutationObserver is triggered at the very start, because resultsHeading is emptied. This first trigger is ignored
  if (!document.querySelector("#resultsHeading").textContent) return;

  CUSTOM_POSITION_BUTTONS.forEach((obj) => {
    const i = obj.questionNr - 1;
    if (obj.hideVotingDouble)
      document.querySelector(`#doubleIcon${i}`).classList.add("d-none");

    const arPositionButtons = document.querySelectorAll(
      `.partyPositionToQuestion${i},
       .selfPosition${i}`
    );
    arPositionButtons.forEach((oldBtn) => {
      const newBtn = document.createElement("button");
      newBtn.classList.add("btn", "btn-custom", "btn-sm");
      newBtn.setAttribute("type", "button");
      const position = +oldBtn.getAttribute("data-value");
      newBtn.setAttribute("data-value", position);
      const index = obj.arPositionValues.indexOf(position);
      let btnTitleAndAltText;
      if (index === -1) {
        newBtn.style.backgroundColor = "transparent";
        newBtn.style.color = "#000";
        newBtn.innerHTML = "↷";
        btnTitleAndAltText = obj.arButtonAltTexts[index] ?? TEXT_VOTING_SKIP;
      } else {
        newBtn.style.backgroundColor =
          obj.arBackgroundColor?.[index] ||
          CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.backgroundColor;
        newBtn.style.color =
          obj.arTextColor?.[index] ||
          CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.textColor;
        newBtn.innerHTML = obj.arPositionIcons[index];
        btnTitleAndAltText = obj.arButtonAltTexts[index] ?? TEXT_VOTING_SKIP;
      }

      if (oldBtn.classList.contains(`selfPosition${i}`)) {
        newBtn.setAttribute(
          "onclick",
          `toggleSelfPositionOfCustomQuestion(${i})`
        );
        newBtn.classList.add(`selfPosition${i}`);
        newBtn.setAttribute(
          "alt",
          `${TEXT_ANSWER_USER}: ${btnTitleAndAltText}`
        );
        newBtn.setAttribute(
          "title",
          `${TEXT_ANSWER_USER}: ${btnTitleAndAltText}`
        );
      } else {
        newBtn.classList.add(`partyPositionToQuestion${i}`);
        newBtn.setAttribute(
          "alt",
          `${TEXT_ANSWER_PARTY}: ${btnTitleAndAltText}`
        );
        newBtn.setAttribute(
          "title",
          `${TEXT_ANSWER_PARTY}: ${btnTitleAndAltText}`
        );
        newBtn.disabled = true;
      }
      if (
        obj.treatThirdOptionLikeSkipped &&
        newBtn.getAttribute("data-value") === "99" &&
        newBtn.classList.contains(`selfPosition${i}`)
      ) {
        newBtn.innerHTML = obj.iconLabelForSkipped;
      }

      oldBtn.parentNode.prepend(newBtn);
      oldBtn.parentNode.removeChild(oldBtn);
    });
  });
}

function toggleSelfPositionOfCustomQuestion(i) {
  const oldPosition = arPersonalPositions[i];
  const obj = CUSTOM_POSITION_BUTTONS.find((obj) => obj.questionNr === i + 1); // This is the corresponding custom question object from definition.js
  const indexOfOldPosition = obj.arPositionValues.indexOf(oldPosition);
  let indexOfNewPosition = indexOfOldPosition + 1;
  if (indexOfOldPosition === -1)
    indexOfNewPosition = 0; // The oldPosition is not in the array, because it is 99 (skip). Continue with first position
  else if (indexOfOldPosition === obj.arButtonLabels.length - 1)
    indexOfNewPosition = null; // oldPosition was last one in array. Continue with skip
  const newPosition = obj.arPositionValues[indexOfNewPosition] ?? 99;

  arPersonalPositions[i] = newPosition;

  document.querySelectorAll(`.selfPosition${i}`).forEach((btn) => {
    btn.setAttribute("data-value", newPosition);
    btn.innerHTML = obj.arPositionIcons[indexOfNewPosition];
    if (btn.innerHTML === "undefined") {
      btn.innerHTML = "↷";
      btn.style.backgroundColor = "transparent";
      btn.style.color = "#000";
      btn.setAttribute("alt", `${TEXT_ANSWER_USER}: ${TEXT_VOTING_SKIP}`);
      btn.setAttribute("title", `${TEXT_ANSWER_USER}: ${TEXT_VOTING_SKIP}`);
    } else {
      btn.style.backgroundColor =
        obj.arBackgroundColor?.[indexOfNewPosition] ||
        CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.backgroundColor;
      btn.style.color =
        obj.arTextColor?.[indexOfNewPosition] ||
        CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.textColor;
      btn.setAttribute(
        "alt",
        `${TEXT_ANSWER_USER}: ${obj.arButtonAltTexts[indexOfNewPosition]}`
      );
      btn.setAttribute(
        "title",
        `${TEXT_ANSWER_USER}: ${obj.arButtonAltTexts[indexOfNewPosition]}`
      );
    }
  });

  fnReEvaluate();

  if (obj.treatThirdOptionLikeSkipped && newPosition === -1) {
    document.querySelector(`.selfPosition${i}`).click();
  }
  if (
    obj.treatThirdOptionLikeSkipped &&
    +document.querySelector(`.selfPosition${i}`).getAttribute("data-value") ===
      99
  ) {
    document.querySelectorAll(`.selfPosition${i}`).forEach((btn) => {
      btn.innerHTML = obj.iconLabelForSkipped;
    });
  }
}

window.addEventListener("load", () => {
  CUSTOM_POSITION_BUTTONS.forEach((obj) => {
    if (obj.votingDoubleByDefault) arVotingDouble[obj.questionNr - 1] = true;
  });

  // For custom questions with votingDoubleByDefault & hideVotingDouble, the user shall not see this state
  const stylesheet = document.createElement("style");
  stylesheet.setAttribute("id", "customVotingButtonsCSS");
  CUSTOM_POSITION_BUTTONS.forEach((obj) => {
    if (obj.votingDoubleByDefault && obj.hideVotingDouble)
      stylesheet.textContent += `#jumpToQuestionNr${obj.questionNr} a {
        font-weight: 400 !important;
      }`;
  });
  document.head.appendChild(stylesheet);

  const observerQuestion = new MutationObserver(createCustomVotingButtons);
  observerQuestion.observe(document.querySelector("#showQuestionsQuestion"), {
    childList: true,
  });

  const observerResults = new MutationObserver(
    createInitialCustomPositionButtons
  );
  observerResults.observe(document.querySelector("#resultsHeading"), {
    childList: true,
  });
});

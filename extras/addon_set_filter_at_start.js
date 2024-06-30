// Global variable to store the value of the chosen filter at the beginning and to retrieve it at the end
let setFilter = null;

function showSetFilterCardBeforeFirstQuestion() {
  const elementsToHide = document.querySelectorAll(
    "#sectionShowQuestions, #sectionNavigation, #restart"
  );
  for (let i = 0; i < elementsToHide.length; i++) {
    elementsToHide[i].classList.add("d-none");
  }
  const cardToSetFilter = document.createElement("div");
  cardToSetFilter.classList.add("card");
  cardToSetFilter.setAttribute("id", "card-to-set-filter");
  cardToSetFilter.style.cssText = "margin: 1rem 15px 0 15px;";
  let innerHtmlOfCardToSetFilter = `<div class="card-header"><h2>${CARD_TO_SET_FILTER_HEADING}</h2></div>
      <hr>
      <div class="card-body">
        <p class="card-text lead">${CARD_TO_SET_FILTER_BODY}</p>
      </div>
      <section>
              <div class="row">`;
  for (let i = 1; i < TEXTFILTER_OPTIONS_TEXTS.length; i++) {
    innerHtmlOfCardToSetFilter += `<div class="col">
      <button type="button" data-value="${TEXTFILTER_KEYWORDS[i]}" class="btn btn-lg btn-block btn-voting btn-set-filter">${TEXTFILTER_OPTIONS_TEXTS[i]}</button>
    </div>`;
  }
  innerHtmlOfCardToSetFilter += `</div></section>
  <div class="w-100"></div>
  <div class="col">
                  <button type="button" style="background-color: transparent;" id="skip-set-filter" class="btn btn-secondary btn float-right">${TEXT_VOTING_SKIP}</button>
                </div>`;
  cardToSetFilter.innerHTML = innerHtmlOfCardToSetFilter;

  function hideCardToSetFilter() {
    if (animateQuestionsCard) {
      cardToSetFilter.classList.add("flyOutLeft");
      setTimeout(() => {
        cardToSetFilter.classList.add("d-none");
        for (let i = 0; i < elementsToHide.length; i++) {
          elementsToHide[i].classList.remove("d-none");
        }
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
      document.querySelector("#card-to-set-filter").classList.add("d-none");
      for (let i = 0; i < elementsToHide.length; i++) {
        elementsToHide[i].classList.remove("d-none");
      }
    }
  }
  const buttonsSetFilter = cardToSetFilter.querySelectorAll(".btn-set-filter");
  for (let i = 0; i < buttonsSetFilter.length; i++) {
    buttonsSetFilter[i].addEventListener("click", (e) => {
      setFilter = e.target.getAttribute("data-value");
      hideCardToSetFilter();
    });
  }

  cardToSetFilter
    .querySelector("#skip-set-filter")
    .addEventListener("click", () => {
      setFilter = null;
      hideCardToSetFilter();
    });

  if (animateQuestionsCard) {
    setTimeout(() => {
      sectionShowQuestions.parentNode.insertBefore(
        cardToSetFilter,
        sectionShowQuestions
      );
      cardToSetFilter.classList.add("flyInRight");
    }, 400);
    setTimeout(() => {
      document
        .querySelector("#card-to-set-filter")
        .classList.remove("flyInRight");
    }, 800);
  } else {
    sectionShowQuestions.parentNode.insertBefore(
      cardToSetFilter,
      sectionShowQuestions
    );
  }
}
window.addEventListener("load", () => {
  document
    .querySelector("#descriptionButtonStart")
    .addEventListener("click", showSetFilterCardBeforeFirstQuestion);
  const observerResults = new MutationObserver(selectPresetFilter);
  observerResults.observe(document.querySelector("#resultsHeading"), {
    childList: true,
  });
});

function selectPresetFilter() {
  // id "#resultsHeading" wird in fnStart() am Anfang geleert (empty()).
  // -> mutationObserver erkennt Änderung und aktiviert fälschlicherweise diese Funktion :(
  // -> prüfen, ob Inhalt in DIV existiert
  if (document.querySelector("#resultsHeading").textContent && setFilter) {
    document.querySelector("#textfilter-dropdown").value = setFilter;
    const eventSetFilter = new Event("change", { bubbles: true });
    document
      .querySelector("#textfilter-dropdown")
      .dispatchEvent(eventSetFilter);
  }
}

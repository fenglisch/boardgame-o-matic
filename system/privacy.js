function fnShowPrivacy() {
  const privacyModalHtml = document.createElement("div");
  privacyModalHtml.innerHTML = `
	<div class="modal fade show" id="privacyModal" tabindex="-1" role="dialog" aria-labelledby="privacyModalLabel" aria-modal="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
				
					<div class="modal-header">
					<h2>${privacyModalTitle}
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">×</span>
						</button>
					</div>
					
					<div class="modal-body" id="privacyModalBody">${privacyModalGeneral}</div>
		</div>
	</div>`;
  document.body.append(privacyModalHtml);
  $("#privacyModal").modal("show");
}

if (matomoTracking.toLowerCase() === "on") {
  var _paq = (window._paq = window._paq || []);
  _paq.push(["disableCookies"]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  (function () {
    var u = matomoUrl;
    _paq.push(["setTrackerUrl", u + "matomo.php"]);
    _paq.push(["setSiteId", matomoSiteId]);
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.type = "text/javascript";
    g.async = true;
    g.src = u + "matomo.js";
    s.parentNode.insertBefore(g, s);
  })();
} else if (matomoTracking.toLowerCase() === "optin") {
  var _paq = (window._paq = window._paq || []);
  _paq.push(["disableCookies"]);

  const matomoModalHtml = document.createElement("div");
  matomoModalHtml.innerHTML = `
        <div class="modal fade show" id="matomoModal" tabindex="-1" role="dialog" aria-labelledby="matomoModalLabel" aria-modal="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                    
                        <div class="modal-header">
						<h2>${TITLE_MATOMO_MODAL}</h2>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        
                        <div class="modal-body" id="matomoModalBody">${TEXT_MATOMO_MODAL}</div>				
                <div class="modal-footer">
                    <button type="button" id="matomoModalButtonNo" class="btn btn-outline-dark" data-dismiss="modal">Nein, danke.</button>
                    <button type="button" id="matomoModalButtonYes" class="btn btn-primary">Ja, einverstanden</button>
                </div>
            </div>
        </div>`;
  window.addEventListener("load", () => {
    document.body.prepend(matomoModalHtml);
    let hasConsent = localStorage.getItem("matomoConsent");
    if (hasConsent === "true") {
      initializeMatomo();
    } else {
      $("#matomoModal").modal("show");
    }
    // Klick-Funktion mit den Ergebnissen zum Senden auf "Ja" legen
    document
      .getElementById("matomoModalButtonYes")
      .addEventListener("click", function () {
        localStorage.setItem("matomoConsent", "true");
        initializeMatomo();
        $("#matomoModal").modal("toggle");
      });

    function initializeMatomo() {
      var u = matomoUrl;
      _paq.push(["setTrackerUrl", u + "matomo.php"]);
      _paq.push(["setSiteId", matomoSiteId]);
      var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.type = "text/javascript";
      g.async = true;
      g.src = u + "matomo.js";
      s.parentNode.insertBefore(g, s);

      // Activate Matomo
      _paq.push(["trackPageView"]);
    }
  });
}

function retractConsent() {
  localStorage.removeItem("matomoConsent");
  _paq.push(["forgetConsentGiven"]);
  alert("Zustimmung erfolgreich widerrufen.");
}

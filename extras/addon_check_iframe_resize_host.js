/*
// EINSTELLUNGEN / SETTINGS
// http://www.mat-o-wahl.de

/* EINSATZZWECK / USE CASE

* WENN der Mat-o-Wahl als <iframe> eingebunden wurde, prÃ¼ft das Skript, 
  ob sich die HÃ¶he Ã¤ndert und Ã¤ndert (dynamisch) auch die HÃ¶he des Frames.
  Funktioniert Cross-Domain und mit gleicher Domain.

* IF the Mat-o-Wahl was included as an <iframe>, this script checks the height
  and adapts it to the current height.
  Works cross-domain and on same-domain.

	********************************************************************

* Dies ist der Teil, welcher von der Eltern-Seite mit dem <iframe> geladen werden muss.  

* This is the part to be included on the parent site with the <iframe>.

  CODE-BEISPIEL / CODE-EXAMPLE
  
  <script src="https://www.seite-von-meinem-kleinen-verein.de/mat-o-wahl/extras/addon_check_iframe_resize_host.js"></script>
  
  <iframe id="myIframe" src="https://www.seite-von-meinem-kleinen-verein.de/mat-o-wahl/index.html" style="min-width:100%;" loading="lazy">
  </iframe>
  
  <script type="text/javascript">
   document.getElementById("myIframe").addEventListener( "load", function() { fnMatoWahlIframeEventListener("myIframe"); } );
  </script>

///////////////////////////////////////////////////////////////////////  


// Hier kommt nur noch Quellcode. Bitte gehen Sie weiter. Hier gibt es nichts zu sehen.
// That's just source code. Please move on. Nothing to see here.


///////////////////////////////////////////////////////////////////////

*/

lastScrollHeight = 0;

// Aktiviere den Eventlistener und warte auf postMessage-Nachrichten
function fnMatoWahlIframeEventListener(iFrameID) {
  window.addEventListener(
    "message",
    function (ereignis) {
      var meinIframe = document.getElementById(iFrameID);

      // Auslesen der Ereigenisse aus dem "postMessage"-Array[]
      // z.B. ["setHeight", 123]
      var eventName = ereignis.data[0];

      switch (eventName) {
        case "setHeight":
          var data = ereignis.data[1];
          // wenn sich die HÃ¶he geÃ¤ndert hat
          if (lastScrollHeight !== data) {
            // neue HÃ¶he des <iframe> setzen ...
            meinIframe.height = data + "px";
            // sanften Bildlauf aktivieren
            meinIframe.style.transition = "height 0.5s";
            // ... und die alte HÃ¶he speichern.
            lastScrollHeight = meinIframe.height;
          }

          break;
        case "triggerScrollEvent":
          // This triggers the eventListener
          window.dispatchEvent(new CustomEvent("scroll"));
          break;
      }
    },
    false
  );

  const iframeWindow = document.querySelector("#myIframe").contentWindow;
  function getDistanceDocTopToElement(elem) {
    let location = 0;
    if (elem.offsetParent) {
      do {
        location += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return location >= 0 ? location : 0;
  }

  // This helps to position the refresh button, see addon_permalink_to_personal_results.js
  window.addEventListener("scroll", () => {
    iframeWindow.postMessage(
      {
        type: "scroll",
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
        distanceDocTopToIframe: getDistanceDocTopToElement(
          document.querySelector("#myIframe")
        ),
      },
      "*"
    );
  });
}

(function () {
  try {
    // -----------------------------
    // CONSTANTS
    // -----------------------------
    var REF_CODE = "ref_code";

    // -----------------------------
    // GET SCRIPT TAG + API KEY
    // -----------------------------
    var scriptTag = document.currentScript;
    if (!scriptTag) return;

    var API_KEY = scriptTag.getAttribute("data-api-key");
    if (!API_KEY) return;

    // -----------------------------
    // HELPER: GET QUERY PARAM 
    // -----------------------------
    function getQueryParam(param) {
      try {
        var params = new URLSearchParams(window.location.search);
        return params.get(param);
      } catch (e) {
        return null;
      }
    }

    // -----------------------------
    // STEP 1: STORE REFERRAL
    // -----------------------------
    function captureReferral() {
      try {
        var ref = getQueryParam("ref");

        if (ref) {
          localStorage.setItem(REF_CODE, ref);
        }
      } catch (e) {
        // silent fail
      }
    }

    // Run immediately
    captureReferral();

    // -----------------------------
    // STEP 2: CREATE GLOBAL OBJECT
    // -----------------------------
    window.Analytx = window.Analytx || {};

    // -----------------------------
    // STEP 3: TRACK SALE FUNCTION
    // -----------------------------
    window.Analytx.trackSale = function (data) {
      try {
        // Validate input
        if (!data || !data.skuId || !data.salePrice) return;

        // Get referral from storage
        var referralCode = null;
        try {
          referralCode = localStorage.getItem(REF_CODE);
        } catch (e) {}

        // If no referral → exit
        if (!referralCode) return;

        // Send API request
        fetch("https://tryanalytx.com/api/event/sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-analytx-api-key": API_KEY,
          },
          body: JSON.stringify({
            referralCode: referralCode,
            skuId: data.skuId,
            salePrice: data.salePrice,
          }),
        })
          .then(function (response) {
            // If success → clear referral
            if (response && response.ok) {
              try {
                localStorage.removeItem(REF_CODE);
              } catch (e) {}
            }
          })
          .catch(function () {
            // silent fail
          });
      } catch (e) {
        // silent fail
      }
    };
  } catch (e) {
    // global silent fail
  }
})();
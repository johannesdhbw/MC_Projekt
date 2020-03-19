_satellite.pushAsyncScript(function(event, target, $variables){
  var consentPartnershipCallback = function (window, document) {
    if (typeof application !== 'undefined') {
        var uaID = {
            'at': '',
            'ca': 'UA-68383661-8',
            'de': 'UA-68383661-5',
            'es': 'UA-68383661-3',
            'fr': 'UA-68383661-2',
            'it': 'UA-68383661-6',
            'mx': 'UA-68383661-7',
            'uk': 'UA-68383661-1',
            'us': 'UA-68383661-4',
            'default': ''
        };

        var applicationKey = (((application || '').split('.') || []).pop() || '').toLowerCase();

        var d = document,
            g = d.createElement('script'),
            s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.defer = true;
        g.async = true;
        g.src = '//www.googletagmanager.com/gtag/js?id=' + uaID[applicationKey];
        s.parentNode.insertBefore(g, s);

        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        if (applicationKey === 'us' || applicationKey === 'mx' || applicationKey === 'ca') {
            gtag('config', uaID[applicationKey]);
        } else {
            gtag('config', uaID[applicationKey], {'anonymize_ip': true});
        }

        // 15 Second Timeout
        setTimeout(function () {
            gtag('event', '15_seconds', {
                'event_label': 'Time on Site >15sec',
                'event_category': 'Traffic Quality',
                'non_interaction': true
            });
        }, 15 * 1000);

        // Scroll Depth
        var winheight, docheight, trackLength, throttlescroll;

        function getDocHeight() {
            var D = document;
            return Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
            )
        }

        function getmeasurements() {
            winheight = window.innerHeight || (document.documentElement || document.body).clientHeight;
            docheight = getDocHeight();
            trackLength = docheight - winheight;
        }

        function amountscrolled() {
            var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var pctScrolled = Math.floor(scrollTop / trackLength * 100);

            if (pctScrolled >= 50 && pctScrolled
                <= 100) {
                gtag('event', 'Scroll_Depth', {
                    'event_label': 'Scroll Depth',
                    'event_category': 'Traffic Quality',
                    'value': pctScrolled,
                    'non_interaction': true
                });
            }
        }

        getmeasurements();

        window.addEventListener("resize", function () {
            getmeasurements();
        }, false);

        window.addEventListener("scroll", function () {
            clearTimeout(throttlescroll);
            throttlescroll = setTimeout(function () { // throttle code inside scroll to once every 50 milliseconds
                amountscrolled();
            }, 50);
        }, false);
    }
};

// for DE: check if consent is given and then trigger
if (document.location.host.indexOf('ionos.de') !== -1 || 
    document.location.host.indexOf('ionos.at') !== -1) {

	if (typeof window.privacyConsentInstance === "undefined") {
  	window.privacyConsentInstance = new PrivacyConsent({ whitelist: true });
  }

  window.privacyConsentInstance.invoke(
	    function() {
      	consentPartnershipCallback(window, document);
      },
      PrivacyConsentEnum.PARTNERSHIPS,
      window.privacyConsentInstance,
      true // invoke only once
  );
  
  window.privacyConsentInstance.initialize();

} else {
    consentPartnershipCallback(window, document);
}
});

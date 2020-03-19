_satellite.pushAsyncScript(function(event, target, $variables){
  var fbPixel = function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
};  
  
if (typeof window.privacyConsentInstance === "undefined") {
    window.privacyConsentInstance = new PrivacyConsent({whitelist: true});
}

window.privacyConsentInstance.invoke(
    function () {
        fbPixel(window,
            document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', '1247733445296294'); // Insert your pixel ID here.
        fbq('track', 'PageView');

        setTimeout(function () {
            fbq('trackCustom', 'SoftConversion', {time: '30 Seconds'});
        }, 30 * 1000);
    },
    PrivacyConsentEnum.PARTNERSHIPS,
    window.privacyConsentInstance,
    true
);

window.privacyConsentInstance.initialize();
});

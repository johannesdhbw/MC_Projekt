$.realUserMonitoring = function() {
    var RealUserMonitoring = function() {

        this.getBrowserPerformanceData = function() {
            return  window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
        };

        this.initializeMeasurement = function(waitUntil) {
            var performanceTimeout = !((this.currentTime - this.startMeasurement) < 90000);

            if (!!!this.performance.timing[waitUntil] && !performanceTimeout) {
                return window.setTimeout(function() {
                    this.initializeMeasurement(waitUntil);
                }.bind(this), 100);
            }

            if (!!this.performance.timing[waitUntil]) {
                var timing = {};
                var currentTime = new Date().getTime();
                var baseTime = this.performance.timing.navigationStart

                // Return in case baseTime is empty or 0
                if (!baseTime) {
                    return;
                }

                for (var key in this.performance.timing) {
                    // Check for safari bug where values might not be timestamps
                    if (this.performance.timing[key] !== 0 && this.performance.timing[key] < baseTime) {
                        return;
                    }

                    timing[key] = this.performance.timing[key]

                    // Handle Safari bug where values can be in the far future
                    // Don't report anything if timing api is buggy
                    if (timing[key] > currentTime) {
                        return;
                    }
                }

                // if not updated means browser does not support resource api
                var resources = -1;

                if (this.performance.getEntries) {
                    resources = this.performance.getEntries('resources').length;
                }

                var parameters = {
                    dom_serial: undefined,
                    application: application,
                    page: page,
                    node_elements: document.getElementsByTagName('*').length,
                    page_size: Math.round(unescape(encodeURIComponent(this.rootNode.outerHTML)).length),
                    browser: UNOUNO.browser.getName() || 'unknown',
                    browser_version: UNOUNO.browser.getVersion() || 'unknown',
                    browser_locale: window.navigator.userLanguage || window.navigator.language || 'unknown',
                    os: 'unknown',
                    market: 'ZZ',
                    variant: undefined,
                    referer: document.referrer || '',
                    device_type: UNOUNO.device.getType(),
                    unload_time: timing.unloadEventEnd - timing.unloadEventStart,
                    navigation_time: timing.responseEnd - timing.navigationStart,
                    browser_time: timing.loadEventEnd - timing.domLoading, // Browser + resources
                    page_load_time: timing.loadEventEnd - timing.navigationStart,
                    redirect_time: timing.redirectEnd - timing.redirectStart,
                    app_cache_time: timing.domainLookupStart - timing.fetchStart,
                    dns_time: timing.domainLookupEnd - timing.domainLookupStart,
                    tcp_time: timing.connectEnd - timing.connectStart,
                    request_time: timing.responseStart - timing.requestStart,
                    response_time: timing.responseEnd - timing.responseStart,
                    resources: resources,
                    interactive_time: timing.domInteractive - timing.domLoading,
                    ttfb: timing.responseStart - timing.fetchStart,
                    pfx_get_dom: 0,
                    pfx_hdl_doc: 0,
                    pfx_rex_doc: 0,
                    pfx_pre_proc: 0,
                    ng_userid: (document.cookie.match(new RegExp('NG_USERID=([^;]+)')) || [])[1],
                    visit_id: undefined
                };

                var measurementPixel = new Image();
                measurementPixel.src = (function() {
                    var params = [];

                    for (var key in parameters) {
                        params.push(key + '=' + encodeURIComponent(parameters[key]));
                    }

                    var host = window.location.host;
                    var hostParts = host.split('.');
                    var tld = hostParts.slice(1);
                    var pixelUrl = '//pixel.' + tld.join('.') + '/rum?';

                    return pixelUrl + params.join('&');
                })();
            }
        };

        this.initialize = function() {
            var rootNode = document.getElementsByTagName('html')[0];

            if (!rootNode || !rootNode.outerHTML) {
                return;
            } else if (!!!application || !!!page) {
                return;
            }

            this.rootNode = rootNode;
            this.currentTime = new Date().getTime();

            if (!this.startMeasurement) {
                this.startMeasurement = this.currentTime;
            }

            this.performance = this.getBrowserPerformanceData();

            if (this.performance && this.performance.timing) {
                this.initializeMeasurement('loadEventEnd');
            }

            return this;
        };

        return this.initialize();
    };

    return new RealUserMonitoring();
};

$(document).ready(function() {

    if (typeof window.PrivacyConsent !== "undefined") {
        // we use the available variable defined by Adpbe DTM script
        if (typeof window.privacyConsentInstance === "undefined") {
            window.privacyConsentInstance = new PrivacyConsent({whitelist: true});
        }

        window.privacyConsentInstance.invoke(
            $.realUserMonitoring,
            PrivacyConsentEnum.STATISTICS,
            window.privacyConsentInstance,
            true
        );

        window.privacyConsentInstance.initialize();
    }
    else {
        $.realUserMonitoring();
    }
});
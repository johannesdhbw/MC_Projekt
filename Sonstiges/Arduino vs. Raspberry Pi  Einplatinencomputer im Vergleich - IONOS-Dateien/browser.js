UNOUNO = window.UNOUNO || {};
UNOUNO.browser = UNOUNO.browser || {};
UNOUNO.engine = UNOUNO.engine || {};
UNOUNO.device = UNOUNO.device || {};

UNOUNO.engine.getVersion = function() {

    var agent = window.navigator.userAgent;

    var version = "";
    if (UNOUNO.engine.isMshtml()) {
        var isTrident = /Trident\/([^\);]+)(\)|;)/.test(agent);
        if (/MSIE\s+([^\);]+)(\)|;)/.test(agent)) {
            version = RegExp.$1;

            // If the IE8 or IE9 is running in the compatibility mode, the MSIE value
            // is set to an older version, but we need the correct version. The only
            // way is to compare the trident version.
            if (version < 8 && isTrident) {
                if (RegExp.$1 == "4.0") {
                    version = "8.0";
                } else if (RegExp.$1 == "5.0") {
                    version = "9.0";
                }
            }
        } else if (isTrident) {
            // IE 11 dropped the "MSIE" string
            var match = /\brv\:(\d+?\.\d+?)\b/.exec(agent);
            if (match) {
                version = match[1];
            }
        }
    } else if (UNOUNO.engine.isOpera()) {
        // Opera has a special versioning scheme, where the second part is combined
        // e.g. 8.54 which should be handled like 8.5.4 to be compatible to the
        // common versioning system used by other browsers
        if (/Opera[\s\/]([0-9]+)\.([0-9])([0-9]*)/.test(agent))
        {
            // opera >= 10 has as a first verison 9.80 and adds the proper version
            // in a separate "Version/" postfix
            // http://my.opera.com/chooseopera/blog/2009/05/29/changes-in-operas-user-agent-string-format
            if (agent.indexOf("Version/") != -1) {
                var match = agent.match(/Version\/(\d+)\.(\d+)/);
                // ignore the first match, its the whole version string
                version =
                    match[1] + "." +
                    match[2].charAt(0) + "." +
                    match[2].substring(1, match[2].length);
            } else {
                version = RegExp.$1 + "." + RegExp.$2;
                if (RegExp.$3 != "") {
                    version += "." + RegExp.$3;
                }
            }
        }
    } else if (UNOUNO.engine.isWebkit()) {
        if (/AppleWebKit\/([^ ]+)/.test(agent))
        {
            version = RegExp.$1;

            // We need to filter these invalid characters
            var invalidCharacter = RegExp("[^\\.0-9]").exec(version);

            if (invalidCharacter) {
                version = version.slice(0, invalidCharacter.index);
            }
        }
    } else if (UNOUNO.engine.isGecko()) {
        // Parse "rv" section in user agent string
        if (/rv\:([^\);]+)(\)|;)/.test(agent)) {
            version = RegExp.$1;
        }
    } else {
        version = "1.9.0.0";
    }

    return version;
};

UNOUNO.engine.getName = function() {

    var name;
    if (UNOUNO.engine.isMshtml()) {
        name = "mshtml";
    } else if (UNOUNO.engine.isOpera()) {
        name = "opera";
    } else if (UNOUNO.engine.isWebkit()) {
        name = "webkit";
    } else if (UNOUNO.engine.isGecko()) {
        name = "gecko";
    } else {
        // fallback to gecko
        name = "gecko";
    }

    return name;
};

UNOUNO.engine.isOpera = function() {
    return window.opera &&
        Object.prototype.toString.call(window.opera) == "[object Opera]";
};

UNOUNO.engine.isWebkit = function() {
    return window.navigator.userAgent.indexOf("AppleWebKit/") != -1;
};


UNOUNO.engine.isGecko = function() {
    return window.navigator.mozApps &&
        window.navigator.product === "Gecko" &&
        window.navigator.userAgent.indexOf("Trident") == -1;
};

UNOUNO.engine.isMshtml = function () {
    if (window.navigator.cpuClass &&
        (/MSIE\s+([^\);]+)(\)|;)/.test(window.navigator.userAgent) ||
        /Trident\/\d+?\.\d+?/.test(window.navigator.userAgent))) {
        return true;
    }
    if (UNOUNO.engine.isWindowsPhone()) {
        return true;
    }
    return false;
};

UNOUNO.engine.isWindowsPhone = function () {
    return window.navigator.userAgent.indexOf("Windows Phone") > -1;
};

UNOUNO.engine.known = {
    // Safari should be the last one to check, because some other Webkit-based browsers
    // use this identifier together with their own one.
    // "Version" is used in Safari 4 to define the Safari version. After "Safari" they place the
    // Webkit version instead. Silly.
    // Palm Pre uses both Safari (contains Webkit version) and "Version" contains the "Pre" version. But
    // as "Version" is not Safari here, we better detect this as the Pre-Browser version. So place
    // "Pre" in front of both "Version" and "Safari".
    "webkit" : "AdobeAIR|Titanium|Fluid|Chrome|Android|Epiphany|Konqueror|iCab|iPad|iPhone|OmniWeb|Maxthon|Pre|PhantomJS|Mobile Safari|Safari",

    // Better security by keeping Firefox the last one to match
    "gecko" : "prism|Fennec|Camino|Kmeleon|Galeon|Netscape|SeaMonkey|Namoroka|Firefox",

    // No idea what other browsers based on IE's engine
    "mshtml" : "IEMobile|Maxthon|MSIE|Trident",

    // Keep "Opera" the last one to correctly prefer/match the mobile clients
    "opera" : "Opera Mini|Opera Mobi|Opera"
};

UNOUNO.browser.getName = function() {

    var detectedEngine = UNOUNO.engine.known[UNOUNO.engine.getName()];
    var agent = navigator.userAgent;
    var reg = new RegExp("(" + detectedEngine + ")(/|)?([0-9]+\.[0-9])?");
    var match = agent.match(reg);
    if (!match) {
        return "";
    }

    var name = match[1].toLowerCase();

    var engine = UNOUNO.engine.getName();
    if (engine === "webkit")
    {
        if (agent.match(/Edge\/\d+\.\d+/)) {
            name = "edge";
        }
        else if (name === "android")
        {
            // Fix Chrome name (for instance wrongly defined in user agent on Android 1.6)
            name = "mobile chrome";
        }
        else if (agent.indexOf("Mobile Safari") !== -1 || agent.indexOf("Mobile/") !== -1)
        {
            // Fix Safari name
            name = "mobile safari";
        }
        else if (agent.indexOf(" OPR/") != -1) {
            name = "opera";
        }
    }
    else if (engine ===  "mshtml")
    {
        // IE 11's ua string no longer contains "MSIE" or even "IE"
        if (name === "msie" || name === "trident")
        {
            name = "ie";

            var reg = new RegExp("IEMobile");
            if (agent.match(reg)) {
                name = "iemobile";
            }
        }
    }
    else if (engine === "opera")
    {
        if (name === "opera mobi") {
            name = "operamobile";
        } else if (name === "opera mini") {
            name = "operamini";
        }
    }

    return name;

};

UNOUNO.browser.getVersion =  function() {

    var detectedEngine = UNOUNO.engine.known[UNOUNO.engine.getName()];
    var agent = navigator.userAgent;
    var reg = new RegExp("(" + detectedEngine + ")(/| )([0-9]+\.[0-9])");
    var match = agent.match(reg);
    if (!match) {
        return "";
    }

    var name = match[1].toLowerCase();
    var version = match[3];

    // Support new style version string used by Opera and Safari
    if (agent.match(/Version(\/| )([0-9]+\.[0-9])/)) {
        version = RegExp.$2;
    }

    if (UNOUNO.engine.getName() == "mshtml")
    {
        // Use the Engine version, because IE8 and higher change the user agent
        // string to an older version in compatibility mode
        version = UNOUNO.engine.getVersion();
    }

    if (UNOUNO.engine.getName() == "webkit" ||
        UNOUNO.browser.getName() == "opera")
    {
        if (agent.match(/OPR(\/| )([0-9]+\.[0-9])/)) {
            version = RegExp.$2;
        }
        if (agent.match(/Edge\/([\d+\.*]+)/)) {
            version = RegExp.$1;
        }
    }

    return version;
};

UNOUNO.device.getType = function() {

    var userAgentString = navigator.userAgent;

    if(UNOUNO.device.detectTabletDevice(userAgentString)){
        return "tablet";
    } else if (UNOUNO.device.detectMobileDevice(userAgentString)){
        return "mobile";
    }

    return "desktop";
};

UNOUNO.device.detectMobileDevice = function(userAgentString){
    return /android.+mobile|ip(hone|od)|bada\/|blackberry|BB10|maemo|opera m(ob|in)i|fennec|NetFront|phone|psp|symbian|IEMobile|windows (ce|phone)|xda/i.test(userAgentString);
};

/**
 * Detects if a device is a tablet device.
 * @param userAgentString {String} userAgent parameter, needed for decision.
 * @return {Boolean} Flag which indicates whether it is a tablet device.
 */
UNOUNO.device.detectTabletDevice = function(userAgentString){
    var isIE10Tablet = (/MSIE 10/i.test(userAgentString)) && (/ARM/i.test(userAgentString)) && !(/windows phone/i.test(userAgentString));
    var isCommonTablet = (!(/android.+mobile|Tablet PC/i.test(userAgentString)) && (/Android|ipad|tablet|playbook|silk|kindle|psp/i.test(userAgentString)));

    return  isIE10Tablet || isCommonTablet;
};
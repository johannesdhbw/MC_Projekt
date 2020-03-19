// CISOFP-670 UTM-Parameter

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var params = getUrlVars();
var source, campaign, term, medium, content = null;

if (typeof params['utm_medium'] !== 'undefined') {
    var medium = params['utm_medium'];
}

if (typeof params['utm_source'] !== 'undefined') {
    var source = params['utm_source'];
}

if (typeof params['utm_campaign'] !== 'undefined') {
    var campaign = params['utm_campaign'];
}

if (typeof params['utm_term'] !== 'undefined') {
    var term = params['utm_term'];
}

if (typeof params['utm_content'] !== 'undefined') {
    var content = params['utm_content'];
}

if (source != null && campaign != null) {
    s.eVar25 = s.prop29 = source + '|' + campaign;
}

if (term != null && medium != null && content != null) {
    s.eVar72 = term + '|' + medium + '|' + content;
}
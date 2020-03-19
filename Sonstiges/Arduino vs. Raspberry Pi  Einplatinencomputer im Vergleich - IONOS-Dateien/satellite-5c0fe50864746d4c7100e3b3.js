_satellite.pushBlockingScript(function(event, target, $variables){
  var triggerMarketingPixels = function() {

  NSfTIF.track({
    'pageidentifier': document.location.pathname,
    'referrer_touchpoint': (document.referrer.split(document.location.host).length>1)?document.referrer.split(document.location.host)[1].match(/^\/?([a-z]*)\/?/)[1]:'',
    'request_touchpoint': document.location.pathname.match(/^\/?([a-z]*)\/?/)[1],
    'tenant': '1&1 IONOS SE',
    'brand': '1&1 IONOS',
    'content_language': $("meta[property='og:locale']").attr('content'),
    'market': $("meta[property='og:locale']").attr('content').split("_")[1],
    'page_id': ($('body').attr('class'))?$('body').attr('class').substr($('body').attr('class').indexOf(' ')+6):'',
    'main_topic': document.location.pathname.split("/")[2],
    'sub_topic': document.location.pathname.split("/")[3],
    'subject': document.location.pathname.split("/")[4],
    'pixel_type': 'cp',
  });

};

window.addEventListener("load", function() {
  if (typeof window.privacyConsentInstance === "undefined") {
	  window.privacyConsentInstance = new PrivacyConsent({ whitelist: true });
	}

  window.privacyConsentInstance.invoke(
    triggerMarketingPixels,
    PrivacyConsentEnum.MARKETING,
    window.privacyConsentInstance,
    true
  );

  window.privacyConsentInstance.initialize();
});
});

(function($) {
    $('#form_newsletter').submit(function(){
		if (!$('#valid_age').is(':checked') || !$('#valid_consent').is(':checked')){
			$('#erreur_newsletter').show();
			event.preventDefault();
		}
	});
})(jQuery);
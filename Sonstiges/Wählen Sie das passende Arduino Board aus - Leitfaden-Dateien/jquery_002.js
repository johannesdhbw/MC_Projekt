(function($) {
    $(document).ready(function(){
        $("#search_query_top").autocomplete({
            source: function(){
                searchQueryAutocomplete($("#search_query_top"));
            },
            minLenght: 3,
            autoFocus: true
        });

        $("#search_query_top_responsive").autocomplete({
            source: function(){
                searchQueryAutocomplete($("#search_query_top_responsive"));
            },
            minLenght: 3,
            autoFocus: true
        });


    });

    function searchQueryAutocomplete($searchQueryTop){
        var lang_id = $('html').attr('lang');

        if(lang_id == "fr-FR"){
            lang_id = 5;
        } else if(lang_id == "de-DE"){
            lang_id = 3;
        } else if (lang_id == "en-US"){
            lang_id = 1;
        } else {
            lang_id = 1;
        }

        if ($searchQueryTop.val().length > 2){
            $searchQueryTop.addClass('ac_loading');
        }
        $.ajax({
            url:"/modules/snsquicksearch/snsquicksearch_ajax.php",
            dataType: "json",
            data: {
                ajaxSearch: 1,
                id_lang: lang_id,
                q: $searchQueryTop.val()
            }
        }).done(function(data) {
            var $acResultsUl = $searchQueryTop.closest('form').next('.ac_results').find('ul');
            $acResultsUl.html('');
            var mytab = [];

            for (var i = 0; i < data.length; i++) {
                if (i < 5) {
                    mytab[mytab.length] = { data: data[i], value: '<li><a href="' + data[i].product_link + '"><div class="img"><img src="' + data[i].product_image + '" alt="' + data[i].pname + '" /></div>' + '<span class="ac_product_name">' + data[i].pname + '</span></a></li>' };
                    $acResultsUl.append($(mytab[i].value)).show();
                }
            }
            $searchQueryTop.closest('form').next('.ac_results').show();

            /*$searchQueryTop.on('focusout', function(){
                $(this).closest('form').next('.ac_results').hide();
            });*/

            $searchQueryTop.removeClass('ac_loading');
        });
    }
})(jQuery);
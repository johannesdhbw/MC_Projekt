function activateParentMenu(e,type) {
    //alert(type);
    if(type == 'element') {
        $(e).parents('.adtm_column').children('h5').children('a').addClass('advtm_menu_actif');
        $(e).parents('.li-niveau1').children('a').addClass('advtm_menu_actif');

    }
    if(type == 'column') {
        $(e).parents('.li-niveau1').children('a').addClass('advtm_menu_actif');
    }

}
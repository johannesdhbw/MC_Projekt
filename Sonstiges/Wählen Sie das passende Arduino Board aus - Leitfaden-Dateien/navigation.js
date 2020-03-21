/**
 * navigation.js
 *
 * Handles toggling the navigation menu for small screens.
 */
( function() {
	var nav = document.getElementById( 'site-navigation' ), button, menu;
	if ( ! nav )
		return;
	button = nav.getElementsByTagName( 'h3' )[0];
	menu   = nav.getElementsByTagName( 'ul' )[0];
	if ( ! button )
		return;

	// Hide button if menu is missing or empty.
	if ( ! menu || ! menu.childNodes.length ) {
		button.style.display = 'none';
		return;
	}

	button.onclick = function() {
		if ( -1 == menu.className.indexOf( 'nav-menu' ) )
			menu.className = 'nav-menu';

		if ( -1 != button.className.indexOf( 'toggled-on' ) ) {
			button.className = button.className.replace( ' toggled-on', '' );
			menu.className = menu.className.replace( ' toggled-on', '' );
		} else {
			button.className += ' toggled-on';
			menu.className += ' toggled-on';
		}
	};
} )();

document.addEventListener('DOMContentLoaded', function() {
    var bodyClasses = document.getElementsByTagName('body')[0].className;
    document.getElementById('responsiveMenuOpener').addEventListener('click', function(){
        document.getElementsByTagName('body')[0].className = bodyClasses + ' responsiveMenuOpen';
    });
    document.getElementById('menuOverlay').addEventListener('click', function(){
        document.getElementsByTagName('body')[0].className = bodyClasses;
    });

    document.getElementById('return-top').addEventListener('click', function(){
        window.scrollToTop(200);
    });

    window.addEventListener('scroll', function(){
        if (window.scrollY > 200){
            document.getElementById('return-top').style.opacity = 1;
        } else {
            document.getElementById('return-top').style.opacity = 0;
        }
    });
});

function scrollToTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
        scrollInterval = setInterval(function(){
            if ( window.scrollY != 0 ) {
                window.scrollBy( 0, scrollStep );
            }
            else clearInterval(scrollInterval);
        },15);
}

/*
document.addEventListener('DOMContentLoaded', function(){
    var bodyClasses = document.getElementsByTagName('body')[0].className;
    addClassResponsive(bodyClasses);

    window.addEventListener('resize', function(){
        addClassResponsive(bodyClasses);
    });
});

function addClassResponsive(bodyClasses){
    if(window.innerWidth <= 991){
        if(window.innerWidth <= 767){
            document.getElementsByTagName('body')[0].className = bodyClasses + ' mobile';
        } else {
            document.getElementsByTagName('body')[0].className = bodyClasses + ' tablet';
        }
    }
}*/
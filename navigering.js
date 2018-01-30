$(document).ready(function() {

	// väljer ut externa länkar och öppnar dem i ett nytt fönster (eller flik) 
	$('a[href^="http://"], a[href^="https://"]').attr('target', '_blank');

	// öppnar ett fönster med länk till "Tennis med Dennis"
	$('#knapp').click(function() {
		var fonster1 = window.open('tennis.html', 'fonster1', 'width=650, height=465');
		fonster1.document.write('<p>Nu har du öppnat fönster 1</p>');
	});

	// visar/döljer texten i index.htmls <article>-element
	$('#text').click(function() {
		if ($('.content').css('display') == 'none') {
			$('.content').css('display', 'block');
		}
		else {
			$('.content').css('display', 'none');
		}
	}); // end click

	$('img').hover(function(){
		$(this).css({'position': 'absolute',
					'z-index': '5',
					'width': '150%',
   					'right': '-25%',
   					'top': '-25%',

   				});
		$(this).next().css({'display': 'inline',
							'font-size': '5em',
							'z-index': '20'});
	},
		function(){
			$(this).css({'width': '100%',
					'position': 'static'});
			$(this).next().css('display', 'none');
		}); // end hover

}); // end ready
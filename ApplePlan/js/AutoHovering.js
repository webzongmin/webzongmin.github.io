$(document).ready(function() {
			$("html,body").animate({scrollTop: $("section").offset().top},2);
			$(window).scroll( function (){   
			var  h_num=$(window).scrollTop();   
			     if (h_num>200){   
			        $( '.nav' ).addClass( 'navFixed' );       
			    } else {   
			        $( '.nav' ).removeClass( 'navFixed' );            
			    }              
			})
		
}); 
			 
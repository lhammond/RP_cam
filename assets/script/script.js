
$(document).ready(function(){

    // this is not for production

    $("#submit").on('click', function(){
        window.location = "snapshot.php";
    })

    // end this is not for production

    
	$("table.linked tr a").hover(function(){

		// $(this)
		// .closest('tr')
		// .find('a')
		// .toggleClass('active');
	
	})

	$("table.linked tr a").touchstart(function(){

			// $(this)
			// .closest('tr')
			// .find('a')
			// .toggleClass('active');
		
		})


});

$( document ).on( "pageinit", "[data-role='page']", function() {

    console.log('init');

});

    $(document).on('swipeleft', '[data-role="page"]', function(event){   
    console.log('running') 
    if(event.handled !== true) // This will prevent event triggering more then once
    {    

        var nextpage = $(this).next('[data-role="page"]');
        var nextClass = nextpage.attr("class");
        console.log("next page: " + nextpage)
        
        
        // swipe using id of next page if exists
        if (nextpage.length > 0) {
            $.mobile.changePage(nextpage, {transition: "slide", reverse: false}, true, true);
        }
        event.handled = true;
    }
    return false;         
});

$(document).on('swiperight', '[data-role="page"]', function(event){   
    if(event.handled !== true) // This will prevent event triggering more then once
    {      
        var prevpage = $(this).prev('[data-role="page"]');
        if (prevpage.length > 0) {
            $.mobile.changePage(prevpage, {transition: "slide", reverse: true}, true, true);
        }
        event.handled = true;
    }
    return false;            
    
});




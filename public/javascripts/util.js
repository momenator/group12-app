$(window).load(function(){
	$("#search-results-container,#image-page,#index-page").fadeIn(1000);
});

$(document).ready(function(){
	 $('input[type="radio"]').click(function(){
        if($(this).attr("value")=="title"){
        	console.log("title");
            $('#query').attr("action", "/search");
        }
        if($(this).attr("value")=="alchemy"){
        			            	console.log("alchemy");

            $('#query').attr("action", "/searchAlchemyTags");
        }
        if($(this).attr("value")=="imagga"){
        			   console.log("imagga");

            $('#query').attr("action", "/searchImaggaTags");
        }
    });
});
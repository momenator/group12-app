$(window).load(function(){
	$("#search-results-container,#image-page,#index-page").fadeIn(1000);
});

$(document).ready(function(){
	$('input[type="radio"]').click(function(){
        if($(this).attr("value")=="title"){
        	console.log("title");
            $('#query').attr("action", "/search");
        }
        if($(this).attr("value")=="tags"){
                       console.log("tags");

            $('#query').attr("action", "/searchTags");
        }
    });
    $('.tag').click(function(){
        var keywords = String($(this).html()).split(" ");
        var tagName = keywords[0];
        if (keywords[1] != ':' && keywords[1] != ' '){
            tagName = keywords[0] + ' ' + keywords[1];
        }
        $('.tag-name').html('"' + tagName + '"');
        $('.search-tag-btn').attr("href", "/searchTags/" + tagName);
    });
});
$(window).load(function(){
	$("#search-results-container,#image-page,#index-page").fadeIn(1000);
    if($('#by-title').is(':checked')) { 
        //alert("it's checked"); 
        $('#query').attr("action", "/search");
    } else {
        $('#query').attr("action", "/searchTags");
    }

    var container = document.querySelector('#columns');
    var msnry = new Masonry( container, {
        // options
        columnWidth: 20,
        itemSelector: '.pin'
    });
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
    $(document.body).on('click', '.tag', function(){
        var keywords = String($(this).html()).split(" ");
        var tagName = keywords[0];
        if (keywords[1] != ':' && keywords[1] != ' ' & keywords[1] != undefined){
            tagName = keywords[0] + ' ' + keywords[1];
        }

        $('.tag-name').html('"' + tagName + '"');
        
        $.ajax({
            method : "GET",
            url : "http://localhost:3000/api/getCoOccuringTags/" + tagName
        }).done(function (data){
            console.log(data['coOccuringTags']);
            $('#tags-in-modal').empty();
            for(var i = 0; i < data['coOccuringTags'].length; i++){
                console.log('inserting tags');
                $('#tags-in-modal').append(
                    '<a class="tag modal-tags" href="javascript:void(0)">'
                    + data['coOccuringTags'][i] 
                    + '</a>');
            }
        });
        
        $('.search-tag-btn').attr("href", "/searchTags/" + tagName);
    });
});
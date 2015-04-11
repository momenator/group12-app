$(window).load(function(){
	$("#search-results-container,#image-page,#index-page").fadeIn(1000);
    if($('#by-title').is(':checked')) { 
        //alert("it's checked"); 
        $('#query').attr("action", "/search");
    } else {
        $('#query').attr("action", "/searchTags");
    }
    if (document.URL.indexOf('searchTags') > 0){
        var container = document.querySelector('#columns');
        var msnry = new Masonry( container, {
            // options
            columnWidth: 20,
            itemSelector: '.pin'
        });
    }  

    if (document.URL.indexOf('stats') > 0){
        $('#image-page').css('visibility', 'hidden');

        var genGraph = function (selector, data, seriesName, title, titleYAxis, pointFormat) {
            $(selector).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: titleYAxis
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: pointFormat
                },
                series: [{
                    name: seriesName,
                    data: data,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:,.0f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        };

        $.ajax({
            method: 'GET',
            url : window.location.protocol + window.location.hostname + '/api/getStatistics'
        }).done(function (data){

            var alchemyData = [];
            var imaggaData = [];
            var topAlchemyTags = data['topTenAlchemyTags'];
            var topImaggaTags = data['topTenImaggaTags'];
            $('#stat1').html(data['collectionSize']);
            $('#stat2').html(data['taggedImages']);
            $('#stat3').html(data['eitherNullTags']);
            $('#stat4').html(data['bothTags']);
            $('#stat5').html(data['bothNullTags']);

            if (topAlchemyTags != undefined && topAlchemyTags.length > 0){

                for (var i = 0; i < topAlchemyTags.length; i++){
                    alchemyData.push([topAlchemyTags[i]['_id'],topAlchemyTags[i]['number']]);
                }
                genGraph('#alchemy-tags',alchemyData, 'Images', 'Top 10 Alchemy Tags', 'Number of Images', 'Tag occurrences : <b>{point.y:,.0f}</b>');
            }

            if (topImaggaTags != undefined && topImaggaTags.length > 0) {

                for (var i = 0;i<  topImaggaTags.length; i++ ){
                    imaggaData.push([topImaggaTags[i]['_id'], topImaggaTags[i]['number']] );
                }
                genGraph('#imagga-tags',imaggaData,'Images', 'Top 10 Imagga Tags', 'Number of Images', 'Tag occurrences : <b>{point.y:,.0f}</b>');
            }
            $('#image-page').css('visibility', 'visible');
        });
    } 
});

$(document).ready(function(){
	$('input[type="radio"]').click(function(){
        if($(this).attr("value")=="title"){
            $('#query').attr("action", "/search");
        }
        if($(this).attr("value")=="tags"){

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
            url :window.location.protocol + window.location.hostname + "/api/getCoOccuringTags/" + tagName
        }).done(function (data){
            $('#tags-in-modal').empty();
            for(var i = 0; i < data['coOccuringTags'].length; i++){
                $('#tags-in-modal').append(
                    '<a class="tag modal-tags" href="javascript:void(0)">'
                    + data['coOccuringTags'][i] 
                    + '</a>');
            }
        });
        
        $('.search-tag-btn').attr("href", "/searchTags/" + tagName);
    });
});
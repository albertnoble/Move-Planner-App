
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var street = $('#street').val();
    var city = $('#city').val();

    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+street+', '+city+'">');
    
    var nyturl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+city + '&sort=newest&api-key=f7f7e5c4d4df4917a1570e2f6cbd061f';
    
    $.getJSON( nyturl, function( data ) {
      $nytHeaderElem.text('New York Times Articles About' + city);
     
      articles = data.response.docs;
      for(var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+
                '</a>'+
                '<p>' + article.snippet + '</p>'+
                '</li>');
      };
      
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    })
    
    //Wikipedia Ajax request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+city+
    '&format=json&callback=wikiCallback';
    
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    },8000);
    
    $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        success: function(response){
            var articleList = response[1];
            
            for(var i = 0; i < articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+
                    articleStr+'</a></li>');
            }
            
            clearTimeout(wikiRequestTimeout);
        }
    });    
    
    
    return false;
    
};

$('#form-container').submit(loadData);

var HY_NEW_STORIES = "https://hacker-news.firebaseio.com/v0/newstories.json";
var HY_TOP_STORIES = "https://hacker-news.firebaseio.com/v0/topstories.json";
var TOTAL_DISPLAY_STORIES = 10;
var CURRENT_DISPLAY_STORIES_AMT = 0;
var INCREMENT = 10;

/* 
	1. generate page structure
	2. grab info from HN
	3. fill the info into the page
*/ 
function onload(){
	// generate page structure with callback function
	var div = document.getElementById('mainDisplayDiv');
	
	var result = getHYTopStories();

	for (i = CURRENT_DISPLAY_STORIES_AMT; i<TOTAL_DISPLAY_STORIES; i++){
		div.innerHTML = div.innerHTML 
			+ "<div class='story'>"
				+ "<div class='storyContent storyTT'><div class='storyTTText'></div></div>"
				+ "<div class='storyContent storyFN'>"
					
				+ "</div>"
				+ "<div class='storyContent storyPV' url='' onclick='' style=''>"
					
				+ "</div>"
			+ "</div>";
	}
	
	setStory(result);
	
}

// function to redirect to URL
function redirect(url){
	//var story = document.getElementById("pv"+id);
	window.open(url);
}

// add unique id to story divs and their inner divs.
function setStory(result){
	// pull all of the stories and components divs
	var stories = document.getElementsByClassName("story");
	var titles = document.getElementsByClassName("storyContent storyTT");
	var titleContents = document.getElementsByClassName("storyTTText");
	var functions = document.getElementsByClassName("storyContent storyFN");
	var previews = document.getElementsByClassName("storyContent storyPV");
	
	for(i = CURRENT_DISPLAY_STORIES_AMT; i<TOTAL_DISPLAY_STORIES; i++){
		if(stories[i].id.length == 0){ // check if the story iv already have a story attached
			var t = i-CURRENT_DISPLAY_STORIES_AMT;
			
			// set the main story wrapper div id
			stories[i].id = 'st' + result[t].id;
			
			// set the story title div id
			titles[i].id = 'tt' + result[t].id;
			titles[i].setAttribute("url",result[t].url);
			
			// set the story title content
			titleContents[i].id = 'ttct' + result[t].id;
			titleContents[i].innerHTML += result[t].title;
			
			// set the story button div id
			functions[i].id = 'rs' + result[t].id;
			
			// set the story preview div id
			previews[i].id = 'pv' + result[t].id;
			// set the preview's url
			previews[i].setAttribute("url",result[t].url);
			previews[i].setAttribute("onclick", "redirect(this.getAttribute('url'))");
			
			titles[i].setAttribute("onclick", "togglePreview(this.id)");
			
		}
	}
	
	CURRENT_DISPLAY_STORIES_AMT = TOTAL_DISPLAY_STORIES;	
}


/*
	add new divs into the mainDisplayDiv
*/
function appendDiv(){
    TOTAL_DISPLAY_STORIES = TOTAL_DISPLAY_STORIES + INCREMENT;
	
	var div = document.getElementById('mainDisplayDiv');
	
	for (i = CURRENT_DISPLAY_STORIES_AMT; i<TOTAL_DISPLAY_STORIES; i++){
		div.innerHTML = div.innerHTML 
			+ "<div class='story'>"
				+ "<div class='storyContent storyTT'>"
					+ "<div class='storyTTText'></div>"
				+ "</div>"
				+ "<div class='storyContent storyFN'>"
					
				+ "</div>"
				+ "<div class='storyContent storyPV' url='' onclick='' style=''>"
					
				+ "</div>"
			+ "</div>";
	}
	
}

/* 
	showmore button function.
	1. add new empty divs
	2. fill content in
*/
function showMore() {
	appendDiv();
	var result = getHYTopStories();
	
	setStory(result);
	
}



// toggle visibility of a preview
function togglePreview(id) {
	
	var pvid='pv'+id.substring(2,9);
	var pv = document.getElementById(pvid);
	
	
	$("#" + pvid).animate({
			height: 'toggle',
			margin: 'toggle'
	}, 100);

}




function HY_GET_STORY_BY_ID(id) { // get story by id
    return "https://hacker-news.firebaseio.com/v0/item/" + id + ".json";
}

function getHYTopStories() {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", HY_TOP_STORIES, false);
    xmlHttp.send(null);

    if (IDs == null) {
        var IDs = JSON.parse(xmlHttp.responseText);
        storyIntegers = IDs;
    }

    var result = [];
    for (var i = TOTAL_DISPLAY_STORIES - INCREMENT; i < TOTAL_DISPLAY_STORIES; ++i) {
        result.push(JSON.parse(getHYStoryByID(storyIntegers[i])));
    } // for
    return result;
}

function getHYStoryByID(id) {
    var url = HY_GET_STORY_BY_ID(id);
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
} // getHYSTORyByID


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Content pulling block %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function getLink(url, callBack) {
	var q = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + url + '" and xpath="//title|//head/meta"') + '&format=json&callback=?';
	
	//console.log(q);
	getContent(url, q, function(text)
	{
		callBack(text);
	});
}

function getContent(url, q, callBack){
	var text ='placeholder';
	$.ajax({
		type: 'GET',
		url: q,
		dataType: 'jsonp',
		success: function(data, textStatus) {
			// make sure we have some data to work with
			if (results) {

				// will contain only the data we want to display
				var result = {};

				// use the html title as the title
				result.title = results.title;

				// loop through meta tags to grab the image & description
				$.each(data.query.results.meta, function(key, val) {
					if (val.content) {
						// description
						if (val.name && val.name == 'description') {
							result.description = val.content;
						}
						
						

						// og:image (Facebook image) -- starts with http:// and has a . 4 characters from the end
						if (val.content.substring(0, 7) == 'http://' && val.content.charAt(val.content.length - 4) == '.') {
							if (val.content != 'undefined') {
								result.img = val.content;
							}
						}
					}
				});
				// build output
				text = '<div><h1>' + result.title + '</h1>';
				text += result.img ? '<img src="' + result.img + '" class="thumb"/>' : '';
				text += '<p>' + result.description + '</p></div>';
				
			callBack(text);
			}
		}
	});
}


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Content pulling block %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


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
				+ "<div class='storyContent storyTT'></div>"
				+ "<div class='storyContent storyFN'>"
					
				+ "</div>"
				+ "<div class='storyContent storyPV'>"
					
				+ "</div>"
			+ "</div>";
	}
	testBTFV();
	setStoryID(result);
}



function testBTRV(){
	window.location.href="https://www.google.com";
}

function testBTFV(){
	console.log("testing story titles loaded.");
}


function setStoryID(result){
	var stories = document.getElementsByClassName("story");
	var titles = document.getElementsByClassName("storyContent storyTT");
	var functions = document.getElementsByClassName("storyContent storyFN");
	var previews = document.getElementsByClassName("storyContent storyPV");
	for(i = CURRENT_DISPLAY_STORIES_AMT; i<TOTAL_DISPLAY_STORIES; i++){
		if(stories[i].id.length == 0){ // check if the story iv already have a story attached
			// set the main story wrapper div id
			stories[i].id = result[i].id;
			// set the story title div id
			titles[i].id = result[i].id;
			// set the story button div id
			functions[i].id = result[i].id;
			// set the story preview div id
			previews[i].id = result[i].id;
			
			// set the story title content
			titles[i].innerHTML += result[i].title;
		}
	}
	CURRENT_DISPLAY_STORIES_AMT = TOTAL_DISPLAY_STORIES;
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
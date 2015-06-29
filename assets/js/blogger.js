/* Generates initial blogs and allows search functionality  in site
 * Initially displays must current blogs and then as keywords are searched for
 * blogs are displayed at the bottom.
 * Pagination assisted by jquery.bootpag
 * Highlighting assisted by jquery.highlight
*/
$(document).ready(getblog);


/* Initial Blogs are generated to display the 5 most current blogs.
*/
function getblog(){
	//clears search fields on initial load
	$('#search-top').val("");
	$('#search-bottom').val("");
	
	$.getJSON('entries.json', function(data) {
		var numBlogs = data.entries.length;
		var blogEntries = []; //will store 5 most current blogs if available
		var blogNum = 5; //number of blogs to display for pagination
		var pageDiv = Math.floor(numBlogs/blogNum)+1; //creates number of pages to display for pagination
		var pageLast = numBlogs % blogNum; //generates number of blogs to display on last page
		//conditional to determine the starting and ending point for the initial blogs to display.
		if (numBlogs > 5){
			var firstKey = numBlogs - 5;
		}
		else{
			firstKey = 0;
		};
		//pushes each entry to blogEntries to deal with at most 5 blogs.
		for (var counter = firstKey; counter<numBlogs; counter++){
			blogEntries.push(data.entries[counter]);
		};
		//iterates over each of the blog entries and prepends the blog to index.html for diplay
		$.each(blogEntries, function(key, val) {
			var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
							val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
							"</p><hr/></div>";
			$('#blog').prepend(message);
		});//end of each loop
	 
		/* initial creation for pagination for blogs. Refers to page-selection div on index.html
		* total refers to total number of page buttons or numbers, maxVisible refers to how many to display at one time.
		* num refers to the number selected by user for page.
		*/
		$('#page-selection').bootpag({
			total: pageDiv,
			next: "next",
			prev: "prev",
			maxVisible: 4
			}).on("page", function(event, num){
			$('#blog').empty();//clears current blog section for page rebuild of blogs.
			pager(num); // pager will generate new blogs based on page number selected.
			$(this).bootpag({total: pageDiv, maxVisible: 4});
			});
	}); //end of getJSON function
} //end of getblog function


/* generates new blog posts based on page number selected
 * some of the same variables are generated in pager because I needed to access the JSON data.
*/
function pager(num){
		$.getJSON('entries.json', function(data) {
			var blogNum = 5; // max number of blog posts to display per page
			var blogEntries = []; // initialize empty array to store new blog posts for page
			var numBlogs = data.entries.length;
			var pageLast = numBlogs % blogNum;
			var numPages = Math.ceil(numBlogs/blogNum); // generates max number of pages needed for blogs based on number of entries.
			//conditional used to determine starting and stopping point for blogs.
			if (num >= numPages){
				var firstKey = 0;
				var lastKey = pageLast;
			}
			else{
				firstKey = numBlogs - num*5;
				lastKey = firstKey + 5;
			};
			// pushes new blog entries into empty array
			for (counter = firstKey; counter<lastKey; counter++){
				blogEntries.push(data.entries[counter]);
			};
			//iterates over each of the blog entries and prepends the blog to index.html for diplay
			$.each(blogEntries, function(key, val) {
				var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
				val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
				"</p><hr/></div>";
				$('#blog').prepend(message);
			});// end of each loop
		});// end of getJSON function
}// end of pager function

/* activates when bottom search text is entered. Focus is generated back to top,
 * text is transferred from bottom and input box is hidden on keyup, and search function is activated (performSearch)
*/
$("#search-bottom").keyup(function(e){
	bottomSearch = $("#search-bottom").val();
	$("#search-top").val(bottomSearch);
	performSearch();
	$('#search-top').focus();
	$('#search-bottom').val("");
	$("#search-bottom").hide();
})

//performSearch is actived when keyup event is initiated.
$("#search-top").keyup(function(e){
		performSearch();
})

//helper function used to strip whitespace from inside text values entered in search fields.
function stripWhiteSpace(value){
	noSpaceValue = value.split(" ").join("");
	return noSpaceValue
}

/* main search engine used to get search value, hide/show appropriate html div's,
 * generate new blogs to display on bottom, and then highlight any search terms found.
 * uses jquery.highlight for highlighting and unhighlighting items found in body.
*/
function performSearch(){
	$("body").unhighlight(); // unhighlight any words found previously
	var searchValue = $("#search-top").val();
	searchValue = stripWhiteSpace(searchValue);// eliminate white space in search term.
	var count = 0; //used to display the number of blogs
	if (searchValue.length > 0){
		$('#blog').hide();
		$('#search-count').show();
		$('#page-selection').hide();
		$('#page-selection2').show();
		var blogs = searchResults(searchValue);
		}
	else{
		$('#blog').show();
		$('#page-selection').show();
		$('#page-selection2').hide();
		$("body").unhighlight();
		$('#search-count').hide();
		$('#search-bottom').show();
		}
}

/* displays number of blogs containing search word underneath top search bar
 * calls getblog2 to generate new blogs based on search words and paginates them if necessary
 */
function searchResults(word){
	var blogEntries = [];
	$.getJSON('entries.json', function(data) {
		var count = 0;
		$.each(data.entries, function(key, val) {
			var text = val.text;
			var patt = new RegExp(word);
			var res = patt.test(text);
		if (res == true){
		  count += 1;
		  blogEntries.push(val);
	  }
	 })
	 var blogLength = blogEntries.length;
	 $('#search-count').empty();
	 $('#search-count').append('<p>Total Blogs Found with Search Word: '+count+'</p>');
	getblog2(blogEntries,word); 
	});	
}

/* based on search word, generates new blogs to display and highlights word found in blog.
 * displays max of 5 at a time. Follows similar search procedure to getblog.
 */
function getblog2(blogs,word){
		var blogLength = blogs.length;
		$('#blog2').empty();
		var finalBlog = [];
		var blogNum = 5;
		var pageDiv = Math.floor(blogLength/blogNum)+1
		var pageLast = blogLength % blogNum;
		if (blogLength > 5){
			var firstKey = blogLength - 5;
		}
		else{
			var firstKey = 0;
		}
		for (var counter = firstKey; counter<blogLength; counter++){
			finalBlog.push(blogs[counter]);
		}
		$.each(finalBlog, function(key, val) {
		var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
		val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
		"</p><hr/></div>";
		$('#blog2').prepend(message);
		})
		$("body").highlight(word);
	$('#page-selection2').bootpag({
    total: pageDiv,
	next: "next",
	prev: "prev",
	maxVisible: 4
	}).on("page", function(event, num){
	$('#blog2').empty();
	var finalBlogs = [];
	var totalNumber = pageDiv;
	totalNumber = Math.ceil(Number(totalNumber)/5);
	var blogNum = 5;
	var pageLast = blogLength % blogNum;
	var numPages = Math.ceil(blogLength/blogNum);
		if (num >= numPages){
			var firstKey = 0;
			var lastKey = pageLast;
		}
		else{
			if (finalBlog.length < 6){
				firstKey = 0;
				lastKey = pageLast;
			}
			firstKey = blogLength - num*5;
			lastKey = firstKey + 5;
		}

	for (var counter = firstKey; counter<lastKey; counter++){
			finalBlogs.push(blogs[counter])
		}
     $.each(finalBlogs, function(key, val) {
	  var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
	  val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
	  "</p><hr/></div>";
	  $('#blog2').prepend(message);
	  $("body").unhighlight();
	  $("body").highlight(word);
	 })
	})
    // ... after content load -> change total to 10
    $(this).bootpag({total: pageDiv, maxVisible: 4});
};


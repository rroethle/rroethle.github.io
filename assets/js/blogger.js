$(document).ready(getblog);



function getblog(){
	$('#search-second').val("")
	$('#search2').val("")
	$.getJSON('entries.json', function(data) {
		var numBlogs = data.entries.length
		var blogEntries = []
		var blogNum = 5
		var pageDiv = Math.floor(numBlogs/blogNum)+1
		var pageLast = numBlogs % blogNum
		if (numBlogs > 5){
			var firstKey = numBlogs - 5
		}
		else{
			firstKey = 1
		}
		for (var counter = firstKey; counter<numBlogs; counter++){
			blogEntries.push(data.entries[counter])
		}
     $.each(blogEntries, function(key, val) {
	  var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
	  val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
	  "</p><hr/></div>"
	  $('#blog').prepend(message)
	 })
	 
	 $('#page-selection').bootpag({
    total: pageDiv,
	next: "next",
	prev: "prev",
	maxVisible: 4
	}).on("page", function(event, num){
	$('#blog').empty()
	var totalNumber = pageDiv
	totalNumber = Math.ceil(Number(totalNumber)/5)
	
    pager(num) // or some ajax content loading...
 
    // ... after content load -> change total to 10
    $(this).bootpag({total: pageDiv, maxVisible: 4});
 
});
	 
	})
}



function pager(num){
		$.getJSON('entries.json', function(data) {
		var blogNum = 5
		var blogEntries = []
		var numBlogs = data.entries.length
		var pageLast = numBlogs % blogNum
		var numPages = Math.ceil(numBlogs/blogNum)
		if (num >= numPages){
			var firstKey = 0
			var lastKey = pageLast
		}
		else{
			firstKey = numBlogs - num*5
			lastKey = firstKey + 5
		}

		
		for (counter = firstKey; counter<lastKey; counter++){
			blogEntries.push(data.entries[counter])
		}
     $.each(blogEntries, function(key, val) {
	  message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
	  val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
	  "</p><hr/></div>"
	  $('#blog').prepend(message)
	 })
	})
}



$("#search2").keyup(function(e){
	bottomSearch = $("#search2").val()
	$("#search-second").val(bottomSearch)
	performSearch()
	$('#search-second').focus()
	$('#search2').val("")
	$("#search2").hide()
})

$("#search-second").keyup(function(e){
		performSearch()
	})

	
function performSearch(){
	$("body").unhighlight();
		var searchValue = $("#search-second").val()
		var count = 0
		
		if (searchValue.length > 0){
			$('#blog').hide();
			$('#search-count').show();
			$('#page-selection').hide();
			$('#page-selection2').show();
			var blogs = searchResults(searchValue)
		}
		else{
			$('#blog').show();
			$('#page-selection').show();
			$('#page-selection2').hide();
			$("body").unhighlight();
			$('#search-count').hide();
			$('#search2').show()
		}
}

function searchResults(word){
	var blogEntries = [];
	$.getJSON('entries.json', function(data) {
		var count = 0
		$.each(data.entries, function(key, val) {
			var text = val.text
			var patt = new RegExp(word)
			var res = patt.test(text)
		if (res == true){
		  count += 1
		  blogEntries.push(val)
	  }
	 })
	 var blogLength = blogEntries.length
	 $('#search-count').empty()
	 $('#search-count').append('<p>Total Blogs Found with Search Word: '+count+'</p>')
	getblog2(blogEntries,word)
	
	 
	})
	
}

function getblog2(blogs,word){
		var blogLength = blogs.length
		$('#blog2').empty()
		var finalBlog = []
		var blogNum = 5
		var pageDiv = Math.floor(blogLength/blogNum)+1
		var pageLast = blogLength % blogNum
		if (blogLength > 5){
			var firstKey = blogLength - 5
		}
		else{
			var firstKey = 0
		}
		for (var counter = firstKey; counter<blogLength; counter++){
			finalBlog.push(blogs[counter])
		}
		$.each(finalBlog, function(key, val) {
		var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
		val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
		"</p><hr/></div>"
		$('#blog2').prepend(message)
		})
		$("body").highlight(word);
	$('#page-selection2').bootpag({
    total: pageDiv,
	next: "next",
	prev: "prev",
	maxVisible: 4
	}).on("page", function(event, num){
	$('#blog2').empty()
	var finalBlogs = []
	var totalNumber = pageDiv
	totalNumber = Math.ceil(Number(totalNumber)/5)
	var blogNum = 5
	var pageLast = blogLength % blogNum
	var numPages = Math.ceil(blogLength/blogNum)
		if (num >= numPages){
			var firstKey = 0
			var lastKey = pageLast
		}
		else{
			if (finalBlog.length < 6){
				firstKey = 0
				lastKey = pageLast
			}
			firstKey = blogLength - num*5
			lastKey = firstKey + 5
		}

	for (var counter = firstKey; counter<lastKey; counter++){
			finalBlogs.push(blogs[counter])
		}
     $.each(finalBlogs, function(key, val) {
	  var message = "<div id=" +key+ " class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
	  val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
	  "</p><hr/></div>"
	  $('#blog2').prepend(message)
	  $("body").unhighlight()
	  $("body").highlight(word);
	 })
	})
    // ... after content load -> change total to 10
    $(this).bootpag({total: pageDiv, maxVisible: 4});
};


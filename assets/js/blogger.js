$(document).ready(getblog);



function getblog(){
	
	$.getJSON('entries.json', function(data) {
		console.log(data)
     $.each(data.entries, function(key, val) {
      console.log(key)
	  console.log("Val" + val.title)
	  message = "<div id=" +key+ "class='col-sm-12 blogpost'><small><p class='muted' style='float:right;'>" + 
	  val.date + "</p></small><h5>" + val.title + "</h5><p>"+val.text+
	  "</p><hr/></div>"
	  $('#blog').append(message)
	  
	 })
	})
      /* $("#json").append(single);
      if((data.entries.length - 1) != key){
        $("#json").append(',<br />');
      } else {
        $("#json").append(',<br />');
        // new post
        var t = getdate();
        var h = $("input#h").val();
        var c = $("textarea#c").val();
        c = $("textarea#c").val().replace(/\n/g, "&lt;br&gt;");
        var added = '{"date":"' + t + '", "title":"' + h + '", "text":"' + c + '"}';
        $("#json").append(added);
        $("#json").append('<br />]}');
      }
    });
  });
  }) */
	
	/* <div id='key' class='col-sm-12 blogpost'> 
	<small>
    <p class='muted' style='float:right;'>Post date will go here.</p>
	</small>
  <h5>Post title will go here.</h5>
  <p>Post content will go here.</p>
  <hr/>
</div> */
}

/* function pager(){
	
	
} */
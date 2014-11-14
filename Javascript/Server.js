
var Server =
{
    /* Callback function to be set by client */
    dataReceivedCallback : null
    
};

Server.init = function()
{
    return true;
};

Server.fetchVideoList = function()
{

	$.ajax({
	    type: "GET",
	    url: "http://" + Data.getAppPref("IP") + "/web/movielist",
	    dataType: "xml",
	    success: loadMovies,
	    error: loadMoviesFail,
		context:  this
	  });

};

function loadMoviesFail(xml)
{
	alert('loadMoviesFail from: ' + xml);

}
function loadMovies(xml)
{

	var base = "http://" + Data.getAppPref("IP") + ":80/file?file=";
	
    var videoNames = [ ];
    var videoURLs = [ ];
    var videoDescriptions = [ ];
    var videoServiceNames = [ ];
    var videoLengths = [ ];
    var videoTimes = [ ];
    var videoDescriptionsExtended = [ ];
    var videoSummarys = [ ];
    
    var index = 0;
	  $(xml).find("e2movie").each(function()
	  {
			
		  var titleElement = 				($(this).find("e2title").text());
	      var linkElement = base + encodeURI($(this).find("e2filename").text());
	      var descriptionElement = 			($(this).find("e2description").text());
	      var descriptionExtendedElement = 	($(this).find("e2descriptionextended").text());
	      var serviceNameElement = 			($(this).find("e2servicename").text());
	      var lengthElement = 				($(this).find("e2length").text());
	      var timeElement = 				($(this).find("e2time").text());
	
	      if (titleElement && linkElement)
	      {
	    	  videoNames[index] = titleElement;
	          videoURLs[index] = linkElement;                        	
	          videoDescriptions[index] = descriptionElement;
	          
	          if (serviceNameElement)
	        	  videoServiceNames[index] = serviceNameElement;
	
	          if (descriptionExtendedElement)
	        	  videoDescriptionsExtended[index] = descriptionExtendedElement;
	          
	          if (lengthElement)
	        	  videoLengths[index] = lengthElement;
	          
	          if (timeElement)
	        	  videoTimes[index] = timeElement;
	          	  var summary =  getFormattedDate(timeElement) + "  [" + serviceNameElement + "]";
	          	  videoSummarys[index] = summary;
	
	          
	//          alert("#videoName: 	"+ titleElement);
	//          alert("	#videoURL:  	"+ videoURLs[index] );
	//          alert("	#serviceNameElement: 	"+ serviceNameElement);
	//          alert("	#descriptionExtendedElement: 	"+ descriptionExtendedElement);
	//          alert("	#lengthElement: 	"+ lengthElement);
	//          alert("	#timeElement: 	"+ timeElement);
	//          alert("	#summary: 	"+ summary);
	
	      }
	  
		  index ++;
		  
		  // This is enough to show the UI
		  if (index == 11){
			  Data.setVideoNames(videoNames);
			  Data.setVideoURLs(videoURLs);
			  Data.setVideoDescriptions(videoDescriptions);
			  Data.setVideoDescriptionsExtended(videoDescriptionsExtended);
			  Data.setVideoServiceNames(videoServiceNames);
			  Data.setVideoLengths(videoLengths);
			  Data.setVideoTimes(videoTimes);
			  Data.setVideoSummarys(videoSummarys);
			  
			  alert("#videoNames.length: (initial load)		" + videoNames.length);

			  if (this.dataReceivedCallback)
			  {
			      this.dataReceivedCallback();    /* Notify all data is received and stored */
			  }
		  }
	  });
 
  // All done.
  
  Data.setVideoNames(videoNames);
  Data.setVideoURLs(videoURLs);
  Data.setVideoDescriptions(videoDescriptions);
  Data.setVideoDescriptionsExtended(videoDescriptionsExtended);
  Data.setVideoServiceNames(videoServiceNames);
  Data.setVideoLengths(videoLengths);
  Data.setVideoTimes(videoTimes);
  Data.setVideoSummarys(videoSummarys);
  
  alert("#videoNames.length: (final load)		" + videoNames.length);

  if (this.dataReceivedCallback)
  {
      this.dataReceivedCallback();    /* Notify all data is received and stored */
  }

}
// From http://www.webdevelopersnotes.com/tips/html/finding_the_number_of_seconds_and_milliseconds.php3
function getFormattedDate(date)
{	
	var d = new Date(date * 1000);
	date_formatted = "";
	
	/**
	 * Get the date
	 */
	
	if(isDateToday(d)) {
		date_formatted = "today";
	}
	else if(isDateYesterday(d)) {
		date_formatted = "yesterday";
	}
	else {
		
		
		var d_names = new Array("Sun", "Mon", "Tues",
				"Wed", "Thurs", "Fri", "Sat");
	
		var m_names = new Array("Jan", "Febr", "Mar", 
		"Apr", "May", "June", "July", "Aug", "Sept", 
		"Oct", "Nov", "Dec");
	
		var curr_day = d.getDay();
		var curr_date = d.getDate();
		var sup = "";
		if (curr_date == 1 || curr_date == 21 || curr_date ==31)
		   {
		   sup = "st";
		   }
		else if (curr_date == 2 || curr_date == 22)
		   {
		   sup = "nd";
		   }
		else if (curr_date == 3 || curr_date == 23)
		   {
		   sup = "rd";
		   }
		else
		   {
		   sup = "th";
		   }
		var curr_month = d.getMonth();
		var curr_year = d.getFullYear();
	
	
		var date_formatted = d_names[curr_day] + " " + curr_date + "<SUP>"
		+ sup + "</SUP> " + m_names[curr_month] + " ";
	
		// Only add the year if its older
		if(new Date().getFullYear() != curr_year)
			date_formatted += curr_year;
		
	}
	
	
	
	/** 
	 * Get the hours/minutes
	 */
	var a_p = "";
	var curr_hour = d.getHours();
	if (curr_hour < 12)
	   {
	   a_p = "am";
	   }
	else
	   {
	   a_p = "pm";
	   }
	if (curr_hour == 0)
	   {
	   curr_hour = 12;
	   }
	if (curr_hour > 12)
	   {
	   curr_hour = curr_hour - 12;
	   }

	var curr_min = d.getMinutes();

	curr_min = curr_min + "";

	if (curr_min.length == 1)
	   {
	   curr_min = "0" + curr_min;
	   }

	var time = curr_hour + ":" + curr_min + a_p;
	var result = time + " " + date_formatted;

	return result;
};

function isDateToday(inputDate)
{
	copy = new Date();
    copy.setTime(inputDate.getTime());
    
	//call setHours to take the time out of the comparison
	if(copy.setHours(0,0,0,0) == new Date().setHours(0,0,0,0))
		return true;
	
	return false;
	
};

function isDateYesterday(inputDate)
{

	copy = new Date();
    copy.setTime(inputDate.getTime());
    
	var date = new Date();

	date ; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

	date.setDate(date.getDate() - 1);

	date ; //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)
	
	//call setHours to take the time out of the comparison
	if(copy.setHours(0,0,0,0) == date.setHours(0,0,0,0))
		return true;
	
	return false;
	
};

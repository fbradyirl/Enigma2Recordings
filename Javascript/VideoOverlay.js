var VideoOverlay =
{
    
};

VideoOverlay.init = function()
{
    
    return true;
};

VideoOverlay.setTotalTime = function(total)
{
	// Sets the total time in millsecs
    this.totalTime = total;
    console.log(total);
};

VideoOverlay.setTime = function(time)
{
    var timeElement = document.getElementById("timeInfo");

    if (time instanceof PlayTime) {
			
		time = time.millisecond;
	    var timePercent = (100 * time) / this.totalTime;
	    var timeHTML = "";
	    var timeHour = 0; var timeMinute = 0; var timeSecond = 0;
	    var totalTimeHour = 0; var totalTimeMinute = 0; var totalTimesecond = 0;
	    
	    document.getElementById("progressBar").style.width = timePercent + "%";
	    
	    if(Player.state == Player.PLAYING)
	    {
	        totalTimeHour = Math.floor(this.totalTime/3600000);
	        timeHour = Math.floor(time/3600000);
	        
	        totalTimeMinute = Math.floor((this.totalTime%3600000)/60000);
	        timeMinute = Math.floor((time%3600000)/60000);
	        
	        totalTimeSecond = Math.floor((this.totalTime%60000)/1000);
	        timeSecond = Math.floor((time%60000)/1000);
	        
	        timeHTML = timeHour + ":";
	        
	        if(timeMinute == 0)
	            timeHTML += "00:";
	        else if(timeMinute <10)
	            timeHTML += "0" + timeMinute + ":";
	        else
	            timeHTML += timeMinute + ":";
	            
	        if(timeSecond == 0)
	            timeHTML += "00/";
	        else if(timeSecond <10)
	            timeHTML += "0" + timeSecond + "/";
	        else
	            timeHTML += timeSecond + "/";
	            
	        //timeHTML = time + "/";
	        timeHTML += totalTimeHour + ":";
	        
	        if(totalTimeMinute == 0)
	            timeHTML += "00";
	        else if(totalTimeMinute <10)
	            timeHTML += "0" + totalTimeMinute;
	        else
	            timeHTML += totalTimeMinute;
	            
	        timeHTML += ":";
	        if(totalTimeSecond == 0)
	            timeHTML += "00";
	        else if(totalTimeSecond <10)
	            timeHTML += "0" + totalTimeSecond;
	        else
	            timeHTML += totalTimeSecond;
	    }
	    else
	        timeHTML = "";  
	} else {
		// Not a date object
        timeHTML = "buffering...";  
	}
    
    widgetAPI.putInnerHTML(timeElement, timeHTML);
    
};
 

VideoOverlay.hide = function()
{
    document.getElementById("video_overlay").style.display="none";
};

VideoOverlay.show = function()
{
    document.getElementById("video_overlay").style.display="block";
    document.getElementById("video_overlay").style.opacity = '0.6';

};


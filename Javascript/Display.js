var Display =
{
    FIRSTIDX : 0,
    LASTIDX : 4,
    currentWindow : 0,

    SELECTOR : 0,
    LIST : 1,
    times : 0,
    
    videoList : new Array(),
	subvideoList : new Array()
};

Display.init = function()
{
    var success = true;
        
    return success;
};

Display.setTotalTime = function(total)
{
	// Sets the total time in millsecs
    this.totalTime = total;
    console.log(total);
};

Display.setTime = function(time)
{
	time = time.millisecond;
    var timePercent = (100 * time) / this.totalTime;
    var timeElement = document.getElementById("timeInfo");
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
    
    widgetAPI.putInnerHTML(timeElement, timeHTML);
    
}

Display.status = function(status)
{
    alert(status);
   // widgetAPI.putInnerHTML(this.statusDiv, status);
}


Display.setVideoList = function(nameList, summaryList)
{
    var listHTML = "";
    
    var i=0;
    for (var name in nameList)
    {
        this.videoList[i] = document.getElementById("video"+i);
        listHTML = nameList[name] ;
        widgetAPI.putInnerHTML(this.videoList[i], listHTML);
        i++;
    }
    
    
    var i=0;
    for (var name in summaryList)
    {
        this.subvideoList[i] = document.getElementById("subvideo"+i);
        listHTML = summaryList[name] ;
        widgetAPI.putInnerHTML(this.subvideoList[i], listHTML);
        i++;
    }
        
    
    this.videoList[this.FIRSTIDX].style.backgroundImage= "url(Images/listBox/selector.png)";
    if(i>5)
    {
        document.getElementById("next").style.opacity = '1.0';
        document.getElementById("previous").style.opacity = '1.0';
    }
    listHTML = "1 / " + i;
    widgetAPI.putInnerHTML(document.getElementById("videoCount"), listHTML);
}

Display.setVideoListPosition = function(position, move)
{    
    var listHTML = "";
    
    listHTML = (position + 1) + " of " + Data.getVideoCount() + " recordings";
    widgetAPI.putInnerHTML(document.getElementById("videoCount"), listHTML);
    
    if(Data.getVideoCount() < 5)
    {
        for (var i = 0; i < Data.getVideoCount(); i++)
        {
            if(i == position)
                this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
            else
                this.videoList[i].style.backgroundImage= "url(none)";
        }
    }
    else if((this.currentWindow!=this.LASTIDX && move==Main.DOWN) || (this.currentWindow!=this.FIRSTIDX && move==Main.UP))
    {
    	alert("setVideoListPosition1");
    	
        if(move == Main.DOWN){
            this.currentWindow ++; 
            alert("setVideoListPosition2");
        }
        else
            this.currentWindow --;
            
        for (var i = 0; i <= this.LASTIDX; i++)
        {
            if(i == this.currentWindow)
                this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
            else
                this.videoList[i].style.backgroundImage= "url(none)";
        }
    }
    else if(this.currentWindow == this.LASTIDX && move == Main.DOWN)
    {
    	alert("setVideoListPosition3");
    	
        if(position == this.FIRSTIDX)
        {
            this.currentWindow = this.FIRSTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
                
                alert("#putInnerHTML1 " + Data.getVideoSummarys()[i]);
                widgetAPI.putInnerHTML(this.subvideoList[i], Data.getVideoSummarys()[i]);
                
                
                if(i == this.currentWindow)
                    this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
                else
                    this.videoList[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i + position - this.currentWindow] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
                
                listHTML = Data.getVideoSummarys()[i + position - this.currentWindow] ;
                alert("#Data.getVideoSummarys i" + Data.getVideoSummarys()[i]);
                alert("#putInnerHTML2 " + listHTML);
                widgetAPI.putInnerHTML(this.subvideoList[i], listHTML);
            }
        }
    }
    else if(this.currentWindow == this.FIRSTIDX && move == Main.UP)
    {
        if(position == Data.getVideoCount()-1)
        {
            this.currentWindow = this.LASTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i + position - this.currentWindow] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
                
                alert("#Data.getVideoSummarys length " + Data.getVideoSummarys().length);
                alert("#i " + i);
                alert("#this.currentWindow " + this.currentWindow);
                listHTML = Data.getVideoSummarys()[i + position - this.currentWindow] ;
                alert("#putInnerHTML3 " + listHTML);
                widgetAPI.putInnerHTML(this.subvideoList[i], listHTML);
                
                if(i == this.currentWindow)
                    this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
                else
                    this.videoList[i].style.backgroundImage= "url(none)";
            }
        }
        else
        {            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i + position] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);

                listHTML = Data.getVideoSummarys()[i + position] ;
                alert("#putInnerHTML4 " + listHTML);
                widgetAPI.putInnerHTML(this.subvideoList[i], listHTML);
            }
        }
    }
};

Display.setDescription = function(description)
{
    var descriptionElement = document.getElementById("description");
    
    widgetAPI.putInnerHTML(descriptionElement, description);
};

Display.hide = function()
{
    document.getElementById("main").style.display="none";
};

Display.show = function()
{
    document.getElementById("main").style.display="block";
};


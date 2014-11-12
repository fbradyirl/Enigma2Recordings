var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var Main =
{
    selectedVideo : 0,
    mode : 0,
    mute : 0,
    
    UP : 0,
    DOWN : 1,

    WINDOW : 0,
    FULLSCREEN : 1,
    
    NMUTE : 0,
    YMUTE : 1
};

Main.onLoad = function()
{
	alert("onload");
  // Enable key event processing
  this.enableKeys();

  widgetAPI.sendReadyEvent();    
};

var GetIPAddress = function(){
    var network = document.getElementById('pluginObjectNetwork');
    return network.GetIP(network.GetActiveType());  
};

window.onShow = function() {
	

	 // if (Data.getAppPref("IP"))
	Data.setAppPref("IP", "10.66.77.5");
	  
	  
  if ( Player.init() && Audio.init() && Display.init() && VideoOverlay.init() && Server.init() )
  {
      Display.setVolume( Audio.getVolume() );
      Display.setTime(0);
      VideoOverlay.hide();
      
      Player.stopCallback = function()
      {
          /* Return to windowed mode when video is stopped
              (by choice or when it reaches the end) */
          Main.setWindowMode();
      };

      // Start retrieving data from server
      Server.dataReceivedCallback = function()
      {
    	  	  alert("#video information has arrived:		" + Data.getVideoNames().length);

              /* Use video information when it has arrived */
              Display.setVideoList( Data.getVideoNames(), Data.getVideoSummarys() );
              Main.updateCurrentVideo();
              
        	  alert("#GetIPAddress returned: " + GetIPAddress());

      };
      Server.fetchVideoList(); /* Request video information from server */  
  }
  else
  {
     alert("Failed to initialise");
  }
};

Main.onUnload = function()
{
    Player.deinit();
}

Main.updateCurrentVideo = function(move)
{
    Player.setVideoURL( Data.getVideoURL(this.selectedVideo) );
    
    Display.setVideoListPosition(this.selectedVideo, move);

    Display.setDescription( Data.getVideoDescription(this.selectedVideo));
}

Main.enableKeys = function()
{
    document.getElementById("anchor").focus();
}

Main.keyDown = function()
{
    var keyCode = event.keyCode;
    alert("Key pressed: " + keyCode);
        
    switch(keyCode)
    {
	    case tvKey.KEY_RED:
	    	 sf.service.setScreenSaver(true);
	    	break;
	    case tvKey.KEY_GREEN:
	    	 sf.service.setScreenSaver(true, 100);
	       	break;
	    case tvKey.KEY_YELLOW:
	    	sf.service.AVSetting.show(function asd(){
				Main.enableKeys();
	    	});
	    	
	    	 break;
	    case tvKey.KEY_BLUE:
	    	sf.service.AVSetting.hide();
	    	break;
	    case tvKey.KEY_RETURN:
	    	sf.key.preventDefault();
	    	
            alert("RETURN");
            if (this.mode != this.FULLSCREEN)
            {
                alert("Not fullscreen, so exiting");

            	// Exit app
            	Player.stopVideo();
                widgetAPI.sendReturnEvent(); 
            } else {
                alert("Toggling out of fullscreen.");
                this.toggleMode();
                //Player.stopVideo();

            }
            break;

	    case tvKey.KEY_PANEL_RETURN:
            alert("KEY_PANEL_RETURN");
            alert("Exiting");
            // Exit app
            Player.stopVideo();
            widgetAPI.sendReturnEvent(); 
            break;
    
        case tvKey.KEY_PLAY:
            alert("PLAY");
            this.handlePlayKey();
            break;
            
        case tvKey.KEY_STOP:
            alert("STOP");
            Player.stopVideo();
            break;
            
        case tvKey.KEY_PAUSE:
            alert("PAUSE");
            this.handlePauseKey();
            break;
            
        case tvKey.KEY_FF:
            alert("FF");
            if(Player.getState() != Player.PAUSED)
                Player.skipForwardVideo(30);
            break;

        case 10:
            alert("N6");
            if(Player.getState() != Player.PAUSED)
                Player.skipForwardVideo(60);
            break;
            
        case 14:
            alert("N9");
            if(Player.getState() != Player.PAUSED)
                Player.skipForwardVideo(60*5);
            break;
            
        case tvKey.KEY_RW:
            alert("RW");
            if(Player.getState() != Player.PAUSED)
                Player.skipBackwardVideo(30);
            break;

        case 8:
            alert("N4");
            if(Player.getState() != Player.PAUSED)
                Player.skipBackwardVideo(60);
            break;
            
        case 12:
            alert("N7");
            if(Player.getState() != Player.PAUSED)
                Player.skipBackwardVideo(60*5);
            break;
        case tvKey.KEY_VOL_UP:
        case tvKey.KEY_PANEL_VOL_UP:
            alert("VOL_UP");
            if(this.mute == 0)
                Audio.setRelativeVolume(0);
            break;
            
        case tvKey.KEY_VOL_DOWN:
        case tvKey.KEY_PANEL_VOL_DOWN:
            alert("VOL_DOWN");
            if(this.mute == 0)
                Audio.setRelativeVolume(1);
            break;      

        case tvKey.KEY_DOWN:
            alert("DOWN");
            this.selectNextVideo(this.DOWN);
            break;
            
        case tvKey.KEY_UP:
            alert("UP");
            this.selectPreviousVideo(this.UP);
            break;            

        case tvKey.KEY_ENTER:
        case tvKey.KEY_PANEL_ENTER:
            alert("ENTER");
            if(Player.getState() == Player.PLAYING)
              this.toggleMode();
            else
              this.handlePlayKey();
            break;
        
        case tvKey.KEY_MUTE:
            alert("MUTE");
            this.muteMode();
            break;
            
        default:
            alert("Unhandled key");
            break;
    }
};

Main.handlePlayKey = function()
{
    switch ( Player.getState() )
    {
        case Player.STOPPED:
            Player.playVideo();
            break;
            
        case Player.PAUSED:
            Player.resumeVideo();
            break;
            
        default:
            alert("Ignoring play key, not in correct state");
            break;
    }
}

Main.handlePauseKey = function()
{
    switch ( Player.getState() )
    {
        case Player.PLAYING:
            Player.pauseVideo();
            break;
        
        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

Main.selectNextVideo = function(down)
{
	if(Player.getState() == Player.PLAYING)
		Player.stopVideo();
    
    this.selectedVideo = (this.selectedVideo + 1) % Data.getVideoCount();

    this.updateCurrentVideo(down);
}

Main.selectPreviousVideo = function(up)
{
	if(Player.getState() == Player.PLAYING)
		Player.stopVideo();
	
    if (--this.selectedVideo < 0)
    {
        this.selectedVideo += Data.getVideoCount();
    }

    this.updateCurrentVideo(up);
}

Main.setFullScreenMode = function()
{
    if (this.mode != this.FULLSCREEN)
    {
        Display.hide();
        VideoOverlay.show();

        VideoOverlay.setVolume( Audio.getVolume() );
        VideoOverlay.setTime(0);
        
        Player.setFullscreen();
        
        this.mode = this.FULLSCREEN;
    }
}

Main.setWindowMode = function()
{
    if (this.mode != this.WINDOW)
    {
        Display.show();
        VideoOverlay.hide();

        Player.setWindow();
        
        this.mode = this.WINDOW;
    }
}

Main.toggleMode = function()
{
    if(Player.getState() == Player.PAUSED)
    {
        Player.resumeVideo();
     }
    switch (this.mode)
    {
        case this.WINDOW:
            this.setFullScreenMode();
            break;
            
        case this.FULLSCREEN:
            this.setWindowMode();
            break;
            
        default:
            alert("ERROR: unexpected mode in toggleMode");
            break;
    }
}


Main.setMuteMode = function()
{
    if (this.mute != this.YMUTE)
    {
        var volumeElement = document.getElementById("volumeInfo");
        Audio.plugin.Execute("SetUserMute",true);
        document.getElementById("volumeBar").style.backgroundImage = "url(Images/videoBox/muteBar.png)";
        document.getElementById("volumeIcon").style.backgroundImage = "url(Images/videoBox/mute.png)";
        widgetAPI.putInnerHTML(volumeElement, "MUTE");
        this.mute = this.YMUTE;
    }
}

Main.noMuteMode = function()
{
    if (this.mute != this.NMUTE)
    {
    	Audio.plugin.Execute("SetUserMute",false);
        document.getElementById("volumeBar").style.backgroundImage = "url(Images/videoBox/volumeBar.png)";
        document.getElementById("volumeIcon").style.backgroundImage = "url(Images/videoBox/volume.png)";
        Display.setVolume( Audio.getVolume() );
        this.mute = this.NMUTE;
    }
}

Main.muteMode = function()
{
    switch (this.mute)
    {
        case this.NMUTE:
            this.setMuteMode();
            break;
            
        case this.YMUTE:
            this.noMuteMode();
            break;
            
        default:
            alert("ERROR: unexpected mode in muteMode");
            break;
    }
}

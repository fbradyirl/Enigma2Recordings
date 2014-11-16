var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
// add pluginAPI

var Main =
{
    selectedVideo : 0,
    mode : 0,
    
    UP : 0,
    DOWN : 1,

    WINDOW : 0,
    FULLSCREEN : 1,

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
	  VideoOverlay.setTime(0);
      VideoOverlay.hide();
      
      Player.stopCallback = function()
      {
          /* Return to windowed mode when video is stopped
              (by choice or when it reaches the end) */
          Main.setWindowMode();
          

          Display.show();
          VideoOverlay.hide();
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
};

Main.updateCurrentVideo = function(move)
{
	if (Data.getVideoURL(this.selectedVideo)){
		 Player.setVideoURL( Data.getVideoURL(this.selectedVideo) );
		    
		    Display.setVideoListPosition(this.selectedVideo, move);

		    Display.setDescription( Data.getVideoDescription(this.selectedVideo));
		    
		    document.getElementById("movie_image").style.display="none";

		    var movieName = Data.getVideoNames()[this.selectedVideo];
		    var movieNameEncoded = encodeURI(movieName);
		    
		   
		    var cachedPosterURL = Data.getAppPref("poster_url-" + movieName);
			if(cachedPosterURL){
		    	alert("Using cached URL: " + cachedPosterURL);
			    document.getElementById("movie_image").src = cachedPosterURL;
			    document.getElementById("movie_image").style.display="block";
		    } else {
		        theMovieDb.search.getMulti({"query":"" + movieNameEncoded + ""}, successCB, errorCB);
		    }
			
			
			 // Preload next movie
		    var nextMovieName = Data.getVideoNames()[this.selectedVideo + 1];
		    if(nextMovieName){
		    	var nextMovieNameEncoded = encodeURI(nextMovieName);
		    
		    	var cachedPosterURL = Data.getAppPref("poster_url-" + nextMovieName);
		    	if(!cachedPosterURL){
		            theMovieDb.search.getMulti({"query":"" + nextMovieNameEncoded + ""}, successPreloadCB, errorCB);
		        }
		    }
	}
   
    
    
};

function successPreloadCB(data) {
    console.log("theMovieDb preload Success callback: " + data);
    successCommon(data, false);
}
function successCB(data) {
    console.log("theMovieDb Success callback: " + data);
    successCommon(data, true);
}

function successCommon(data, show) {
    
	var obj = JSON.parse(data);
	var imageUrl = "";
	
	if (obj.results.length > 0) {
		// http://image.tmdb.org/t/p/w500/hpt3aa5i0TrSAnEdl3VJrRrje8C.jpg
		
		poster_path = obj.results[0].poster_path;

		if(obj.results[0].poster_path) {

			imageUrl = theMovieDb.common.images_uri + "w500" + poster_path;
			alert("obj.results[0]: " + obj.results[0]);
			alert("imageUrl: " + imageUrl);
			
			// TODO: Save cache URL path
			var name = obj.results[0].original_name;
			if (!name) 
				name = obj.results[0].original_title;
			
			Data.setAppPref("poster_url-" + name, imageUrl);
			
			if (show){
				document.getElementById("movie_image").src = imageUrl;
		    	document.getElementById("movie_image").style.display="block";
			}
		}

	}
	alert("JSON results: " + obj.results);

};

function errorCB(data) {
	console.log("theMovieDb Error callback: " + data);
};
    

Main.enableKeys = function()
{
    document.getElementById("anchor").focus();
};

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
            if(Player.getState() == Player.PLAYING){
              //this.toggleMode();
                VideoOverlay.show();
            
	            setTimeout(function(){ 
	            	VideoOverlay.hide();
	            }, 10000);
            }
            else
              this.handlePlayKey();
            
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
            this.toggleMode();

            break;
            
        case Player.PAUSED:
            Player.resumeVideo();
            this.toggleMode();

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
};

Main.setFullScreenMode = function()
{
    if (this.mode != this.FULLSCREEN)
    {
        Display.hide();
//        VideoOverlay.show();
//        
//        setTimeout(function(){ 
//        	VideoOverlay.hide();
//        }, 5000);

        VideoOverlay.setTime(0);
        
        Player.setFullscreen();
        
        this.mode = this.FULLSCREEN;
    }
};

Main.setWindowMode = function()
{
    if (this.mode != this.WINDOW)
    {
        Display.show();
        VideoOverlay.hide();

        Player.stopVideo();
        Player.setWindow();

        this.mode = this.WINDOW;
    }
};

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



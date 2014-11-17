var video_width=1280;
var video_height=720;
var ui_width=960;
var ui_height=540;
	
var is_buffering = false;

var Player =
{
	AVPlayer : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    
    STOPPED : 0,
    PLAYING : 1,
    PAUSED : 2,  
    FORWARD : 3,
    REWIND : 4
};

var bufferingCB = {
	onbufferingstart : function () {
		console.log("buffering started");
		is_buffering = true;
		Player.setTotalTime();
		Player.onBufferingStart();
    },
    onbufferingprogress: function (percent) {
        console.log("buffering : " + percent);
        Player.onBufferingProgress(percent);
    },
    onbufferingcomplete: function () {
        console.log("buffering complete");
		is_buffering = false;
        Player.onBufferingComplete();
    }
};

var playCB = {
    oncurrentplaytime: function (time) {
        console.log("playing time : " + time);
        Player.setCurTime(time);
    },
    onresolutionchanged: function (width, height) {
        console.log("resolution changed : " + width + ", " + height);
    },
    onstreamcompleted: function () {
        console.log("streaming completed");
    },
    onerror: function (error) {
        console.log(error.name);
    }
};

Player.init = function()
{
    var success = true;
    alert("success vale :  " + success);    
    this.state = this.STOPPED;
    try{
    	var playerInstance = webapis.avplay;
		webapis.avplay.getAVPlay(Player.onAVPlayObtained, Player.onGetAVPlayError);
		
	}catch(e){
		alert('######getAVplay Exception :[' +e.code + '] ' + e.message);
	}      
    return success;
};

Player.onAVPlayObtained = function(avplay) {
	//AVPlayer 모듈을 초기화하는 콜백함수
	//모듈을 호출하는 onAVPlayObtained 함수는 AVPlay 인스턴스를 인자로 받는다.
	alert('Getting avplay object successfully');
	
	Player.AVPlayer = avplay;
	Player.AVPlayer.init({
		//containerID : 'player_container',
		zIndex: -1,
		bufferingCallback : bufferingCB, 
		playCallback : playCB,
		displayRect: {
		  top: 0,
		  left: 0,
	        width: ui_width,
	        height: ui_height
		},
		autoRatio: false, 
	});
	
	/**
	 * Resolution Guide
	 * http://www.samsungdforum.com/Guide/?FolderName=c07&FileName=index.html
	 * 
	 * Aspect ratio SD thread
	 * http://www.samsungdforum.com/SamsungDForum/ForumView/f0cd8ea6961d50c3?forumID=88555f42acdd3243&currentPage=1&searchText=avplayer&selectcontents=1&selectPageSize=20&sorting_target=CreateDate&sorting_type=desc
	 */

	
	console.log("Player initialised: " + Player.AVPlayer);

};


Player.onGetAVPlayError = function() {
	//AVPlayer 모듈을 초기화할 때 발생하는 에러를 처리하기 위한 함수
	alert('######onGetAVPlayError: ' + error.message);
};

Player.onError = function(){
	alert('######onError: ');
};

Player.onSuccess = function(){
	alert('######onSuccess: ');
};

Player.deinit = function()
{
	alert("Player deinit !!! " );
};

Player.setWindow = function()
{
	alert("Player.setWindow !!! " );
   
	Player.AVPlayer.setDisplayRect({
		top: 0,
		left: 0,
        width: ui_width,
        height: ui_height
	});
	
	Player.AVPlayer.setDisplayArea({
        top: 0,
        left: 0,
        width: ui_width,
        height: ui_height
	});

};

Player.setFullscreen = function()
{
	alert("Player.setFullscreen !!! " );
   
	//this.plugin.Execute("SetDisplayArea",0, 0, 960, 540);
	Player.AVPlayer.setDisplayRect({
		top: 0,
		left: 0,
        width: video_width,
        height: video_height
	});
	
	Player.AVPlayer.setDisplayArea({
        top: 0,
        left: 0,
        width: video_width,
        height: video_height
	});

};

Player.setVideoURL = function(url)
{
    this.url = url;
    alert("URL = " + this.url);
};

Player.playVideo = function()
{
    if (this.url == null)
    {
        alert("No videos to play");
    }
    else
    {
        this.state = this.PLAYING;
//        document.getElementById("play").style.opacity = '0.2';
//        document.getElementById("stop").style.opacity = '1.0';
//        document.getElementById("pause").style.opacity = '1.0';
//        document.getElementById("forward").style.opacity = '1.0';
//        document.getElementById("rewind").style.opacity = '1.0';
//        Display.status("Playing");
        //this.setWindow();
        
        try{
        	Player.AVPlayer.open(this.url); 	// 재생할 미디어 콘텐츠 설정
        	Player.AVPlayer.play(Player.onSuccess, Player.onError); // 콘텐츠 재생
			//index_saver = content_index; //현재 재생한 영상의 index를 기억하게 하기위해 변수 index_saver에 할당
            
        	
        	// For some reason, I need to call this again, otherwise PIP doesnt show video
        	//this.setWindow();
        	
        	// Show the overlay 
            VideoOverlay.show(0);

		}catch(e){
			alert(e.message);
		}
        
        Audio.plugin.Execute("SetSystemMute",false); 
    }
};

Player.pauseVideo = function()
{
    this.state = this.PAUSED;
//    document.getElementById("play").style.opacity = '1.0';
//    document.getElementById("stop").style.opacity = '1.0';
//    document.getElementById("pause").style.opacity = '0.2';
//    document.getElementById("forward").style.opacity = '0.2';
//    document.getElementById("rewind").style.opacity = '0.2';
//    Display.status("Pause");
    Player.AVPlayer.pause();
    
    // Show the overlay
    VideoOverlay.show(0);
};

Player.stopVideo = function()
{
    if (this.state != this.STOPPED)
    {
        this.state = this.STOPPED;
//        document.getElementById("play").style.opacity = '1.0';
//        document.getElementById("stop").style.opacity = '0.2';
//        document.getElementById("pause").style.opacity = '0.2';
//        document.getElementById("forward").style.opacity = '0.2';
//        document.getElementById("rewind").style.opacity = '0.2';
        Display.status("Stop");
        Player.AVPlayer.stop();
        Display.setTime(0);
        
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
};

Player.resumeVideo = function()
{
    this.state = this.PLAYING;
//    document.getElementById("play").style.opacity = '0.2';
//    document.getElementById("stop").style.opacity = '1.0';
//    document.getElementById("pause").style.opacity = '1.0';
//    document.getElementById("forward").style.opacity = '1.0';
//    document.getElementById("rewind").style.opacity = '1.0';
    Display.status("Playing");
    Player.AVPlayer.resume();
    
    // Show the overlay for 5 secs
    VideoOverlay.show(5);
};


/**
 * http://www.samsungdforum.com/Guide/?FolderName=tec00118&FileName=index.html
 * 
 * Avoiding potential problems with FF and REW operations on video content
Some of the multimedia containers can not handle the JumpForward function correctly, 

if the jump target is bigger than the contents length. For that reason it is recommended to
 check if the operation will not reach beyond the available range in the FF and REW keyhandling functions.
 
For instance, if the total video length is A, current playback time: B and jump parameter: C,
 before calling the jump function, please check if (A-B) <= C. If this condition is met, it is 
 recommended to block the jump operation, to avoid potential player errors.
 
Please also note that the FF and REW functions may not work properly during the video buffering. 
In order to eliminate any potential player errors related to that issue, we strongly recommend to 
block any FF and REW operations in the OnBufferingStart callback and activate them back in OnBufferingComplete.

 */
Player.skipForwardVideo = function(secs)
{
	if (is_buffering)
	{
		alert("Currently buffering! Blocking FF");
		return;
	}
	
    this.skipState = this.FORWARD;  
    Player.AVPlayer.jumpForward(secs);
    
    // Show the overlay for 5 secs
    VideoOverlay.show(5);
};

Player.skipBackwardVideo = function(secs)
{
	if (is_buffering)
	{
		alert("Currently buffering! Blocking RW");
		return;
	}
	
    this.skipState = this.REWIND;
    Player.AVPlayer.jumpBackward(secs);
    
    // Show the overlay for 5 secs
    VideoOverlay.show(5);
};

Player.getState = function()
{
    return this.state;
};

// Global functions called directly by the player 

Player.onBufferingStart = function()
{
    Display.status("Buffering...");
    
    VideoOverlay.show(0);
    
//    switch(this.skipState)
//    {
//        case this.FORWARD:
//            document.getElementById("forward").style.opacity = '0.2';
//            break;
//        
//        case this.REWIND:
//            document.getElementById("rewind").style.opacity = '0.2';
//            break;
//    }
};

Player.onBufferingProgress = function(percent)
{
    Display.status("Buffering:" + percent + "%");
};

Player.onBufferingComplete = function()
{
    Display.status("Playing");
    

	alert("#totalNumOfSubtitle: " + Player.AVPlayer.totalNumOfSubtitle);
	alert("#totalNumOfAudio: " + Player.AVPlayer.totalNumOfAudio);
	
	// BBC reports totalNumOfAudio: 2 TODO: Show UI to choose audio track!
	// SD reports totalNumOfAudio: 0
    
	switch(this.skipState)
    {
        case this.FORWARD:
            document.getElementById("forward").style.opacity = '1.0';
            break;
        
        case this.REWIND:
            document.getElementById("rewind").style.opacity = '1.0';
            break;
            
        default:
        	VideoOverlay.show(5);
        	break;
    }
};

Player.setCurTime = function(time)
{
	VideoOverlay.setTime(time);
};

Player.setTotalTime = function()
{
	console.log('setTotalTime : ' + Player.AVPlayer.getDuration());
	VideoOverlay.setTotalTime(Player.AVPlayer.getDuration());
};

onServerError = function()
{
    Display.status("Server Error!");
};

OnNetworkDisconnected = function()
{
    Display.status("Network Error!");
};

getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

onDecoderReady = function() { alert("onDecoderReady"); }

onRenderError = function() { alert("onRenderError"); }

stopPlayer = function()
{
    Player.stopVideo();
}

setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }

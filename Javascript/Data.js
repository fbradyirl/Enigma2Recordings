var Data =
{
    videoNames : [ ],
    videoServiceNames : [ ],
    videoLengths : [ ],
    videoTimes : [ ],
    videoURLs : [ ],
    videoDescriptions : [ ],
    videoDescriptionsExtended : [ ],
	videoSummarys : [ ]
};

/**
 * SETTERS
 */
Data.setVideoNames = function(list)
{
    this.videoNames = list;
};

Data.setVideoServiceNames = function(list)
{
    this.videoServiceNames = list;
};

Data.setVideoLengths = function(list)
{
    this.videoLengths = list;
};

Data.setVideoTimes = function(list)
{
    this.videoTimes = list;
};

Data.setVideoURLs = function(list)
{
    this.videoURLs = list;
};

Data.setVideoDescriptions = function(list)
{
    this.videoDescriptions = list;
};

Data.setVideoDescriptionsExtended = function(list)
{
    this.videoDescriptionsExtended = list;
};

Data.setVideoSummarys = function(list)
{
    this.videoSummarys = list;
};

/**
 * GETTERS
 */

Data.getVideoURL = function(index)
{
    var url = this.videoURLs[index];
    
    if (url)    // Check for undefined entry (outside of valid array)
    {
        return url;
    }
    else
    {
        return null;
    }
};

Data.getVideoCount = function()
{
    return this.videoURLs.length;
};

Data.getVideoNames = function()
{
    return this.videoNames;
};

Data.getVideoServiceNames = function()
{
    return this.videoServiceNames;
};

Data.getVideoLengths = function()
{
    return this.videoLengths;
};

Data.getVideoTimes = function()
{
    return this.videoTimes;
};

Data.getVideoSummarys = function()
{
    alert("#getvideoSummarys: " + this.videoSummarys);
    return this.videoSummarys;
};


Data.getVideoDescriptionExtended = function(index)
{
    var description = this.videoDescriptionsExtended[index];
    
    if (description)    // Check for undefined entry (outside of valid array)
    {
        return description;
    }
    else
    {
        return "No extended description";
    }
};

Data.getVideoDescription = function(index)
{
    var description = this.videoDescriptions[index];
    
    if (description)    // Check for undefined entry (outside of valid array)
    {
        return description;
    }
    else
    {
        return "No description";
    }
};


/**
 * App Settings and prefs
 */

Data.getAppPref = function(prefName)
{
	var obj = JSON.parse(localStorage.getItem(prefName));
	alert(prefName + ": " + obj);

	return obj;
};

Data.setAppPref = function(prefName, value)
{
	alert("setAppPref: " + prefName + " to: " + value);
	localStorage.setItem(prefName, JSON.stringify(value));

};



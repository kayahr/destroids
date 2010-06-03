/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Score class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a score counter.
 * 
 * @constructor
 * @class The score counter
 */

destroids.Score = function()
{
	this.reset();
};

/**
 * The game.
 * @private
 * @type {destroids.Game} 
 */
destroids.Score.prototype.game = null; 
    
/**
 * The score journal.
 * @private
 * @type {string}
 */
destroids.Score.prototype.journal;

/**
 * The current score.
 * @private
 * @type {number}
 */
destroids.Score.prototype.score = 0;

/**
 * The last time stamp.
 * @private
 * @type {number}
 */
destroids.Score.prototype.last = 0;

/**
 * The onScore event
 * @type {Function}
 */
destroids.Score.prototype.onScore = null;

/**
 * If we are currently in debug mode.
 * @type {boolean}
 */
destroids.Score.prototype.debug = false;

/**
 * If score is valid.
 * @type {boolean}
 */
destroids.Score.prototype.valid = true;


/**
 * Reset the score.
 */

destroids.Score.prototype.reset = function()
{
	var now;
	
	this.score = 0;
	now = new Date().getTime() / 1000 | 0;
	this.last = now;
	this.valid = true;
	this.journal = now.toString(36);
	this.scoreChanged();
};


/**
 * Registers a score change.
 * 
 * @param {number} points
 * @param {...number} data
 */

destroids.Score.prototype.register = function(points, data)
{
    var now, ts, i, max;
    
    this.score += points;
    now = new Date().getTime() / 1000 | 0;
    ts = now - this.last;
    this.last = now;
    this.journal += "I" + ts.toString(36);
    for (i = 1, max = arguments.length; i < max; i++)
        this.journal += "I" + parseInt(arguments[i], 10).toString(36);
    if (points) this.scoreChanged();
};


/**
 * Returns the current score.
 * 
 * @return {number} The current score 
 */

destroids.Score.prototype.getScore = function()
{
    return this.score;
};


/**
 * Submits the score to the server.
 * 
 * @param {string} name
 *            The player name 
 */

destroids.Score.prototype.submit = function(name)
{
    var data, url;
    
    url = destroids.scoreReceiveUrl;
    if (!url) return;
    data = this.score.toString(36) + "?" + this.journal + "@" + name;
    data = data.length + ":" + data;
    
    new Ajax.Request(url, {
        method: "post",
        postBody: data,
        onSuccess: this.handleResponse.bind(this)
    });
};


/**
 * Handles the response from the server. This is only important for debug so
 * the response is ignored when not in debug mode.
 * 
 * @param {Ajax.Response} response
 *            The ajax response
 */

destroids.Score.prototype.handleResponse = function(response)
{
	if (this.debug)
	{
		this.valid = (response.responseText | 0) == this.score;
		if (this.onScore) this.onScore(this);
	}
};


/**
 * Triggers the onScore event.
 *  
 * @private
 */

destroids.Score.prototype.scoreChanged = function()
{
	if (this.onScore) this.onScore(this);
	
	// In debug mode we immediately submit the code to the server
	if (this.debug) this.submit("me");
};


/**
 * Enables or disabled the debug mode.
 * 
 * @param {boolean} debug
 *            True to enable debugging, false to disable it
 */

destroids.Score.prototype.setDebug = function(debug)
{
	this.debug = debug;
	this.scoreChanged();
};


/**
 * Checks if code is valid. This only makes sense in debug mode. In non-debug
 * mode the score is not validated.
 * 
 * @return {boolean} True if score is valid, false if not
 */
destroids.Score.prototype.isValid = function()
{
	return this.valid;
};


/**
 * Checks if score system is currently in debug mode.
 * 
 * @return {boolean} True if debug mode, false if not
 */

destroids.Score.prototype.isDebug = function()
{
	return this.debug;
};
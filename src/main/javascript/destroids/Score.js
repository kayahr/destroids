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
 * The current points.
 * @private
 * @type {number}
 */
destroids.Score.prototype.points = 0;

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
 * The onSubmit event
 * @type {Function}
 */
destroids.Score.prototype.onSubmit = null;


/**
 * Reset the score.
 */

destroids.Score.prototype.reset = function()
{
    var now;
    
    this.points = 0;
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
    
    this.points += points;
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

destroids.Score.prototype.getPoints = function()
{
    return this.points;
};


/**
 * Submits the score to the server.
 * 
 * @param {string} name
 *            The player name 
 * @param {number} level
 *            The achieved level
 */

destroids.Score.prototype.submit = function(name, level)
{
    var data, url;
    
    url = destroids.scoreSubmitUrl;
    if (!url) return;
    data = this.points.toString(36) + "/" + level.toString(36) + "?" +
        this.journal + "@" + name;
    data = data.length + ":" + data;
    
    new Ajax.Request(url, {
        method: "post",
        postBody: data,
        onSuccess: this.handleSuccess.bind(this),
        onFailure: this.handleFailure.bind(this)
    });
};


/**
 * Handles the response from the server. This is only important for debug so
 * the response is ignored when not in debug mode.
 * 
 * @param {Ajax.Response} response
 *            The ajax response
 */

destroids.Score.prototype.handleSuccess = function(response)
{
    var rank;
    
    rank = response.responseText.evalJSON();
    if (destroids.onNotification) destroids.onNotification(
        destroids.msgRankNotification.replace("%RANK%", rank.toString()));
    if (this.onSubmit) this.onSubmit();
};


/**
 * Handles an error response from the server.
 * 
 * @param {Ajax.Response} response
 *            The ajax response
 */

destroids.Score.prototype.handleFailure = function(response)
{
    if (destroids.onNotification) destroids.onNotification(
        destroids.msgRankErrorNotification);
};


/**
 * Triggers the onScore event.
 *  
 * @private
 */

destroids.Score.prototype.scoreChanged = function()
{
    if (this.onScore) this.onScore(this);
};

/**
 * $Id: HighScores.js 906 2009-08-05 08:35:52Z k $
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the highscores.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 906 $
 */


/**
 * Constructs a new instance of the highscores.
 * 
 * @constructor
 * @class The highscores.
 * 
 */

jsteroids.HighScores = function()
{
    this.load();
};

/** The singleton instance. @private @type {jsteroids.HighScores} */
jsteroids.HighScores.instance = null;

/** If array with the scores (Entries:name,level,score). @private @type {Array} */
jsteroids.HighScores.prototype.scores = null;

/** The maximum number of entries in the high score list. @type {String} */
jsteroids.HighScores.prototype.entries = 5;


/**
 * Returns the singleton instance of the high scores list.
 * 
 * @return {jsteroids.HighScores} The high scores
 */

jsteroids.HighScores.getInstance = function()
{
    if (!this.instance) this.instance = new jsteroids.HighScores();
    return this.instance;
};


/**
 * Loads the high scores.
 * 
 * @private
 */

jsteroids.HighScores.prototype.load = function()
{
    var cookie, name, level, score, i;
    
    // Read high scores from mojo cookies if possible
    if (window.Mojo && Mojo.Model && Mojo.Model.Cookie)
        cookie = new Mojo.Model.Cookie("highscores").get();
    
    this.reset();
    if (cookie)
    {
        for (i = 0; i < this.entries; i++)
        {
            level = cookie["level" + i];
            if (!level) continue;
            name = cookie["name" + i];
            score = cookie["score" + i];
            this.scores.push({
                "name": name,
                "level": level,
                "score": score
            });
        }
    }
};


/**
 * Saves the high scores.
 */

jsteroids.HighScores.prototype.save = function()
{
    var data, max, entry, i;
    
    for (i = 0, max = this.scores.length; i < max; i++)
    {
        entry = this.scores[i];
        data["name" + i] = entry["name"];
        data["level" + i] = entry["level"];
        data["score" + i] = entry["score"];
    }

    // Write to Mojo cookie if available
    if (window.Mojo && Mojo.Model && Mojo.Model.Cookie)
        new Mojo.Model.Cookie("highscores").put(data);
};


/**
 * Resets the high scores.
 */

jsteroids.HighScores.prototype.reset = function()
{
    this.scores = [
        { "name": "Scott Safran", "level": 5, "score": 5000 },
        { "name": "Leo Daniels", "level": 4, "score": 4000 },
        { "name": "Lyle Rains", "level": 3, "score": 3000 },
        { "name": "Ed Logg", "level": 2, "score": 2000 },
        { "name": "Atari", "level": 1, "score": 1000 },
    ];
};


/**
 * Returns the rank in the high score list the specified score would get.
 * Returns 0 if this score is not good enough to be recorded in the list at
 * all.
 * 
 * @return {Number} score
 *             The score
 * @return {Number} The rank or 0 if not in the list.
 */

jsteroids.HighScores.prototype.determineRank = function(score)
{
    var rank, entries;
    
    for (rank = 0, entries = this.scores.length; rank < entries; rank++)
    {
        entry = this.scores[rank];
        if (score > entry["score"]) return rank + 1;
    }
    if (rank < this.entries) return rank + 1;
    return 0;
};


/**
 * Adds a new high score entry.
 * 
 * @param {String} name
 *            The name to add
 * @param {Number} level
 *            The level to add
 * @param {Number} score
 *            The score to add
 */

jsteroids.HighScores.prototype.add = function(name, level, score)
{
    var rank;
    
    // Get the rank in the list
    rank = this.determineRank(score);
    
    // If no rank then do nothing
    if (!rank) return;
    
    // Insert the new entry
    this.scores.splice(rank - 1, 0, {
        "name": name,
        "level": level,
        "score": score
    });
    
    // Truncate the list if needed
    if (this.scores.length > this.entries)
        this.scores = this.scores.slice(0, this.entries);
};


/**
 * Returns the scores.
 * 
 * @return {Array} The scores
 */

jsteroids.HighScores.prototype.getScores = function()
{
    return this.scores;
};

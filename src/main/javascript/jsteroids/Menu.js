/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Menu class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new menu screen
 * 
 * @constructor
 * @class The menu screen
 */

jsteroids.Menu = function(game)
{
    var root, s, e;
    
    this.game = game;
    root = this.element = document.createElement("div");
    s = root.style;
    s.position = "absolute";
    s.left = "40px";
    s.top = "-400px";    
    s.right = "40px";
    s.border = "solid rgba(0, 255, 0, 0.5) 1px";
    s.padding = "10px";
    s.textAlign = "center";
    s.fontFamily = "sans-serif";
    s.fontSize = "12px";
    s.color = "#cc0";
    s.zIndex = 3;
    s.background = "rgba(0, 255, 0, 0.2)";
    //s.opacity = 0;
    s.transition = s.oTransition = s.MozTransition = s.webkitTransition =
        "top 0.5s ease-in-out, color 0.5s ease-in-out, opacity 0.5s ease-in-out";
    s.borderRadius = s.oBorderRadius = s.webkitBorderRadius = s.MozBorderRadius =
        "8px";
    e = document.createElement("div");
    s = e.style;
    s.fontFamily = "serif";
    s.fontSize = "25px";
    e.appendChild(document.createTextNode(jsteroids.msgTitle));
    root.appendChild(e);    
    
    e = document.createElement("div");
    s = e.style;
    s.fontSize = "12px";
    s.marginBottom = "1em";
    e.appendChild(document.createTextNode(jsteroids.msgVersion));
    root.appendChild(e);

    // Create and append the high scores table
    root.appendChild(this.createHighScores());
    
    // Create the "new game" button
    e = document.createElement("div");
    s = e.style;
    s.padding = "20px";
    s.border = "solid 1px #0f0";
    s.margin = "8px 0";
    s.cursor = "pointer";
    e.onclick = function() { game.newGame.call(game); };
    e.appendChild(document.createTextNode(jsteroids.msgNewGame));
    root.appendChild(e);
    
    // Create the "Continue" button
    e = this.continueButton = document.createElement("div");
    s = e.style;
    s.padding = "20px";
    s.border = "solid 1px #0f0";
    s.margin = "8px 0";
    s.cursor = "pointer";
    e.onclick = function() { game.continueGame.call(game); };
    e.appendChild(document.createTextNode(jsteroids.msgContinueGame));
    root.appendChild(e);
    
    // Create preferences button
    if (jsteroids.onPreferences)
    {
        e = document.createElement("div");
        s = e.style;
        s.cursor = "pointer";
        s.padding = "20px";
        s.border = "solid 1px #0f0";
        s.margin = "8px 0";
        e.onclick = jsteroids.onPreferences;
        e.appendChild(document.createTextNode(jsteroids.msgPreferences));
        root.appendChild(e);
    }
    
    // Create about button
    if (jsteroids.onAbout)
    {
        e = document.createElement("div");
        s = e.style;
        s.padding = "20px";
        s.cursor = "pointer";
        s.border = "solid 1px #0f0";
        s.margin = "8px 0";
        e.onclick = jsteroids.onAbout;
        e.appendChild(document.createTextNode(jsteroids.msgAbout));
        root.appendChild(e);
    }
};

/** The game reference. @private @type {jsteroids.Game} */
jsteroids.Menu.prototype.game = null;

/** The HTML element. @private @type {HTMLElement} */
jsteroids.Menu.prototype.element = null;

/** If menu is open or not. @private @type {Boolean} */
jsteroids.Menu.prototype.opened = false;

/** The continue button. @private @type {HTMLElement} */
jsteroids.Menu.prototype.continueButton = null;

/** The high scores table. @private @type {HTMLElement} */
jsteroids.Menu.prototype.highScoresTable = null;


/**
 * Opens the menu screen.
 */

jsteroids.Menu.prototype.open = function()
{
    var s;

    this.continueButton.style.display = this.game.isGameOver() ? "none" : "block";
    this.updateHighScores();
    s = this.element.style;
    s.top = "40px";
    this.opened = true;
};


/**
 * Closes the menu screen.
 */

jsteroids.Menu.prototype.close = function()
{
    var s;
    
    s = this.element.style;
    s.top = "-400px";
    this.opened = false;
    
};


/**
 * Checks if menu is open.
 * 
 * @return {Boolean} True if menu is open, false if not
 */

jsteroids.Menu.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the menu screen.
 * 
 * @return {HTMLElement} The root HTML element
 */

jsteroids.Menu.prototype.getElement = function()
{
    return this.element;
};


/**
 * Creates and returns the high scores table.
 * 
 * @return {HTMLElement} The high scores table
 * 
 * @private
 */

jsteroids.Menu.prototype.createHighScores = function()
{
    var table, row, cell;
    
    table = this.highScoresTable = document.createElement("table");
    table.id = "highScores";
    
    row = document.createElement("tr");
    table.appendChild(row);
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.appendChild(document.createTextNode("Name"));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.appendChild(document.createTextNode("Level"));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.appendChild(document.createTextNode("Score"));
    
    return table;
};


/**
 * Updates the high scores table.
 */

jsteroids.Menu.prototype.updateHighScores = function()
{
    var table, row, scores, cell, entry, i, max;
    
    table = this.highScoresTable;
    while ((row = table.lastChild).firstChild.tagName == "TD")
    {
        table.removeChild(row);
    }
    
    scores = jsteroids.HighScores.getInstance().getScores();
    console.log(scores);
    for (i = 0, max = scores.length; i < max; i++)
    {
        entry = scores[i];
        
        row = document.createElement("tr");
        table.appendChild(row);
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(entry["name"]));
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(entry["level"]));

        cell = document.createElement("td");
        row.appendChild(cell);
        cell.appendChild(document.createTextNode(entry["score"]));
    }
};

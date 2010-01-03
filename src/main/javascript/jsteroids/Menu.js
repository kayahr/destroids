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
    var root, e, buttons;
    
    // Remember the game reference
    this.game = game;
    
    // Create the root element
    root = this.element = document.createElement("div");
    root.id = "mainMenu";
    
    // Create the title element
    e = document.createElement("div");
    root.appendChild(e);
    e.id = "title";
    e.appendChild(document.createTextNode(jsteroids.msgTitle));
    
    // Create and append the high scores table
    root.appendChild(this.createHighScores());
    
    // Create the buttons container
    buttons = this.buttons = document.createElement("div");
    root.appendChild(buttons);
    buttons.id = "buttons";
    
    // Create the "new game" button
    e = document.createElement("div");
    buttons.appendChild(e);
    e.id = "newGameButton";
    e.className = "button";
    e.onclick = function() { game.newGame.call(game); };
    e.appendChild(document.createTextNode(jsteroids.msgNewGame));
    
    // Create the "Continue" button
    e = this.continueButton = document.createElement("div");
    buttons.appendChild(e);
    e.id = "continueGameButton";
    e.className = "button";
    e.onclick = function() { game.continueGame.call(game); };
    e.appendChild(document.createTextNode(jsteroids.msgContinueGame));
    
    // Create preferences button
    if (jsteroids.onPreferences)
    {
        e = document.createElement("div");
        buttons.appendChild(e);
        e.id = "preferencesButton";
        e.className = "button";
        e.onclick = jsteroids.onPreferences;
        e.appendChild(document.createTextNode(jsteroids.msgPreferences));
    }    
};

/** The game reference. @private @type {jsteroids.Game} */
jsteroids.Menu.prototype.game = null;

/** The HTML element. @private @type {HTMLElement} */
jsteroids.Menu.prototype.element = null;

/** If menu is open or not. @private @type {Boolean} */
jsteroids.Menu.prototype.opened = false;

/** The buttons container. @private @type {HTMLElement} */
jsteroids.Menu.prototype.buttons = null;

/** The continue button. @private @type {HTMLElement} */
jsteroids.Menu.prototype.continueButton = null;

/** The high scores table. @private @type {HTMLElement} */
jsteroids.Menu.prototype.highScoresTable = null;


/**
 * Opens the menu screen.
 */

jsteroids.Menu.prototype.open = function()
{
    if (this.game.isGameOver())
        this.continueButton.className = "hidden-button button";
    else
        this.continueButton.className = "button";
    this.updateHighScores();
    
    this.element.className = "visible";
    this.opened = true;
};


/**
 * Closes the menu screen.
 */

jsteroids.Menu.prototype.close = function()
{
    this.element.className = "";
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
    cell.className = "name";
    cell.appendChild(document.createTextNode(jsteroids.msgName));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "level";
    cell.appendChild(document.createTextNode(jsteroids.msgLevel));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "score";
    cell.appendChild(document.createTextNode(jsteroids.msgScore));
    
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
    for (i = 0, max = scores.length; i < max; i++)
    {
        entry = scores[i];
        
        row = document.createElement("tr");
        table.appendChild(row);
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "name";
        cell.appendChild(document.createTextNode(entry["name"]));
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "level";
        cell.appendChild(document.createTextNode(entry["level"]));

        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "score";
        cell.appendChild(document.createTextNode(
            jsteroids.formatNumber(entry["score"])));
    }
};

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
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @class The menu screen
 */

destroids.Menu = function(game)
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
    e.appendChild(document.createTextNode(destroids.msgTitle));
    
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
    e.onclick = function() { destroids.Game.prototype.newGame.call(game); };
    e.appendChild(document.createTextNode(destroids.msgNewGame));
    
    // Create the "Continue" button
    e = this.continueButton = document.createElement("div");
    buttons.appendChild(e);
    e.id = "continueGameButton";
    e.className = "button";
    e.onclick = function() { destroids.Game.prototype.continueGame.call(game); };
    e.appendChild(document.createTextNode(destroids.msgContinueGame));
    
    // Create preferences button
    if (destroids.onHelp)
    {
        e = document.createElement("div");
        buttons.appendChild(e);
        e.id = "helpButton";
        e.className = "button";
        e.onclick = destroids.onHelp;
        e.appendChild(document.createTextNode(destroids.msgHelp));
    }    

    // Create preferences button
    if (destroids.onPreferences)
    {
        e = document.createElement("div");
        buttons.appendChild(e);
        e.id = "preferencesButton";
        e.className = "button";
        e.onclick = destroids.onPreferences;
        e.appendChild(document.createTextNode(destroids.msgPreferences));
    }    
};

/** 
 * The game reference. 
 * @private 
 * @type {destroids.Game} 
 */
destroids.Menu.prototype.game = null;

/** 
 * The HTML element. 
 * @private 
 * @type {Element} 
 */
destroids.Menu.prototype.element = null;

/** 
 * If menu is open or not. 
 * @private
 * @type {boolean} 
 */
destroids.Menu.prototype.opened = false;

/** 
 * The buttons container. 
 * @private 
 * @type {Element} 
 */
destroids.Menu.prototype.buttons = null;

/** 
 * The continue button. 
 * @private 
 * @type {Element}
 */
destroids.Menu.prototype.continueButton = null;

/** 
 * The high scores table. 
 * @private 
 * @type {Element} 
 */
destroids.Menu.prototype.highScoresTable = null;


/**
 * Opens the menu screen.
 */

destroids.Menu.prototype.open = function()
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

destroids.Menu.prototype.close = function()
{
    this.element.className = "";
    this.opened = false;
    
};


/**
 * Checks if menu is open.
 * 
 * @return {boolean} True if menu is open, false if not
 */

destroids.Menu.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the menu screen.
 * 
 * @return {Element} The root HTML element
 */

destroids.Menu.prototype.getElement = function()
{
    return this.element;
};


/**
 * Creates and returns the high scores table.
 * 
 * @return {Element} The high scores table
 * 
 * @private
 */

destroids.Menu.prototype.createHighScores = function()
{
    var table, row, cell;
    
    table = this.highScoresTable = document.createElement("table");
    table.id = "highScores";
    
    row = document.createElement("tr");
    table.appendChild(row);
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "name";
    cell.appendChild(document.createTextNode(destroids.msgName));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "level";
    cell.appendChild(document.createTextNode(destroids.msgLevel));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "score";
    cell.appendChild(document.createTextNode(destroids.msgScore));
    
    return table;
};


/**
 * Updates the high scores table.
 */

destroids.Menu.prototype.updateHighScores = function()
{
    var table, row, scores, cell, entry, i, max;
    
    table = this.highScoresTable;
    while ((row = table.lastChild))
    {
        cell = row.firstChild;
        if (!cell || (/** @type Element */ cell).tagName != "TD") break;
        table.removeChild(row);
    }
    
    scores = destroids.HighScores.getInstance().getScores();
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
            destroids.formatNumber(entry["score"])));
    }
};

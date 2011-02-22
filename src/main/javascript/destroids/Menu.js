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
    var root, e, buttons, container, indicator, localList, globalList;
    
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

    // Create the high scores container
    container = this.highScoresContainer = document.createElement("div");
    container.id = "highScoresContainer";
    container.className = "local";
    root.appendChild(container);
    
    // Create the local high score list diff
    localList = document.createElement("div");
    localList.id = "localHighScores";
    container.appendChild(localList);
    
    // Create the high score location indiciator
    indicator = document.createElement("span");
    indicator.id = "highScoresLocationIndicator";
    indicator.appendChild(document.createTextNode(destroids.msgLocalIndicator));
    localList.appendChild(indicator);
    
    // Create and append the high scores table
    localList.appendChild(this.createLocalHighScores());

    // Create the global high score list diff
    globalList = document.createElement("div");
    globalList.id = "globalHighScores";
    container.appendChild(globalList);
    
    // Create the high score location indiciator
    indicator = document.createElement("span");
    indicator.id = "highScoresLocationIndicator";
    indicator.appendChild(document.createTextNode(destroids.msgGlobalIndicator));
    globalList.appendChild(indicator);
    
    // Create and append the global high scores table
    globalList.appendChild(this.createGlobalHighScores());
    
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
 * The local high scores table. 
 * @private 
 * @type {Element} 
 */
destroids.Menu.prototype.localHighScoresTable = null;

/** 
 * The global high scores table. 
 * @private 
 * @type {Element} 
 */
destroids.Menu.prototype.globalHighScoresTable = null;

/**
 * The high scores container DIV.
 * @private
 * @type {Element}
 */
destroids.Menu.prototype.highScoresContainer = null;

/**
 * If global high scores are available.
 * @private
 * @type {boolean}
 */
destroids.Menu.prototype.hasGlobalHighScores = false;

/**
 * If high score toggle timer is running.
 * @private
 * @type {boolean}
 */
destroids.Menu.prototype.highScoreToggleTimer = false;


/**
 * Opens the menu screen.
 */

destroids.Menu.prototype.open = function()
{
    if (this.game.isGameOver())
        this.continueButton.className = "hidden-button button";
    else
        this.continueButton.className = "button";
    this.updateLocalHighScores();
    this.updateGlobalHighScores();
    
    this.element.className = "visible";
    this.opened = true;
    
    if (!this.highScoreToggleTimer)
    {
    	this.highScoreToggleTimer = true;
    	this.toggleHighScoreList.bind(this).delay(3);
    }
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
 * Toggles the high score list from local to global and vice-versa.
 * 
 * @private
 */

destroids.Menu.prototype.toggleHighScoreList = function()
{
	var oldClassName, container, newClassName;
	
	if (!this.opened)
    {
		this.highScoreToggleTimer = false;
		return;
    }	
	if (!this.game.isStopped())
	{
    	container = this.highScoresContainer;
    	oldClassName = container.className;
    	newClassName = oldClassName == "global" ? "local" : "global";
    	container.className = newClassName;
	}
    this.toggleHighScoreList.bind(this).delay(3);
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

destroids.Menu.prototype.createLocalHighScores = function()
{
    var table, row, cell;
    
    table = this.localHighScoresTable = document.createElement("table");
    table.className = "highScores";
    
    row = document.createElement("tr");
    table.appendChild(row);
    
    cell = document.createElement("th")
    row.appendChild(cell);
    cell.className = "rank";
    cell.appendChild(document.createTextNode(destroids.msgRank));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "name";
    cell.appendChild(document.createTextNode(destroids.msgName));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "level";
    cell.appendChild(document.createTextNode(destroids.msgShortLevel));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "score";
    cell.appendChild(document.createTextNode(destroids.msgScore));
    
    return table;
};


/**
 * Creates and returns the global high scores table.
 * 
 * @return {Element} The global high scores table
 * 
 * @private
 */

destroids.Menu.prototype.createGlobalHighScores = function()
{
    var table, row, cell;
    
    table = this.globalHighScoresTable = document.createElement("table");
    table.className = "highScores";
    
    row = document.createElement("tr");
    table.appendChild(row);
    
    cell = document.createElement("th")
    row.appendChild(cell);
    cell.className = "rank";
    cell.appendChild(document.createTextNode(destroids.msgRank));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "name";
    cell.appendChild(document.createTextNode(destroids.msgName));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "level";
    cell.appendChild(document.createTextNode(destroids.msgShortLevel));
    
    cell = document.createElement("th");
    row.appendChild(cell);
    cell.className = "score";
    cell.appendChild(document.createTextNode(destroids.msgScore));
    
    return table;
};


/**
 * Updates the high scores table.
 */

destroids.Menu.prototype.updateLocalHighScores = function()
{
    var table, row, scores, cell, entry, i, max;
    
    table = this.localHighScoresTable;
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
        cell.className = "rank";
        cell.appendChild(document.createTextNode("" + (i + 1)));
        
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


/**
 * Updates the global high scores table.
 */

destroids.Menu.prototype.updateGlobalHighScores = function()
{
    var data, url;
    
    this.hasGlobalHighScores = false;

    url = destroids.scoreTop5Url;
    if (!url) return;
    
    new Ajax.Request(url, {
        method: "get",
        onSuccess: this.fillGlobalHighScores.bind(this)
    });
};

/**
 * Fills the global high scores table.
 * 
 * @param {Ajax.Response} response
 *            The ajax response from the server
 */

destroids.Menu.prototype.fillGlobalHighScores = function(response)
{
    var table, row, scores, cell, entry, i, max;
    
    table = this.globalHighScoresTable;
    while ((row = table.lastChild))
    {
        cell = row.firstChild;
        if (!cell || (/** @type Element */ cell).tagName != "TD") break;
        table.removeChild(row);
    }
    
    scores = (/** @type Array.<Object> */ response.responseText.evalJSON()); 
    for (i = 0, max = scores.length; i < max; i++)
    {
        entry = scores[i];
        
        row = document.createElement("tr");
        table.appendChild(row);
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "rank";
        cell.appendChild(document.createTextNode("" + (i + 1)));
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "name";
        cell.appendChild(document.createTextNode(entry["player"]));
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "level";
        cell.appendChild(document.createTextNode(entry["level"]));
        
        cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "score";
        cell.appendChild(document.createTextNode(
            destroids.formatNumber(entry["points"])));
    }
    
    this.hasGlobalHighScores = true;
};

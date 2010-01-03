/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Hud class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new hud
 * 
 * @constructor
 * @class The hud
 */

jsteroids.Hud = function(game)
{
    var root, value, topBar, bottomBar, display;
    
    this.game = game;
    
    // Create the root element
    root = this.element = document.createElement("div");
    root.id = "hud";
    
    // Create the top HUD bar
    topBar = document.createElement("div");
    root.appendChild(topBar);
    topBar.className = "bar";
    topBar.id = "topBar";
    
    // Create the level box
    display = document.createElement("div");
    topBar.appendChild(display);
    display.id = "levelDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(jsteroids.msgLevel));
    value = this.levelElement = document.createElement("span");
    display.appendChild(value);
    value.id = "levelValue";
    value.className = "value";
    value.appendChild(document.createTextNode("1"));

    // Create the score box
    display = document.createElement("div");
    topBar.appendChild(display);
    display.id = "scoreDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(jsteroids.msgScore));
    value = this.scoreElement = document.createElement("span");
    display.appendChild(value);
    value.id = "scoreValue";
    value.className = "value";
    value.appendChild(document.createTextNode("0"));

    // Create the bottom HUD bar
    bottomBar = document.createElement("div");
    root.appendChild(bottomBar);
    bottomBar.className = "bar";
    bottomBar.id = "bottomBar";
    
    // Create the shield display
    display = document.createElement("div");
    bottomBar.appendChild(display);
    display.id = "shieldDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(jsteroids.msgShield));
    value = this.shieldElement = document.createElement("span");
    display.appendChild(value);
    value.id = "shieldValue";
    value.className = "value";
    value.appendChild(document.createTextNode("100"));
    display.appendChild(document.createTextNode("%"));

    // Create the hull box
    display = document.createElement("div");
    bottomBar.appendChild(display);
    display.id = "hullDisplay";
    display.className = "display";
    display.appendChild(document.createTextNode(jsteroids.msgHull));
    value = this.hullElement = document.createElement("span");
    display.appendChild(value);
    value.id = "hullValue";
    value.className = "value";
    value.appendChild(document.createTextNode("100"));
    display.appendChild(document.createTextNode("%"));
};

/** The game reference. @private @type {jsteroids.Game} */
jsteroids.Hud.prototype.game = null;

/** The HTML element. @private @type {HTMLElement} */
jsteroids.Hud.prototype.element = null;

/** If hud is open or not. @private @type {Boolean} */
jsteroids.Hud.prototype.opened = false;

/** The shield HTML element. @private @type {HTMLElement} */
jsteroids.Hud.prototype.shieldElement = null;

/** The hull HTML element. @private @type {HTMLElement} */
jsteroids.Hud.prototype.hullElement = null;

/** The level HTML element. @private @type {HTMLElement} */
jsteroids.Hud.prototype.levelElement = null;

/** The score HTML element. @private @type {HTMLElement} */
jsteroids.Hud.prototype.scoreElement = null;


/**
 * Opens the hud screen.
 */

jsteroids.Hud.prototype.open = function()
{
    // Stinking webOS. Can't handle transitions with CSS classes... 
    //this.element.className = "visible";
    this.element.style.opacity = 1;
    this.element.style.color = "#0f0";
    
    this.opened = true;
};


/**
 * Closes the hud screen.
 */

jsteroids.Hud.prototype.close = function()
{
    // Stinking webOS. Can't handle transitions with CSS classes... 
    //this.element.className = "hidden";
    this.element.style.opacity = 0;
    this.element.style.color = "rgba(0, 0, 0, 0)";
       
    this.opened = false;
};


/**
 * Checks if hud is open.
 * 
 * @return {Boolean} True if hud is open, false if not
 */

jsteroids.Hud.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the hud screen.
 * 
 * @return {HTMLElement} The root HTML element
 */

jsteroids.Hud.prototype.getElement = function()
{
    return this.element;
};


/**
 * Sets the shield display value.
 * 
 * @param {Number} shield
 *            The shield display value to set
 */

jsteroids.Hud.prototype.setShield = function(shield)
{
    var e;
    
    e = this.shieldElement;
    e.innerHTML = shield;
    if (shield > 50)
        e.className = "value";
    else if (shield > 25)
        e.className = "value value-warning";
    else
        e.className = "value value-critical";
};


/**
 * Sets the hull display value.
 * 
 * @param {Number} hull
 *            The hull display value to set
 */

jsteroids.Hud.prototype.setHull = function(hull)
{
    var e;
    
    e = this.hullElement;
    e.innerHTML = hull;
    if (hull > 50)
        e.className = "value";
    else if (hull > 25)
        e.className = "value value-warning";
    else
        e.className = "value value-critical";
};


/**
 * Sets the level display value.
 * 
 * @param {Number} level
 *            The level display value to set
 */

jsteroids.Hud.prototype.setLevel = function(level)
{
    this.levelElement.innerHTML = level;
};


/**
 * Sets the score display value.
 * 
 * @param {Number} score
 *            The score display value to set
 */

jsteroids.Hud.prototype.setScore = function(score)
{
    this.scoreElement.innerHTML = jsteroids.formatNumber(score);
};
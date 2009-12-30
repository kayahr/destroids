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
    var root, s, box, value;
    
    this.game = game;
    root = this.element = document.createElement("div");
    s = root.style;
    s.position = "absolute";
    s.left = s.top = s.right = s.bottom = 0;
    s.opacity = 0;
    s.color = "#0f0";
    s.fontSize = "9px";
    s.fontFamily = "sans-serif";
    s.transition = s.oTransition = s.MozTransition = s.webkitTransition =
        "color 0.5s ease-in-out, opacity 0.5s ease-in-out";
    
    // Create the shield box
    box = document.createElement("div");
    s = box.style;    
    s.background = "rgba(0, 255, 0, 0.2)";
    s.position = "absolute";
    s.left = s.bottom = 0;
    s.border = "solid rgba(0, 255, 0, 0.5)";
    s.borderWidth = "1px 1px 0 0";
    s.borderRadius = s.oBorderRadius = s.webkitBorderRadius = s.MozBorderRadius =
        "0 8px 0 0";
    s.padding = "4px";
    root.appendChild(box);
    box.appendChild(document.createTextNode("Shield: "));
    value = this.shieldElement = document.createElement("span");
    s = value.style;
    s.fontFamily = "monospace";
    s.fontWeight = "bold";
    s.fontSize = "12px";
    value.appendChild(document.createTextNode("100"));
    box.appendChild(value);
    box.appendChild(document.createTextNode(" %"));

    // Create the hull box
    box = document.createElement("div");
    s = box.style;    
    s.background = "rgba(0, 255, 0, 0.2)";
    s.position = "absolute";
    s.right = s.bottom = 0;
    s.border = "solid rgba(0, 255, 0, 0.5)";
    s.borderWidth = "1px 0 0 1px";
    s.borderRadius = s.oBorderRadius = s.webkitBorderRadius = s.MozBorderRadius =
        "8px 0 0 0";
    s.padding = "4px";
    root.appendChild(box);
    box.appendChild(document.createTextNode("Hull: "));
    value = this.hullElement = document.createElement("span");
    s = value.style;
    s.fontFamily = "monospace";
    s.fontWeight = "bold";
    s.fontSize = "12px";
    value.appendChild(document.createTextNode("100"));
    box.appendChild(value);
    box.appendChild(document.createTextNode(" %"));

    // Create the level box
    box = document.createElement("div");
    s = box.style;    
    s.background = "rgba(0, 255, 0, 0.2)";
    s.position = "absolute";
    s.left = s.top = 0;
    s.border = "solid rgba(0, 255, 0, 0.5)";
    s.borderWidth = "0 1px 1px 0";
    s.borderRadius = s.oBorderRadius = s.webkitBorderRadius = s.MozBorderRadius =
        "0 0 8px 0";
    s.padding = "4px";
    root.appendChild(box);
    box.appendChild(document.createTextNode("Level: "));
    value = this.levelElement = document.createElement("span");
    s = value.style;
    s.fontFamily = "monospace";
    s.fontWeight = "bold";
    s.fontSize = "12px";
    value.appendChild(document.createTextNode("1"));
    box.appendChild(value);

    // Create the score box
    box = document.createElement("div");
    s = box.style;    
    s.background = "rgba(0, 255, 0, 0.2)";
    s.position = "absolute";
    s.right = s.top = 0;
    s.border = "solid rgba(0, 255, 0, 0.5)";
    s.borderWidth = "0 0 1px 1px";
    s.borderRadius = s.oBorderRadius = s.webkitBorderRadius = s.MozBorderRadius =
        "0 0 0 8px";
    s.padding = "4px";
    root.appendChild(box);
    box.appendChild(document.createTextNode("Score: "));
    value = this.scoreElement = document.createElement("span");
    s = value.style;
    s.fontFamily = "monospace";
    s.fontWeight = "bold";
    s.fontSize = "12px";
    value.appendChild(document.createTextNode("0"));
    box.appendChild(value);
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
    var s;
    
    s = this.element.style;
    s.opacity = 1;
    s.color = "#0f0";
    this.opened = true;
};


/**
 * Closes the hud screen.
 */

jsteroids.Hud.prototype.close = function()
{
    var s;
    
    s = this.element.style;
    s.opacity = 0;
    s.color = "rgba(0, 0, 0, 0)";
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
    var s, e, v;
    
    v = parseInt(shield).toString();
    if (shield < 100) v = "&nbsp;" + v;
    if (shield < 10) v = "&nbsp;" + v;
    e = this.shieldElement;
    e.innerHTML = v;
    s = e.style;
    if (shield > 50)
        s.color = "inherit";
    else if (shield > 25)
        s.color = "#ff0";
    else if (shield <=50)
        s.color = "#f44";
};


/**
 * Sets the hull display value.
 * 
 * @param {Number} hull
 *            The hull display value to set
 */

jsteroids.Hud.prototype.setHull = function(hull)
{
    var s, e, v;
    
    v = parseInt(hull).toString();
    if (hull < 100) v = "&nbsp;" + v;
    if (hull < 10) v = "&nbsp;" + v;
    e = this.hullElement;
    e.innerHTML = v;
    s = e.style;
    if (hull > 50)
        s.color = "inherit";
    else if (hull > 25)
        s.color = "#ff0";
    else if (hull <=50)
        s.color = "#f44";
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
    this.scoreElement.innerHTML = score;
};
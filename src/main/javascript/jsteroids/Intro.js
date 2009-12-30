/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Intro class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new intro screen
 * 
 * @constructor
 * @class The intro screen
 */

jsteroids.Intro = function(game)
{
    var root, s, e, link;
    
    this.game = game;
    root = this.element = document.createElement("div");
    s = root.style;
    s.position = "absolute";
    s.left = "40px";
    s.top = "40px";    
    s.right = "40px";
    s.border = "1px solid rgba(0, 255, 0, 0.5)";
    s.padding = "10px";
    s.textAlign = "center";
    s.fontFamily = "sans-serif";
    s.fontSize = "12px";
    s.color = "#cc0";
    s.background = "rgba(0, 255, 0, 0.2)";
    s.opacity = 0;
    s.transition = s.oTransition = s.MozTransition = s.webkitTransition =
        "color 0.5s ease-in-out, opacity 0.5s ease-in-out";
    s.borderRadius = s.oBorderRadius = s.webkitBorderRadius = s.MozBorderRadius =
        "8px";
    e = document.createElement("div");
    s = e.style;
    s.fontFamily = "serif";
    s.fontSize = "25px";
    e.appendChild(document.createTextNode("JSteroids"));
    root.appendChild(e);
    
    e = document.createElement("div");
    s = e.style;
    s.fontSize = "12px";
    s.marginBottom = "1em";
    e.appendChild(document.createTextNode("Version 0.0.4"));
    root.appendChild(e);
    
    e = document.createElement("div");
    s = e.style;
    s.marginBottom = "3em";
    e.appendChild(document.createTextNode("Copyright © 2009 "));
    link = document.createElement("a");
    s = link.style;
    s.color = "inherit";
    s.position = "relative";
    s.zIndex = 100;
    link.href = "http://www.ailis.de/~k/";
    link.appendChild(document.createTextNode("Klaus Reimer"));
    e.appendChild(link);
    root.appendChild(e);
    
    e = document.createElement("div");
    e.appendChild(document.createTextNode("Press any key or click to start game"));
    root.appendChild(e);
};

/** The game reference. @private @type {jsteroids.Game} */
jsteroids.Intro.prototype.game = null;

/** The HTML element. @private @type {HTMLElement} */
jsteroids.Intro.prototype.element = null;

/** If intro is open or not. @private @type {Boolean} */
jsteroids.Intro.prototype.opened = false;


/**
 * Opens the intro screen.
 */

jsteroids.Intro.prototype.open = function()
{
    var s;
    
    s = this.element.style;
    s.opacity = 1;
    s.color = "#cc0";
    this.opened = true;
};


/**
 * Closes the intro screen.
 */

jsteroids.Intro.prototype.close = function()
{
    var s;
    
    s = this.element.style;
    s.opacity = 0;
    s.color = "rgba(0, 0, 0, 0)";
    this.opened = false;
};


/**
 * Checks if intro is open.
 * 
 * @return {Boolean} True if intro is open, false if not
 */

jsteroids.Intro.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the intro screen.
 * 
 * @return {HTMLElement} The root HTML element
 */

jsteroids.Intro.prototype.getElement = function()
{
    return this.element;
};

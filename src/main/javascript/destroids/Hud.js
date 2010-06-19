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
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @class The hud
 */

destroids.Hud = function(game)
{
    var root, value, topBar, bottomBar, display, ejectLabel, powerupGauge,
        powerupGaugeFill;
    
    this.game = game;
    game.getScore().onScore = this.handleScore.bind(this);
    
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
    display.appendChild(document.createTextNode(destroids.msgLevel));
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
    display.appendChild(document.createTextNode(destroids.msgScore));
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
    display.appendChild(document.createTextNode(destroids.msgShield));
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
    display.appendChild(document.createTextNode(destroids.msgHull));
    value = this.hullElement = document.createElement("span");
    display.appendChild(value);
    value.id = "hullValue";
    value.className = "value";
    value.appendChild(document.createTextNode("100"));
    display.appendChild(document.createTextNode("%"));

    // Create the eject label
    this.ejectLabel = ejectLabel = document.createElement("span");
    root.appendChild(ejectLabel);
    ejectLabel.innerHTML = destroids.msgEject;
    ejectLabel.id = "ejectLabel";
    
    this.powerupGauge = powerupGauge = document.createElement("div");
    powerupGauge.id = "powerupGauge";
    powerupGauge.style.display = "none";
    this.powerupGaugeFill = powerupGaugeFill = document.createElement("div");
    powerupGauge.appendChild(powerupGaugeFill);
    powerupGaugeFill.id = "powerupGaugeFill";
    powerupGaugeFill.style.width = 0;
    root.appendChild(powerupGauge);
};

/** 
 * The game reference. 
 * @private 
 * @type {destroids.Game} 
 */
destroids.Hud.prototype.game = null;

/** 
 * The HTML element.
 * @private 
 * @type {Element}
 */
destroids.Hud.prototype.element = null;

/** 
 * If hud is open or not. 
 * @private 
 * @type {boolean} 
 */
destroids.Hud.prototype.opened = false;

/** 
 * The shield HTML element. 
 * @private 
 * @type {Element} 
 */
destroids.Hud.prototype.shieldElement = null;

/** 
 * The hull HTML element. 
 * @private 
 * @type {Element} 
 */
destroids.Hud.prototype.hullElement = null;

/** 
 * The level HTML element.
 * @private 
 * @type {Element} 
 */
destroids.Hud.prototype.levelElement = null;

/** 
 * The score HTML element. 
 * @private 
 * @type {Element} 
 */
destroids.Hud.prototype.scoreElement = null;

/** 
 * The eject label. 
 * @private 
 * @type {Element} 
 */
destroids.Hud.prototype.ejectLabel = null;

/**
 * The eject blinker timer id
 * @private
 * @type {?number}
 */
destroids.Hud.prototype.ejectBlinker = null;

/**
 * The powerup gauge element.
 * @private
 * @type {Element}
 */
destroids.Hud.prototype.powerupGauge;

/**
 * The powerup gauge fill element.
 * @private
 * @type {Element}
 */
destroids.Hud.prototype.powerupGaugeFill;

/**
 * The current powerup timeout in milliseconds.
 * @private
 * @type {number}
 */
destroids.Hud.prototype.powerupTimeout = 0;

/**
 * The current maximum powerup timeout in milliseconds.
 * @private
 * @type {number}
 */
destroids.Hud.prototype.maxPowerupTimeout = 0;

/**
 * The current powerup timeout in percent.
 * @private
 * @type {number}
 */
destroids.Hud.prototype.powerupPercent = 0;


/**
 * Opens the hud screen.
 */

destroids.Hud.prototype.open = function()
{
    this.element.className = "visible";
    this.opened = true;
};


/**
 * Closes the hud screen.
 */

destroids.Hud.prototype.close = function()
{
    this.element.className = "";
    this.opened = false;    
};


/**
 * Checks if hud is open.
 * 
 * @return {boolean} True if hud is open, false if not
 */

destroids.Hud.prototype.isOpen = function()
{
    return this.opened;
};


/**
 * Returns the root HTML element of the hud screen.
 * 
 * @return {Element} The root HTML element
 */

destroids.Hud.prototype.getElement = function()
{
    return this.element;
};


/**
 * Sets the shield display value.
 * 
 * @param {number} shield
 *            The shield display value to set
 */

destroids.Hud.prototype.setShield = function(shield)
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
 * @param {number} hull
 *            The hull display value to set
 */

destroids.Hud.prototype.setHull = function(hull)
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
    
    if (hull > 25)
    {
        this.ejectLabel.removeClassName("warn");
        this.stopEjectBlink();
    }
    else
    {
        this.ejectLabel.addClassName("warn");
        this.startEjectBlink();
    }
};


/**
 * Sets the level display value.
 * 
 * @param {number} level
 *            The level display value to set
 */

destroids.Hud.prototype.setLevel = function(level)
{
    this.levelElement.innerHTML = level;
};


/**
 * Sets the powerup timeout in milliseconds.
 * 
 * @param {number} powerupTimeout
 *            The powerup timeout in milliseconds
 */

destroids.Hud.prototype.setPowerupTimeout = function(powerupTimeout)
{
    if (powerupTimeout != this.powerupTimeout)
    {
        this.powerupTimeout = powerupTimeout;
        this.updatePowerupGauge();
    }
}


/**
 * Sets the maximum powerup timeout in milliseconds.
 * 
 * @param {number} maxPowerupTimeout
 *            The maxmimum powerup timeout in milliseconds
 */

destroids.Hud.prototype.setMaxPowerupTimeout = function(maxPowerupTimeout)
{
    if (maxPowerupTimeout != this.maxPowerupTimeout)
    {
        this.maxPowerupTimeout = maxPowerupTimeout;
        this.updatePowerupGauge();
    }
}


/**
 * Updates the powerup gauge.
 * 
 * @private
 */

destroids.Hud.prototype.updatePowerupGauge = function()
{
    var percent;
    
    percent = Math.max(0, 0|(100 * this.powerupTimeout / this.maxPowerupTimeout));
    if (percent != this.powerupPercent)
    {
        if (!percent) this.powerupGauge.style.display = "none";
        if (!this.powerupPercent) this.powerupGauge.style.display = "block";
        if (percent)
            this.powerupGaugeFill.style.width = percent + "%";        
        this.powerupPercent = percent;
    }    
}


/**
 * Sets the score display value.
 * 
 * @param {number} score
 *            The score display value to set
 */

destroids.Hud.prototype.setScore = function(score)
{
    this.scoreElement.innerHTML = destroids.formatNumber(score);
};


/**
 * Blinks the eject label.
 * 
 * @private
 */

destroids.Hud.prototype.blinkEjectLabel = function()
{
    this.ejectLabel.toggleClassName("blink");
};


/**
 * Starts blinking the eject label.
 * 
 * @private
 */

destroids.Hud.prototype.startEjectBlink = function()
{
    if (this.ejectBlinker == null)
        this.ejectBlinker = setInterval(this.blinkEjectLabel.bind(this), 500);
};


/**
 * Stops blinking the eject label.
 * 
 * @private
 */

destroids.Hud.prototype.stopEjectBlink = function()
{
    if (this.ejectBlinker != null) clearInterval(this.ejectBlinker);
    this.ejectBlinker = null;
};


/**
 * Handles a score change.
 * 
 * @param {destroids.Score} score
 *            The score counter
 * @private
 */

destroids.Hud.prototype.handleScore = function(score)
{
	this.setScore(score.getPoints());	
};

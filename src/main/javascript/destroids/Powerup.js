/**
 * Copyright (C) 2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the base class for all drops.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */

/*
 * @require destroids.js
 */


/**
 * Constructs a new powerup.
 *
 * @param {number} type
 *            The powerup type (One of the POWERUP_* constants)
 * @param {number} timeout
 *            The powerup timeout in milliseconds
 * 
 * @constructor
 * @class Base class for all powerups
 */

destroids.Powerup = function(type, timeout)
{
    this.type = type;
    this.timeout = timeout;
};

/** 
 * The powerup type. 
 * @private 
 * @type {number} 
 */
destroids.Powerup.prototype.type;

/** 
 * The powerup timeout. 
 * @private 
 * @type {number} 
 */
destroids.Powerup.prototype.timeout;


/**
 * Returns the powerup type. This is one of the POWERUP_* constants.
 * 
 * @return {number} The powerup type
 */

destroids.Powerup.prototype.getType = function()
{
    return this.type;
};


/**
 * Returns the powerup timeout.
 * 
 * @return {number} The powerup timeout ion milliseconds
 */

destroids.Powerup.prototype.getTimeout = function()
{
    return this.timeout;
};
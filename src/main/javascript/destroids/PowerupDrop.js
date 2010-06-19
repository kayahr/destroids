/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the PowerupDrop class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new powerup drop.
 * 
 * @param {destroids.Game} game
 *            The game
 * @param {destroids.Powerup} powerup
 *            The powerup
 * 
 * @constructor
 * @extends destroids.Drop
 * @class A powerup drop
 */

destroids.PowerupDrop = function(game, powerup)
{
    destroids.Drop.call(this, game, destroids.PowerupDrop.images[powerup.getType()]);
    this.powerup = powerup;
};
twodee.inherit(destroids.PowerupDrop, destroids.Drop);

/**
 * The powerup images.
 * @private
 * @type {Array.<string>}
 */
destroids.PowerupDrop.images = [ "trilaser", "beamlaser" ];

/**
 * The powerup.
 * @private
 * @type {destroids.Powerup}
 */
destroids.PowerupDrop.prototype.powerup;


/**
 * Returns the powerup.
 * 
 * @return {destroids.Powerup} The powerup
 */

destroids.PowerupDrop.prototype.getPowerup = function()
{
    return this.powerup;
};

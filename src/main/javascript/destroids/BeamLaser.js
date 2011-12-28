/**
 * Copyright (C) 2010-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require destroids.js
 */

/**
 * Constructs a new beamlaser powerup.
 * 
 * @constructor
 * @extends {destroids.Powerup}
 * @class 
 * Beamlaser powerup.
 */
destroids.Beamlaser = function()
{
    destroids.Powerup.call(this, destroids.POWERUP_BEAMLASER, 30000);
};
twodee.inherit(destroids.Beamlaser, destroids.Powerup);

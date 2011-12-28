/**
 * Copyright (C) 2010-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require destroids.js
 */

/**
 * Constructs a new trilaser powerup.
 * 
 * @constructor
 * @extends {destroids.Powerup}
 * @class 
 * Trilaser powerup.
 */
destroids.Trilaser = function()
{
    destroids.Powerup.call(this, destroids.POWERUP_TRILASER, 30000);
};
twodee.inherit(destroids.Trilaser, destroids.Powerup);

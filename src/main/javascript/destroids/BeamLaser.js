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


/**
 * Constructs a new beamlaser powerup.
 * 
 * @constructor
 * @class Beamlaser powerup
 * @extends destroids.Powerup
 */

destroids.Beamlaser = function()
{
    destroids.Powerup.call(this, destroids.POWERUP_BEAMLASER, 30000);
};
twodee.inherit(destroids.Beamlaser, destroids.Powerup);
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
 * Constructs a new trilaser powerup.
 * 
 * @constructor
 * @class Trilaser powerup
 * @extends destroids.Powerup
 */

destroids.Trilaser = function()
{
    destroids.Powerup.call(this, destroids.POWERUP_TRILASER, 20000);
};
twodee.inherit(destroids.Trilaser, destroids.Powerup);

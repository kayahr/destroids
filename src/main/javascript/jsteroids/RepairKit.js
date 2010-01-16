/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the RepairKit class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new repair drop.
 * 
 * @param {jsteroids.Game} game
 *            The game
 * 
 * @constructor
 * @class An repair drop
 */

jsteroids.RepairKit = function(game)
{
    jsteroids.Drop.call(this, game, "repairkit");
};
twodee.inherit(jsteroids.RepairKit, jsteroids.Drop);

/** The class name. @private @type {String} */
jsteroids.RepairKit.prototype.jsonClassName = "jsteroid.RepairKit";


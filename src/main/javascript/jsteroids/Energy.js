/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Energy class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new energy drop.
 * 
 * @param {jsteroids.Game} game
 *            The game
 * 
 * @constructor
 * @class An energy drop
 */

jsteroids.Energy = function(game)
{
    jsteroids.Drop.call(this, game, "energy");
};
twodee.inherit(jsteroids.Energy, jsteroids.Drop);

/** The class name. @private @type {String} */
jsteroids.Energy.prototype.jsonClassName = "jsteroid.Energy";

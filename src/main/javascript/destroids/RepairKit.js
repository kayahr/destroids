/**
 * Copyright (C) 2009-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 *
 * @require destroids.js
 * @require destroids/Drop.js
 */

/**
 * Constructs a new repair drop.
 * 
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends {destroids.Drop}
 * @class 
 * A repair kit drop.
 */
destroids.RepairKit = function(game)
{
    destroids.Drop.call(this, game, "repairkit");
};
twodee.inherit(destroids.RepairKit, destroids.Drop);



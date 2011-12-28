/**
 * Copyright (C) 2009-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require destroids.js
 */

/**
 * Constructs a new energy drop.
 * 
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends {destroids.Drop}
 * @class 
 * An energy drop.
 */
destroids.Energy = function(game)
{
    destroids.Drop.call(this, game, "energy");
};
twodee.inherit(destroids.Energy, destroids.Drop);

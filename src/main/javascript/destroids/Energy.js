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
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends destroids.Drop
 * @class An energy drop
 */

destroids.Energy = function(game)
{
    destroids.Drop.call(this, game, "energy");
};
twodee.inherit(destroids.Energy, destroids.Drop);

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
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends destroids.Drop
 * @class An repair drop
 */

destroids.RepairKit = function(game)
{
    destroids.Drop.call(this, game, "repairkit");
};
twodee.inherit(destroids.RepairKit, destroids.Drop);



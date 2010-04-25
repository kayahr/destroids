/**
 * @type {Object}
 */
var destroids;

/**
 * @type {number}
 */
destroids.SND_SPACESHIP_THRUST;

/**
 * @type {number} 
 */
destroids.SND_SPACESHIP_FIRE;

/**
 * @type {number} 
 */
destroids.SND_EJECT;

/** 
 * @type {number} 
 */
destroids.SND_UFO_FIRE;

/**
 * @type {number} 
 */
destroids.SND_SMALL_ASTEROID_DESTROYED;

/**
 * @type {number} 
 */
destroids.SND_LARGE_ASTEROID_DESTROYED;

/**
 * @type {number} 
 */
destroids.SND_UFO_HULL_DAMAGE;

/**
 * @type {number} 
 */
destroids.SND_UFO_DESTROYED;

/**
 * @type {number} 
 */
destroids.SND_DROP_DESTROYED;

/**
 * @type {number} 
 */
destroids.SND_SPACESHIP_SHIELD_DAMAGE;

/**
 * @type {number} 
 */
destroids.SND_SPACESHIP_HULL_DAMAGE;

/**
 * @type {number} 
 */
destroids.SND_SPACESHIP_DESTROYED ;

/**
 * @type {number} 
 */
destroids.SND_COLLECT_DROP;

/**
 * @type {number} 
 */
destroids.SND_LEVEL_UP;


/**
 * @constructor
 * @param {string} containerId
 * @param {boolean} autoStart
 */
destroids.Game = function(containerId, autoStart) {};

/**
 */
destroids.Game.prototype.resetHighScores = function() {};

/**
 */
destroids.Game.prototype.gotoMenu = function() {};

/**
 */
destroids.Game.prototype.resume = function() {};

/**
 */
destroids.Game.prototype.pause = function() {};

/**
 */
destroids.Game.prototype.start = function() {};

/**
 */
destroids.Game.prototype.stop = function() {};


/**
 * @return {boolean}
 */
destroids.Game.prototype.isMenuOpen = function() {};
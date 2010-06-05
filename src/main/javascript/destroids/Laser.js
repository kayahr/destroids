/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Laser class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new laser shot.
 * 
 * @param {destroids.Game} game
 *            The game
 * @param {boolean=} alien
 *            Set to true if this is an alien laser. Optional, defaults to false
 * 
 * @constructor
 * @extends twodee.PolygonNode
 * @class A Laser
 */

destroids.Laser = function(game, alien)
{
	var physics;
	
    this.game = game;
    
    twodee.PolygonNode.call(this, destroids.LASER);
    this.setFillStyle(alien ? "#4f4" : "orange");

    // Remember that this is an alien laser
    if (alien) this.alien = true;
    
    // Set the Lasers physics model
    physics = new twodee.Physics();
    physics.setLifetime(alien ? 2 : 0.75);
    physics.setDecay(alien ? 0.5 : 0.2);
    this.setPhysics(physics);
    
    // Enable cotwodee.PolygonNodellision detection
    this.setCollisionType(destroids.TYPE_LASER);
    this.setCollisionMask(destroids.TYPE_ASTEROID | destroids.TYPE_DROP |
         destroids.TYPE_UFO | destroids.TYPE_SPACESHIP);
    this.connect("collisionStarted", this.handleCollide, this);
};
twodee.inherit(destroids.Laser, twodee.PolygonNode);

/** The game. @private @type {destroids.Game} */
destroids.Laser.prototype.game = null;

/** If this is an alien laser. @private @type {boolean} */
destroids.Laser.prototype.alien = false;


/**
 * Handles collision.
 * 
 * @param {destroids.Laser} laser
 *            The laser
 * @param {twodee.SceneNode} collider
 *            The node the laser collided with
 */

destroids.Laser.prototype.handleCollide = function(laser, collider)
{
    if (collider instanceof destroids.Asteroid)
    {
        laser.remove();
        if (this.alien)
        {
            collider.getParentNode().appendChild(new destroids.Asteroid(this.game,
                collider.isSmall()));
            collider.destroy(true);
        }
        else
        {
            // Score points for the asteroid
        	if (!this.game.isGameOver())
        	{
	        	if (collider.isSmall())
	        		this.game.getScore().register(50 * this.game.getLevel(), 5);
	        	else
	        		this.game.getScore().register(20 * this.game.getLevel(), 6);
        	}
            collider.destroy();
        }
    }
    
    else if (collider instanceof destroids.Drop)
    {
        collider.destroy();
        laser.remove();
    }
    
    else if (collider instanceof destroids.Ufo && !this.alien)
    {
        this.game.explode(laser, 3);
        laser.remove();
        collider.addDamage(100);
    }

    else if (collider instanceof destroids.Spaceship && this.alien)
    {
        this.game.explode(laser, 3);
        laser.remove();
        collider.addDamage(75);
    }
};


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {number} delta
 *            The time delta in milliseconds
 * @override
 */

destroids.Laser.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, bbox, game;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    
    transform = this.getTransform();

    // Calculate the maximum x and y radius of the position
    bbox = this.getBounds().getBoundingBox();
    game = this.game;
    xRadius = (game.getWidth() + bbox.getWidth()) / 2;
    yRadius = (game.getHeight() + bbox.getHeight()) / 2;
    
    // Don't wrap stuff around if player is ejecting 
    if (game.isEjecting()) return;
    
    // Correct the position if out of screen
    x = transform.m02;
    y = transform.m12;
    if (x > xRadius) transform.m02 = -xRadius;
    if (x < -xRadius) transform.m02 = xRadius;
    if (y > yRadius) transform.m12 = -yRadius;
    if (y < -yRadius) transform.m12 = yRadius;   
};

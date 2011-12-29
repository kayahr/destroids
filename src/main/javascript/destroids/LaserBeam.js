/**
 * Copyright (C) 2009-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 *
 * @require destroids.js
 * @require twodee/PolygonNode.js
 * @use twodee/Physics.js
 */

/**
 * Constructs a new laser shot.
 * 
 * @param {!destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends {twodee.PolygonNode}
 * @class 
 * A Laser beam.
 */
destroids.LaserBeam = function(game)
{
	var physics;
	
    this.game = game;
    
    twodee.PolygonNode.call(this, destroids.LASERBEAM);
    this.setFillStyle("red");
    
    // Set the Lasers physics model
    physics = new twodee.Physics();
    physics.setLifetime(0.2);
    physics.setDecay(0.2);
    this.setPhysics(physics);
    
    // Enable cotwodee.PolygonNodellision detection
    this.setCollisionType(destroids.TYPE_LASER);
    this.setCollisionMask(destroids.TYPE_ASTEROID | destroids.TYPE_DROP |
         destroids.TYPE_UFO | destroids.TYPE_SPACESHIP);
    this.connect("collisionStarted", this.handleCollide, this);
};
twodee.inherit(destroids.LaserBeam, twodee.PolygonNode);

/** 
 * The game. 
 * @private 
 * @type {!destroids.Game} 
 */
destroids.LaserBeam.prototype.game;

/**
 * Handles collision.
 * 
 * @param {destroids.LaserBeam} laser
 *            The laser
 * @param {twodee.SceneNode} collider
 *            The node the laser collided with
 */
destroids.LaserBeam.prototype.handleCollide = function(laser, collider)
{
    if (collider instanceof destroids.Asteroid)
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
    
    else if (collider instanceof destroids.Drop)
    {
        if (!collider.isInvulnerable())
        {
            collider.destroy();
        }
    }
    
    else if (collider instanceof destroids.Ufo)
    {
        this.game.explode(collider, 3);
        collider.addDamage(100);
    }
};

/**
 * @see twodee.PolygonNode#update
 * 
 * @param {number} delta
 *            The time delta in milliseconds
 * @override
 */
destroids.LaserBeam.prototype.update = function(delta)
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

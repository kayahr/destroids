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
 * @param {jsteroids.Game} game
 *            The game
 * 
 * @constructor
 * @class An Laser
 */

jsteroids.Laser = function(game)
{
    this.game = game;
    
    twodee.PolygonNode.call(this, jsteroids.LASER);
    this.setFillStyle("orange");
    
    // Set the Lasers physics model
    physics = new twodee.Physics();
    physics.setLifetime(0.75);
    physics.setDecay(0.2);
    this.setPhysics(physics);
    
    // Enable collision detection
    this.setCollidable(true);
    this.connect("collisionStarted", this.handleCollide, this);
};
twodee.inherit(jsteroids.Laser, twodee.PolygonNode);

/** The class name. @private @type {String} */
jsteroids.Laser.prototype.jsonClassName = "jsteroid.Laser";

/** The game. @private @type {jsteroids.Game} */
jsteroids.Laser.prototype.game = null; 


/**
 * Handles collision.
 * 
 * @param {jsteroids.Laser} laser
 *            The laser
 * @param {twodee.SceneNode} collider
 *            The node the laser collided with
 */

jsteroids.Laser.prototype.handleCollide = function(laser, collider)
{
    if (collider instanceof jsteroids.Asteroid)
    {
        laser.remove();
        collider.destroy();
    }
};


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {Number} delta
 *            The time delta in milliseconds
 */

jsteroids.Laser.prototype.update2 = function(delta)
{
    var x, y, transform, xRadius, yRadius, bbox, game;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    
    transform = this.getTransform();
    
    // Calculate the maximum x and y radius of the position
    bbox = this.getBounds().getBoundingBox();
    game = this.game;
    xRadius = (game.width + bbox.getWidth()) / 2;
    yRadius = (game.height + bbox.getHeight()) / 2;
    
    // Correct the position if out of screen
    x = transform.m02;
    y = transform.m12;
    if (x > xRadius || x < -xRadius || y > yRadius || y < -yRadius)
        this.remove();
};


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {Number} delta
 *            The time delta in milliseconds
 */

jsteroids.Laser.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, bbox, game;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    
    transform = this.getTransform();

    // Calculate the maximum x and y radius of the position
    bbox = this.getBounds().getBoundingBox();
    game = this.game;
    xRadius = (game.width + bbox.getWidth()) / 2;
    yRadius = (game.height + bbox.getHeight()) / 2;
    
    // Correct the position if out of screen
    x = transform.m02;
    y = transform.m12;
    if (x > xRadius) transform.m02 = -xRadius;
    if (x < -xRadius) transform.m02 = xRadius;
    if (y > yRadius) transform.m12 = -yRadius;
    if (y < -yRadius) transform.m12 = yRadius;   
};

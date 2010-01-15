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
 * @param {Boolean} alien
 *            Set to true if this is an alien laser
 * 
 * @constructor
 * @class A Laser
 */

jsteroids.Laser = function(game, alien)
{
    this.game = game;
    
    twodee.PolygonNode.call(this, jsteroids.LASER);
    this.setFillStyle(alien ? "#4f4" : "orange");

    // Remember that this is an alien laser
    if (alien) this.alien = true;
    
    // Set the Lasers physics model
    physics = new twodee.Physics();
    physics.setLifetime(alien ? 2 : 0.75);
    physics.setDecay(alien ? 0.5 : 0.2);
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

/** If this is an alien laser. @private @type {Boolean} */
jsteroids.Laser.prototype.alien = false;


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
    var parent;
    
    if (collider instanceof jsteroids.Asteroid)
    {
        laser.remove();
        if (this.alien)
        {
            // In some situations collider has no parent. Don't know
            // why (MOst likely because asteroid is already destroyed)
            // but just in case we check it here
            parent = collider.getParentNode();
            if (parent)
            {
                parent.appendChild(new jsteroids.Asteroid(this.game,
                    collider.isSmall()));
                collider.destroy(true);
            }
        }
        else
        {
            // Score points for the asteroid
            this.game.addScore(20 + (collider.isSmall() ? 30 : 0));
            
            collider.destroy();
        }
    }
    
    else if (collider instanceof jsteroids.Energy)
    {
        collider.destroy();
        laser.remove();
    }
    
    else if (collider instanceof jsteroids.Ufo && !this.alien)
    {
        this.game.explode(laser, 3);
        laser.remove();
        collider.addDamage(100);
    }

    else if (collider instanceof jsteroids.Spaceship && this.alien)
    {
        this.game.explode(laser, 3);
        laser.remove();
        collider.addDamage(75);
    }
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

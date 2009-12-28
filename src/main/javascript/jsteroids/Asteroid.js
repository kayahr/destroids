/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Asteroid class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new asteroid.
 * 
 * @param {jsteroids.Game} game
 *            The game
 * @param {jsteroids.Asteroid} parentAsteroid
 *            The parent asteroid if this asteroid is created from a destroyed
 *            parent asteroid
 * 
 * @constructor
 * @class An asteroid
 */

jsteroids.Asteroid = function(game, parentAsteroid)
{
    var type, image, heading, minSpeed, maxSpeed, xRadius, yRadius, radius,
        astXRadius, astYRadius, bounds, bbox, level, transform;    
    
    this.game = game;
    level = game.getLevel();
    
    // Set the ancestor level
    if (parentAsteroid) this.ancestor = parentAsteroid.ancestor + 1;
    
    // Determine the asteroid type
    type = parseInt(Math.random() * jsteroids.asteroids); 

    // Load the asteroid image and construct the image node with it
    image = new Image();
    image.src = jsteroids.imagesDir + "/asteroid" + (type + 1) + ".png";
    twodee.ImageNode.call(this, image);
    transform = this.getTransform();

    // Set the asteroids physics model
    physics = new twodee.Physics();
    this.setPhysics(physics);
    
    // Set the asteroid bounds
    this.setBounds(bounds = jsteroids.ASTEROID_BOUNDS[type]);
    
    // Get the asteroid radius
    bbox = bounds.getBoundingBox();
    this.xRadius = astXRadius = bbox.getWidth() / 2;
    this.yRadius = astYRadius = bbox.getHeight() / 2;
    
    // Calculate a random heading and a level-specific speed
    heading = 22.5 + Math.random() * 45 + parseInt(Math.random() * 4) * 90;
    minSpeed = 25 + level * 5;
    maxSpeed = 50 + level * 5;
    physics.getVelocity().set(minSpeed + Math.random() * (maxSpeed - minSpeed),
        0).rotate(heading * Math.PI / 180);
    
    // Calculate a random spin
    physics.setSpin((25 + Math.random() * 45) * Math.PI / 180 *
        (parseInt(Math.random() * 2) ? 1 : -1));

    // Calculate a random start position
    if (parentAsteroid)
    {
        transform.setTransform(parentAsteroid.getTransform());
    }
    else
    {
        xRadius = game.width / 2 + astXRadius;
        yRadius = game.height / 2 + astYRadius;
        radius = Math.sqrt(xRadius * xRadius + yRadius * yRadius);
        transform.rotate(Math.random() * Math.PI * 2).
            translate(radius, 0);
    }
    
    // Scale the asteroid according to its ancestor level
    transform.scale(1 / this.ancestor);
    
    // Enable collision detection
    this.setCollidable(true);
};
twodee.inherit(jsteroids.Asteroid, twodee.ImageNode);

/** The class name. @private @type {String} */
jsteroids.Asteroid.prototype.jsonClassName = "jsteroid.Asteroid";

/** The game. @private @type {jsteroids.Game} */
jsteroids.Asteroid.prototype.game = null; 
    
/** The x radius of the asteroid. @private @type {Number} */
jsteroids.Asteroid.prototype.xRadius = null;

/** The y radius of the asteroid. @private @type {Number} */
jsteroids.Asteroid.prototype.yRadius = null;

/** The ancestor level. @private @type {Number} */
jsteroids.Asteroid.prototype.ancestor = 1;


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {Number} delta
 *            Number of milliseconds since last update 
 */

jsteroids.Asteroid.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, game;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    transform = this.getTransform();
    game = this.game;
    xRadius = game.width / 2 + this.xRadius;
    yRadius = game.height / 2 + this.yRadius;
    x = transform.m02;
    y = transform.m12;
    if (x > xRadius) transform.m02 = -xRadius;
    if (x < -xRadius) transform.m02 = xRadius;
    if (y > yRadius) transform.m12 = -yRadius;
    if (y < -yRadius) transform.m12 = yRadius;
};


/**
 * Destroys the asteroid. 
 */

jsteroids.Asteroid.prototype.destroy = function()
{
    var i;

    // Trigger an explosion at the location of the asteroid
    this.game.explode(this);
    
    // Score points for the asteroid
    this.game.addScore(this.ancestor);

    // If ancestor level is not low enough then spawn new asteroids.
    if (this.ancestor < 2)
        for (i = 0; i < 4; i++)
            this.game.addAsteroid(this);
    
    // Remove the asteroid
    this.game.removeAsteroid();
    this.remove();
};

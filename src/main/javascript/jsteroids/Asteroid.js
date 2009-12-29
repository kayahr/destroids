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
 * @param {Number} subId
 *            The sub id if asteroid is spawned from a parent asteroid. Must
 *            be between 0 and 3. This number is used to calculate the initial
 *            position (relative to the parent asteroid) and the heading.
 * 
 * @constructor
 * @class An asteroid
 */

jsteroids.Asteroid = function(game, parentAsteroid, subId)
{
    var type, image, heading, speed, xRadius, yRadius, radius, tmp,
        astXRadius, astYRadius, bounds, bbox, level, transform;    
    
    this.game = game;
    game.addAsteroid();
    level = game.getLevel();
    
    // Set the descendant level
    if (parentAsteroid) this.descendant = parentAsteroid.descendant + 1;
    
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
    
    if (parentAsteroid)
    {
        // Calclate a heading based on the parent asteroid heading and the
        // sub id
        heading = (45 + Math.random() * 45) * subId -
            parentAsteroid.getPhysics().getVelocity().
            getAngle(new twodee.Vector(0, 1)) * 180 / Math.PI;
    }
    else
    {
        // Calculate a random heading
        heading = 22.5 + Math.random() * 45 + parseInt(Math.random() * 4) * 90;
    }
    
    // Make sure the heading is a good one (To prevent the asteroid moving
    // constantly in the void)
    tmp = (heading % 360 + 360) % 90;
    if (tmp < 22.5) heading += (22.5 - tmp);
    if (tmp > 90 - 22.5) heading -= tmp - (90 - 22.5);    
    
    // Calculate a level (and descendant) specific speed
    speed = 25 * this.descendant + level * 5;
    
    // Calculate and apply the velocity vector
    physics.getVelocity().set(0, speed).rotate(heading * Math.PI / 180);
    
    // Calculate a random spin
    physics.setSpin((25 + Math.random() * 45) * Math.PI / 180 *
        (parseInt(Math.random() * 2) ? 1 : -1));

    // Calculate a random start position
    if (parentAsteroid)
    {
        offset = new twodee.Vector(0, 8).rotate(Math.PI / 2 * subId);
        transform.setTransform(parentAsteroid.getTransform()).translate(
                offset.x, offset.y);
                
    }
    else
    {
        xRadius = game.width / 2 + astXRadius;
        yRadius = game.height / 2 + astYRadius;
        radius = Math.sqrt(xRadius * xRadius + yRadius * yRadius);
        transform.rotate(Math.random() * Math.PI * 2).
            translate(radius, 0);
    }
    
    // Scale the asteroid according to its descendant level
    transform.scale(1 / this.descendant);
    
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

/** The descendant level. @private @type {Number} */
jsteroids.Asteroid.prototype.descendant = 1;


/**
 * Returns the descendent level. This is one for the large asteroid and
 * 2 for the smaller asteroid.
 * 
 * @return {Number} The descendant level 
 */

jsteroids.Asteroid.prototype.getDescendant = function()
{
    return this.descendant;
};


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
 * 
 * @param {Boolean} noDescendants
 *            Set to true to prevent descendants
 */

jsteroids.Asteroid.prototype.destroy = function(noDescendants)
{
    var i;

    // Trigger an explosion at the location of the asteroid
    this.game.explode(this);
    
    // Score points for the asteroid
    this.game.addScore(20 + (this.descendant - 1) * 30);

    // If descendant level is not low enough then spawn new asteroids.
    if (!noDescendants && this.descendant < 2)
        for (i = 0; i < 4; i++)
            this.parentNode.appendChild(new jsteroids.Asteroid(this.game, this, i));
    
    // Remove the asteroid
    this.game.removeAsteroid();
    this.remove();
};

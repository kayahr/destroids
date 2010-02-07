/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Ufo class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new UFO
 * 
 * @constructor
 * @class An UFO
 */

jsteroids.Ufo = function(game)
{
    var image, bbox, ufoXRadius, ufoYRadius, xRadius, yRadius, radius, bounds,
        rotation;
    
    this.game = game;
    
    // Load the image and setup the image node with it
    image = new Image();
    image.src = jsteroids.imagesDir + "/ufo.png";
    twodee.ImageNode.call(this, image);
    
    // Set the bounds
    this.setBounds(bounds = jsteroids.UFO_BOUNDS);
    
    // Apply physics
    this.setPhysics(new twodee.Physics());
    
    // Get the asteroid radius
    bbox = bounds.getBoundingBox();
    ufoXRadius = bbox.getWidth() / 2;
    ufoYRadius = bbox.getHeight() / 2;
    
    // Calculate starting position
    xRadius = game.width / 2 + ufoXRadius;
    yRadius = game.height / 2 + ufoYRadius;
    radius = Math.sqrt(xRadius * xRadius + yRadius * yRadius);
    rotation = Math.random() * Math.PI * 2;
    this.getTransform().rotate(rotation).
        translate(radius, 0).rotate(-rotation);
    
    // Enable collision detection
    this.setCollisionType(jsteroids.TYPE_UFO);
    this.setCollisionMask(jsteroids.TYPE_ASTEROID);
    this.connect("collisionStarted", this.handleCollide, this);
        
    jsteroids.Ufo.counter++;
};
twodee.inherit(jsteroids.Ufo, twodee.ImageNode);

/** The number of active UFOs. @private @type {Number} */
jsteroids.Ufo.counter = 0;

/** The game. @private @type {jsteroids.Game} */
jsteroids.Ufo.prototype.game = null;

/** The timeout for the next course change. @private @type {Number} */ 
jsteroids.Ufo.prototype.nextCourseChange = 0;

/** The timeout for the next laser firing. @private @type {Number} */ 
jsteroids.Ufo.prototype.nextFire = 3000;

/** The UFO hull. @private @type {Number} */
jsteroids.Ufo.prototype.hull = 300;



/**
 * Handles collision.
 * 
 * @param {jsteroids.Ufo} ufo
 *            The UFO
 * @param {twodee.SceneNode} collider
 *            The node the spaceship collided with
 */

jsteroids.Ufo.prototype.handleCollide = function(ufo, collider)
{
    var parent;
    
    if (collider instanceof jsteroids.Asteroid)
    {
        parent = collider.getParentNode();
        if (!parent) return;
        parent.appendChild(
            new jsteroids.Asteroid(this.game, collider.isSmall()));
        collider.destroy(true);
    }
};


/**
 * Changes the course randomly.
 * 
 * @private
 */


jsteroids.Ufo.prototype.changeCourse = function()
{
    var heading, tmp;
    
    // Calculate a random heading
    heading = 22.5 + Math.random() * 45 + parseInt(Math.random() * 4) * 90;

    // Make sure the heading is a good one (To prevent the UFO moving
    // constantly in the void)
    tmp = (heading % 360 + 360) % 90;
    if (tmp < 22.5) heading += (22.5 - tmp);
    if (tmp > 90 - 22.5) heading -= tmp - (90 - 22.5);    

    // Calculate random speed
    speed = 33 + Math.random() * 33;
    
    // Calculate and apply the velocity vector
    this.getPhysics().getVelocity().set(0, speed).
        rotate(heading * Math.PI / 180);
    
    // Set timeout for next course change
    this.nextCourseChange = 2500 + Math.random() * 5000;
};


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {Number} delta
 *            The time delta in milliseconds
 */

jsteroids.Ufo.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, bbox;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    
    // Do initial course change
    if ((this.nextCourseChange -= delta) < 0) this.changeCourse();

    // Do initial course change
    if ((this.nextFire -= delta) < 0) this.fireLaser();

    // Update physics
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


/**
 * Destroys the UFO. 
 */

jsteroids.Ufo.prototype.destroy = function()
{
    this.game.playSound(jsteroids.SND_UFO_DESTROYED);

    // Trigger an explosion at the location of the UFO
    this.game.explode(this, 2);
    
    // Score points for the UFO
    this.game.addScore(100);

    // Drop some energy
    if (!this.game.isGameOver()) this.dropStuff();
    
    // Remove the UFO
    this.remove();
    
    jsteroids.Ufo.counter--;
};


/**
 * Returns the number of active UFOs.
 * 
 * @return {Number} The number of active UFOs.
 */

jsteroids.Ufo.count = function()
{
    return this.counter;
};


/**
 * Fires the laser cannon.
 * 
 * @private
 */

jsteroids.Ufo.prototype.fireLaser = function()
{
    var laser, transform, speed, angle;
    
    this.game.playSound(jsteroids.SND_UFO_FIRE);

    speed = 100;
    angle = Math.random() * 2 * Math.PI;
    laser = new jsteroids.Laser(this.game, true);
    transform = this.getTransform();
    laser.getTransform().setTransform(transform).translate(0, (angle > Math.PI / 2 && angle < Math.PI * 1.5) ? 10 : -10).rotate(angle);
    laser.getPhysics().getVelocity().set(0, -speed).
        rotate(angle);
    this.parentNode.appendChild(laser);
    this.nextFire = 2000;
};


/**
 * Adds damage to the ship.
 * 
 * @param {Number} damage
 *            The damage to add
 */

jsteroids.Ufo.prototype.addDamage = function(damage)
{
    this.game.playSound(jsteroids.SND_UFO_HULL_DAMAGE);

    this.hull = Math.max(0, this.hull - damage);
    if (!this.hull) this.destroy();
};


/**
 * Drops some stuff.
 * 
 * @private 
 */

jsteroids.Ufo.prototype.dropStuff = function()
{
    var spaceship, hull, shield, drops, drop, transform;
    
    drops = [];
    spaceship = this.game.getSpaceship();
    hull = spaceship.getHull();
    shield = spaceship.getShield();
    
    if (hull < 100) drops.push(jsteroids.RepairKit);
    if (shield < 150) drops.push(jsteroids.Energy);
    
    // If nothing to drop then do nothing
    if (!drops.length) return;
    
    dropClass = drops[parseInt(Math.random() * drops.length)];    
    drop = new dropClass(this.game);
    transform = this.getTransform();
    drop.getTransform().setTransform(transform);
    this.getPhysics().getVelocity().copy(drop.getPhysics().getVelocity());
    this.parentNode.appendChild(drop);       
};
/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Spaceship class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new jsteroids.Spaceship
 * 
 * @constructor
 * @class The players jsteroids.Spaceship
 */

jsteroids.Spaceship = function(game)
{
    var image, physics, mainThrust, leftThrust, rightThrust;
    
    this.game = game;
    
    // Load the image and setup the image node with it
    image = new Image();
    image.src = jsteroids.imagesDir + "/spaceship.png";
    twodee.ImageNode.call(this, image);
    
    // Set the bounds
    this.setBounds(jsteroids.SPACESHIP_BOUNDS);
    
    // Append the main thrust node
    this.mainThrust = mainThrust = new twodee.PolygonNode(jsteroids.MAIN_THRUST);
    mainThrust.setFillStyle("orange");
    mainThrust.disable();
    this.appendChild(mainThrust);
    
    // Append the left thrust node
    this.leftThrust = leftThrust = new twodee.PolygonNode(jsteroids.LEFT_THRUST);
    leftThrust.setFillStyle("orange");
    leftThrust.disable();
    this.appendChild(leftThrust);
    
    // Append the right thrust node
    this.rightThrust = rightThrust = new twodee.PolygonNode(jsteroids.RIGHT_THRUST);
    rightThrust.setFillStyle("orange");
    rightThrust.disable();
    this.appendChild(rightThrust);
    
    // Setup the spaceship physics
    physics = new twodee.Physics();
    physics.setMaxVelocity(200);
    physics.setMaxSpin(200 * Math.PI / 180);
    physics.setMinSpin(-200 * Math.PI / 180);
    this.setPhysics(physics);
    
    // Enable collision detection
    this.setCollidable(true);
    this.connect("collisionStarted", this.handleCollide, this);
};
twodee.inherit(jsteroids.Spaceship, twodee.ImageNode);

/** The yaw thrust. @private @final @type {Number} */
jsteroids.Spaceship.YAW = 400 * Math.PI / 180;

/** The thrust. @private @final @type {Number} */
jsteroids.Spaceship.THRUST = 250;

/** The game. @private @type {jsteroids.Game} */
jsteroids.Spaceship.prototype.game = null; 
    
/** The current thrust. @private @type {Number} */
jsteroids.Spaceship.prototype.thrust = 0;

/** The current yaw. @private @type {Number} */
jsteroids.Spaceship.prototype.yaw = 0;

/** The main thrust node. @private @type {twodee.SceneNode} */
jsteroids.Spaceship.prototype.mainThrust = null;

/** The right thrust node. @private @type {twodee.SceneNode} */
jsteroids.Spaceship.prototype.rightThrust = null;

/** The left thrust node. @private @type {twodee.SceneNode} */
jsteroids.Spaceship.prototype.leftThrust = null;

/** If laser is currently firing. @private @type {Boolean} */
jsteroids.Spaceship.prototype.laserFiring = false;

/** The last time the laser was fired. @private @type {Number} */
jsteroids.Spaceship.prototype.lastLaserFire = 0;

/** The fire rate (shots per second). @private @type {Number} */
jsteroids.Spaceship.prototype.fireRate = 4;

/** If ship is currently yawing. @private @type {Boolean} */
jsteroids.Spaceship.prototype.yawing = false;

/** The shield strength in percent. @private @type {Number} */
jsteroids.Spaceship.prototype.shield = 100;

/** The hull strength in percent. @private @type {Number} */
jsteroids.Spaceship.prototype.hull = 100;


/**
 * Starts thrust forward.
 */

jsteroids.Spaceship.prototype.startThrust = function()
{
    this.thrust = jsteroids.Spaceship.THRUST * this.hull / 100;
    this.mainThrust.enable();
};


/**
 * Stops thrust forward.
 */

jsteroids.Spaceship.prototype.stopThrust = function()
{
    this.thrust = 0;
    this.mainThrust.disable();
};


/**
 * Yaws the spaceship to the left.
 */

jsteroids.Spaceship.prototype.yawLeft = function()
{
    this.physics.setSpinAcceleration(-jsteroids.Spaceship.YAW * this.hull / 100);
    this.yawing = true;
};


/**
 * Yaws the spaceship to the right.
 */

jsteroids.Spaceship.prototype.yawRight = function()
{
    this.physics.setSpinAcceleration(jsteroids.Spaceship.YAW * this.hull / 100);
    this.yawing = true;
};


/**
 * Stops yaw.
 */

jsteroids.Spaceship.prototype.stopYaw = function()
{
    this.physics.setSpinAcceleration(0);
    this.yawing = false;
};


/**
 * Starts firing the laser cannon.
 */

jsteroids.Spaceship.prototype.startFireLaser = function()
{
    this.laserFiring = true;
};


/**
 * Stops firing the laser cannon.
 */

jsteroids.Spaceship.prototype.stopFireLaser = function()
{
    this.laserFiring = false;
};


/**
 * Fires the laser cannon.
 * 
 * @private
 */

jsteroids.Spaceship.prototype.fireLaser = function()
{
    var laser, transform, speed, bbox;
    
    speed = jsteroids.Spaceship.THRUST * 1.2;
    bbox = this.getBounds().getBoundingBox();
    laser = new jsteroids.Laser(this.game);
    transform = this.getTransform();
    laser.getTransform().setTransform(transform).translate(0, -24);
    laser.getPhysics().getVelocity().set(0, -speed).
        rotate(transform.getRotationAngle()).add(this.physics.getVelocity());
    this.parentNode.appendChild(laser);
};


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {Number} delta
 *            The time delta in milliseconds
 */

jsteroids.Spaceship.prototype.update = function(delta)
{
    var x, y, transform, acceleration, xRadius, yRadius, bbox, game, now,
        physics, spinAcceleration;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    
    // Fire the laser if needed
    if (this.laserFiring)
    {
        now = new Date().getTime();
        if (this.lastLaserFire + 1000 / (this.fireRate * this.hull / 100) < now)
        {
            this.fireLaser();
            this.lastLaserFire = now;
        }
    }
    
    physics = this.physics;
    spin = physics.getSpin();
        
    // Auto-pilot
    if (!this.yawing)
    {
        if (spin)
        {
            if (Math.abs(spin) * 180 / Math.PI > 1)
                physics.setSpinAcceleration(Math.min(
                    jsteroids.Spaceship.YAW * this.hull / 100, Math.abs(spin) * 5) *
                    (spin < 0 ? 1 : -1));
            else
            {
               physics.setSpin(0);
               physics.setSpinAcceleration(0);
            }
        }
    }

    // Animate left and right thrust
    spinAcceleration = physics.getSpinAcceleration();
    this.animateLeftThrust(spinAcceleration);
    this.animateRightThrust(spinAcceleration);

    // Animate the first vector of the main thrust polygon
    this.animateMainThrust();
    
    // Update physics
    transform = this.getTransform();    
    acceleration = physics.getAcceleration();
    acceleration.set(0, -this.thrust);
    if (this.thrust) acceleration.rotate(transform.getRotationAngle());
    
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
 * Animates the main thrust polygon.
 * 
 * @private
 */

jsteroids.Spaceship.prototype.animateMainThrust = function()
{
    var orig, xDelta, yDelta;
   
    this.mainThrust.setOpacity(this.thrust / jsteroids.Spaceship.THRUST);
    orig = jsteroids.MAIN_THRUST.getVertex(0);
    xDelta = 1 - Math.random() * 2; 
    yDelta = 2 - Math.random() * 4;
    this.mainThrust.getPolygon().getVertex(0).set(
        orig.x + xDelta, orig.y + yDelta);
};


/**
 * Animates the right thrust polygon.
 * 
 * @private
 */

jsteroids.Spaceship.prototype.animateRightThrust = function(acceleration)
{
    var orig, xDelta, yDelta;
   
    if (acceleration > 0)
    {
        this.rightThrust.setOpacity(acceleration / jsteroids.Spaceship.YAW);
        orig = jsteroids.RIGHT_THRUST.getVertex(0);
        xDelta = 2 - Math.random() * 4; 
        yDelta = 1 - Math.random() * 2;
        this.rightThrust.getPolygon().getVertex(0).set(
            orig.x + xDelta, orig.y + yDelta);
        this.rightThrust.enable();
    } else this.rightThrust.disable();
};


/**
 * Animates the right thrust polygon.
 * 
 * @private
 */

jsteroids.Spaceship.prototype.animateLeftThrust = function(acceleration)
{
    var orig, xDelta, yDelta;
   
    if (acceleration < 0)
    {
        this.leftThrust.setOpacity(-acceleration / jsteroids.Spaceship.YAW);
        orig = jsteroids.LEFT_THRUST.getVertex(0);
        xDelta = 2 - Math.random() * 4; 
        yDelta = 1 - Math.random() * 2;
        this.leftThrust.getPolygon().getVertex(0).set(
            orig.x + xDelta, orig.y + yDelta);
        this.leftThrust.enable();
    } else this.leftThrust.disable();
};


/**
 * Handles collision.
 * 
 * @param {jsteroids.Spaceship} spaceship
 *            The spaceship
 * @param {twodee.SceneNode} collider
 *            The node the spaceship collided with
 */

jsteroids.Spaceship.prototype.handleCollide = function(spaceship, collider)
{
    if (collider instanceof jsteroids.Asteroid)
    {
        collider.destroy(true);
        this.addDamage(100 / (collider.isSmall() ? 4 : 1));
    }

    else if (collider instanceof jsteroids.Ufo)
    {
        collider.destroy();
        this.addDamage(100);
    }
};


/**
 * Adds damage to the ship.
 * 
 * @param {Number} damage
 *            The damage to add
 */

jsteroids.Spaceship.prototype.addDamage = function(damage)
{
    var restDamage;
    
    damage = parseInt(damage);
    restDamage = parseInt(Math.max(0, damage - this.shield) / 2);
    this.shield = Math.max(0, this.shield - damage);
    this.hull = Math.max(0, this.hull - restDamage);
    this.game.updateShipState();
    if (!this.hull) this.destroy();
};


/**
 * Returns the current shield strength.
 * 
 * @return {Number} The current shield strength
 */

jsteroids.Spaceship.prototype.getShield = function()
{
    return this.shield;
};


/**
 * Returns the current hull strength.
 * 
 * @return {Number} The current hull strength
 */

jsteroids.Spaceship.prototype.getHull = function()
{
    return this.hull;
};


/**
 * Destroys the spaceship. 
 */

jsteroids.Spaceship.prototype.destroy = function()
{
    // Trigger an explosion at the location of the asteroid
    this.game.explode(this, 1);

    // Remove the spaceship
    this.remove();
    this.stopFireLaser();
    this.stopThrust();
    this.stopYaw();
    
    // End the game
    this.game.endGame();
};

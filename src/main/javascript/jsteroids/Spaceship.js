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
    physics.setMaxVelocity(250);
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
jsteroids.Spaceship.THRUST = 300;

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
jsteroids.Spaceship.prototype.fireRate = 5;

/** If ship is currently yawing. @private @type {Boolean} */
jsteroids.Spaceship.prototype.yawing = false;


/**
 * Starts thrust forward.
 */

jsteroids.Spaceship.prototype.startThrust = function()
{
    this.thrust = jsteroids.Spaceship.THRUST;
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
    this.physics.setSpinAcceleration(-jsteroids.Spaceship.YAW);
    this.yawing = true;
};


/**
 * Yaws the spaceship to the right.
 */

jsteroids.Spaceship.prototype.yawRight = function()
{
    this.physics.setSpinAcceleration(jsteroids.Spaceship.YAW);
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
        if (this.lastLaserFire + 1000 / this.fireRate < now)
        {
            this.game.fireLaser();
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
                    jsteroids.Spaceship.YAW, -spin * 5));
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
 * @param {jsteroids.Laser} spaceship
 *            The spaceship
 * @param {twodee.SceneNode} collider
 *            The node the spaceship collided with
 */

jsteroids.Spaceship.prototype.handleCollide = function(spaceship, collider)
{
    if (collider instanceof jsteroids.Asteroid)
    {
        spaceship.destroy();
        collider.destroy();
    }
};


/**
 * Destroys the spaceship. 
 */

jsteroids.Spaceship.prototype.destroy = function()
{
    // Trigger an explosion at the location of the asteroid
    this.game.explode(this);

    // Remove the spaceship
    this.remove();
    this.stopFireLaser();
    this.stopThrust();
    this.stopYaw();
    
    // End the game
    this.game.endGame();
};

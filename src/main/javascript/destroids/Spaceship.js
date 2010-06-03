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
 * Constructs a new destroids.Spaceship
 * 
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends twodee.ImageNode
 * @class The players destroids.Spaceship
 */

destroids.Spaceship = function(game)
{
    var image, physics, mainThrust, leftThrust, rightThrust;
    
    this.game = game;
    
    // Load the image and setup the image node with it
    image = new Image();
    image.src = destroids.imagesDir + "/spaceship.png";
    twodee.ImageNode.call(this, image);
    
    // Set the bounds
    this.setBounds(destroids.SPACESHIP_BOUNDS);
    
    // Append the main thrust node
    this.mainThrust = mainThrust = new twodee.PolygonNode(destroids.MAIN_THRUST);
    mainThrust.setFillStyle("orange");
    mainThrust.disable();
    this.appendChild(mainThrust);
    
    // Append the left thrust node
    this.leftThrust = leftThrust = new twodee.PolygonNode(destroids.LEFT_THRUST);
    leftThrust.setFillStyle("orange");
    leftThrust.disable();
    this.appendChild(leftThrust);
    
    // Append the right thrust node
    this.rightThrust = rightThrust = new twodee.PolygonNode(destroids.RIGHT_THRUST);
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
    this.setCollisionType(destroids.TYPE_SPACESHIP);
    this.setCollisionMask(destroids.TYPE_ASTEROID | destroids.TYPE_DROP |
         destroids.TYPE_UFO);
    this.connect("collisionStarted", this.handleCollide, this);
};
twodee.inherit(destroids.Spaceship, twodee.ImageNode);

/** 
 * The yaw thrust. 
 * @private @final 
 * @type {number} 
 */
destroids.Spaceship.YAW = 400 * Math.PI / 180;

/** 
 * The thrust. 
 * @private 
 * @final 
 * @type {number} 
 */
destroids.Spaceship.THRUST = 250;

/** 
 * The game. 
 * @private 
 * @type {destroids.Game} 
 */
destroids.Spaceship.prototype.game = null; 
    
/** 
 * The current thrust. 
 * @private 
 * @type {number} 
 */
destroids.Spaceship.prototype.thrust = 0;

/** 
 * The current yaw. 
 * @private 
 * @type {number} 
 */
destroids.Spaceship.prototype.yaw = 0;

/** 
 * The main thrust node. 
 * @private 
 * @type {twodee.PolygonNode}
 */
destroids.Spaceship.prototype.mainThrust = null;

/** 
 * The right thrust node. 
 * @private 
 * @type {twodee.PolygonNode} 
 */
destroids.Spaceship.prototype.rightThrust = null;

/** 
 * The left thrust node. 
 * @private 
 * @type {twodee.PolygonNode} 
 */
destroids.Spaceship.prototype.leftThrust = null;

/** 
 * If laser is currently firing.
 * @private 
 * @type {boolean}
 */
destroids.Spaceship.prototype.laserFiring = false;

/** 
 * The last time the laser was fired. 
 * @private 
 * @type {number} 
 */
destroids.Spaceship.prototype.lastLaserFire = 0;

/** 
 * The fire rate (shots per second). 
 * @private 
 * @type {number} 
 */
destroids.Spaceship.prototype.fireRate = 4;

/** 
 * If ship is currently yawing. 
 * @private 
 * @type {boolean} 
 */
destroids.Spaceship.prototype.yawing = false;

/** 
 * The shield strength in percent. 
 * @private 
 * @type {number} 
 */
destroids.Spaceship.prototype.shield = 100;

/** 
 * The hull strength in percent. 
 * @private 
 * @type {number}
 */
destroids.Spaceship.prototype.hull = 100;

/** 
 * The target heading.
 * @private 
 * @type {?number}
 */
destroids.Spaceship.prototype.targetHeading = null;


/**
 * Starts thrust forward.
 * 
 * @param {number} power
 *            The thrust power
 */

destroids.Spaceship.prototype.startThrust = function(power)
{
    this.game.playSound(destroids.SND_SPACESHIP_THRUST);
    this.thrust = destroids.Spaceship.THRUST * this.hull / 100 *
        Math.max(0, power) / 100;
    if (this.thrust) this.mainThrust.enable();
};


/**
 * Stops thrust forward.
 */

destroids.Spaceship.prototype.stopThrust = function()
{
    this.thrust = 0;
    this.mainThrust.disable();
};


/**
 * Yaws the spaceship to the left.
 * 
 * @param {number} power
 *            The thrust power in percent
 */

destroids.Spaceship.prototype.yawLeft = function(power)
{
    this.getPhysics().setSpinAcceleration(-destroids.Spaceship.YAW * this.hull /
        100 * power / 100);
    this.yawing = true;
};


/**
 * Yaws the spaceship to the right.
 * 
 * @param {number} power
 *            The thrust power in percent
 */

destroids.Spaceship.prototype.yawRight = function(power)
{
    this.getPhysics().setSpinAcceleration(destroids.Spaceship.YAW * this.hull /
        100 * power / 100);
    this.yawing = true;
};


/**
 * Stops yaw.
 */

destroids.Spaceship.prototype.stopYaw = function()
{
    this.getPhysics().setSpinAcceleration(0);
    this.yawing = false;
};


/**
 * Starts firing the laser cannon.
 */

destroids.Spaceship.prototype.startFireLaser = function()
{
    this.laserFiring = true;
};


/**
 * Stops firing the laser cannon.
 */

destroids.Spaceship.prototype.stopFireLaser = function()
{
    this.laserFiring = false;
};


/**
 * Fires the laser cannon.
 * 
 * @private
 */

destroids.Spaceship.prototype.fireLaser = function()
{
    var laser, transform, speed, bbox;
    
    this.game.playSound(destroids.SND_SPACESHIP_FIRE);

    speed = destroids.Spaceship.THRUST * 1.2;
    bbox = this.getBounds().getBoundingBox();
    laser = new destroids.Laser(this.game);
    transform = this.getTransform();
    laser.getTransform().setTransform(transform).translate(0, -24);
    laser.getPhysics().getVelocity().set(0, -speed).
        rotate(transform.getRotationAngle()).add(this.getPhysics().getVelocity());
    this.getParentNode().appendChild(laser);
};


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {number} delta
 *            The time delta in milliseconds
 * @override
 */

destroids.Spaceship.prototype.update = function(delta)
{
    var x, y, transform, acceleration, xRadius, yRadius, bbox, game, now,
        physics, spinAcceleration, targetHeading, spin;
    
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
    
    physics = this.getPhysics();
    spin = physics.getSpin();
        
    // Auto-pilot
    if (!this.yawing && destroids.ctrlRotationCompensator)
    {
        if (spin)
        {
            if (Math.abs(spin) * 180 / Math.PI > 1)
                physics.setSpinAcceleration(Math.min(
                    destroids.Spaceship.YAW * this.hull / 100, Math.abs(spin) * 5) *
                    (spin < 0 ? 1 : -1));
            else
            {
               physics.setSpin(0);
               physics.setSpinAcceleration(0);
            }
        }
    }

    // Slow down the ship (slowly)
    if (!this.thrust) physics.getVelocity().scale(0.99);

    targetHeading = this.targetHeading;
    
    /*
    if (targetHeading !== null)
    {
        // TODO Implement me
    
    }*/
    
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


/**
 * Animates the main thrust polygon.
 * 
 * @private
 */

destroids.Spaceship.prototype.animateMainThrust = function()
{
    var orig, xDelta, yDelta;
   
    this.mainThrust.setOpacity(this.thrust / destroids.Spaceship.THRUST);
    orig = destroids.MAIN_THRUST.getVertex(0);
    xDelta = 1 - Math.random() * 2; 
    yDelta = 2 - Math.random() * 4;
    this.mainThrust.getPolygon().getVertex(0).set(
        orig.x + xDelta, orig.y + yDelta);
};


/**
 * Animates the right thrust polygon.
 *
 * @param {number} acceleration
 *            The acceleration value
 * @private
 */

destroids.Spaceship.prototype.animateRightThrust = function(acceleration)
{
    var orig, xDelta, yDelta;
   
    if (acceleration > 0)
    {
        this.rightThrust.setOpacity(acceleration / destroids.Spaceship.YAW);
        orig = destroids.RIGHT_THRUST.getVertex(0);
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
 * @param {number} acceleration
 *            The acceleration value
 * @private
 */

destroids.Spaceship.prototype.animateLeftThrust = function(acceleration)
{
    var orig, xDelta, yDelta;
   
    if (acceleration < 0)
    {
        this.leftThrust.setOpacity(-acceleration / destroids.Spaceship.YAW);
        orig = destroids.LEFT_THRUST.getVertex(0);
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
 * @param {destroids.Spaceship} spaceship
 *            The spaceship
 * @param {twodee.SceneNode} collider
 *            The node the spaceship collided with
 */

destroids.Spaceship.prototype.handleCollide = function(spaceship, collider)
{
	var gameOver;
	
	gameOver = this.game.isGameOver();
	
    if (collider instanceof destroids.Asteroid)
    {
        collider.destroy(true);
        this.addDamage(100 / (collider.isSmall() ? 4 : 1));
        if (!gameOver)
        {
        	if (collider.isSmall())
        		this.game.getScore().register(50 * this.game.getLevel(), 7);
        	else
        		this.game.getScore().register(20 * this.game.getLevel(), 8);
        }
    }

    else if (collider instanceof destroids.Ufo)
    {
        collider.destroy();
        this.addDamage(100);
        if (!gameOver)
        	this.game.getScore().register(100 * this.game.getLevel(), 9);
    }
    
    else if (collider instanceof destroids.Energy)
    {
        this.game.playSound(destroids.SND_COLLECT_DROP);
        collider.remove();
        this.addShieldEnergy(25);
        if (!gameOver)
        	this.game.getScore().register(25 * this.game.getLevel(), 4);
    }

    else if (collider instanceof destroids.RepairKit)
    {
        this.game.playSound(destroids.SND_COLLECT_DROP);
        collider.remove();
        this.repair(25);
        if (!gameOver)
        	this.game.getScore().register(25 * this.game.getLevel(), 3);
    }
};


/**
 * Adds shield energy.
 * 
 * @param {number} energy
 *            The energy amount
 */

destroids.Spaceship.prototype.addShieldEnergy = function(energy)
{
    this.shield += Math.max(0, Math.ceil(energy * (150 - this.shield) / 150));
    this.game.updateShipState();
};


/**
 * Repairs the hull.
 * 
 * @param {number} repair
 *            The repair amount
 */

destroids.Spaceship.prototype.repair = function(repair)
{
    this.hull += Math.max(0, Math.ceil(repair * (100 - this.hull) / 100));
    this.game.updateShipState();
};


/**
 * Adds damage to the ship.
 * 
 * @param {number} damage
 *            The damage to add
 */

destroids.Spaceship.prototype.addDamage = function(damage)
{
    var restDamage;
    
    damage = parseInt(damage, 10);
    restDamage = parseInt(Math.max(0, damage - this.shield) / 2, 10);
    if (restDamage)
        this.game.playSound(destroids.SND_SPACESHIP_HULL_DAMAGE);
    else
        this.game.playSound(destroids.SND_SPACESHIP_SHIELD_DAMAGE);        
    this.shield = Math.max(0, this.shield - damage);
    this.hull = Math.max(0, this.hull - restDamage);
    this.game.updateShipState();
    if (!this.hull) this.destroy();
};


/**
 * Returns the current shield strength.
 * 
 * @return {number} The current shield strength
 */

destroids.Spaceship.prototype.getShield = function()
{
    return this.shield;
};


/**
 * Returns the current hull strength.
 * 
 * @return {number} The current hull strength
 */

destroids.Spaceship.prototype.getHull = function()
{
    return this.hull;
};


/**
 * Destroys the spaceship. 
 */

destroids.Spaceship.prototype.destroy = function()
{
    this.game.playSound(destroids.SND_SPACESHIP_DESTROYED);
            
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


/**
 * Returns the current heading of the spaceship in clock-wise RAD.
 * 
 * @return {number} The current heading of the spaceship
 */

destroids.Spaceship.prototype.getHeading = function()
{
    return this.getTransform().getRotationAngle();    
};


/**
 * Sets the current heading of the spaceship in clock-wise RAD.
 * 
 * @param {number} heading
 *            The heading to set
 */

destroids.Spaceship.prototype.setHeading = function(heading)
{
    this.getTransform().rotate(heading - this.getHeading());
};


/**
 * Sets the target heading in clock-wise RAD. The auto-pilot then
 * tries to reach this heading as fast as possible.
 * 
 * @param {number} targetHeading
 *            The target heading to set
 */

destroids.Spaceship.prototype.setTargetHeading = function(targetHeading)
{
    var heading;
    
    heading = this.getHeading();
    if (targetHeading != heading)
    {
        this.targetHeading = targetHeading;
    }
};

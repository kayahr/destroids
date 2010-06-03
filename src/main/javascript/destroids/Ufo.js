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
 * @param {destroids.Game} game
 *            The game
 * 
 * @constructor
 * @extends twodee.ImageNode
 * @class An UFO
 */

destroids.Ufo = function(game)
{
    var image, bbox, ufoXRadius, ufoYRadius, xRadius, yRadius, radius, bounds,
        rotation;
    
    this.game = game;
    
    // Load the image and setup the image node with it
    image = new Image();
    image.src = destroids.imagesDir + "/ufo.png";
    twodee.ImageNode.call(this, image);
    
    // Set the bounds
    this.setBounds(bounds = destroids.UFO_BOUNDS);
    
    // Apply physics
    this.setPhysics(new twodee.Physics());
    
    // Get the asteroid radius
    bbox = bounds.getBoundingBox();
    ufoXRadius = bbox.getWidth() / 2;
    ufoYRadius = bbox.getHeight() / 2;
    
    // Calculate starting position
    xRadius = game.getWidth() / 2 + ufoXRadius;
    yRadius = game.getHeight() / 2 + ufoYRadius;
    radius = Math.sqrt(xRadius * xRadius + yRadius * yRadius);
    rotation = Math.random() * Math.PI * 2;
    this.getTransform().rotate(rotation).
        translate(radius, 0).rotate(-rotation);
    
    // Enable collision detection
    this.setCollisionType(destroids.TYPE_UFO);
    this.setCollisionMask(destroids.TYPE_ASTEROID);
    this.connect("collisionStarted", this.handleCollide, this);
        
    destroids.Ufo.counter++;
};
twodee.inherit(destroids.Ufo, twodee.ImageNode);

/**
 * The number of active UFOs.
 * @private
 * @type {number}
 */
destroids.Ufo.counter = 0;

/** 
 * The game. 
 * @private 
 * @type {destroids.Game} 
 */
destroids.Ufo.prototype.game = null;

/** 
 * The timeout for the next course change. 
 * @private 
 * @type {number} 
 */ 
destroids.Ufo.prototype.nextCourseChange = 0;

/** 
 * The timeout for the next laser firing. 
 * @private 
 * @type {number} 
 */ 
destroids.Ufo.prototype.nextFire = 3000;

/** 
 * The UFO hull. 
 * @private 
 * @type {number} 
 */
destroids.Ufo.prototype.hull = 300;


/**
 * Handles collision.
 * 
 * @param {destroids.Ufo} ufo
 *            The UFO
 * @param {twodee.SceneNode} collider
 *            The node the spaceship collided with
 */

destroids.Ufo.prototype.handleCollide = function(ufo, collider)
{
    var parent;
    
    if (collider instanceof destroids.Asteroid)
    {
        parent = collider.getParentNode();
        if (!parent) return;
        parent.appendChild(
            new destroids.Asteroid(this.game, collider.isSmall()));
        collider.destroy(true);
    }
};


/**
 * Changes the course randomly.
 * 
 * @private
 */

destroids.Ufo.prototype.changeCourse = function()
{
    var heading, tmp, speed;
    
    // Calculate a random heading
    heading = 22.5 + Math.random() * 45 + parseInt(Math.random() * 4, 10) * 90;

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
 * @param {number} delta
 *            The time delta in milliseconds
 * @override
 */

destroids.Ufo.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, bbox, game;
    
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
 * Destroys the UFO. 
 */

destroids.Ufo.prototype.destroy = function()
{
    this.game.playSound(destroids.SND_UFO_DESTROYED);

    // Trigger an explosion at the location of the UFO
    this.game.explode(this, 2);
    
    // Score points for the UFO
    this.game.getScore().register(100 * this.game.getLevel(), 2);

    // Drop some energy
    if (!this.game.isGameOver()) this.dropStuff();
    
    // Remove the UFO
    this.remove();
    
    destroids.Ufo.counter--;
};


/**
 * Returns the number of active UFOs.
 * 
 * @return {number} The number of active UFOs.
 */

destroids.Ufo.count = function()
{
    return destroids.Ufo.counter;
};


/**
 * Fires the laser cannon.
 * 
 * @private
 */

destroids.Ufo.prototype.fireLaser = function()
{
    var laser, transform, speed, angle;
    
    this.game.playSound(destroids.SND_UFO_FIRE);

    speed = 100;
    angle = Math.random() * 2 * Math.PI;
    laser = new destroids.Laser(this.game, true);
    transform = this.getTransform();
    laser.getTransform().setTransform(transform).translate(0, (angle > Math.PI / 2 && angle < Math.PI * 1.5) ? 10 : -10).rotate(angle);
    laser.getPhysics().getVelocity().set(0, -speed).
        rotate(angle);
    this.getParentNode().appendChild(laser);
    this.nextFire = 2000;
};


/**
 * Adds damage to the ship.
 * 
 * @param {number} damage
 *            The damage to add
 */

destroids.Ufo.prototype.addDamage = function(damage)
{
    this.game.playSound(destroids.SND_UFO_HULL_DAMAGE);

    this.hull = Math.max(0, this.hull - damage);
    if (!this.hull) this.destroy();
};


/**
 * Drops some stuff.
 * 
 * @private 
 */

destroids.Ufo.prototype.dropStuff = function()
{
    var spaceship, hull, shield, drop, transform, dropClass,
        drops;
    
    drops = (/** @type Array.<number> */ []);
    spaceship = this.game.getSpaceship();
    hull = spaceship.getHull();
    shield = spaceship.getShield();
    
    if (hull < 100) drops.push(1);
    if (shield < 150) drops.push(0);
    
    // If nothing to drop then do nothing
    if (!drops.length) return;
    
    dropClass = drops[parseInt(Math.random() * drops.length, 10)];
    switch (dropClass)
    {
        case 1:
            drop = new destroids.RepairKit(this.game);
            break;
           
        default:
    		drop = new destroids.Energy(this.game);
    }
    transform = this.getTransform();
    drop.getTransform().setTransform(transform);
    this.getPhysics().getVelocity().copy(drop.getPhysics().getVelocity());
    this.getParentNode().appendChild(drop);       
};
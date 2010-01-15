/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides the Energy class.
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs a new energy drop.
 * 
 * @param {jsteroids.Game} game
 *            The game
 * 
 * @constructor
 * @class An energy drop
 */

jsteroids.Energy = function(game)
{
    this.game = game;
    
    // Load the image and setup the image node with it
    image = new Image();
    image.src = jsteroids.imagesDir + "/energy.png";
    twodee.ImageNode.call(this, image);

    // Set the bounds
    this.setBounds(jsteroids.DROP_BOUNDS);
    
    // Set the physics model
    physics = new twodee.Physics();
    physics.setLifetime(10);
    physics.setDecay(0.5);
    physics.setSpin(-Math.PI / 2 + Math.random() * Math.PI);
    this.setPhysics(physics);
    
    // Enable collision detection
    this.setCollidable(true);
};
twodee.inherit(jsteroids.Energy, twodee.ImageNode);

/** The class name. @private @type {String} */
jsteroids.Energy.prototype.jsonClassName = "jsteroid.Energy";

/** The game. @private @type {jsteroids.Game} */
jsteroids.Energy.prototype.game = null;


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {Number} delta
 *            The time delta in milliseconds
 */

jsteroids.Energy.prototype.update = function(delta)
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


/**
 * Destroys the drop. 
 */

jsteroids.Energy.prototype.destroy = function()
{
    this.game.playSound(jsteroids.SND_DROP_DESTROYED);
    
    // Trigger an explosion at the location of the UFO
    this.game.explode(this);
    
    // Remove the UFO
    this.remove();
};

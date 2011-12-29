/**
 * Copyright (C) 2010-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require destroids.js
 * @require twodee/ImageNode.js
 * @use twodee/Physics.js
 */

/**
 * Constructs a new drop.
 * 
 * @param {destroids.Game} game
 *            The game
 * @param {string} imageName
 *            The image name (without directory and extension)
 * 
 * @constructor
 * @extends {twodee.ImageNode}
 * @class 
 * Base class for all drops.
 */
destroids.Drop = function(game, imageName)
{
    var image, physics;
    
    this.game = game;
    
    // Load the image and setup the image node with it
    image = new Image();
    image.src = destroids.imagesDir + "/" + imageName + ".png";
    twodee.ImageNode.call(this, image);

    // Set the bounds
    this.setBounds(destroids.DROP_BOUNDS);
    
    // Set the physics model
    physics = new twodee.Physics();
    physics.setLifetime(15);
    physics.setDecay(0.5);
    physics.setSpin(-Math.PI / 2 + Math.random() * Math.PI);
    this.setPhysics(physics);
    
    // Enable collision detection
    this.setCollisionType(destroids.TYPE_DROP);
    
    // Set invulnerability time to one second
    this.invulnerability = 1000;
};
twodee.inherit(destroids.Drop, twodee.ImageNode);

/** 
 * The game. 
 * @private 
 * @type {destroids.Game} 
 */
destroids.Drop.prototype.game = null;

/**
 * The invulnerability count down in milliseconds.
 * @private
 * @type {number}
 */
destroids.Drop.prototype.invulnerability;


/**
 * @see twodee.PolygonNode#update
 * 
 * @param {number} delta
 *            The time delta in milliseconds
 * @override
 */
destroids.Drop.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, bbox, game;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    
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
    
    // Count down the invulnerability counter
    if (this.invulnerability > 0) this.invulnerability -= delta;
};

/**
 * Destroys the drop. 
 */
destroids.Drop.prototype.destroy = function()
{
    this.game.playSound(destroids.SND_DROP_DESTROYED);
    
    // Trigger an explosion at the location of the UFO
    this.game.explode(this);
    
    // Remove the UFO
    this.remove();
};

/**
 * Checks if drop is invulnerable.
 * 
 * @return {boolean} True if drop is invulnerable, false if not
 */
destroids.Drop.prototype.isInvulnerable = function()
{
    return this.invulnerability > 0;
};

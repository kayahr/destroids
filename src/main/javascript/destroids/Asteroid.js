/**
 * Copyright (C) 2009-2011 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @require destroids.js
 * @require twodee/ImageNode.js
 * @use twodee/Physics.js
 * @use twodee/Vector.js
 */

/**
 * Constructs a new asteroid.
 * 
 * @param {!destroids.Game} game
 *            The game
 * @param {boolean=} small
 *            If small asteroid should be created. Optional. Defaults to false.
 * @param {destroids.Asteroid=} parentAsteroid
 *            The parent asteroid if this asteroid is created from a destroyed
 *            parent asteroid
 * @param {number=} subId
 *            The sub id if asteroid is spawned from a parent asteroid. Must
 *            be between 0 and 3. This number is used to calculate the initial
 *            position (relative to the parent asteroid) and the heading.
 * 
 * @constructor
 * @extends {twodee.ImageNode}
 * @class 
 * An asteroid.
 */
destroids.Asteroid = function(game, small, parentAsteroid, subId)
{
    var type, image, heading, speed, xRadius, yRadius, radius, tmp,
        astXRadius, astYRadius, bounds, bbox, level, transform, offset,
        physics;    
    
    this.game = game;
    game.addAsteroid();
    level = game.getLevel();
    
    // Remember that this is a small asteroid
    if (small) this.small = small;
    
    // Determine the asteroid type
    type = parseInt(Math.random() * destroids.asteroids, 10); 

    // Load the asteroid image and construct the image node with it
    image = new Image();
    image.src = destroids.imagesDir + "/asteroid" + (type + 1) + ".png";
    twodee.ImageNode.call(this, image);
    transform = this.getTransform();

    // Set the asteroids physics model
    physics = new twodee.Physics();
    this.setPhysics(physics);
    
    // Set the asteroid bounds
    this.setBounds(bounds = destroids.ASTEROID_BOUNDS[type]);
    
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
        heading = 22.5 + Math.random() * 45 + parseInt(Math.random() * 4, 10) * 90;
    }
    
    // Make sure the heading is a good one (To prevent the asteroid moving
    // constantly in the void)
    tmp = (heading % 360 + 360) % 90;
    if (tmp < 22.5) heading += (22.5 - tmp);
    if (tmp > 90 - 22.5) heading -= tmp - (90 - 22.5);    
    
    // Calculate a level (and size) specific speed
    speed = 25 + (small ? 50 : 0) + level * 2;
    
    // Calculate and apply the velocity vector
    physics.getVelocity().set(0, speed).rotate(heading * Math.PI / 180);
    
    // Calculate a random spin
    physics.setSpin((25 + Math.random() * 45) * Math.PI / 180 *
        (parseInt(Math.random() * 2, 10) ? 1 : -1));

    // Calculate a random start position
    if (parentAsteroid)
    {
        offset = new twodee.Vector(0, 8).rotate(Math.PI / 2 * subId);
        transform.setTransform(parentAsteroid.getTransform()).translate(
                offset.x, offset.y);                
    }
    else
    {
        xRadius = game.getWidth() / 2 + astXRadius;
        yRadius = game.getHeight() / 2 + astYRadius;
        radius = Math.sqrt(xRadius * xRadius + yRadius * yRadius);
        transform.rotate(Math.random() * Math.PI * 2).
            translate(radius, 0);
    }
    
    // Scale the asteroid down if this is small asteroid
    if (small) transform.scale(0.5);
    
    // Enable collision detection
    this.setCollisionType(destroids.TYPE_ASTEROID);
};
twodee.inherit(destroids.Asteroid, twodee.ImageNode);

/** 
 * The game.
 * @private
 * @type {!destroids.Game} 
 */
destroids.Asteroid.prototype.game; 
    
/** 
 * The x radius of the asteroid.
 * @private
 * @type {number}
 */
destroids.Asteroid.prototype.xRadius;

/** 
 * The y radius of the asteroid.
 * @private
 * @type {number}
 */
destroids.Asteroid.prototype.yRadius;

/** 
 * If this is a small asteroid.
 * @private
 * @type {boolean}
 */
destroids.Asteroid.prototype.small = false;

/**
 * Checks if this is a small asteroid.
 * 
 * @return {boolean} True if this is a small asteroid, false if not 
 */
destroids.Asteroid.prototype.isSmall = function()
{
    return this.small;
};

/**
 * @see twodee.PolygonNode#update
 * 
 * @param {number} delta
 *            Number of milliseconds since last update
 * @override 
 */
destroids.Asteroid.prototype.update = function(delta)
{
    var x, y, transform, xRadius, yRadius, game;
    
    twodee.PolygonNode.prototype.update.call(this, delta);
    transform = this.getTransform();
    game = this.game;
    xRadius = game.getWidth() / 2 + this.xRadius;
    yRadius = game.getHeight() / 2 + this.yRadius;
    x = transform.m02;
    y = transform.m12;
    
    // Don't wrap stuff around if player is ejecting 
    if (game.isEjecting()) return;
    
    if (x > xRadius) transform.m02 = -xRadius;
    if (x < -xRadius) transform.m02 = xRadius;
    if (y > yRadius) transform.m12 = -yRadius;
    if (y < -yRadius) transform.m12 = yRadius;
};

/**
 * Destroys the asteroid. 
 * 
 * @param {boolean=} noDescendants
 *            Optional. Set to true to prevent descendants
 */
destroids.Asteroid.prototype.destroy = function(noDescendants)
{
    var i;
    
    if (this.small)
        this.game.playSound(destroids.SND_SMALL_ASTEROID_DESTROYED);
    else
        this.game.playSound(destroids.SND_LARGE_ASTEROID_DESTROYED);

    // Trigger an explosion at the location of the asteroid
    this.game.explode(this);

    // If its a large asteroid then spawn new asteroids.
    if (noDescendants == undefined && !this.small)
        for (i = 0; i < 4; i++)
            this.getParentNode().appendChild(new destroids.Asteroid(
                this.game, true, this, i));
    
    // Remove the asteroid
    this.game.removeAsteroid();
    this.remove();
};

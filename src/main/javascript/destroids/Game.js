/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009-2010 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides destroids.Game class
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs the game.
 * 
 * @param {string} containerId
 *            The ID of the container element (Typically a DIV element).
 *            In this element the game constructs the canvas element and
 *            other elements needed for the game.
 * @param {boolean} autoStart
 *            If game should start automatically after initialization.
 *            This parameter is optional and defaults to true
 * 
 * @constructor
 * @class The game
 */

destroids.Game = function(containerId, autoStart)
{
    this.containerId = containerId;
    if (autoStart === false) this.autoStart = false;
    this.init();
};

/** 
 * If game has been initialized. 
 * @private 
 * @type {boolean} 
 */
destroids.Game.prototype.initialized = false;

/** 
 * If game should start automatically after init. 
 * @private 
 * @type {boolean} 
 */
destroids.Game.prototype.autoStart = true;

/** 
 * The container id. 
 * @private 
 * @type {string} 
 */
destroids.Game.prototype.containerId;

/** 
 * The container HTML element. 
 * @private 
 * @type {Element} 
 */
destroids.Game.prototype.container = null;

/** 
 * The canvas element. 
 * @private 
 * @type {HTMLCanvasElement} 
 */
destroids.Game.prototype.canvas = null;

/** 
 * The game canvas width. 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.width = 0;

/** 
 * The game canvas height. 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.height = 0;

/** 
 * The graphics context. 
 * @private 
 * @type {CanvasRenderingContext2D} 
 */
destroids.Game.prototype.ctx = null;

/** 
 * The game timer. 
 * @private 
 * @type {?number} 
 */
destroids.Game.prototype.timer = null;

/** 
 * The game scene. 
 * @private 
 * @type {twodee.Scene} 
 */
destroids.Game.prototype.scene = null;

/** 
 * The root node. 
 * @private 
 * @type {twodee.SceneNode} 
 */
destroids.Game.prototype.rootNode = null;

/** 
 * The current level. 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.level = 0;

/** 
 * The space ship. 
 * @private 
 * @type {destroids.Spaceship} 
 */
destroids.Game.prototype.spaceship = null;

/** 
 * The score. 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.score = 0;

/** 
 * The game-state label. 
 * @private 
 * @type {Element} 
 */
destroids.Game.prototype.stateLabel = null;

/** 
 * The number of remaining asteroids. 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.asteroids = 0;

/** 
 * If game is over. 
 * @private 
 * @type {boolean} 
 */
destroids.Game.prototype.gameOver = true;

/** 
 * If player is ejecting. 
 * @private 
 * @type {boolean} 
 */
destroids.Game.prototype.ejecting = true;

/** 
 * The menu. 
 * @private 
 * @type {destroids.Menu} 
 */
destroids.Game.prototype.menu = null;

/** 
 * The hud. 
 * @private 
 * @type {destroids.Hud} 
 */
destroids.Game.prototype.hud = null;

/** 
 * The last screen orientation (Accelerometer support) 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.lastOrientation = 2;

/** 
 * If game has been paused. 
 * @private 
 * @type {boolean} 
 */
destroids.Game.prototype.paused = false;

/** 
 * The last level which has seen an UFO. 
 * @private 
 * @type {number} 
 */
destroids.Game.prototype.lastUfoLevel = 0;

/**
 * The mouse up handler function.
 * @private
 * @type {Function}
 */
destroids.Game.prototype.mouseUpHandler = null;

/**
 * The mouse down handler function.
 * @private
 * @type {Function}
 */
destroids.Game.prototype.mouseDownHandler = null;

/**
 * The key up handler function.
 * @private
 * @type {Function}
 */
destroids.Game.prototype.keyUpHandler = null;

/**
 * The key down handler function.
 * @private
 * @type {Function}
 */
destroids.Game.prototype.keyDownHandler = null;

/**
 * The orientation change handler function.
 * @private
 * @type {Function}
 */
destroids.Game.prototype.orientationChangeHandler = null;


/**
 * Initializes the game.
 */

destroids.Game.prototype.init = function()
{
    var container, canvas, scene, rootNode, menu, hud, stateLabel;
    
    // Try to get container reference
    this.container = container = document.getElementById(this.containerId);
    
    // If not yet present then delay initialization
    if (!container)
    {
        this.init.bind(this).delay(0.1);
        return;
    }
    
    // Create the canvas
    this.canvas = canvas = (/** @type {HTMLCanvasElement} */ document.createElement("canvas"));
    container.appendChild(canvas);
    canvas.id = "gameCanvas";

    // Create the game state label
    this.stateLabel = stateLabel = document.createElement("span");
    container.appendChild(stateLabel);
    stateLabel.id = "stateLabel";
    
    // Create the menu
    menu = this.menu = new destroids.Menu(this);
    container.appendChild(menu.getElement());
    
    // Create the HUD
    hud = this.hud = new destroids.Hud(this);
    container.appendChild(hud.getElement());
    
    // Correct container positioning if needed
    if (canvas.offsetParent != container)
        container.style.position = "relative";
    
    // Create the graphics context
    this.ctx = (/** @type {CanvasRenderingContext2D} */ canvas.getContext("2d"));
    
    // Create the scene
    this.scene = scene = new twodee.Scene();
    this.rootNode = rootNode = new twodee.SceneNode();
    scene.setRootNode(rootNode);
    
    // Re-call resize method when window resizes
    Event.observe(window, "resize", this.resize.bindAsEventListener(this));

    // Create keyboard listeners
    this.keyDownHandler = this.handleKeyDown.bindAsEventListener(this);
    this.keyUpHandler = this.handleKeyUp.bindAsEventListener(this);
    this.mouseDownHandler = this.handleMouseDown.bindAsEventListener(this);
    this.mouseUpHandler = this.handleMouseUp.bindAsEventListener(this);
    this.orientationChangeHandler = this.handleOrientationChange.bindAsEventListener(this);
    
    // Initialize the game size
    this.resize();
    
    // Start game with intro
    this.startIntro();
    
    // Mark game as initialized
    this.initialized = true;
    
    // Auto-start the game if needed
    if (this.autoStart) this.start();
};


/**
 * Resets the game.
 */

destroids.Game.prototype.reset = function()
{
    var rootNode, spaceship;
    
    rootNode = this.rootNode;

    // Remove all stuff from the scene
    rootNode.removeChildren();
    
    // Create the spaceship
    spaceship = this.spaceship = new destroids.Spaceship(this);
    rootNode.appendChild(spaceship);
    this.updateShipState();

    // Reset score to 0
    this.setScore(0);
    
    this.lastUfoLevel = 0;

    this.gameOver = false;
    
    this.hud.open();

    // Initialize the game to level 1
    this.setLevel(1);    
};



/**
 * This method must be called when the size of the output container has been
 * resized. It updates the internal HTML elements which are located in this
 * output container.
 */

destroids.Game.prototype.resize = function()
{
    var container, width, height, canvas;
    
    container = this.container;
    canvas = this.canvas;
    width = this.width = container.offsetWidth;
    height = this.height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;    
};


/**
 * Checks if game is initialized.
 * 
 * @return {boolean} True if game is initialized, false if not
 */

destroids.Game.prototype.isInitialized = function()
{
    return this.initialized;
};


/**
 * Starts the game.
 */

destroids.Game.prototype.start = function()
{
    // Do nothing if game is not initialized yet
    if (!this.initialized) return;
    
    // Resume the scene (if it was paused)
    if (!this.paused) this.scene.resume();

    // Start the game thread
    if (!this.timer)
        this.timer = window.setInterval(this.run.bind(this), destroids.GAME_INTERVAL);

    // Install keyboard handlers
    document.addEventListener("orientationchange", this.orientationChangeHandler, false);
    window.addEventListener("keydown", this.keyDownHandler, false);     
    window.addEventListener("keyup", this.keyUpHandler, false);     
    this.container.addEventListener("mousedown", this.mouseDownHandler, false);     
    this.container.addEventListener("mouseup", this.mouseUpHandler, false);     
};


/**
 * Checks if game has been stopped or is running
 * 
 * @return {boolean} True if game is paused, false if not
 */

destroids.Game.prototype.isPaused = function()
{
    return this.paused;
};


/**
 * Pauses the game
 */

destroids.Game.prototype.pause = function()
{
    if (!this.paused)
    {
        // Stop game thread
        if (this.timer)
        {
            window.clearTimeout(this.timer);
            this.timer = null;
        }       

        this.scene.pause();
        this.paused = true;
    }
};


/**
 * Resumes the game
 */

destroids.Game.prototype.resume = function()
{
    if (this.paused && (this.gameOver || !this.menu.isOpen()))
    {
        // Start the game thread
        if (!this.timer)
            this.timer = window.setInterval(this.run.bind(this), destroids.GAME_INTERVAL);

        this.paused = false;
        this.scene.resume();
    }
};


/**
 * Stops the game.
 */

destroids.Game.prototype.stop = function()
{
    // Uninstall keyboard handlers
    document.removeEventListener("orientationchange", this.orientationChangeHandler, false);
    window.removeEventListener("keydown", this.keyDownHandler, false);
    window.removeEventListener("keyup", this.keyUpHandler, false);     
    this.container.removeEventListener("mousedown", this.mouseDownHandler, false);     
    this.container.removeEventListener("mouseup", this.mouseUpHandler, false);     
    
    // Stop game thread
    if (this.timer)
    {
        window.clearTimeout(this.timer);
        this.timer = null;
    }       
    
    // Pause the scene
    this.scene.pause();
};


/**
 * The game thread run method.
 */

destroids.Game.prototype.run = function()
{
    var ctx, width, height;
    
    width = this.width;
    height = this.height;
    ctx = this.ctx;
    
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    this.scene.update(-destroids.GAME_INTERVAL * 5);
    this.scene.render(ctx, width, height);
    ctx.restore();
};


/**
 * Sets the level.
 * 
 * @param {number} level
 *            The level to set
 */

destroids.Game.prototype.setLevel = function(level)
{
    var rootNode, asteroids;
    
    // Do nothing if game is over
    if (this.gameOver) return;
    
    this.hideStateLabel();

    this.hud.setLevel(level);

    rootNode = this.rootNode;
    
    // Set the level
    this.level = level;
        
    // Create the asteroids
    this.asteroids = 0;
    asteroids = 1 + parseInt(level / 3, 10);
    while (asteroids--)
        this.rootNode.appendChild(new destroids.Asteroid(this));
    asteroids = level % 3;
    while (asteroids)
    {
        this.rootNode.appendChild(new destroids.Asteroid(this, true));
        asteroids--;
    }
};


/**
 * Returns the current level.
 * 
 * @return {number} The current level
 */

destroids.Game.prototype.getLevel = function()
{
    return this.level;
};


/**
 * Checks if control is in the specified controls array.
 * 
 * @param {number} control
 *            The control to check
 * @param {Array} controls
 *            Controls array
 * @return {boolean} True if control is in the array, false if not
 * @private
 */

destroids.Game.prototype.isControl = function(control, controls)
{
    var i;
    
    for (i = controls.length - 1; i >= 0; i--)
        if (control == controls[i]) return true;
    return false;
};


/**
 * Handles the control down event.
 * 
 * @param {number} control
 *            The control id
 * @param {number=} power
 *            Optional power (percent) for analog controls. Defaults to 100
 * @return {boolean} True if event was handles, false if not
 * 
 * @private
 */
 
destroids.Game.prototype.handleControlDown = function(control, power)
{
    if (power === undefined) power = 100;
    
    // Controls when within menu
    if (this.menu.isOpen())
    {
        return false;
    }
    
    // Controls when playing
    else if (!this.gameOver && !this.isPaused())
    {
        if (this.isControl(control, destroids.ctrlThrust))
            this.spaceship.startThrust(power);
        else if (this.isControl(control, destroids.ctrlRight))
            this.spaceship.yawRight(power);
        else if (this.isControl(control, destroids.ctrlLeft))
            this.spaceship.yawLeft(power);
        else if (this.isControl(control, destroids.ctrlFire))
            this.spaceship.startFireLaser();
        else if (this.isControl(control, destroids.ctrlMenu))
            this.gotoMenu();
        else if (this.isControl(control, destroids.ctrlEject))
            this.eject();
        else if (destroids.ctrlGravity)
        {
            switch (control)
            {
                case 102:
                    this.spaceship.setTargetHeading(Math.PI / 2);
                    break;
                case 104:
                    this.spaceship.setTargetHeading(0);
                    break;
                case 100:
                    this.spaceship.setTargetHeading(Math.PI + Math.PI / 2);
                    break;
                case 98:
                    this.spaceship.setTargetHeading(Math.PI);
                    break;
            }
            return false;
        }
        else
            return false;
    }
    
    // Unhandled control
    else return false;

    return true;
};


/**
 * Handles the control up event.
 * 
 * @param {number} control
 *            The control id
 * @return {boolean} True if event was handles, false if not
 * 
 * @private
 */
 
destroids.Game.prototype.handleControlUp = function(control)
{
    // Controls when playing
    if (!this.menu.isOpen() && !this.gameOver && !this.isPaused())
    {
        if (this.isControl(control, destroids.ctrlThrust))
            this.spaceship.stopThrust();
        else if (this.isControl(control, destroids.ctrlRight))
            this.spaceship.stopYaw();
        else if (this.isControl(control, destroids.ctrlLeft))
            this.spaceship.stopYaw();
        else if (this.isControl(control, destroids.ctrlFire))
            this.spaceship.stopFireLaser();
        else
            return false;
    }
    
    // Unhandled control
    else return false;
    
    return true;
};


/**
 * Handles the key down event.
 * 
 * @param {Event} event
 *            The key down event
 * @private
 */
 
destroids.Game.prototype.handleKeyDown = function(event)
{
    if (this.handleControlDown(event.keyCode) ||
        this.handleControlDown(0)) event.preventDefault();
};


/**
 * Handles the key up event.
 * 
 * @param {Event} event
 *            The key down event
 * @private
 */
 
destroids.Game.prototype.handleKeyUp = function(event)
{
    if (this.handleControlUp(event.keyCode) ||
        this.handleControlUp(0)) event.preventDefault();
};


/**
 * Handles the mouse down event.
 * 
 * @param {Event} event
 *            The mouse down event
 * @private
 */
 
destroids.Game.prototype.handleMouseDown = function(event)
{    
    if (this.handleControlDown(-1)) event.preventDefault();
};


/**
 * Handles the mouse up event.
 * 
 * @param {Event} event
 *            The mouse up event
 * @private
 */
 
destroids.Game.prototype.handleMouseUp = function(event)
{
    if (this.handleControlUp(-1)) event.preventDefault();
};


/**
 * Handles the orientation change event.
 * 
 * @param {Mojo.OrientationChangeEvent} event
 *            The orientation change event
 * @private
 */
 
destroids.Game.prototype.handleOrientationChange = function(event)
{
    var roll, pitch, pitchPower, rollPower, pitchRange, rollRange,
        pitchDeadZone, rollDeadZone, angle;

    // If position is not 0 or 1 then a orientation change was performed.
    // Remember this orientation change because this is the base for
    // calculating the yaw angle.
    if (event.position > 1) this.lastOrientation = event.position;
    
    // Do nothing more if game is over
    if (this.gameOver) return;
    
    // Calculate the yaw angle
    switch (this.lastOrientation)
    {
        case 2:
            roll = event.roll;
            pitch = -event.pitch;
            break;

        case 3:
            roll = -event.roll;
            pitch = event.pitch;
            break;

        case 4:
            roll = -event.pitch;
            pitch = -event.roll;
            break;
            
        case 5:
            roll = event.pitch;
            pitch = event.roll;
            break;
            
        default:
            roll = 0;
            pitch = 0;            
    }
    
    if (destroids.ctrlGravity)
    {
        angle = new twodee.Vector(0, 1).getAngle(new twodee.Vector(roll,
            -pitch));
        this.spaceship.setTargetHeading(angle);
    }
    
    roll -= destroids.ctrlRollCenter;
    pitch -= destroids.ctrlPitchCenter;
    
    // Dead zone
    rollDeadZone = destroids.ctrlRollDeadZone / 2;
    pitchDeadZone = destroids.ctrlPitchDeadZone / 2;
    if (Math.abs(roll) < rollDeadZone) roll = 0;
    if (Math.abs(pitch) < pitchDeadZone) pitch = 0;
    
    // Calculate power
    rollRange = destroids.ctrlRollRange / 2;
    pitchRange = destroids.ctrlPitchRange / 2;
    rollPower = Math.min(100, (Math.abs(roll) - rollDeadZone) * 100 / (rollRange - rollDeadZone));    
    pitchPower = Math.min(100, (Math.abs(pitch) - pitchDeadZone) * 100 / (pitchRange - pitchDeadZone));    
    
    // Apply the roll and pitch
    if (roll > 0)
    {
        this.handleControlUp(-2);
        this.handleControlDown(-3, rollPower);
    }
    else if (roll < 0)
    {
        this.handleControlUp(-3);
        this.handleControlDown(-2, rollPower);
    }
    else
    {
        this.handleControlUp(-2);
        this.handleControlUp(-3);
    }
    if (pitch > 0)
    {
        this.handleControlUp(-4);
        this.handleControlDown(-5, pitchPower);
    }
    else if (pitch < 0)
    {
        this.handleControlUp(-5);
        this.handleControlDown(-4, pitchPower);
    }
    else
    {
        this.handleControlUp(-4);
        this.handleControlUp(-5);
    }
};

    
/**
 * Triggers an explosion at the position of the specified node.
 * 
 * @param {twodee.SceneNode} node
 *            The node at which position an explosion should be triggered
 * @param {number=} type
 *            The explosion type. 0 is normal, 1 is player ship, 2 is alien
 *            ship, 3 is a small hit explosion. Optional. Defaults to 0
 */

destroids.Game.prototype.explode = function(node, type)
{
    var i, particle, transform, heading, velocity, partTransform, physics;
    
    for (i = (type == 1 ? 50 : 10); i >= 0; i--)
    {
        heading = Math.random() * Math.PI * 2;
        particle = new twodee.PolygonNode(destroids.PARTICLE);
        transform = node.getTransform();
        partTransform = particle.getTransform();
        partTransform.translate(transform.m02, transform.m12).
            rotate(heading);        
        physics = new twodee.Physics();
        particle.setPhysics(physics);
        velocity = physics.getVelocity();
        switch (type)
        {
            // A large space ship explosion
            case 1:
                particle.setFillStyle("orange");
                partTransform.scale(1.5);
                velocity.set(0, 15 + Math.random() * 50);
                physics.setLifetime(5);
                physics.setDecay(4);
                break;
                
            // A medium explosion of alien ufo
            case 2:
                particle.setFillStyle("yellow");
                partTransform.scale(1.5);
                velocity.set(0, 15 + Math.random() * 25);
                physics.setLifetime(2);
                physics.setDecay(1);
                break;
                
            // A small hit-explosion
            case 3:
                particle.setFillStyle("#ccc");
                velocity.set(0, 50 + Math.random() * 50);
                physics.setLifetime(0.25);
                physics.setDecay(0.25);
                break;
   
            // The default asteroid explosion
            default:
                velocity.set(0, 75 + Math.random() * 75);
                particle.setFillStyle("white");
                physics.setLifetime(0.5);
                physics.setDecay(0.25);
                    
        }
        velocity.rotate(heading);
        this.rootNode.appendChild(particle);
    }
};


/**
 * Adds score points.
 * 
 * @param {number} points
 *            The points to add per level
 */

destroids.Game.prototype.addScore = function(points)
{
    if (!this.gameOver) this.setScore(this.score + points * this.level);
};


/**
 * Sets the score.
 * 
 * @param {number} score
 *            The score to set
 */

destroids.Game.prototype.setScore = function(score)
{
    this.score = score;
    this.hud.setScore(score);
};


/**
 * Adds a new asteroid.
 */

destroids.Game.prototype.addAsteroid = function()
{
    if (this.gameOver) return;
    
    this.asteroids++;
};


/**
 * Removes one asteroid. If all asteroids are removed then the level is
 * complete.
 */

destroids.Game.prototype.removeAsteroid = function()
{
    if (this.gameOver) return;
    
    this.asteroids--;
    if (!this.asteroids)
        this.completeLevel();
    else
    {
        // Spawn a new UFO if probability check succeeds.
        if (!parseInt(Math.random() * this.asteroids, 10))
            this.newUFO();
    }
};


/**
 * Completes the current level.
 */

destroids.Game.prototype.completeLevel = function()
{
    var nextLevel;
    
    this.playSound(destroids.SND_LEVEL_UP);
    
    nextLevel = this.level + 1;
    this.stateLabel.innerHTML = destroids.msgRightOn +
        destroids.msgNextLevel.replace("%LEVEL%", String(nextLevel));
    this.showStateLabel();
    this.setLevel.bind(this, nextLevel).delay(5);
};


/**
 * Checks if player is currently ejecting.
 * 
 * @return {boolean} True if player is ejecting, false if not
 */

destroids.Game.prototype.isEjecting = function()
{
    return this.ejecting;
};


/**
 * Ejects from the spaceship. This ends the game but gives some extra
 * points for not dying in the asteroid field.
 * 
 * @private
 */

destroids.Game.prototype.eject = function()
{
    var bonus, physics;
    
    if (!this.gameOver)
    {
        this.playSound(destroids.SND_EJECT);
        
        this.ejecting = true;
        physics = new twodee.Physics();
        physics.setScaling(0.7);
        physics.setSpin(45 * Math.PI / 180);
        this.rootNode.setPhysics(physics);
        bonus = parseInt(this.score / 1000, 10) * 100;
        this.score += bonus;
        this.gameOver = true;
        this.stateLabel.innerHTML = destroids.msgEjected.replace("%SCORE%",
            destroids.formatNumber(this.score)).replace("%BONUS%", destroids.formatNumber(bonus));
        this.showStateLabel();
        if (destroids.HighScores.getInstance().determineRank(this.score))
            this.newHighScore.bind(this).delay(5);
        else
            this.startIntro.bind(this).delay(5);
        this.hud.close();
    }
};


/**
 * Ends the game.
 */

destroids.Game.prototype.endGame = function()
{
    if (!this.gameOver)
    {
        this.gameOver = true;
        this.stateLabel.innerHTML = destroids.msgGameOver.replace("%SCORE%",
            destroids.formatNumber(this.score));
        this.showStateLabel();
        if (destroids.HighScores.getInstance().determineRank(this.score))
            this.newHighScore.bind(this).delay(5);
        else
            this.startIntro.bind(this).delay(5);
        this.hud.close();
    }
};


/**
 * Starts a new game.
 */

destroids.Game.prototype.newGame = function()
{
    this.playSound(destroids.SND_LEVEL_UP);

    this.gameOver = true;
    this.menu.close();
    this.resume();
    this.destroyAll();
    this.stateLabel.innerHTML = destroids.msgNextLevel.replace("%LEVEL%", String(1));
    this.showStateLabel();
    this.reset.bind(this).delay(2);
};


/**
 * Creates a new UFO if this level hasn't seen an UFO yet.
 */

destroids.Game.prototype.newUFO = function()
{
    if (this.gameOver || this.lastUfoLevel <
        this.level && !destroids.Ufo.count())
    {
        this.rootNode.appendChild(new destroids.Ufo(this));
        this.lastUfoLevel = this.level
    }
};


/**
 * Destroys all destructible items.
 */

destroids.Game.prototype.destroyAll = function()
{
    var node, next;
    
    node = this.rootNode.getFirstChild();
    while (node)
    {
        next = node.getNextSibling();
        if ("destroy" in node) node["destroy"](); // TODO Cleaner interface
        node = next;
    }
};


/**
 * Plays a simple intro which is used as a background for the main menu.
 */

destroids.Game.prototype.startIntro = function()
{
    var i;
    
    this.destroyGame();

    // Create some asteroids
    for (i = this.asteroids; i < 2; i++)
    {
        this.rootNode.appendChild(new destroids.Asteroid(this));
    }
    
    // Create a new UFO
    this.newUFO();
    
    // Display the intro screen
    this.menu.open();
};


/**
 * Shows the game state label.
 * 
 * @private
 */

destroids.Game.prototype.showStateLabel = function()
{
    this.stateLabel.className = "visible"; 
};


/**
 * Hides the game state label.
 * 
 * @private
 */

destroids.Game.prototype.hideStateLabel = function()
{
    this.stateLabel.className = "hidden"; 
};


/**
 * Updates the space ship state displays.
 */

destroids.Game.prototype.updateShipState = function()
{    
    this.hud.setShield(this.spaceship.getShield());
    this.hud.setHull(this.spaceship.getHull());
};


/**
 * Pauses the game and opens the menu.
 */

destroids.Game.prototype.gotoMenu = function()
{
    this.pause();
    this.hud.close();
    this.menu.open();
};


/**
 * Closes the menu and continues the game.
 */

destroids.Game.prototype.continueGame = function()
{
    this.menu.close();
    this.hud.open();
    this.resume();
};


/**
 * Checks if game is over or not.
 * 
 * @return {boolean} True if game is over, false if not
 */

destroids.Game.prototype.isGameOver = function()
{
    return this.gameOver;
};

/**
 * Destroys the game.
 * 
 * @private
 */

destroids.Game.prototype.destroyGame = function()
{
    this.hideStateLabel();

    // Reset level so intro does not run too fast
    this.rootNode.setPhysics(null);
    this.rootNode.getTransform().setIdentity();
    this.asteroids = 0;
    
    // Destroy all old stuff
    if (this.ejecting)
        this.rootNode.removeChildren();
    else
        this.destroyAll();
    this.ejecting = false;
};


/**
 * Records a new high score.
 * 
 * @param {number} place
 *            The achieved place
 * @private 
 */

destroids.Game.prototype.newHighScore = function(place)
{
    var message, rank, highScores;

    this.destroyGame();
    highScores = destroids.HighScores.getInstance();
    rank = highScores.determineRank(this.score);
    message = destroids.msgNewHighScore.replace("%SCORE%",
        destroids.formatNumber(this.score)).
        replace("%RANK%", String(rank))
    destroids.onPrompt(destroids.msgNewHighScoreTitle, message,
        (/** @type {function(?string)} */
        destroids.Game.prototype.saveHighScore), this);
};


/**
 * Submits the high score name. This method must be called by the external
 * newHighScore
 * 
 * @param {string} name
 *            The high score name
 * @private
 */

destroids.Game.prototype.saveHighScore = function(name)
{
	var rank, highScores;
	
    if (name)
    {
        highScores = destroids.HighScores.getInstance();
        rank = highScores.determineRank(this.score);
        highScores.add(name, this.level, this.score);
    }
    this.startIntro();
};


/**
 * Checks if menu is currently open.
 * 
 * @return {boolean} True if menu is open, false if not
 */

destroids.Game.prototype.isMenuOpen = function()
{
    return this.menu.isOpen();
};


/**
 * Plays a sound.
 * 
 * @param {number} sound
 *            The sound ID
 */

destroids.Game.prototype.playSound = function(sound)
{
    if (destroids.onSound) destroids.onSound(sound);
};


/**
 * Resets the high scores.
 */

destroids.Game.prototype.resetHighScores = function()
{
    var highScores;
    
    highScores = destroids.HighScores.getInstance();
    highScores.reset();
    highScores.save();
    this.menu.updateHighScores();
};


/**
 * Returns the spaceship.
 * 
 * @return {destroids.Spaceship} The spaceship  
 */

destroids.Game.prototype.getSpaceship = function()
{
    return this.spaceship;
};


/**
 * Returns the game canvas width.
 * 
 * @return {number}
 *             The game canvas width
 */

destroids.Game.prototype.getWidth = function()
{
    return this.width;
};


/**
 * Returns the game canvas height.
 * 
 * @return {number}
 *             The game canvas height
 */

destroids.Game.prototype.getHeight = function()
{
    return this.height;
};
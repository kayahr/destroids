/**
 * $Id: game-assistant.js 910 2009-08-05 12:26:08Z k $
 * Copyright (C) 2009 Klaus Reimer <k@ailis.de>
 * See LICENSE.TXT for licensing information
 * 
 * @fileoverview
 * Provides jsteroids.Game class
 * 
 * @author Klaus Reimer (k@ailis.de)
 * @version $Revision: 910 $
 */


/**
 * Constructs the game.
 * 
 * @param {String} containerId
 *            The ID of the container element (Typically a DIV element).
 *            In this element the game constructs the canvas element and
 *            other elements needed for the game.
 * @param {Boolean} autoStart
 *            If game should start automatically after initialization.
 *            This parameter is optional and defaults to true
 * 
 * @constructor
 * @class The game
 */

jsteroids.Game = function(containerId, autoStart)
{
    this.containerId = containerId;
    if (autoStart === false) this.autoStart = false;
    this.init();
};

/** If game has been initialized. @private @type {Boolean} */
jsteroids.Game.prototype.initialized = false;

/** If game should start automatically after init. @private @type {Boolean} */
jsteroids.Game.prototype.autoStart = true;

/** The container id. @private @type {String} */
jsteroids.Game.prototype.containerId = null;

/** The container HTML element. @private @type {HTMLElement} */
jsteroids.Game.prototype.container = null;

/** The canvas element. @private @type {HTMLCanvasElement} */
jsteroids.Game.prototype.container = null;

/** The game canvas width. @private @type {Number} */
jsteroids.Game.prototype.width = null;

/** The game canvas height. @private @type {Number} */
jsteroids.Game.prototype.height = null;

/** The graphics context. @private @type {CanvasRenderingContext2D} */
jsteroids.Game.prototype.ctx = null;

/** The game timer. @private @type {Number} */
jsteroids.Game.prototype.timer = null;

/** The game scene. @private @type {twodee.Scene} */
jsteroids.Game.prototype.scene = null;

/** The root node. @private @type {twodee.SceneNode} */
jsteroids.Game.prototype.rootNode = null;

/** The current level. @private @type {Number} */
jsteroids.Game.prototype.level = null;

/** The space ship. @private @type {jsteroids.Spaceship} */
jsteroids.Game.prototype.spaceship = null;

/** The score. @private @type {Number} */
jsteroids.Game.prototype.score = 0;

/** The score label. @private @type {HTMLElement} */
jsteroids.Game.prototype.scoreLabel = null;

/** The level label. @private @type {HTMLElement} */
jsteroids.Game.prototype.levelLabel = null;

/** The game-state label. @private @type {HTMLElement} */
jsteroids.Game.prototype.stateLabel = null;

/** The number of remaining asteroids. @private @type {Number} */
jsteroids.Game.prototype.asteroids = 0;

/** If game is over. @private @type {Boolean} */
jsteroids.Game.prototype.gameOver = false;

/**
 * Initializes the game.
 */

jsteroids.Game.prototype.init = function()
{
    var container, canvas, s, scene, rootNode, scoreLabel, levelLabel;
    
    // Try to get container reference
    this.container = container = document.getElementById(this.containerId);
    
    // If not yet present then delay initialization
    if (!container)
    {
        this.init.bind(this).delay(0.1);
        return;
    }
    
    // Create the canvas
    this.canvas = canvas = document.createElement("canvas");
    s = canvas.style;
    s.position = "absolute";
    s.left = s.top = 0;
    s.background = "#000 center center url(" + jsteroids.imagesDir +
        "/background1.jpeg)";

    container.appendChild(canvas);

    // Create the score label
    this.scoreLabel = scoreLabel = document.createElement("div");
    s = scoreLabel.style;
    s.position = "absolute";
    s.top = s.right = "5px";
    s.fontFamily = "sans-serif";
    s.fontWeight = "bold";
    s.fontSize = "12px";
    s.color = "#0f0";
    container.appendChild(scoreLabel);
    
    // Create the level label
    this.levelLabel = levelLabel = document.createElement("div");
    s = levelLabel.style;
    s.position = "absolute";
    s.left = s.top = "8px";
    s.fontFamily = "sans-serif";
    s.fontWeight = "bold";
    s.fontSize = "12px";
    s.color = "#0f0";
    container.appendChild(levelLabel);
    
    // Create the game state label
    this.stateLabel = stateLabel = document.createElement("span");
    s = stateLabel.style;
    s.position = "absolute";
    s.left = s.right = "16px";
    s.top = "33%";
    s.textAlign = "center";
    s.fontFamily = "Times New Roman, serif";
    s.fontWeight = "bold";
    s.fontSize = "30px";
    s.color = "rgba(255, 255, 128, 0)";
    s.webkitTransition = "color .5s ease-in-out";

    container.appendChild(stateLabel);
    
    // Correct container positioning if needed
    if (canvas.offsetParent != container)
        container.style.position = "relative";
    
    // Create the graphics context
    this.ctx = canvas.getContext("2d");
    
    // Create the scene
    this.scene = scene = new twodee.Scene();
    this.rootNode = rootNode = new twodee.SceneNode();
    scene.setRootNode(rootNode);
    
    // Re-call resize method when window resizes
    Event.observe(window, "resize", this.resize.bindAsEventListener(this));

    // Create keyboard listeners
    this.keyDownHandler = this.handleKeyDown.bindAsEventListener(this);
    this.keyUpHandler = this.handleKeyUp.bindAsEventListener(this);
    
    // Initialize the game size
    this.resize();
    
    // Reset the game
    this.newGame();
    
    // Mark game as initialized
    this.initialized = true;
    
    // Auto-start the game if needed
    if (this.autoStart) this.start();
};


/**
 * Resets the game.
 */

jsteroids.Game.prototype.reset = function()
{
    var rootNode;
    
    this.hideStateLabel();
    rootNode = this.rootNode;

    // Remove all stuff from the scene
    rootNode.removeChildren();
    
    // Create the spaceship
    spaceship = this.spaceship = new jsteroids.Spaceship(this);
    rootNode.appendChild(spaceship);

    // Reset score to 0
    this.setScore(0);
    
    // Initialize the game to level 1
    this.setLevel(1);
    
    this.gameOver = false;
};



/**
 * This method must be called when the size of the output container has been
 * resized. It updates the internal HTML elements which are located in this
 * output container.
 */

jsteroids.Game.prototype.resize = function()
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
 * @return {Boolean} True if game is initialized, false if not
 */

jsteroids.Game.prototype.isInitialized = function()
{
    return this.initialized;
};


/**
 * Starts the game.
 */

jsteroids.Game.prototype.start = function()
{
    // Do nothing if game is not initialized yet
    if (!this.initialized) return;
    
    // Start the game thread
    this.timer = window.setInterval(this.run.bind(this), 1);

    // Install keyboard handlers
    window.addEventListener("keydown", this.keyDownHandler, false);     
    window.addEventListener("keyup", this.keyUpHandler, false);     
};


/**
 * Stops the game.
 */

jsteroids.Game.prototype.stop = function()
{
    // Uninstall keyboard handlers
    window.removeEventListener("keydown", this.keyDownHandler, false);     
    window.removeEventListener("keyup", this.keyUpHandler, false);     

    // Stop game thread
    window.clearTimeout(this.timer);
};


/**
 * The game thread run method.
 */

jsteroids.Game.prototype.run = function()
{
    var ctx, width, height;
    
    width = this.width;
    height = this.height;
    ctx = this.ctx;
    
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    this.scene.update();
    this.scene.render(ctx, width, height);
    ctx.restore();
};


/**
 * Sets the level.
 * 
 * @param {Number} level
 *            The level to set
 */

jsteroids.Game.prototype.setLevel = function(level)
{
    var bgId, rootNode, asteroids;
    
    this.hideStateLabel();

    this.levelLabel.innerHTML = "Level: " + level;

    rootNode = this.rootNode;
    
    // Set the level
    this.level = level;
    
    // Setup the background image
    bgId = (level % jsteroids.backgrounds) + 1;
    this.canvas.style.backgroundImage = "url(" + jsteroids.imagesDir +
        "/background" + bgId + ".jpeg)";
    
    // Create the asteroids
    this.asteroids = 0;
    asteroids = 2 + parseInt(level / 3);
    while (asteroids--) this.addAsteroid();
};


/**
 * Returns the current level.
 * 
 * @return {Number} The current level
 */

jsteroids.Game.prototype.getLevel = function()
{
    return this.level;
};


/**
 * Handles the key down event.
 * 
 * @param {Event} event
 *            The key down event
 * @private
 */
 
jsteroids.Game.prototype.handleKeyDown = function(event)
{
    if (this.gameOver) return;
    
    switch (event.keyCode)
    {
        case 65: // A
        case 38: // UP
            this.spaceship.startThrust();
            break;
            
        case 76: // L
        case 39: // RIGHT
            this.spaceship.yawRight();
            break;
            
        case 75: // K
        case 37: // LEFT
            this.spaceship.yawLeft();
            break;
            
        case 32: // Space
        case 81: // Q
            this.spaceship.startFireLaser();
            break;
            
        default:
            return;
    }
    event.preventDefault();
};


/**
 * Handles the key up event.
 * 
 * @param {Event} event
 *            The key down event
 * @private
 */
 
jsteroids.Game.prototype.handleKeyUp = function(event)
{
    switch (event.keyCode)
    {
        case 65: // A
        case 38: // UP
            this.spaceship.stopThrust();
            break;
            
        case 75: // K
        case 76: // L
        case 39: // RIGHT
        case 37: // LEFT
            this.spaceship.stopYaw();
            break;
            
        case 32: // Space
        case 81: // Q
            this.spaceship.stopFireLaser();
            break;
            
        default:
            return;
    }
    event.preventDefault();
};


/**
 * Triggers an explosion at the position of the specified node.
 * 
 * @param {twodee.SceneNode} node
 *            The node at which position an explosion should be triggered
 */

jsteroids.Game.prototype.explode = function(node)
{
    var i, particle, transform, heading;
    
    for (i = 10; i >= 0; i--)
    {
        heading = Math.random() * Math.PI * 2;
        particle = new twodee.PolygonNode(jsteroids.PARTICLE);
        transform = node.getTransform();
        particle.getTransform().translate(transform.m02, transform.m12).
            rotate(heading);
        particle.setFillStyle("#fff");
        physics = new twodee.Physics();
        particle.setPhysics(physics);
        physics.getVelocity().set(0, 150 + Math.random() * 100).rotate(heading);
        physics.setLifetime(1);
        this.rootNode.appendChild(particle);
    }
};


/**
 * Adds score points.
 * 
 * @param {Number} points
 *            The points to add per level
 */

jsteroids.Game.prototype.addScore = function(points)
{
    if (!this.gameOver) this.setScore(this.score + points* this.level);
};


/**
 * Sets the score.
 * 
 * @param {Number} score
 *            The score to set
 */

jsteroids.Game.prototype.setScore = function(score)
{
    this.score = score;
    this.scoreLabel.innerHTML = "Score: " + score;
};


/**
 * Adds a new asteroid.
 */

jsteroids.Game.prototype.addAsteroid = function(parentAsteroid)
{
    this.rootNode.appendChild(new jsteroids.Asteroid(this, parentAsteroid));
    this.asteroids++;
};


/**
 * Removes one asteroid. If all asteroids are removed then the level is
 * complete.
 */

jsteroids.Game.prototype.removeAsteroid = function()
{
    this.asteroids--;
    if (!this.asteroids) this.completeLevel();
};


/**
 * Completes the current level.
 */

jsteroids.Game.prototype.completeLevel = function()
{
    var nextLevel;
    
    nextLevel = this.level + 1;
    this.stateLabel.innerHTML = "Right On Commander!<br /><br />Prepare for Level <strong>" + nextLevel + "</strong>";
    this.showStateLabel();
    this.setLevel.bind(this, nextLevel).delay(5);
};


/**
 * Ends the game.
 */

jsteroids.Game.prototype.endGame = function()
{
    this.gameOver = true;
    this.stateLabel.innerHTML = "Game Over";
    this.showStateLabel();
    this.reset.bind(this).delay(5);
};


/**
 * Starts a new game.
 */

jsteroids.Game.prototype.newGame = function()
{
    this.gameOver = true;
//    this.stateLabel.innerHTML = "Version 0.0.1<br />Public Alpha<br /><br>Use K, L and A to steer the ship, Q to fire";
  //  this.showStateLabel();
    //this.reset.bind(this).delay(5);
    this.reset();
};


/**
 * Shows the game state label.
 * 
 * @private
 */

jsteroids.Game.prototype.showStateLabel = function()
{
    this.stateLabel.style.color = "rgba(255, 255, 128, 1)"; 
};


/**
 * Hides the game state label.
 * 
 * @private
 */

jsteroids.Game.prototype.hideStateLabel = function()
{
    this.stateLabel.style.color = "rgba(255, 255, 128, 0)"; 
};
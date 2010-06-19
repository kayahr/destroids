/**
 * The namespace for Destroids classes.
 * 
 * @type {Object} 
 */
var destroids = {};
window["destroids"] = destroids;


/**
 * Formats a number
 *
 * @param {number} number
 *            The number to format
 * @return {string} The formatted number
 */

destroids.formatNumber = function(number)
{
    var rest;
    
    rest = parseInt(number / 1000, 10);
    if (rest) return destroids.formatNumber(rest) + destroids.msgThousandSep +
        (1000 + (Math.abs(number) % 1000)).toString().substring(1);
    return "" + number;
};


/**
 * Sanitizes the specified angle (RAD) so the returned angle
 * is between 0 and 2*PI.
 * 
 * @param {number} angle
 *            The angle to sanitize
 * @return {number} The sanitized angle
 */

destroids.sanitizeAngle = function(angle)
{
    var pi2;
    
    pi2 = Math.PI * 2;
    return ((angle % pi2) + pi2) % pi2;
};


/**
 * Returns the difference between the two angles (Both in RAD). The
 * returned difference angle is between -PI and PI. Negative means
 * the angle is anti-clockwise, positive means it is clockwise.
 * 
 * @param {number} startAngle
 *            The starting angle
 * @param {number} endAngle
 *            The ending enagle
 */

destroids.getAngleDiff = function(startAngle, endAngle)
{
	var diff;
	
    startAngle = destroids.sanitizeAngle(startAngle);
    endAngle = destroids.sanitizeAngle(endAngle);
    diff = destroids.sanitizeAngle(endAngle - startAngle);
    if (diff > Math.PI) diff -= Math.PI * 2;
    return diff;
};


/**
 * The location of the images.
 * 
 * @type {string} 
 */
destroids.imagesDir = "images";

/**
 * The number of available asteroid types.
 * 
 * @type {number}
 */
destroids.asteroids = 5;

/** 
 * The asteroid bounds. @private 
 * 
 * @type {Array.<twodee.Polygon>} 
 */
destroids.ASTEROID_BOUNDS = [
    new twodee.Polygon([
        new twodee.Vector(-16, -5),
        new twodee.Vector(-7, -16),
        new twodee.Vector(4, -16),
        new twodee.Vector(15, -7),
        new twodee.Vector(15, 2),
        new twodee.Vector(6, 15),
        new twodee.Vector(-5, 15),
        new twodee.Vector(-12, 11),
        new twodee.Vector(-16, -2)
    ]),
    new twodee.Polygon([
        new twodee.Vector(-15, -6),
        new twodee.Vector(-6, -16),
        new twodee.Vector(4, -16),
        new twodee.Vector(15, -7),
        new twodee.Vector(15, 7),
        new twodee.Vector(6, 15),
        new twodee.Vector(-8, 15),
        new twodee.Vector(-16, 4)
    ]),
    new twodee.Polygon([
        new twodee.Vector(-16, -4),
        new twodee.Vector(-8, -15),
        new twodee.Vector(-2, -16),
        new twodee.Vector(9, -16),
        new twodee.Vector(15, -4),
        new twodee.Vector(15, 8),
        new twodee.Vector(7, 15),
        new twodee.Vector(-7, 15),
        new twodee.Vector(-16, 5)
    ]),
    new twodee.Polygon([
        new twodee.Vector(-16, -11),
        new twodee.Vector(-1, -11),
        new twodee.Vector(15, 0),
        new twodee.Vector(15, 9),
        new twodee.Vector(13, 11),
        new twodee.Vector(6, 11),
        new twodee.Vector(-9, 5),
        new twodee.Vector(-16, -5)
    ]),
    new twodee.Polygon([
        new twodee.Vector(15, -16),
        new twodee.Vector(14, -5),
        new twodee.Vector(6, 6),
        new twodee.Vector(-5, 15),
        new twodee.Vector(-16, 12),
        new twodee.Vector(-16, 2),
        new twodee.Vector(-11, -7),
        new twodee.Vector(1, -14)
    ])
];

/** 
 * The main thrust polygon.
 * 
 * @type {twodee.Polygon} 
 */
destroids.MAIN_THRUST = new twodee.Polygon([
    new twodee.Vector(0, 26),
    new twodee.Vector(-2, 19),
    new twodee.Vector(0, 20),
    new twodee.Vector(2, 19)
]);    

/**
 * The left thrust polygon. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.LEFT_THRUST = new twodee.Polygon([
    new twodee.Vector(10, -12),
    new twodee.Vector(4, -13),
    new twodee.Vector(4, -11)
]);    

/** 
 * The right thrust polygon. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.RIGHT_THRUST = new twodee.Polygon([
    new twodee.Vector(-10, -12),
    new twodee.Vector(-4, -13),
    new twodee.Vector(-4, -11)
]);    

/**
 * The laser polygon. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.LASER = new twodee.Polygon([
    new twodee.Vector(0, -15),
    new twodee.Vector(1.5, -10),
    new twodee.Vector(0, 15),
    new twodee.Vector(-1.5, -10)
]);    


/**
 * The laser beam polygon. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.LASERBEAM = new twodee.Polygon([
    new twodee.Vector(0, -300),
    new twodee.Vector(1.5, -10),
    new twodee.Vector(0, 15),
    new twodee.Vector(-1.5, -10)
]);    

/** 
 * The particle polygon. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.PARTICLE = new twodee.Polygon([
    new twodee.Vector(0, -5),
    new twodee.Vector(1, 2),
    new twodee.Vector(0, 5),
    new twodee.Vector(-1, 2)
]);    

/** 
 * The spaceship bounds. 
 *
 * @type {twodee.Polygon} 
 */
destroids.SPACESHIP_BOUNDS = new twodee.Polygon([
    new twodee.Vector(-11,  8),
    new twodee.Vector(  0, -18),
    new twodee.Vector( 11,  8),
    new twodee.Vector( 11,  13),
    new twodee.Vector(  4,  17),
    new twodee.Vector( -4,  17),
    new twodee.Vector(-11,  13)
]);

/** 
 * The UFO bounds. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.UFO_BOUNDS = new twodee.Polygon([
    new twodee.Vector( 0 - 24,  8 - 8),
    new twodee.Vector(22 - 24,  0 - 8),
    new twodee.Vector(25 - 24,  0 - 8),
    new twodee.Vector(47 - 24,  8 - 8),
    new twodee.Vector(25 - 24, 15 - 8),
    new twodee.Vector(22 - 24, 15 - 8)
]);

/**
 * The drop bounds. 
 * 
 * @type {twodee.Polygon} 
 */
destroids.DROP_BOUNDS = new twodee.Polygon([
    new twodee.Vector(-7,  0),
    new twodee.Vector(-5, -5),
    new twodee.Vector( 0, -7),
    new twodee.Vector( 5, -5),
    new twodee.Vector( 7,  0),
    new twodee.Vector( 5,  5),
    new twodee.Vector( 0,  7),
    new twodee.Vector(-5,  5)
]);

/** 
 * The function to call when preferences button is pressed.
 */
destroids.onPreferences = function() {};

/** 
 * The function to call when help button is pressed.
 */
destroids.onHelp = function() {};

/** 
 * Prompts for a value and submits it to the specified onSubmit callback. 
 * 
 * @param {string} title
 *            The prompt window title
 * @param {string} message
 *            The prompt message
 * @param {function(?string)} onSubmit
 *            The submit callback
 * @param {Object} context
 *            The callback context            
 */
destroids.onPrompt = function(title, message, onSubmit, context)
{
    onSubmit.call(context, prompt(title + " " + message));
};


/**
 * Displays a notification.
 * 
 * @param {string} message
 *     The message to display
 */

destroids.onNotification = function(message)
{
	alert(message);
};


/**
 * The function to call to play a sound.
 * 
 * @param {number} sound
 *            The sound to play
 */ 
destroids.onSound = function(sound) {};

/**
 * The game title. 
 * 
 * @type {string} 
 */
destroids.msgTitle = "Destroids"

/** 
 * The first level message. 
 * 
 * @type {string} 
 */
destroids.msgRightOn = "<span class=\"rightOn\">Right On Commander!</span>";

/** 
 * The next level message. 
 * 
 * @type {string} 
 */
destroids.msgNextLevel = "Prepare for Level <span class=\"level\">%LEVEL%</span>"

/** 
 * The game over message. 
 * 
 * @type {string} */
destroids.msgGameOver = "Game Over<br /><span class=\"detail\">End Score: <span class=\"score\">%SCORE%</span></span>";

/**
 * The eject warning message.
 * @type {string}
 */
destroids.msgEject = "EJECT !";

/** 
 * The game over message. 
 * 
 * @type {string} */
destroids.msgEjected = "Ejected<br /><span class=\"ejectBonus\">Eject Bonus: + %BONUS%</span><br />End Score: <span class=\"score\">%SCORE%</span></span>";

/** 
 * The shield display label. 
 * 
 * @type {string} 
 */
destroids.msgShield = "Shield";

/** 
 * The hull display label. 
 * 
 * @type {string} 
 */
destroids.msgHull = "Hull";

/** 
 * The rank label. 
 * 
 * @type {string} 
 */
destroids.msgRank = "#";

/** 
 * The name label. 
 * 
 * @type {string} 
 */
destroids.msgName = "Name";

/** 
 * The score display label. 
 * 
 * @type {string} 
 */
destroids.msgScore = "Score";

/** 
 * The short level display label. 
 * 
 * @type {string} 
 */
destroids.msgShortLevel = "Lvl";

/** 
 * The level display label. 
 * 
 * @type {string} 
 */
destroids.msgLevel = "Level";

/** 
 * The new-game button label.
 * 
 * @type {string} 
 */
destroids.msgNewGame = "New Game";

/** 
 * The continue-game button label. 
 * 
 * @type {string} */
destroids.msgContinueGame = "Continue";

/** 
 * The preferences button label. 
 * 
 * @type {string} */
destroids.msgPreferences = "Prefs";

/** 
 * The help button label. 
 * 
 * @type {string} 
 */
destroids.msgHelp = "Help";

/** 
 * The new high score title. 
 * 
 * @type {string} 
 */
destroids.msgNewHighScoreTitle = "Well done!";

/** 
 * The new high score message. 
 * 
 * @type {string} 
 */
destroids.msgNewHighScore = "You scored %SCORE% points! Your score will be submitted to the online highscore list. Please enter your name:";

/** 
 * The new high score message (with local ranking). 
 * 
 * @type {string} 
 */
destroids.msgNewHighScoreWithLocal = "You scored %SCORE% points! This is rank %RANK% in your local highscore list! Your score will also be submitted to the online highscore list. Please enter your name:";

/**
 * The rank notification message.
 * 
 * @type {string}
 */
destroids.msgRankNotification = "You achieved rank #%RANK% in the global highscore list!";

/**
 * The rank error notification message.
 * 
 * @type {string}
 */
destroids.msgRankErrorNotification = "Sorry, your score could not be submitted... Hey, don't get mad at me, it's just a game.";

/**
 * The thousand separator character.
 * 
 * @type {string} 
 */
destroids.msgThousandSep = ",";

/**
 * Indicator for local highscore list.
 * 
 * @type {string}
 */
destroids.msgLocalIndicator = "LOCAL";

/**
 * Indicator for global highscore list.
 * 
 * @type {string}
 */
destroids.msgGlobalIndicator = "GLOBAL";

/**
 * The roll center.
 * 
 * @type {number} 
 */
destroids.ctrlRollCenter = 0;

/**
 * The roll center.
 * 
 * @type {number} 
 */
destroids.ctrlPitchCenter = 0;

/**
 * The roll range in degree. 
 * 
 * @type {number} 
 */
destroids.ctrlRollRange = 45;

/**
 * The roll range in degree. 
 * 
 * @type {number} 
 */
destroids.ctrlPitchRange = 45;

/**
 * The pitch dead zone in degree. 
 * 
 * @type {number} 
 */
destroids.ctrlPitchDeadZone = 10;

/**
 * The roll dead zone in degree. 
 * 
 * @type {number} 
 */
destroids.ctrlRollDeadZone = 10;

/**
 * Keycodes for thrust. 
 * 
 * @type {Array.<number>} 
 */
destroids.ctrlThrust = [ 65, 38 ];

/**
 * Keycodes for thrust. 
 * 
 * @type {Array.<number>} 
 */
destroids.ctrlEject = [ 69 ];

/**
 * Keycodes for yaw right. 
 * 
 * @type {Array.<number>} 
 */
destroids.ctrlRight = [ 76, 39 ];

/**
 * Keycodes for yaw left. 
 * 
 * @type {Array.<number>} 
 */
destroids.ctrlLeft = [ 75, 37 ];

/**
 * Keycodes for fire. 
 * 
 * @type {Array.<number>} 
 */
destroids.ctrlFire = [ 32, 81 ];

/**
 * Keycodes for menu. 
 * 
 * @type {Array.<number>} 
 */
destroids.ctrlMenu = [ 27, -1 ];

/**
 * If rotation compensator should be used. 
 * 
 * @type {boolean} 
 */
destroids.ctrlRotationCompensator = true;

/**
 * If gravity control should be used. 
 * 
 * @type {boolean} 
 */
destroids.ctrlGravity = false;

/**
 * The game interval in millisconds. 
 * 
 * @const
 * @type {number} 
 */
destroids.GAME_INTERVAL = 33;

/**
 * Sound constant for spaceship fire. 
 * 
 * @type {number} 
 */
destroids.SND_SPACESHIP_THRUST = 0;

/**
 * Sound constant for spaceship fire. 
 * 
 * @type {number} 
 */
destroids.SND_SPACESHIP_FIRE = 1;

/**
 * Sound constant for UFO fire. 
 * 
 * @type {number} 
 */
destroids.SND_UFO_FIRE = 2;

/**
 * Sound constant for destroying small asteroid. 
 * 
 * @type {number} 
 */
destroids.SND_SMALL_ASTEROID_DESTROYED = 3;

/**
 * Sound constant for destroying large asteroid. 
 * 
 * @type {number} 
 */
destroids.SND_LARGE_ASTEROID_DESTROYED = 4;

/**
 * Sound constant for UFO hull damage. 
 * 
 * @type {number} 
 */
destroids.SND_UFO_HULL_DAMAGE = 5;

/**
 * Sound constant for destroying UFO. 
 * 
 * @type {number} 
 */
destroids.SND_UFO_DESTROYED = 6;

/**
 * Sound constant for destroying drop. 
 * 
 * @type {number} 
 */
destroids.SND_DROP_DESTROYED = 7;

/**
 * Sound constant for spaceship shield damage. 
 * 
 * @type {number} 
 */
destroids.SND_SPACESHIP_SHIELD_DAMAGE = 8;

/**
 * Sound constant for spaceship hull damage. 
 * 
 * @type {number} 
 */
destroids.SND_SPACESHIP_HULL_DAMAGE = 9;

/**
 * Sound constant for spaceship destroyed. 
 * 
 * @type {number} 
 */
destroids.SND_SPACESHIP_DESTROYED = 10;

/**
 * Sound constant for adding shield energy. 
 * 
 * @type {number} 
 */
destroids.SND_COLLECT_DROP = 11;

/**
 * Sound constant for level up. 
 * 
 * @type {number} 
 */
destroids.SND_LEVEL_UP = 12;

/**
 * Sound constant for ejection. 
 * @final
 * @type {number} 
 */
destroids.SND_EJECT = 13;

/**
 * Constant for laser type.
 * @final 
 * @type {number} 
 */
destroids.TYPE_LASER = 1;

/**
 * Constant for laser type.
 * @final 
 * @type {number}
 */
destroids.TYPE_ASTEROID = 2;

/**
 * Constant for laser type.
 * @final 
 * @type {number} 
 */
destroids.TYPE_SPACESHIP = 4;

/**
 * Constant for laser type.
 * @final 
 * @type {number} 
 */
destroids.TYPE_UFO = 8;

/**
 * Constant for laser type.
 * @final 
 * @type {number}
 */
destroids.TYPE_DROP = 16;

/**
 * The URL to which scores are submitted.
 * @type {?string}
 */
destroids.scoreSubmitUrl = null;

/**
 * The URL to retrieve the global Top 5.
 * @type {?string}
 */
destroids.scoreTop5Url = null;

/**
 * The trilaser powerup ID.
 * @type {number}
 */
destroids.POWERUP_TRILASER = 0;

/**
 * The beamlaser powerup ID.
 * @type {number}
 */
destroids.POWERUP_BEAMLASER = 1;

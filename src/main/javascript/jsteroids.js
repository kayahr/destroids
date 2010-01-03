/** The namespace for JSteroids classes. @type {Object} */
jsteroids = {};


/**
 * Formats a number
 * 
 * @param {Number} number
 *            The number to format
 * @return {String} The formatted number
 */

jsteroids.formatNumber = function(number)
{
    var rest;
    
    rest = parseInt(number / 1000);
    if (rest) return jsteroids.formatNumber(rest) + jsteroids.msgThousandSep +
        (1000 + (Math.abs(number) % 1000)).toString().substring(1);
    return number;
};

/** The location of the images. @type {String} */
jsteroids.imagesDir = "images";

/** The number of available asteroid types. @type {Number} */
jsteroids.asteroids = 5;

/** The asteroid bounds. @private @type {Array} */
jsteroids.ASTEROID_BOUNDS = [
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

/** The main thrust polygon. @private @type {twodee.Polygon} */
jsteroids.MAIN_THRUST = new twodee.Polygon([
    new twodee.Vector(0, 26),
    new twodee.Vector(-2, 19),
    new twodee.Vector(0, 20),
    new twodee.Vector(2, 19)
]);    

/** The left thrust polygon. @private @type {twodee.Polygon} */
jsteroids.LEFT_THRUST = new twodee.Polygon([
    new twodee.Vector(10, -12),
    new twodee.Vector(4, -13),
    new twodee.Vector(4, -11)
]);    

/** The right thrust polygon. @private @type {twodee.Polygon} */
jsteroids.RIGHT_THRUST = new twodee.Polygon([
    new twodee.Vector(-10, -12),
    new twodee.Vector(-4, -13),
    new twodee.Vector(-4, -11)
]);    

/** The laser polygon. @private @type {twodee.Polygon} */
jsteroids.LASER = new twodee.Polygon([
    new twodee.Vector(0, -15),
    new twodee.Vector(1.5, -10),
    new twodee.Vector(0, 15),
    new twodee.Vector(-1.5, -10)
]);    

/** The particle polygon. @private @type {twodee.Polygon} */
jsteroids.PARTICLE = new twodee.Polygon([
    new twodee.Vector(0, -5),
    new twodee.Vector(1, 2),
    new twodee.Vector(0, 5),
    new twodee.Vector(-1, 2)
]);    

/** The spaceship bounds. @private @type {twodee.Polygon} */
jsteroids.SPACESHIP_BOUNDS = new twodee.Polygon([
    new twodee.Vector(-11,  8),
    new twodee.Vector(  0, -18),
    new twodee.Vector( 11,  8),
    new twodee.Vector( 11,  13),
    new twodee.Vector(  4,  17),
    new twodee.Vector( -4,  17),
    new twodee.Vector(-11,  13)
]);

/** The UFO bounds. @private @type {twodee.Polygon} */
jsteroids.UFO_BOUNDS = new twodee.Polygon([
    new twodee.Vector( 0 - 24,  8 - 8),
    new twodee.Vector(22 - 24,  0 - 8),
    new twodee.Vector(25 - 24,  0 - 8),
    new twodee.Vector(47 - 24,  8 - 8),
    new twodee.Vector(25 - 24, 15 - 8),
    new twodee.Vector(22 - 24, 15 - 8)
]);

/** The function to call when preferences button is pressed. @type {Function} */
jsteroids.onPreferences = null;

/** The prompt function. @type {Function} */
jsteroids.onPrompt = function(title, message, onSubmit, context)
{
    onSubmit.call(context, prompt(title + " " + message));
};

/** The game title. @type {String} */
jsteroids.msgTitle = "JSteroids"

/** The copyright message. @type {String} */ 
jsteroids.msgCopyright = "Copyright © 2009"
    
/** The copyright holder URL. @type {String} */
jsteroids.msgCopyrightHolderURL = "http://www.ailis.de/~k/";

/** The copyright holder. @type {String} */
jsteroids.msgCopyrightHolder = "Klaus Reimer";

/** The first level message. @type {String} */
jsteroids.msgRightOn = "Right On Commander!<br /><br />";

/** The next level message. @type {String} */
jsteroids.msgNextLevel = "Prepare for Level <span class=\"level\">%LEVEL%</span>"

/** The game over message. @type {String} */
jsteroids.msgGameOver = "Game Over<br /><span class=\"detail\">End Score: <span class=\"score\">%SCORE%</span></span>";

/** The shield display label. @type {String} */
jsteroids.msgShield = "Shield";

/** The hull display label. @type {String} */
jsteroids.msgHull = "Hull";

/** The namey label. @type {String} */
jsteroids.msgName = "Name";

/** The score display label. @type {String} */
jsteroids.msgScore = "Score";

/** The level display label. @type {String} */
jsteroids.msgLevel = "Level";

/** The new-game button label. @type {String} */
jsteroids.msgNewGame = "New Game";

/** The continue-game button label. @type {String} */
jsteroids.msgContinueGame = "Continue";

/** The preferences button label. @type {String} */
jsteroids.msgPreferences = "Prefs";

/** The help button label. @type {String} */
jsteroids.msgHelp = "Help";

/** The new high score title. @type {String} */
jsteroids.msgNewHighScoreTitle = "Congratulations!";

/** The new high score message. @type {String} */
jsteroids.msgNewHighScore = "You scored %SCORE% points! This is rank %RANK% in the high score list! Please enter your name:";

/** The thousand separator character. @type {String} */
jsteroids.msgThousandSep = ",";

/** Keycodes for thrust. @type {Number} */
jsteroids.ctrlThrust = [ 65, 38 ];

/** Keycodes for yaw right. @type {Number} */
jsteroids.ctrlRight = [ 76, 39 ];

/** Keycodes for yaw left. @type {Number} */
jsteroids.ctrlLeft = [ 75, 37 ];

/** Keycodes for fire. @type {Number} */
jsteroids.ctrlFire = [ 32, 81 ];

/** Keycodes for menu. @type {Number} */
jsteroids.ctrlMenu = [ 27, -1 ];

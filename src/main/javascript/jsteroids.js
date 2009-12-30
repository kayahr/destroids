/** The namespace for JSteroids classes. @type {Object} */
jsteroids = {};

/** The location of the images. @type {String} */
jsteroids.imagesDir = "images";

/** The number of available background images. @type {Number} */
jsteroids.backgrounds = 1;

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

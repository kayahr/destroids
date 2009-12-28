/** The namespace for JSteroids classes. @type {Object} */
jsteroids = {};

/** The location of the images. @type {String} */
jsteroids.imagesDir = "images";

/** The number of available background images. @type {Number} */
jsteroids.backgrounds = 1;

/** The number of available asteroid types. @type {Number} */
jsteroids.asteroids = 1;

/** The asteroid bounds. @private @type {Array} */
jsteroids.ASTEROID_BOUNDS = [
    new twodee.Polygon([
        new twodee.Vector(0 - 16, 11 - 16),
        new twodee.Vector(9 - 16, 0 - 16),
        new twodee.Vector(20 - 16, 0 - 16),
        new twodee.Vector(31 - 16, 9 - 16),
        new twodee.Vector(31 - 16, 18 - 16),
        new twodee.Vector(22 - 16, 31 - 16),
        new twodee.Vector(11 - 16, 31 - 16),
        new twodee.Vector(4 - 16, 27 - 16),
        new twodee.Vector(0 - 16, 18 - 16)
    ])
];

/** The main thrust polygon. @private @type {twodee.Polygon} */
jsteroids.MAIN_THRUST = new twodee.Polygon([
    new twodee.Vector(0, 10 + 25),
    new twodee.Vector(-2.5, 25),
    new twodee.Vector(2.5, 25)
]);    

/** The left thrust polygon. @private @type {twodee.Polygon} */
jsteroids.LEFT_THRUST = new twodee.Polygon([
    new twodee.Vector(8 + 6, 0 - 14),
    new twodee.Vector(0 + 6, -1.5 - 14),
    new twodee.Vector(0 + 6, 1.5 - 14)
]);    

/** The right thrust polygon. @private @type {twodee.Polygon} */
jsteroids.RIGHT_THRUST = new twodee.Polygon([
    new twodee.Vector(-8 - 6, 0 - 14),
    new twodee.Vector(0 - 6, -1.5 - 14),
    new twodee.Vector(0 - 6, 1.5 - 14)
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
    new twodee.Vector(1, 0),
    new twodee.Vector(0, 5),
    new twodee.Vector(-1, 0)
]);    

/** The spaceship bounds. @private @type {twodee.Polygon} */
jsteroids.SPACESHIP_BOUNDS = new twodee.Polygon([
    new twodee.Vector(0 - 16, 34 - 24),
    new twodee.Vector(15 - 16, 0 - 24),
    new twodee.Vector(16 - 16, 0 - 24),
    new twodee.Vector(31 - 16, 34 - 24),
    new twodee.Vector(31 - 16, 41 - 24),
    new twodee.Vector(20 - 16, 47 - 24),
    new twodee.Vector(11 - 16, 47 - 24),
    new twodee.Vector(0 - 16, 41 - 24)
]);

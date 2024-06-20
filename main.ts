namespace SpriteKind {
    export const Collectible = SpriteKind.create()
    export const Box = SpriteKind.create()
    export const GrowPower = SpriteKind.create()
    export const Tile = SpriteKind.create()
    export const ShootPower = SpriteKind.create()
    export const ShrinkPower = SpriteKind.create()
    export const BatPower = SpriteKind.create()
    export const Selector = SpriteKind.create()
    export const Arrow = SpriteKind.create()
    export const Indicator = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
    export const SpinEnemy = SpriteKind.create()
    export const MysteryEnemy = SpriteKind.create()
    export const ShellEnemy = SpriteKind.create()
}

let currentLevel: number = -1
let maxLevel : number = 0
let currentWorld: number = 0
let maxWorld : number = 0
let previousLevelLocation: tiles.Location
let jumps: number = 0
let isFlying: boolean = false
let delta: number = 0
let playerSprite: Sprite = null
let levelSelectSprite: Sprite = null
let arrowSprite: Sprite = null
let indicatorSprite: Sprite = null
let levelTileLocationsList: tiles.Location[] = []
let index: number = 0

let isFalling: boolean = false
let levelSelect: boolean = false

let worldLevelsList: tiles.TileMapData[][] = [
        [
            tilemap`level1`,
            tilemap`level2`,
            tilemap`level3`,
            tilemap`level4`,
            tilemap`level5`,
            tilemap`level6`,
        ],
    ]

info.setScore(0)
let airEnemyObject = {
    "imgae" : [
        assets.image`drone`,
    ],
    "heatlh" : [1, ],
}

let groundEnemyObject = {
    "image" : [
        assets.image`zooKeeper`,
    ],
    "heatlh": [1,],
    "animations" : [
        [
            img`
                . . . f f f f f . . . .
                . . f e e e e e f f . .
                . f e e e e e e e f f .
                f e e e e e e e f f f f
                f e e 4 e e e f f f f f
                f e e 4 4 e e e f f f f
                f f e 4 4 4 4 4 f f f f
                f f e 4 4 f f 4 e 4 f f
                . f f d d d d 4 d 4 f .
                . . f b b d d 4 f f f .
                . . f e 4 4 4 e e f . .
                . . f 1 1 1 e d d 4 . .
                . . f 1 1 1 e d d e . .
                . . f 6 6 6 f e e f . .
                . . . f f f f f f . . .
                . . . . . f f f . . . .
            `, 
            img`
                . . . . . . . . . . . .
                . . . f f f f f f . . .
                . . f e e e e e f f f .
                . f e e e e e e e f f f
                f e e e e e e e f f f f
                f e e 4 e e e f f f f f
                f e e 4 4 e e e f f f f
                f f e 4 4 4 4 4 f f f f
                . f e 4 4 f f 4 e 4 f f
                . . f d d d d 4 d 4 f .
                . . f b b d e e f f f .
                . . f e 4 e d d 4 f . .
                . . f 1 1 e d d e f . .
                . f f 6 6 f e e f f f .
                . f f f f f f f f f f .
                . . f f f . . . f f . .
            `, 
            img`
                . . . . . . . . . . . .
                . . . f f f f f f . . .
                . . f e e e e e f f f .
                . f e e e e e e e f f f
                f e e e e e e e f f f f
                f e e 4 e e e f f f f f
                f e e 4 4 e e e f f f f
                f f e 4 4 4 4 4 f f f f
                . f e 4 4 f f 4 e 4 f f
                . . f d d d d 4 d 4 f f
                . . f b b d d 4 f f f .
                . . f e 4 4 4 e d d 4 .
                . . f 1 1 1 1 e d d e .
                . f f 6 6 6 6 f e e f .
                . f f f f f f f f f f .
                . . f f f . . . f f . .
            `
        ],
        [
            img`
                . . . . f f f f f . . .
                . . f f e e e e e f . .
                . f f e e e e e e e f .
                f f f f e e e e e e e f
                f f f f f e e e 4 e e f
                f f f f e e e 4 4 e e f
                f f f f 4 4 4 4 4 e f f
                f f 4 e 4 f f 4 4 e f f
                . f 4 d 4 d d d d f f .
                . f f f 4 d d b b f . .
                . . f e e 4 4 4 e f . .
                . . 4 d d e 1 1 1 f . .
                . . e d d e 1 1 1 f . .
                . . f e e f 6 6 6 f . .
                . . . f f f f f f . . .
                . . . . f f f . . . . .
            `,
            img`
                . . . . . . . . . . . .
                . . . f f f f f f . . .
                . f f f e e e e e f . .
                f f f e e e e e e e f .
                f f f f e e e e e e e f
                f f f f f e e e 4 e e f
                f f f f e e e 4 4 e e f
                f f f f 4 4 4 4 4 e f f
                f f 4 e 4 f f 4 4 e f .
                . f 4 d 4 d d d d f . .
                . f f f e e d b b f . .
                . . f 4 d d e 4 e f . .
                . . f e d d e 1 1 f . .
                . f f f e e f 6 6 f f .
                . f f f f f f f f f f .
                . . f f . . . f f f . .
            `,
            img`
                . . . . . . . . . . . .
                . . . f f f f f f . . .
                . f f f e e e e e f . .
                f f f e e e e e e e f .
                f f f f e e e e e e e f
                f f f f f e e e 4 e e f
                f f f f e e e 4 4 e e f
                f f f f 4 4 4 4 4 e f f
                f f 4 e 4 f f 4 4 e f .
                f f 4 d 4 d d d d f . .
                . f f f 4 d d b b f . .
                . 4 d d e 4 4 4 e f . .
                . e d d e 1 1 1 1 f . .
                . f e e f 6 6 6 6 f f .
                . f f f f f f f f f f .
                . . f f . . . f f f . .
            `
        ]
    ]
}
let shootingEnemyObject = {
    "image" : [
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . 4 4 4 4 . . . . . .
            . . . . 4 4 4 4 4 4 4 4 . . . .
            . . . 4 4 4 5 5 5 5 4 4 4 . . .
            . . 4 4 4 4 4 4 4 5 5 4 4 4 . .
            . . 4 4 4 4 4 4 4 4 5 5 4 4 . .
            . 4 4 4 4 4 4 4 4 4 5 5 4 4 4 .
            . 4 4 4 4 4 4 4 4 4 5 5 5 4 4 .
            . 4 4 4 4 4 4 4 4 4 5 5 5 4 4 .
            . 4 4 4 4 4 4 4 4 4 5 5 5 4 4 .
            . . 4 4 4 4 4 4 4 4 5 5 4 4 . .
            . . 4 4 4 4 4 4 4 4 4 4 4 4 . .
            . . . 4 4 4 4 4 4 4 4 4 4 . . .
            . . . . 4 4 4 4 4 4 4 4 . . . .
            . . . . . . 4 4 4 4 . . . . . .
            . . . . . . . . . . . . . . . .
        `
    ],
    "health" : [1,]
}
let spinningEnemyObject = {
    "image" : [
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . 4 4 4 4 4 4 4 . . . .
            . . . . 4 4 5 4 4 4 4 4 4 . . .
            . . . 4 4 5 5 2 2 4 4 4 4 4 . .
            . . . 4 5 5 5 2 2 2 2 4 4 4 . .
            . . . 4 5 5 2 2 2 2 2 2 4 4 . .
            . . . 4 5 5 2 2 2 2 2 2 4 4 . .
            . . . 4 5 5 2 2 2 2 2 4 4 4 . .
            . . . 4 4 4 2 2 2 2 2 4 4 4 . .
            . . . 4 4 4 4 2 2 2 4 4 4 4 . .
            . . . . 4 4 4 4 4 4 4 4 4 . . .
            . . . . . 4 4 4 4 4 4 4 . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . 7 7 7 7 7 7 7 . . . .
            . . . . 7 7 9 7 7 7 7 7 7 . . .
            . . . 7 7 9 9 8 8 7 7 7 7 7 . .
            . . . 7 9 9 9 8 8 8 8 7 7 7 . .
            . . . 7 9 9 8 8 8 8 8 8 7 7 . .
            . . . 7 9 9 8 8 8 8 8 8 7 7 . .
            . . . 7 9 9 8 8 8 8 8 7 7 7 . .
            . . . 7 7 7 8 8 8 8 8 7 7 7 . .
            . . . 7 7 7 7 8 8 8 7 7 7 7 . .
            . . . . 7 7 7 7 7 7 7 7 7 . . .
            . . . . . 7 7 7 7 7 7 7 . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . 8 8 8 8 8 8 8 . . . .
            . . . . 8 8 3 8 8 8 8 8 8 . . .
            . . . 8 8 3 3 a a 8 8 8 8 8 . .
            . . . 8 3 3 3 a a a a 8 8 8 . .
            . . . 8 3 3 a a a a a a 8 8 . .
            . . . 8 3 3 a a a a a a 8 8 . .
            . . . 8 3 3 a a a a a 8 8 8 . .
            . . . 8 8 8 a a a a a 8 8 8 . .
            . . . 8 8 8 8 a a a 8 8 8 8 . .
            . . . . 8 8 8 8 8 8 8 8 8 . . .
            . . . . . 8 8 8 8 8 8 8 . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
    ]
}
function createEnemyAnimations(animationList: Image[][], sprite: Sprite, animationInterval: number){
    // A for loop that sets animations based on left, right, up, and down
    let animationDirection = [Predicate.MovingLeft, Predicate.MovingRight, Predicate.MovingUp, Predicate.MovingDown]
    let count: number = 0
    for(let currentAnimation of animationList){
        characterAnimations.loopFrames(sprite, currentAnimation, animationInterval, animationDirection[count])
        count += 1
    }
}
function createSpinningEnemy(tileLocation: tiles.Location, enemyType: number, amount: number){
    if(enemyType < 0 || enemyType >= spinningEnemyObject["image"].length){
        console.log("Invalid Spinning Enemy")
        return
    }
    let enemySprite: Sprite = sprites.create(spinningEnemyObject["image"][enemyType], SpriteKind.SpinEnemy)
    tiles.placeOnTile(enemySprite, tileLocation)

    let orbitingSpritesList: Sprite[] = []

    for(let i = 0; i < amount; i+=1){
        let orbitingSprite: Sprite = sprites.create(spinningEnemyObject["image"][enemyType], SpriteKind.SpinEnemy)
        orbitingSprite.setFlag(SpriteFlag.GhostThroughWalls, true)
        orbitingSpritesList.push(orbitingSprite)
    }

    let angle: number = spriteutils.degreesToRadians(Math.randomRange(0, 359))
    let distance: number = 13
    spriteutils.onSpriteUpdateInterval(enemySprite, 50, function(sprite){
        let count: number = 0
        for(let orbitingSprite of orbitingSpritesList){
            orbitingSprite.scale = 1 - (0.1*(count+1))
            spriteutils.placeAngleFrom(orbitingSprite, angle, distance*(count+1), sprite)
            count++
        }
        angle += 0.0625
    })


}
function createMysteryEnemy(tileLocation: tiles.Location){
    let enemySpriteAnimations: Image[][] = [
        [
            img`
                . . . . . . . . . . . c c . . .
                . . . . . . . c c c c 6 3 c . .
                . . . . . . c 6 3 3 3 3 6 c . .
                . . c c . c 6 c c 3 3 3 3 3 c .
                . b 5 5 c 6 c 5 5 c 3 3 3 3 3 c
                . f f 5 c 6 c 5 f f 3 3 3 3 3 c
                . f f 5 c 6 c 5 f f 6 3 3 3 c c
                . b 5 5 3 c 3 5 5 c 6 6 6 6 c c
                . . b 5 5 3 5 5 c 3 3 3 3 3 3 c
                . . c 5 5 5 5 b c c 3 3 3 3 3 c
                . . c 4 5 5 4 b 5 5 c 3 3 3 c .
                . c 5 b 4 4 b b 5 c c b b b . .
                . c 4 4 b 5 5 5 4 c 4 4 4 5 b .
                . c 5 4 c 5 5 5 c 4 4 4 c 5 c .
                . c 5 c 5 5 5 5 c 4 4 4 c c c .
                . . c c c c c c c . . . . . . .
            `,
            img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . c c . . . .
                . . . . . . c c c c 6 3 c . . .
                . . . . . c 6 6 3 3 3 6 c . . .
                . . . . c 6 6 3 3 3 3 3 3 c . .
                b c c c 6 6 c c 3 3 3 3 3 3 c .
                b 5 5 c 6 c 5 5 c 3 3 3 3 3 c .
                f f 5 c 6 c 5 f f 6 3 3 3 c c .
                f f 5 c c c 5 f f 6 6 6 6 c c .
                . b 5 5 3 5 5 c 3 3 3 3 3 3 c .
                . c 5 5 5 5 4 c c c 3 3 3 3 c .
                . c 4 5 5 4 4 b 5 5 c 3 3 c . .
                . c 5 b 4 4 b b 5 c b b c . . .
                . c c 5 4 c 5 5 5 c c 5 c . . .
                . . . c c 5 5 5 5 c c c c . . .
                . . . . c c c c c c . . . . . .
            `,
            img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . c c . . .
                . . . . . . . c c c c 6 3 c . .
                . . . . . . c 6 6 3 3 3 6 c . .
                . . . . . c 6 6 3 3 3 3 3 3 c .
                . b c c c 6 6 c c 3 3 3 3 3 3 c
                . b 5 5 c 6 c 5 5 c 3 3 3 3 3 c
                . f f 5 c 6 c 5 f f 6 3 3 3 c c
                . f f 5 c c c 5 f f 6 6 6 6 c c
                . . b 5 5 3 5 5 c c c 3 3 3 3 c
                . . c 5 5 5 5 5 b 5 5 c 3 3 3 c
                . c 4 4 5 5 4 4 b b 5 c 3 3 c .
                . c 5 5 b 4 4 4 b 5 5 5 b c . .
                . c 5 5 5 4 4 4 c 5 5 5 c b . .
                . . c c c c 4 c 5 5 5 5 c c . .
                . . . . c c c c c c c c c c . .
            `,
            img`
                . . . . . . . . . . . c c . . .
                . . . . . . . c c c c 6 3 c . .
                . . . . . . c 6 3 3 3 3 6 c . .
                . . c c . c 6 c c 3 3 3 3 3 c .
                . b 5 5 c 6 c 5 5 c 3 3 3 3 3 c
                . f f 5 c 6 c 5 f f 3 3 3 3 3 c
                . f f 5 c 6 c 5 f f 6 3 3 3 c c
                . b 5 5 3 c 3 5 5 c 6 6 6 6 c c
                . . b 5 5 3 5 5 c 3 3 3 3 3 3 c
                . c c 5 5 5 5 4 c c 3 3 3 3 3 c
                c 5 5 4 5 5 4 c 5 5 c 3 3 3 c .
                b 5 4 b 4 4 4 c 5 5 5 b c c . .
                c 4 5 5 b 4 4 c 5 5 5 c b b . .
                c 5 5 5 c 4 c 5 5 5 5 c c 5 b .
                c 5 5 5 5 c 4 c c c c c c 5 c .
                . c c c c c c . . . . . c c c .
            `,
        ],
        [
            img`
                . . . c c . . . . . . . . . . .
                . . c 3 6 c c c c . . . . . . .
                . . c 6 3 3 3 3 6 c . . . . . .
                . c 3 3 3 3 3 c c 6 c . c c . .
                c 3 3 3 3 3 c 5 5 c 6 c 5 5 b .
                c 3 3 3 3 3 f f 5 c 6 c 5 f f .
                c c 3 3 3 6 f f 5 c 6 c 5 f f .
                c c 6 6 6 6 c 5 5 3 c 3 5 5 b .
                c 3 3 3 3 3 3 c 5 5 3 5 5 b . .
                c 3 3 3 3 3 c c b 5 5 5 5 c . .
                . c 3 3 3 c 5 5 b 4 5 5 4 c . .
                . . b b b c c 5 b b 4 4 b 5 c .
                . b 5 4 4 4 c 4 5 5 5 b 4 4 c .
                . c 5 c 4 4 4 c 5 5 5 c 4 5 c .
                . c c c 4 4 4 c 5 5 5 5 c 5 c .
                . . . . . . . c c c c c c c . .
            `,
            img`
                . . . . . . . . . . . . . . . .
                . . . . c c . . . . . . . . . .
                . . . c 3 6 c c c c . . . . . .
                . . . c 6 3 3 3 6 6 c . . . . .
                . . c 3 3 3 3 3 3 6 6 c . . . .
                . c 3 3 3 3 3 3 c c 6 6 c c c b
                . c 3 3 3 3 3 c 5 5 c 6 c 5 5 b
                . c c 3 3 3 6 f f 5 c 6 c 5 f f
                . c c 6 6 6 6 f f 5 c c c 5 f f
                . c 3 3 3 3 3 3 c 5 5 3 5 5 b .
                . c 3 3 3 3 c c c 4 5 5 5 5 c .
                . . c 3 3 c 5 5 b 4 4 5 5 4 c .
                . . . c b b c 5 b b 4 4 b 5 c .
                . . . c 5 c c 5 5 5 c 4 5 c c .
                . . . c c c c 5 5 5 5 c c . . .
                . . . . . . c c c c c c . . . .
            `,
            img`
                . . . . . . . . . . . . . . . .
                . . . c c . . . . . . . . . . .
                . . c 3 6 c c c c . . . . . . .
                . . c 6 3 3 3 6 6 c . . . . . .
                . c 3 3 3 3 3 3 6 6 c . . . . .
                c 3 3 3 3 3 3 c c 6 6 c c c b .
                c 3 3 3 3 3 c 5 5 c 6 c 5 5 b .
                c c 3 3 3 6 f f 5 c 6 c 5 f f .
                c c 6 6 6 6 f f 5 c c c 5 f f .
                c 3 3 3 3 c c c 5 5 3 5 5 b . .
                c 3 3 3 c 5 5 b 5 5 5 5 5 c . .
                . c 3 3 c 5 b b 4 4 5 5 4 4 c .
                . . c b 5 5 5 b 4 4 4 b 5 5 c .
                . . b c 5 5 5 c 4 4 4 5 5 5 c .
                . . c c 5 5 5 5 c 4 c c c c . .
                . . c c c c c c c c c c . . . .
            `,
            img`
                . . . c c . . . . . . . . . . .
                . . c 3 6 c c c c . . . . . . .
                . . c 6 3 3 3 3 6 c . . . . . .
                . c 3 3 3 3 3 c c 6 c . c c . .
                c 3 3 3 3 3 c 5 5 c 6 c 5 5 b .
                c 3 3 3 3 3 f f 5 c 6 c 5 f f .
                c c 3 3 3 6 f f 5 c 6 c 5 f f .
                c c 6 6 6 6 c 5 5 3 c 3 5 5 b .
                c 3 3 3 3 3 3 c 5 5 3 5 5 b . .
                c 3 3 3 3 3 c c 4 5 5 5 5 c c .
                . c 3 3 3 c 5 5 c 4 5 5 4 5 5 c
                . . c c b 5 5 5 c 4 4 4 b 4 5 b
                . . b b c 5 5 5 c 4 4 b 5 5 4 c
                . b 5 c c 5 5 5 5 c 4 c 5 5 5 c
                . c 5 c c c c c c 4 c 5 5 5 5 c
                . c c c . . . . . c c c c c c .
            `,
        ],
    ]

    let enemySprite: Sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . c c . . . .
        . . . . . . c c c c 6 3 c . . .
        . . . . . c 6 6 3 3 3 6 c . . .
        . . . . c 6 6 3 3 3 3 3 3 c . .
        b c c c 6 6 c c 3 3 3 3 3 3 c .
        b 5 5 c 6 c 5 5 c 3 3 3 3 3 c .
        f f 5 c 6 c 5 f f 6 3 3 3 c c .
        f f 5 c c c 5 f f 6 6 6 6 c c .
        . b 5 5 3 5 5 c 3 3 3 3 3 3 c .
        . c 5 5 5 5 4 c c c 3 3 3 3 c .
        . c 4 5 5 4 4 b 5 5 c 3 3 c . .
        . c 5 b 4 4 b b 5 c b b c . . .
        . c c 5 4 c 5 5 5 c c 5 c . . .
        . . . c c 5 5 5 5 c c c c . . .
        . . . . c c c c c c . . . . . .
    `, SpriteKind.MysteryEnemy)
    createEnemyAnimations(enemySpriteAnimations, enemySprite, 150)
    enemySprite.ay = 300
    let directionX: number = 0
    if (Math.randomRange(-1, 1) < 0) {
        directionX = -1
    } else {
        directionX = 1
    }
    enemySprite.setVelocity(directionX * Math.randomRange(25, 40), 0)
    sprites.setDataNumber(enemySprite, "speed", enemySprite.vx)

    tiles.placeOnTile(enemySprite, tileLocation)
}

function createShellEnemy(spriteLocation: Sprite){

    let enemySprite: Sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . c c . .
        . . . . . . . c c c c c 6 3 c .
        . . . . . . c 6 6 3 3 3 6 6 c .
        . . . . . c 6 6 6 3 3 3 3 3 3 c
        . . . . c 6 6 6 6 3 3 3 3 3 3 c
        . . c c c 6 6 6 6 6 3 3 3 3 3 c
        . c 3 3 3 c 6 6 6 6 6 3 3 3 3 c
        c 3 c c c 3 c 6 6 6 6 6 3 3 c c
        c 6 c c c c 3 c 6 6 6 6 6 6 c c
        c 6 c c c c 6 6 c 6 6 3 3 3 3 c
        . c 6 c c c c 6 c 6 3 3 3 3 6 c
        . . c 6 c c c c c 6 3 3 3 6 c .
        . . . c c c c c c c c c c c . .
    `, SpriteKind.ShellEnemy)
    enemySprite.ay = 300
    sprites.setDataNumber(enemySprite, "speed", enemySprite.vx)
    enemySprite.setPosition(spriteLocation.x, spriteLocation.y)
    enemySprite.setFlag(SpriteFlag.AutoDestroy, true)
}

function createShootingEnemy(tileLocation: tiles.Location){
    let enemySprite: Sprite = sprites.create(shootingEnemyObject["image"][0], SpriteKind.Enemy)
    sprites.setDataString(enemySprite, "type", "shooting")
    tiles.placeOnTile(enemySprite, tileLocation)
    spriteutils.onSpriteUpdateInterval(enemySprite, 2000, function(sprite){
        let playerSpriteReference = spriteutils.getSpritesWithin(SpriteKind.Player, 80, sprite)
        if(playerSpriteReference.length > 0){
            let enemyProjectile: Sprite = sprites.create(img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . 2 2 . . . . . . .
                . . . . . . 2 5 5 2 . . . . . .
                . . . . . . 2 5 5 2 . . . . . .
                . . . . . . . 2 2 . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `, SpriteKind.EnemyProjectile)
            enemyProjectile.setPosition(sprite.x, sprite.y)
            enemyProjectile.setFlag(SpriteFlag.DestroyOnWall, true)
            spriteutils.setVelocityAtAngle(enemyProjectile, spriteutils.angleFrom(sprite, playerSpriteReference[0]) , 50)

        }
    })
}

function createGroundEnemy(tileLocation: tiles.Location){
    let enemySprite = sprites.create(groundEnemyObject["image"][0], SpriteKind.Enemy)
    enemySprite.ay = 300
    let directionX: number = 0
    if(Math.randomRange(-1, 1) < 0){
        directionX = -1
    } else {
        directionX = 1
    }
    enemySprite.setVelocity(directionX*Math.randomRange(25, 40), 0)
    sprites.setDataNumber(enemySprite, "speed", enemySprite.vx)
    sprites.setDataString(enemySprite, "type", "ground")
    tiles.placeOnTile(enemySprite, tileLocation)
    createEnemyAnimations(groundEnemyObject["animations"], enemySprite, 100)
}
function createAirEnemy(tileLocation: tiles.Location){
    let enemySprite = sprites.create(airEnemyObject["imgae"][0], SpriteKind.Enemy)
    sprites.setDataString(enemySprite, "type", "air")
    tiles.placeOnTile(enemySprite, tileLocation)

    spriteutils.onSpriteUpdateInterval(enemySprite, 2000, function(sprite){
        
        let playerSpriteReference = spriteutils.getSpritesWithin(SpriteKind.Player, 64, sprite)
        if(playerSpriteReference.length > 0){
            sprite.follow(playerSpriteReference[0], 20)
        } else {
            spriteutils.moveTo(sprite, spriteutils.pos(sprite.x + Math.randomRange(-50, 50), sprite.y), 1000)
        }
    })
}
function generateTilemapEnemies(){
    for(let tileLocation of tiles.getTilesByType(assets.tile`groundEnemySpawnTile`)){
        createGroundEnemy(tileLocation)
        tiles.setTileAt(tileLocation, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `)
    }
    for (let tileLocation of tiles.getTilesByType(assets.tile`airEnemySpawnTile`)) {
        createAirEnemy(tileLocation)
        tiles.setTileAt(tileLocation, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `)
    }
    for (let tileLocation of tiles.getTilesByType(assets.tile`shootingEnemySpawnTile`)) {
        createShootingEnemy(tileLocation)
        tiles.setTileAt(tileLocation, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `)
    }
    for (let tileLocation of tiles.getTilesByType(assets.tile`spinningEnemySpawnTile`)) {
        createSpinningEnemy(tileLocation, Math.randomRange(0, spinningEnemyObject["image"].length - 1), 3)
        tiles.setTileAt(tileLocation, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `)
    }
    for (let tileLocation of tiles.getTilesByType(assets.tile`mysteryEnemySpawnTile`)){
        createMysteryEnemy(tileLocation)
        tiles.setTileAt(tileLocation, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `)
    }
}
function onStart() {
    sprites.destroyAllSpritesOfKind(SpriteKind.Collectible)
    sprites.destroyAllSpritesOfKind(SpriteKind.GrowPower)
    sprites.destroyAllSpritesOfKind(SpriteKind.ShootPower)
    sprites.destroy(levelSelectSprite)
    sprites.destroy(arrowSprite)
    sprites.destroy(indicatorSprite)
    if(levelSelect){
        createLevelSelect()
        return
    }
    scene.setBackgroundColor(9)
    if (currentLevel < 0 || currentLevel >= worldLevelsList[0].length) {
        tiles.setTilemap(tilemap`test`)
    } else {
        tiles.setTilemap(worldLevelsList[currentWorld][currentLevel])
    }
    generateTilemapEnemies()
    generateTilemapCollectibles()
    createPlayer()
}
onStart()

function createLevelSelect(){
    levelSelectSprite = sprites.create(img`
        . . . . . . . . . . . . f f . .
        . . . . . . . . . . . f d d f .
        . . . . . f . . . . f d d d f .
        . . . . f d f . . f d d f f . .
        . . . f d d f f f 4 f f f f . .
        . . . f 4 4 e e 4 f e e e d f .
        . . . f e e e 4 f e e e e d 5 f
        . . f e e e e 4 f e e e e e d f
        . f e e e e e 4 f e e e e e d f
        f e e f e e e 4 f e e e e d 5 f
        e e f f 4 4 e e 4 f e e e d f .
        e f . f d d f f f 4 f f f f . .
        e e f . f d f . . f d d f f . .
        f e e f . f . . . . f d d d f .
        . f f . . . . . . . . f d d f .
        . . . . . . . . . . . . f f . .
    `, SpriteKind.Selector)
    levelSelectSprite.z = 100
    arrowSprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . f . . . . . . . .
            . . . . . . f 1 f . . . . . . .
            . . . . . . f 1 f . . . . . . .
            . . . . . . f 1 f . . . . . . .
            . . . . . f f 1 f f . . . . . .
            . . . . f 1 f 1 f 1 f . . . . .
            . . . . . f 1 1 1 f . . . . . .
            . . . . . . f 1 f . . . . . . .
            . . . . . . . f . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, SpriteKind.Arrow)
    sprites.setDataBoolean(arrowSprite, "levelVertical", false)
    sprites.setDataBoolean(arrowSprite, "isVisible", false)
    arrowSprite.setFlag(SpriteFlag.Invisible, true)
    arrowSprite.setFlag(SpriteFlag.Ghost, true)
    indicatorSprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, SpriteKind.Indicator)
    animation.runImageAnimation(indicatorSprite, [
        img`
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
        `,
        img`
            ...88888888888888...
            ..88............88..
            .88..............88.
            88................88
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            8..................8
            88................88
            .88..............88.
            ..88............88..
            ...88888888888888...
        `,
        img`
            ...99999999999999...
            ..9988888888888899..
            .9988..........8899.
            9988............8899
            988..............889
            98................89
            98................89
            98................89
            98................89
            98................89
            98................89
            98................89
            98................89
            98................89
            98................89
            988..............889
            9988............8899
            .9988..........8899.
            ..9988888888888899..
            ...99999999999999...
        `,
        img`
            ...33333333333333...
            ..3399999999999933..
            .339988888888889933.
            339988........889933
            39988..........88993
            3988............8893
            398..............893
            398..............893
            398..............893
            398..............893
            398..............893
            398..............893
            398..............893
            398..............893
            3988............8893
            39988..........88993
            339988........889933
            .339988888888889933.
            ..3399999999999933..
            ...33333333333333...
        `,
        img`
            ....................
            ....333333333333....
            ...33999999999933...
            ..3399888888889933..
            .339988......889933.
            .39988........88993.
            .3988..........8893.
            .398............893.
            .398............893.
            .398............893.
            .398............893.
            .398............893.
            .398............893.
            .3988..........8893.
            .39988........88993.
            .339988......889933.
            ..3399888888889933..
            ...33999999999933...
            ....333333333333....
            ....................
        `,
        img`
            ....................
            ....................
            .....3333333333.....
            ....339999999933....
            ...33998888889933...
            ..339988....889933..
            ..39988......88993..
            ..3988........8893..
            ..398..........893..
            ..398..........893..
            ..398..........893..
            ..398..........893..
            ..3988........8893..
            ..39988......88993..
            ..339988....889933..
            ...33998888889933...
            ....339999999933....
            .....3333333333.....
            ....................
            ....................
        `,
        img`
            ....................
            ....................
            ....................
            ......33333333......
            .....3399999933.....
            ....339988889933....
            ...339988..889933...
            ...39988....88993...
            ...3988......8893...
            ...398........893...
            ...398........893...
            ...3988......8893...
            ...39988....88993...
            ...339988..889933...
            ....339988889933....
            .....3399999933.....
            ......33333333......
            ....................
            ....................
            ....................
        `,
        img`
            ....................
            ....................
            ....................
            ....................
            .......333333.......
            ......33999933......
            .....3399889933.....
            ....339988889933....
            ....39988..88993....
            ....3988....8893....
            ....3988....8893....
            ....39988..88993....
            ....339988889933....
            .....3399889933.....
            ......33999933......
            .......333333.......
            ....................
            ....................
            ....................
            ....................
        `,
        img`
            ....................
            ....................
            ....................
            ....................
            ....................
            ........3333........
            .......339933.......
            ......33999933......
            .....3399..9933.....
            .....399....993.....
            .....399....993.....
            .....3399..9933.....
            ......33999933......
            .......339933.......
            ........3333........
            ....................
            ....................
            ....................
            ....................
            ....................
        `,
        img`
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            .........33.........
            ........3333........
            .......33..33.......
            ......33....33......
            ......33....33......
            .......33..33.......
            ........3333........
            .........33.........
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
        `,
    ], 125, true)
    indicatorSprite.setFlag(SpriteFlag.Invisible, true)
    tiles.setTilemap(tilemap`world1`)
    
    levelTileLocationsList = []
    // Find all the locations of all level tiles
    for (let tileLocation of tiles.getTilesByType(assets.tile`levelHorizontal`)) {
        levelTileLocationsList.push(tileLocation)
    }
    for (let tileLocation of tiles.getTilesByType(assets.tile`levelVertical`)) {
        levelTileLocationsList.push(tileLocation)
    }
    levelTileLocationsList.sort(compareColumns)
    levelTileLocationsList.sort(compareRows)
    // console.log(levelTileLocationsList)

    
    if (currentLevel >= 0 && currentLevel < worldLevelsList[currentWorld].length){
        tiles.placeOnTile(levelSelectSprite, levelTileLocationsList[currentLevel])
        let targetLocation: tiles.Location = tiles.getTileLocation(levelSelectSprite.tilemapLocation().column+1, levelSelectSprite.tilemapLocation().row)
        let isVertical: boolean = false
        if (tiles.tileAtLocationEquals(levelTileLocationsList[currentLevel], assets.tile`levelVertical`)){
            levelSelectSprite.setImage(img`
            . . . . . . f f f f . . . . . .
            . f f . . f 5 d d 5 f . . f f .
            f d d f f d d e e d d f f d d f
            f d d f f e e e e e e f f d d f
            . f d d f e e e e e e f d d f .
            . . f d f e e e e e e f d f . .
            . . . f 4 f e e e e f 4 f . . .
            . . . . f 4 f f f f 4 f . . . .
            . . . . f e 4 4 4 4 e f . . . .
            . . . f f e e e e e e f f . . .
            . . f d d 4 e e e e 4 d d f . .
            . . . f d 4 e e e e 4 d f . . .
            . . . . f f f e e f f f . f . .
            . . . . . . . f e e f . f e f .
            . . . . . . . . f e e f e e f .
            . . . . . . . . . f e e e f . .
        `)
            isVertical = true
            targetLocation = tiles.getTileLocation(levelSelectSprite.tilemapLocation().column, levelSelectSprite.tilemapLocation().row-1)
        }
        activateLevelIndicatorSprites(isVertical, true, targetLocation)
              
    } else {
        tiles.placeOnTile(levelSelectSprite, tiles.getTileLocation(0, 13))
    }
    previousLevelLocation = levelSelectSprite.tilemapLocation()
    
    for(let tileLocation of levelTileLocationsList){
        let wallLocation: tiles.Location = tileLocation
        if(tiles.tileAtLocationEquals(tileLocation, assets.tile`levelHorizontal`)){
            if (tileLocation.column < levelSelectSprite.tilemapLocation().column) {
                wallLocation = tiles.getTileLocation(wallLocation.column - 1, wallLocation.row)
                tiles.setWallAt(wallLocation, true)
            } else if (tileLocation.column > levelSelectSprite.tilemapLocation().column) {
                wallLocation = tiles.getTileLocation(wallLocation.column + 1, wallLocation.row)
                tiles.setWallAt(wallLocation, true)
            }
        } else {
            if (tileLocation.row < levelSelectSprite.tilemapLocation().row) {
                wallLocation = tiles.getTileLocation(wallLocation.column, wallLocation.row - 1)
                tiles.setWallAt(wallLocation, true)
            } else if (tileLocation.row > levelSelectSprite.tilemapLocation().row) {
                wallLocation = tiles.getTileLocation(wallLocation.column, wallLocation.row + 1)
                tiles.setWallAt(wallLocation, true)
            }
        }
        
    }

    scene.cameraFollowSprite(levelSelectSprite)
}
// Helper functions to sort locations by column then row
function compareColumns(currentLocation: tiles.Location, nextLocation: tiles.Location) {
    if (currentLocation.column > nextLocation.column) {
        return -1;
    } else {
        return 1;
    }
}
function compareRows(currentLocation: tiles.Location, nextLocation: tiles.Location) {
    if (currentLocation.row > nextLocation.row) {
        return -1;
    } else {
        return 1;
    }
}



function createPlayer(){
    playerSprite = sprites.create(img`
        . . . . f f f f f . . . . . . .
        . . . f e e e e e f . . . . . .
        . . f d d d d e e e f . . . . .
        . c d f d d f d e e f f . . . .
        . c d f d d f d e e d d f . . .
        c d e e d d d d e e b d c . . .
        c d d d d c d d e e b d c . f f
        c c c c c d d d e e f c . f e f
        . f d d d d d e e f f . . f e f
        . . f f f f f e e e e f . f e f
        . . . . f e e e e e e e f f e f
        . . . f e f f e f e e e e f f .
        . . . f e f f e f e e e e f . .
        . . . f d b f d b f f e f . . .
        . . . f d d c d d b b d f . . .
        . . . . f f f f f f f f f . . .
    `, SpriteKind.Player)
    scene.cameraFollowSprite(playerSprite)
    resetPlayerPowerups()
    tiles.placeOnRandomTile(playerSprite, assets.tile`spawnTile`)
}
function resetPlayerPowerups(){
    // stop any timers
    info.stopCountdown()
    // Reset player attributes
    playerSprite.scale = 1
    playerSprite.ay = 300
    controller.moveSprite(playerSprite, 100, 0)
    // Reset player animations
    createPlayerWalkingAnimation()
    createPlayerJumpingAnimation()
    createPlayerIdleAnimation()
    // Reset player data
    sprites.setDataBoolean(playerSprite, "GrowPower", false)
    sprites.setDataBoolean(playerSprite, "ShootPower", false)
    sprites.setDataBoolean(playerSprite, "ShrinkPower", false)
    sprites.setDataBoolean(playerSprite, "BatPower", false)
    isFlying = false
}
// Powerup Object
let powerUpObject = {
    "image" : [
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . f 5 . . . . . . .
            . . . . . . . 5 7 5 . . . . . .
            . . . . . . . . 7 5 5 . . . . .
            . . . . . . . . 5 5 7 . . . . .
            . . . . . . . . 7 5 7 . . . . .
            . . . . . . . . 7 5 5 . . . . .
            . . . . . . . . 5 5 5 . . . . .
            . . . . . . . 7 5 5 7 . . . . .
            . . . . . . 7 5 5 5 7 . . . . .
            . . . f 5 5 5 5 7 5 . . . . . .
            . . . . 5 7 7 5 7 . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . . 2 5 5 5 2 . . . . .
            . . . . . 2 5 5 4 5 5 2 . . . .
            . . . . . 2 5 4 4 4 5 2 . . . .
            . . . . . 2 5 5 4 5 5 2 . . . .
            . . . . . . 2 5 5 5 2 . . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . . 6 . 7 . . . . . . .
            . . . . . . . 6 7 . 6 . . . . .
            . . . . . . . . 7 6 . . . . . .
            . . . . . . 6 . 7 . 6 . . . . .
            . . . . . . . 6 7 6 . . . . . .
            . . . . . . . . 7 . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            .........bb.........
            ........cccc........
            ........cccc........
            .........ff.........
            .........cf.........
            .........cc.........
            ........c66c........
            .......c7766c.......
            .......c7666c.......
            .......c6666c.......
            .......cc66cf.......
            ........cfff........
            ....................
            ....................
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . b b . . . . . . .
            . . . . . . c c c c . . . . . .
            . . . . . . c c c c . . . . . .
            . f . . . . . f f . . . . . f .
            . f f . . . . b f . . . . f f .
            . 2 f f . . . b b . . . f f 2 .
            . f f 2 f f b b b b f f 2 f f .
            . . f f f b b 2 2 b b f f f . .
            . . . f 2 b 2 2 2 2 b 2 f . . .
            . . . . f b 2 2 2 2 b f . . . .
            . . . . . b 2 2 2 2 c . . . . .
            . . . . . . c c c c . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        ],
    "kind" : [
        SpriteKind.GrowPower,
        SpriteKind.ShootPower,
        SpriteKind.ShrinkPower,
        SpriteKind.BatPower,
    ],
    "scale" : [
        0.75,
        0.75,
        0.75,
        0.75,
    ]
}
// A function to create a Powerup
function createPowerUp(powerUpType: number, targetLocation: tiles.Location){
    let powerUpSprite: Sprite = sprites.create(powerUpObject["image"][powerUpType], powerUpObject["kind"][powerUpType])
    powerUpSprite.scale = powerUpObject["scale"][powerUpType]
    powerUpSprite.ay = 300
    let direction: number = 0
    if(Math.randomRange(-1, 1) < 0 ){
        direction = -1
    } else {
        direction = 1
    }
    console.log(direction)
    powerUpSprite.setVelocity(direction*Math.randomRange(25, 50), -100)
    sprites.setDataNumber(powerUpSprite, "speed", powerUpSprite.vx)
    tiles.placeOnTile(powerUpSprite, targetLocation)
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    // Testing to validate sorting criteria for world Tiles
    // if(levelSelect){
    //     index++
    //     index = index % levelTileLocationsList.length
    //     tiles.placeOnTile(levelSelectSprite, levelTileLocationsList[index])
    // }
    if (jumps > 0 && !isFalling && !isFlying){
        isFalling = true
        jumps -= 1
        music.play(music.createSoundEffect(WaveShape.Triangle, 400, 869, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        if(sprites.readDataBoolean(playerSprite, "ShrinkPower")){
            playerSprite.vy = -250
            return
        }
        
        playerSprite.vy = -200
        
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function(){
    if(levelSelect){
        if (tiles.tileAtLocationEquals(levelSelectSprite.tilemapLocation(), assets.tile`levelHorizontal`) || tiles.tileAtLocationEquals(levelSelectSprite.tilemapLocation(), assets.tile`levelVertical`)){
            levelSelect = false
            onStart()
            return
        }
    }
    if(sprites.readDataBoolean(playerSprite, "BatPower") && !isFlying){
        batPower()
        info.startCountdown(10)
        isFlying = true
    }
    if(sprites.readDataBoolean(playerSprite, "ShootPower")){
        let projectileSprite: Sprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . 2 2 2 2 . . . . . . .
            . . . . 2 2 2 2 2 2 . . . . . .
            . . . 2 2 5 5 5 5 2 2 . . . . .
            . . 2 2 5 5 4 4 5 5 2 2 . . . .
            . . 2 2 5 5 4 4 5 5 2 2 . . . .
            . . 2 2 5 5 4 4 5 5 2 2 . . . .
            . . . 2 2 5 5 5 5 2 2 . . . . .
            . . . . 2 2 2 2 2 2 . . . . . .
            . . . . . 2 2 2 2 . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, SpriteKind.Projectile)
        projectileSprite.setPosition(playerSprite.x, playerSprite.y)
        projectileSprite.lifespan = 3000
        projectileSprite.ay = 100
        projectileSprite.setBounceOnWall(true)
        projectileSprite.startEffect(effects.fire)
        projectileSprite.vy = -10
        if(characterAnimations.matchesRule(playerSprite, Predicate.FacingRight)){
            projectileSprite.x += 10
            projectileSprite.vx = 150
        } else if(characterAnimations.matchesRule(playerSprite, Predicate.FacingLeft)){
            projectileSprite.x -= 10
            projectileSprite.vx = -150
        }
        music.play(music.createSoundEffect(WaveShape.Square, 379, 1, 255, 0, 250, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    }
})
function batPower() {
    createBatAnimations()
    controller.moveSprite(playerSprite, 100, 100)
    playerSprite.ay = 0
}
info.onCountdownEnd(function(){
    resetPlayerPowerups()
    timer.after(10000, function() {
        if(!sprites.readDataBoolean(playerSprite, "ShrinkPower") && 
            !sprites.readDataBoolean(playerSprite, "GrowPower") &&
            !sprites.readDataBoolean(playerSprite, "ShootPower")){
            sprites.setDataBoolean(playerSprite, "BatPower", true)
        }
    })
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function(){
    movelevelSelectSprite(-1, 0)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    movelevelSelectSprite(1, 0)
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    movelevelSelectSprite(0, -1)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    movelevelSelectSprite(0, 1)
})
function movelevelSelectSprite(velocityX: number, velocityY: number){
    if (!levelSelect)
        return
    if (velocityX > 0 && tiles.getTileLocation(levelSelectSprite.tilemapLocation().column + 1, levelSelectSprite.tilemapLocation().row).isWall()){
        return
    } else if (velocityX < 0 && tiles.getTileLocation(levelSelectSprite.tilemapLocation().column - 1, levelSelectSprite.tilemapLocation().row).isWall()){
        return
    } else if (velocityY > 0 && tiles.getTileLocation(levelSelectSprite.tilemapLocation().column, levelSelectSprite.tilemapLocation().row + 1).isWall()){
        return
    } else if (velocityY < 0 && tiles.getTileLocation(levelSelectSprite.tilemapLocation().column, levelSelectSprite.tilemapLocation().row - 1).isWall()){
        return
    }
    levelSelectSprite.setVelocity(velocityX * 50, velocityY * 50)
    if(levelSelectSprite.vx > 0){
        levelSelectSprite.setImage(img`
            . . . . . . . . . . . . f f . .
            . . . . . . . . . . . f d d f .
            . . . . . f . . . . f d d d f .
            . . . . f d f . . f d d f f . .
            . . . f d d f f f 4 f f f f . .
            . . . f 4 4 e e 4 f e e e d f .
            . . . f e e e 4 f e e e e d 5 f
            . . f e e e e 4 f e e e e e d f
            . f e e e e e 4 f e e e e e d f
            f e e f e e e 4 f e e e e d 5 f
            e e f f 4 4 e e 4 f e e e d f .
            e f . f d d f f f 4 f f f f . .
            e e f . f d f . . f d d f f . .
            f e e f . f . . . . f d d d f .
            . f f . . . . . . . . f d d f .
            . . . . . . . . . . . . f f . .
        `)
    } else if (levelSelectSprite.vx < 0){
        levelSelectSprite.setImage(img`
            . . f f . . . . . . . . . . . .
            . f d d f . . . . . . . . . . .
            . f d d d f . . . . f . . . . .
            . . f f d d f . . f d f . . . .
            . . f f f f 4 f f f d d f . . .
            . f d e e e f 4 e e 4 4 f . . .
            f 5 d e e e e f 4 e e e f . . .
            f d e e e e e f 4 e e e e f . .
            f d e e e e e f 4 e e e e e f .
            f 5 d e e e e f 4 e e e f e e f
            . f d e e e f 4 e e 4 4 f f e e
            . . f f f f 4 f f f d d f . f e
            . . f f d d f . . f d f . f e e
            . f d d d f . . . . f . f e e f
            . f d d f . . . . . . . . f f .
            . . f f . . . . . . . . . . . .
        `)
    } else if (levelSelectSprite.vy > 0){
        levelSelectSprite.setImage(img`
            . . f e e e f . . . . . . . . .
            . f e e f e e f . . . . . . . .
            . f e f . f e e f . . . . . . .
            . . f . f f f e e f f f . . . .
            . . . f d 4 e e e e 4 d f . . .
            . . f d d 4 e e e e 4 d d f . .
            . . . f f e e e e e e f f . . .
            . . . . f e 4 4 4 4 e f . . . .
            . . . . f 4 f f f f 4 f . . . .
            . . . f 4 f e e e e f 4 f . . .
            . . f d f e e e e e e f d f . .
            . f d d f e e e e e e f d d f .
            f d d f f e e e e e e f f d d f
            f d d f f d d e e d d f f d d f
            . f f . . f 5 d d 5 f . . f f .
            . . . . . . f f f f . . . . . .
        `)
    } else if (levelSelectSprite.vy < 0){
        levelSelectSprite.setImage(img`
            . . . . . . f f f f . . . . . .
            . f f . . f 5 d d 5 f . . f f .
            f d d f f d d e e d d f f d d f
            f d d f f e e e e e e f f d d f
            . f d d f e e e e e e f d d f .
            . . f d f e e e e e e f d f . .
            . . . f 4 f e e e e f 4 f . . .
            . . . . f 4 f f f f 4 f . . . .
            . . . . f e 4 4 4 4 e f . . . .
            . . . f f e e e e e e f f . . .
            . . f d d 4 e e e e 4 d d f . .
            . . . f d 4 e e e e 4 d f . . .
            . . . . f f f e e f f f . f . .
            . . . . . . . f e e f . f e f .
            . . . . . . . . f e e f e e f .
            . . . . . . . . . f e e e f . .
        `)
    }
}
scene.onHitWall(SpriteKind.Selector, function(sprite, location){
    if(sprite.isHittingTile(CollisionDirection.Right) || sprite.isHittingTile(CollisionDirection.Left)){
        if(tiles.tileAtLocationEquals(sprite.tilemapLocation(), assets.tile`levelHorizontal`)){
            if (sprite.tilemapLocation().column == previousLevelLocation.column && sprite.tilemapLocation().row == previousLevelLocation.row){
                activateLevelIndicatorSprites(false, true, location)
                return
            }
            if (sprite.isHittingTile(CollisionDirection.Right)) {
                currentLevel++
            } else {
                currentLevel--
            }
            previousLevelLocation = sprite.tilemapLocation()
            activateLevelIndicatorSprites(false, true, location)
        }
    } else if (sprite.isHittingTile(CollisionDirection.Top) || sprite.isHittingTile(CollisionDirection.Bottom)) {
        if (tiles.tileAtLocationEquals(sprite.tilemapLocation(), assets.tile`levelVertical`)) {
            if (sprite.tilemapLocation().column == previousLevelLocation.column && sprite.tilemapLocation().row == previousLevelLocation.row) {
                activateLevelIndicatorSprites(true, true, location)
                return
            }
            if (sprite.isHittingTile(CollisionDirection.Top)) {
                currentLevel++
            } else {
                currentLevel--
            }
            previousLevelLocation = sprite.tilemapLocation()
            activateLevelIndicatorSprites(true, true, location)
            
        }
    }
})
function activateLevelIndicatorSprites(isVertical: boolean, isVisible: boolean, location: tiles.Location){
    if(currentLevel < maxLevel)
        tiles.setWallAt(location, false)
    arrowSprite.setFlag(SpriteFlag.Invisible, !isVisible)
    arrowSprite.setImage(img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . 8 . . . . . . . .
                . . . . . . 8 9 8 . . . . . . .
                . . . . . . 8 9 8 . . . . . . .
                . . . . . . 8 9 8 . . . . . . .
                . . . . . 8 8 9 8 8 . . . . . .
                . . . . 8 9 8 9 8 9 8 . . . . .
                . . . . . 8 9 9 9 8 . . . . . .
                . . . . . . 8 9 8 . . . . . . .
                . . . . . . . 8 . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `)
    sprites.setDataBoolean(arrowSprite, "levelVertical", isVertical)
    let arrowTileLocation: tiles.Location = tiles.getTileLocation(levelSelectSprite.tilemapLocation().column, levelSelectSprite.tilemapLocation().row - 2)
    
    if(isVertical){
        arrowSprite.setImage(img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . 8 . . . . . .
                . . . . . . . . 8 9 8 . . . . .
                . . . . . 8 8 8 8 8 9 8 . . . .
                . . . . 8 9 9 9 9 9 9 9 8 . . .
                . . . . . 8 8 8 8 8 9 8 . . . .
                . . . . . . . . 8 9 8 . . . . .
                . . . . . . . . . 8 . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `)
        arrowTileLocation = tiles.getTileLocation(levelSelectSprite.tilemapLocation().column - 2, levelSelectSprite.tilemapLocation().row)
    }
    tiles.placeOnTile(arrowSprite, arrowTileLocation)
    sprites.setDataBoolean(arrowSprite, "isVisible", isVisible)
    tiles.placeOnTile(indicatorSprite, levelSelectSprite.tilemapLocation())
    indicatorSprite.setFlag(SpriteFlag.Invisible, !isVisible)
}
scene.onHitWall(SpriteKind.Projectile, function(sprite, location){
    if(tiles.tileAtLocationEquals(location, assets.tile`vineTile`)){
        destroyTile(assets.tile`vineTile`, location, effects.fire, 0)
        sprite.destroy()
    }
})
scene.onHitWall(SpriteKind.Player, function(sprite, location){
    if(sprite.isHittingTile(CollisionDirection.Bottom)){
        jumps = 1
        isFalling = false
    }
    if(sprite.isHittingTile(CollisionDirection.Top)){
        if(tiles.tileAtLocationEquals(location, assets.tile`luckyTile`)){
            let targetLocation: tiles.Location = tiles.getTileLocation(location.column, location.row - 1)
            createPowerUp(randint(0, powerUpObject["image"].length-1), targetLocation)
            // createCollectible(targetLocation)
            // tiles.setTileAt(location, assets.tile`depletedTile`)
            hitPowerBox(img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `, location)
            music.play(music.createSoundEffect(WaveShape.Sine, 200, 600, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        }
        if (tiles.tileAtLocationEquals(location, assets.tile`depletedTile`)){
            hitPowerBox(assets.tile`depletedTile`, location)
            music.play(music.createSoundEffect(WaveShape.Sine, 200, 600, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        }
        if (tiles.tileAtLocationEquals(location, assets.tile`stoneUnbreakable`)){
            if(sprites.readDataBoolean(sprite, "GrowPower")){
                music.play(music.createSoundEffect(WaveShape.Sawtooth, 1137, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
                destroyTile(assets.tile`stoneUnbreakable`, location, effects.disintegrate, -50)
                return
            } else if(Math.randomRange(1, 100) < 5){
                let targetLocation: tiles.Location = tiles.getTileLocation(location.column, location.row - 1)
                createCollectible(targetLocation)
                createCollectible(targetLocation)
                hitPowerBox(img`
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, location)
            }
            music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 25, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        }
    }
})

function destroyTile(tileImage: Image, targetLocation: tiles.Location, effectType: effects.ParticleEffect, velocityY: number){
    let tileSprite = sprites.create(tileImage, SpriteKind.Tile)
    tiles.setTileAt(targetLocation, img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `)
    tiles.setWallAt(targetLocation, false)
    tiles.placeOnTile(tileSprite, targetLocation)
    tileSprite.vy = velocityY
    tileSprite.destroy(effectType, 150)

}


// Update checkpoint once player overlaps
scene.onOverlapTile(SpriteKind.Player, assets.tile`checkPointTile`, function(sprite, location){
    for(let tileLocation of tiles.getTilesByType(assets.tile`spawnTile`)){
        tiles.setTileAt(tileLocation, assets.tile`checkPointTile`)
    }
    tiles.setTileAt(location, assets.tile`spawnTile`)
})
// Send player back to world select once they reach the exitTile
scene.onOverlapTile(SpriteKind.Player, assets.tile`exitTile`, function (sprite, location) {
    levelSelect = true
    maxLevel = currentLevel+1
    sprite.destroy()
    onStart()
})

// Destroy power ups when they enter the lava
scene.onOverlapTile(SpriteKind.GrowPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.ShootPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.ShrinkPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.BatPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})

// Enemy destroyes upon overlapping lava tile
scene.onOverlapTile(SpriteKind.Enemy, assets.tile`lavaTile`, function(sprite, location){
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

    
})
scene.onOverlapTile(SpriteKind.MysteryEnemy, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.ShellEnemy, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy(effects.fire)
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})



// Player destroys after overlapping hazard tiles
scene.onOverlapTile(SpriteKind.Player, assets.tile`bottomHazardTile`, function(sprite, location){
    destroySprite(sprite, 0, -70, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`topHazardTile`, function (sprite, location) {
    destroySprite(sprite, 0, 70, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`rightHazardTile`, function (sprite, location) {
    destroySprite(sprite, -70, 0, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`leftHazardTile`, function (sprite, location) {
    destroySprite(sprite, 70, 0, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`lavaTile`, function (sprite, location) {
    destroySprite(sprite, 0, -70, 8)
})

function destroySprite(sprite: Sprite, velocityX: number, velocityY: number, cameraShakeStrength: number){
    sprite.setVelocity(velocityX, velocityY)
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprites.destroy(sprite, effects.none, 1000)
    scene.cameraShake(cameraShakeStrength, 500)
    music.play(music.createSoundEffect(WaveShape.Noise, 3321, 958, 255, 0, 150, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
}

sprites.onDestroyed(SpriteKind.Player, function(sprite){
    if(levelSelect){
        return
    }
    createPlayer()
})

function hitPowerBox(tileImage: Image, location: tiles.Location){
    tiles.setTileAt(location, assets.tile`transparentTile`)
    let powerBoxSprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 5 5 5 5 5 . . . . . . .
        . . . . 5 . . . . 5 . . . . . .
        . . . . 5 . . . . . 5 5 . . . .
        . . . . 5 . . . . . . 5 . . . .
        . . . . 5 . . . . . . 5 . . . .
        . . . . 5 . . . . . . 5 . . . .
        . . . . 5 . . . . . . 5 . . . .
        . . . . 5 . . . . . . 5 . . . .
        . . . . 5 5 5 . . . 5 5 . . . .
        . . . . . . . 5 5 5 5 . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Box)
    tiles.placeOnTile(powerBoxSprite, location)
    powerBoxSprite.y -= 16
    if(tileImage.equals(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `)){
        animation.runImageAnimation(powerBoxSprite, [
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e55555555555555e
                e55555555555555e
                e55555111155555e
                e55551555515555e
                e55551555515555e
                e55551555515555e
                e55555555515555e
                e55555511155555e
                e55555515555555e
                e55555555555555e
                e55555515555555e
                e55555555555555e
                e55555555555555e
                e55555555555555e
                eeeeeeeeeeeeeeee
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e55555555555555e
                e55555555555555e
                e55555111155555e
                e55551555515555e
                e55551555515555e
                e55551555515555e
                e55555555515555e
                e55555511155555e
                e55555515555555e
                e55555555555555e
                e55555515555555e
                e55555555555555e
                e55555555555555e
                e55555555555555e
                eeeeeeeeeeeeeeee
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e55555555555555e
                e55555555555555e
                e55555111155555e
                e55551555515555e
                e55551555515555e
                e55551555515555e
                e55555555515555e
                e55555511155555e
                e55555515555555e
                e55555555555555e
                e55555515555555e
                e55555555555555e
                e55555555555555e
                e55555555555555e
                eeeeeeeeeeeeeeee
                ................
                ................
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e55555555555555e
                e55555555555555e
                e55555111155555e
                e55551555515555e
                e55551555515555e
                e55551555515555e
                e55555555515555e
                e55555511155555e
                e55555515555555e
                e55555555555555e
                e55555515555555e
                e55555555555555e
                e55555555555555e
                e55555555555555e
                eeeeeeeeeeeeeeee
                ................
                ................
                ................
                ................
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e55555555555555e
                e55555555555555e
                e55555111155555e
                e55551555515555e
                e55551555515555e
                e55551555515555e
                e55555555515555e
                e55555511155555e
                e55555515555555e
                e55555555555555e
                e55555515555555e
                e55555555555555e
                e55555555555555e
                e55555555555555e
                eeeeeeeeeeeeeeee
                ................
                ................
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e55555555555555e
                e55555555555555e
                e55555111155555e
                e55551555515555e
                e55551555515555e
                e55551555515555e
                e55555555515555e
                e55555511155555e
                e55555515555555e
                e55555555555555e
                e55555515555555e
                e55555555555555e
                e55555555555555e
                e55555555555555e
                eeeeeeeeeeeeeeee
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
            `
        ], 40, false)
    } else {
        animation.runImageAnimation(powerBoxSprite, [
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
                ................
                ................
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
                ................
                ................
                ................
                ................
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
                ................
                ................
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
                ................
                ................
            `,
            img`
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                ................
                eeeeeeeeeeeeeeee
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                e44444444444444e
                eeeeeeeeeeeeeeee
            `
        ], 40, false)
    }
    powerBoxSprite.lifespan = 421
}
sprites.onDestroyed(SpriteKind.Box, function(sprite){
    tiles.setTileAt(sprite.tilemapLocation(), assets.tile`depletedTile`)
})
function createPlayerWalkingAnimation(){
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . f f e e d f d d f d c .
            . . . f d d e e d f d d f d c .
            . . . c d b e e d d d d e e d c
            f f . c d b e e d d c d d d d c
            f e f . c f e e d d d c c c c c
            f e f . . f f e e d d d d d f .
            f e f . f e e e e f f f f f . .
            f e f f e e e e e e e f . . . .
            . f f e e e e f e f f e f . . .
            . . f e e e e f e f f e f . . .
            . . . f e f f b d f b d f . . .
            . . . f d b b d d c d d f . . .
            . . . f f f f f f f f f . . . .
        `,
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . . f e e d f d d f d c .
            . . . . f f e e d f d d f d c .
            . . . f d d e e d d d d e e d c
            . . . c d b e e d d c d d d d c
            f f . c d b e e e d d c c c c c
            f e f . c f f e e e d d d d f .
            f e f . f e e e e f f f f f f .
            f e f f e e e e e e e f f f f .
            . f f e e e e f e f d d f d d f
            . . f e e e e f e f b d f b d f
            . . f e f f f f f f f f f f f f
            . . f d d c f . . . . . . . . .
            . . f f f f . . . . . . . . . .
        `,
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . f f e e e d d d d f . .
            . . . f d d e e d d d d d d c .
            . . . c d b e e d f d d f d c .
            f f . c d b e e d f d d f d d c
            f e f . c f e e d d d d e e d c
            f e f . . f e e e d c d d d d c
            f e f . . f f e e e d c c c f .
            f e f . f e e e e f f f f f . .
            . f f f e e e e e e e f . . . .
            . . f e e e e f e e f e f f . .
            . . f e e e f f f e e f f e f .
            . f b f f f f f f c d d b d d f
            . f d d c f . . f d d d c d d f
            . . f f f . . . f f f f f f f .
        `,
        img`
            . . . . . . . f f f f f . . . .
            . . . . f f f e e e e e f . . .
            . . . f d d e e e e d d d f . .
            . . . c d b e e e d d d d d c .
            . . . c d b e e d d d d d d c .
            . f f . c f e e d f d d f d d c
            f e f . . f e e d f d d f d d c
            f e f . . f e e d d d d e e d c
            f e f . . f f e e d c d d d f .
            f e f . f e e e e e d f f f . .
            . f f f e e e e e e e f . . . .
            . . f f b e e e e e f f . . . .
            . . f f d d c e e f f e f . . .
            . . . . f f f c d d b d d f . .
            . . . . . f f d d d c d d f . .
            . . . . . . f f f f f f f . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingRight, Predicate.MovingRight, Predicate.HittingWallDown))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . c d f d d f d e e f f . . . .
            . c d f d d f d e e d d f . . .
            c d e e d d d d e e b d c . . .
            c d d d d c d d e e b d c . f f
            c c c c c d d d e e f c . f e f
            . f d d d d d e e f f . . f e f
            . . f f f f f e e e e f . f e f
            . . . . f e e e e e e e f f e f
            . . . f e f f e f e e e e f f .
            . . . f e f f e f e e e e f . .
            . . . f d b f d b f f e f . . .
            . . . f d d c d d b b d f . . .
            . . . . f f f f f f f f f . . .
        `,
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . c d f d d f d e e f . . . . .
            . c d f d d f d e e f f . . . .
            c d e e d d d d e e d d f . . .
            c d d d d c d d e e b d c . . .
            c c c c c d d e e e b d c . f f
            . f d d d d e e e f f c . f e f
            . f f f f f f e e e e f . f e f
            . f f f f e e e e e e e f f e f
            f d d f d d f e f e e e e f f .
            f d b f d b f e f e e e e f . .
            f f f f f f f f f f f f e f . .
            . . . . . . . . . f c d d f . .
            . . . . . . . . . . f f f f . .
        `,
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f f . . . .
            . c d d d d d d e e d d f . . .
            . c d f d d f d e e b d c . . .
            c d d f d d f d e e b d c . f f
            c d e e d d d d e e f c . f e f
            c d d d d c d e e e f . . f e f
            . f c c c d e e e f f . . f e f
            . . f f f f f e e e e f . f e f
            . . . . f e e e e e e e f f f .
            . . f f e f e e f e e e e f . .
            . f e f f e e f f f e e e f . .
            f d d b d d c f f f f f f b f .
            f d d c d d d f . . f c d d f .
            . f f f f f f f . . . f f f . .
        `,
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f f f . . . .
            . . f d d d e e e e d d f . . .
            . c d d d d d e e e b d c . . .
            . c d d d d d d e e b d c . . .
            c d d f d d f d e e f c . f f .
            c d d f d d f d e e f . . f e f
            c d e e d d d d e e f . . f e f
            . f d d d c d e e f f . . f e f
            . . f f f d e e e e e f . f e f
            . . . . f e e e e e e e f f f .
            . . . . f f e e e e e b f f . .
            . . . f e f f e e c d d f f . .
            . . f d d b d d c f f f . . . .
            . . f d d c d d d f f . . . . .
            . . . f f f f f f f . . . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingLeft, Predicate.MovingLeft, Predicate.HittingWallDown))
}
function createPlayerIdleAnimation(){
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . c d f d d f d e e f f . . . .
            . c d f d d f d e e d d f . . .
            c d e e d d d d e e b d c . . .
            c d d d d c d d e e b d c . . .
            c c c c c d d e e e f c . . . .
            . f d d d d e e e f f . . . . .
            . . f e e e f f e e e f . . . .
            . . f f f f f e e e e e f . f f
            . . f d b f e e f f e e f . e f
            . f f d d f e f f e e e f . e f
            . f f f f f f e b b f e f f e f
            . f d d f e e e d d b e f f f f
            . . f f f f f f f f f f f f f .
        `,
        img`
            . . . . . f f f f f . . . . . .
            . . . . f e e e e e f . . . . .
            . . . f d d d d d e e f . . . .
            . . f f f d d f f d e f f . . .
            . c d d e e d d d d e d d f . .
            . c c d d d d c d d e d f f f .
            . c d c c c c d d d e d f b d f
            . . c d d d d d d e e f f d d f
            . . . c d d d d e e f f e f f f
            . . . . f f f e e f e e e f . .
            . . . . f e e e e e e e f f f .
            . . . f e e e e e e f f f e f .
            . . f f e e e e f f f f f e f .
            . f b d f e e f b b f f f e f .
            . f d d f e e f d d b f f f f .
            . f f f f f f f f f f f f f . .
        `,
        img`
            . . . . . f f f f f . . . . . .
            . . . . f e e e e e f . . . . .
            . . . f d d d d d d e f . . . .
            . . f d f f d d f f d f f . . .
            . c d d d e e d d d d e d f . .
            . c d c d d d d c d d e f f . .
            . c d d c c c c d d d e f f f f
            . . c d d d d d d d e f f b d f
            . . . c d d d d e e f f f d d f
            . . . . f f f e e f e e e f f f
            . . . . f e e e e e e e f f f .
            . . . f e e e e e e f f f e f .
            . . f f e e e e f f f f f e f .
            . f b d f e e f b b f f f e f .
            . f d d f f f f d d b f f f f .
            . f f f f f f f f f f f f f . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . . f d d d d d e e f f . . . .
            . c d d d f f d e e d d f . . .
            c d e e d d d d e e b d c . . .
            c f f d d c d d e e b d c . . .
            f d d f e f f f e e e f . . . .
            f d d f e e e f f f f f . . . .
            f f f f f e e e e e f f . f f .
            . f f f e f f e e e f f . e f .
            . f b d f e f f b b f f f e f .
            . f d d f e e f d d b f f e f .
            . f f f f f f f f f f f f f . .
        `,
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . . f d d f d d e e f f . . . .
            . c d d d f d d e e d d f . . .
            c d e e d d d d e e b d c . . .
            c d d d d c d d e e b d c . . .
            c f f f f d d d e e f c f . . .
            . f b d f f f e e e e f . . . .
            . f d d f e f f f e e f . . . .
            . . f f f e e e e f f f . f f .
            . . f e e f e e e e f f . e f .
            . f f e e e f f f f f f f e f .
            . f b d f e e f b b f f f e f .
            . f d d f f e e d d b f f f f .
            . f f f f f f f f f f f f f . .
        `,
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . c d f d d f d e e f f . . . .
            . c d f d d f d e e d d f . . .
            c d e e d d d d e e b d c . . .
            c d d d d c d d e e b d c . . .
            c c c c c d d e e e f c . . . .
            . f d d d d e e e f f . . . . .
            . . f f f f f e e e e f . . . .
            . . . . f f e e e e e e f . f f
            . . . f e e f e e f e e f . e f
            . . f e e f e e f e e e f . e f
            . f b d f d b f b b f e f f e f
            . f d d f d d f d d b e f f f f
            . . f f f f f f f f f f f f f .
        `,
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . c d f d d f d e e f f . . . .
            . c d f d d f d e e d d f . . .
            c d e e d d d d e e b d c . . .
            c d d d d c d d e e b d c . . .
            c c c c c d d e e e f c . . . .
            . f d d d d e e e f f . . . . .
            . . f f f f f e e e e f . . . .
            . . . . f f e e e e e e f . f f
            . . . f e e f e e f e e f . e f
            . . f e e f e e f e e e f . e f
            . f b d f d b f b b f e f f e f
            . f d d f d d f d d b e f f f f
            . . f f f f f f f f f f f f f .
        `,
    ], 200, characterAnimations.rule(Predicate.HittingWallDown, Predicate.NotMoving, Predicate.FacingLeft))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . f f e e d f d d f d c .
            . . . f d d e e d f d d f d c .
            . . . c d b e e d d d d e e d c
            . . . c d b e e d d c d d d d c
            . . . . c f e e e d d c c c c c
            . . . . . f f e e e d d d d f .
            . . . . f e e e f f e e e f . .
            f f . f e e e e e f f f f f . .
            f e . f e e f f e e f b d f . .
            f e . f e e e f f e f d d f f .
            f e f f e f b b e f f f f f f .
            f f f f e b d d e e e f d d f .
            . f f f f f f f f f f f f f . .
        `,
        img`
            . . . . . . f f f f f . . . . .
            . . . . . f e e e e e f . . . .
            . . . . f e e d d d d d f . . .
            . . . f f e d f f d d f f f . .
            . . f d d e d d d d e e d d c .
            . f f f d e d d c d d d d c c .
            f d b f d e d d d c c c c d c .
            f d d f f e e d d d d d d c . .
            f f f e f f e e d d d d c . . .
            . . f e e e f e e f f f . . . .
            . f f f e e e e e e e f . . . .
            . f e f f f e e e e e e f . . .
            . f e f f f f f e e e e f f . .
            . f e f f f b b f e e f d b f .
            . f f f f b d d f e e f d d f .
            . . f f f f f f f f f f f f f .
        `,
        img`
            . . . . . . f f f f f . . . . .
            . . . . . f e e e e e f . . . .
            . . . . f e d d d d d d f . . .
            . . . f f d f f d d f f d f . .
            . . f d e d d d d e e d d d c .
            . . f f e d d c d d d d c d c .
            f f f f e d d d c c c c d d c .
            f d b f f e d d d d d d d c . .
            f d d f f f e e d d d d c . . .
            f f f e e e f e e f f f . . . .
            . f f f e e e e e e e f . . . .
            . f e f f f e e e e e e f . . .
            . f e f f f f f e e e e f f . .
            . f e f f f b b f e e f d b f .
            . f f f f b d d f f f f d d f .
            . . f f f f f f f f f f f f f .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . f f e e d d d d d f . .
            . . . f d d e e d f f d d d c .
            . . . c d b e e d d d d e e d c
            . . . c d b e e d d c d d f f c
            . . . . f e e e f f f e f d d f
            . . . . f f f f f e e e f d d f
            . f f . f f e e e e e f f f f f
            . f e . f f e e e f f e f f f .
            . f e f f f b b f f e f d b f .
            . f e f f b d d f e e f d d f .
            . . f f f f f f f f f f f f f .
        `,
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . f f e e d d f d d f . .
            . . . f d d e e d d f d d d c .
            . . . c d b e e d d d d e e d c
            . . . c d b e e d d c d d d d c
            . . . f c f e e d d d f f f f c
            . . . . f e e e e f f f d b f .
            . . . . f e e f f f e f d d f .
            . f f . f f f e e e e f f f . .
            . f e . f f e e e e f e e f . .
            . f e f f f f f f f e e e f f .
            . f e f f f b b f e e f d b f .
            . f f f f b d d e e f f d d f .
            . . f f f f f f f f f f f f f .
        `,
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . f f e e d f d d f d c .
            . . . f d d e e d f d d f d c .
            . . . c d b e e d d d d e e d c
            . . . c d b e e d d c d d d d c
            . . . . c f e e e d d c c c c c
            . . . . . f f e e e d d d d f .
            . . . . f e e e e f f f f f . .
            f f . f e e e e e e f f . . . .
            f e . f e e f e e f e e f . . .
            f e . f e e e f e e f e e f . .
            f e f f e f b b f b d f d b f .
            f f f f e b d d f d d f d d f .
            . f f f f f f f f f f f f f . .
        `,
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . f f e e d f d d f d c .
            . . . f d d e e d f d d f d c .
            . . . c d b e e d d d d e e d c
            . . . c d b e e d d c d d d d c
            . . . . c f e e e d d c c c c c
            . . . . . f f e e e d d d d f .
            . . . . f e e e e f f f f f . .
            f f . f e e e e e e f f . . . .
            f e . f e e f e e f e e f . . .
            f e . f e e e f e e f e e f . .
            f e f f e f b b f b d f d b f .
            f f f f e b d d f d d f d d f .
            . f f f f f f f f f f f f f . .
        `,
    ], 200, characterAnimations.rule(Predicate.HittingWallDown, Predicate.NotMoving, Predicate.FacingRight))
}
function createPlayerJumpingAnimation(){
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . f f f f f . . . . . . .
            . . . f e e e e e f . . . . . .
            . . f d d d d e e e f . . . . .
            . c d f d d f d e e f . . . . .
            . c d f d d f d e e f f . . . .
            c d e e d d d d e e d d f . . .
            c d d d d c d d e e b d c . . .
            c c c c c d d e e e b d c . f f
            . f d d d d e e e f f c . f e f
            . f f f f f f e e e e f . f e f
            . f f f f e e e e e e e f f e f
            f d d f d d f e f e e e e f f .
            f d b f d b f e f e e e e f . .
            f f f f f f f f f f f f e f . .
            . . . . . . . . . f c d d f . .
            . . . . . . . . . . f f f f . .
        `
    ], 100, characterAnimations.rule(Predicate.Moving, Predicate.FacingLeft))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . . . . f f f f f . . . .
            . . . . . . f e e e e e f . . .
            . . . . . f e e e d d d d f . .
            . . . . . f e e d f d d f d c .
            . . . . f f e e d f d d f d c .
            . . . f d d e e d d d d e e d c
            . . . c d b e e d d c d d d d c
            f f . c d b e e e d d c c c c c
            f e f . c f f e e e d d d d f .
            f e f . f e e e e f f f f f f .
            f e f f e e e e e e e f f f f .
            . f f e e e e f e f d d f d d f
            . . f e e e e f e f b d f b d f
            . . f e f f f f f f f f f f f f
            . . f d d c f . . . . . . . . .
            . . f f f f . . . . . . . . . .
        `
    ], 100, characterAnimations.rule(Predicate.Moving, Predicate.FacingRight))
}

// player, projectile, and enemy overlap events
sprites.onOverlap(SpriteKind.Player, SpriteKind.Collectible, function(sprite, otherSprite){
    sprites.destroy(otherSprite)
    info.changeScoreBy(100)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function(sprite, otherSprite){
    otherSprite.vy = -100
    otherSprite.destroy(effects.disintegrate, 1000)
    music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    info.changeScoreBy(10)
    sprite.destroy(effects.fire, 100)
})
sprites.onOverlap(SpriteKind.EnemyProjectile, SpriteKind.Player, function(sprite, otherSprite){
    sprite.destroy()
    destroySprite(sprite, 0, -70, 8)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(sprite, otherSprite){
    if(sprite.bottom < otherSprite.y){
        sprite.vy = -100
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        info.changeScoreBy(25)
    } else {
        destroySprite(sprite, 0, -70, 8)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.SpinEnemy, function(sprite, otherSprite){
    destroySprite(sprite, 0, -70, 8)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.MysteryEnemy, function(sprite, otherSprite){
    otherSprite.destroy(effects.disintegrate, 1000)
    music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

})
sprites.onOverlap(SpriteKind.Player, SpriteKind.MysteryEnemy, function(sprite, otherSprite){
    if(sprite.bottom < otherSprite.y){
        sprite.vy = -100
        otherSprite.destroy()
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

        info.changeScoreBy(25)
        createShellEnemy(otherSprite)
    } else {
        destroySprite(sprite, 0, -70, 8)
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.ShellEnemy, function(sprite, otherSprite){
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

    otherSprite.vy -= 100
    otherSprite.destroy(effects.disintegrate, 1000)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ShellEnemy, function(sprite, otherSprite){
    if(Math.abs(otherSprite.vx) > 0){
        if(sprite.bottom < otherSprite.bottom){
            otherSprite.vx = 0
        } else {
            destroySprite(sprite, 0, -70, 8)
            return
        }
    } else {
        if(characterAnimations.matchesRule(sprite, Predicate.FacingRight)){
            otherSprite.vx = 100
        } else {
            otherSprite.vx = -100
        }
        otherSprite.setFlag(SpriteFlag.GhostThroughSprites, true)

        timer.after(100, function() {
            otherSprite.setFlag(SpriteFlag.GhostThroughSprites, false)
        })

    }
    info.changeScoreBy(5)
    sprite.vy = -100
    music.play(music.createSoundEffect(WaveShape.Triangle, 400, 869, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    sprites.setDataNumber(otherSprite, "speed", otherSprite.vx)  
})
sprites.onOverlap(SpriteKind.ShellEnemy, SpriteKind.Enemy, function(sprite, otherSprite){
    if( Math.abs(sprite.vx) > 0){
        otherSprite.vy = -100
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

        info.changeScoreBy(5)
    }
    
})
sprites.onOverlap(SpriteKind.ShellEnemy, SpriteKind.MysteryEnemy, function (sprite, otherSprite) {
    if (Math.abs(sprite.vx) > 0) {
        otherSprite.vy = -100
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

        info.changeScoreBy(5)
    }

})


// Power up overlap events
sprites.onOverlap(SpriteKind.Player, SpriteKind.GrowPower, function(sprite, otherSprite){
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    if(sprites.readDataBoolean(sprite, "GrowPower")){
        return
    }
    sprites.setDataBoolean(sprite, "GrowPower", true)
    sprite.scale = 1.5
    sprite.vy = -100
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ShrinkPower, function (sprite, otherSprite) {
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

    if (sprites.readDataBoolean(sprite, "ShrinkPower")) {
        return
    }
    sprites.setDataBoolean(sprite, "ShrinkPower", true)
    sprite.scale = 0.5
    sprite.vy = -100
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ShootPower, function (sprite, otherSprite) {
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    if (sprites.readDataBoolean(sprite, "ShootPower")) {
        return
    }
    sprites.setDataBoolean(sprite, "ShootPower", true)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.BatPower, function (sprite, otherSprite) {
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

    if (sprites.readDataBoolean(sprite, "BatPower")) {
        return
    }
    sprites.setDataBoolean(sprite, "BatPower", true)

})


function createBatAnimations(){
    // Moving animations
    characterAnimations.loopFrames(playerSprite, [
        img`
            f f f . . . . . . . . f f f . .
            c b b c f . . . . . . c c f f .
            . c b b c f . . . . . . c c f f
            . c c c b f . . . . . . c f c f
            . c c b b c f . c c . c c f f f
            . c b b c b f c c 3 c c 3 c f f
            . c b c c b f c b 3 c b 3 b f f
            . . c c c b b c b b b b b b c .
            . . . c c c c b b 1 b b b 1 c .
            . . . . c c b b b b b b b b b c
            . . . . f b b b b c b b b c b c
            . . . c f b b b b 1 f f f 1 b f
            . . c c f b b b b b b b b b b f
            . . . . f c b b b b b b b b f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
        img`
            . . . . . . . . . . . f f f . .
            f f f . . . . . . . . c c f f f
            c b b c f . . . c c . . c c f f
            . c b b b f f c c 3 c c 3 c f f
            . c c c b b f c b 3 c b 3 b f f
            . c c b c b f c b b b b b b c .
            . c b b c b b c b b b b b b c .
            . c b c c c b b b 1 b b b 1 b c
            . . c c c c c b b b b b b b b c
            . . . c f b b b b c b b b c b f
            . . c c f b b b b 1 f f f 1 b f
            . . . . f c b b b b b b b b f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . c c . . c c . .
            . . . . . . c c c 3 c c 3 c . .
            . . . . . c c c b 3 c b 3 b c .
            . . . . f f b b b b b b b b c .
            . . . . f f b b b b b b b b c c
            . . . f f f c b b 1 b b b 1 b c
            . . . f f f f b b b b b b b b c
            . . . b b b c c b c b b b c b f
            . . . c c c c f b 1 f f f 1 b f
            . . . c c b b f b b b b b b f .
            . . . c b b c c b b b b b f c c
            . . c b b c c f f f f f f c c c
            . c c c c c . . . . . . c c c .
            c c c c . . . . . . . c c c . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . f f f . . . . . . . . f f f .
            . c b b c f . . . . . . . c f f
            . . c b b c f . . . . . . c c f
            . . c c c b f . . . . . . . f c
            . . c c b b f f . . . . . f f c
            . . c b b c b f c c . c c f f f
            . . c b c c b f c c c c c f f f
            . . . c c c b c b 3 c c 3 c f .
            . . . c c c c b b 3 c b 3 b c .
            . . . . c c b b b b b b b b c c
            . . . c f b b b b 1 b b b 1 b c
            . . c c f b b b b b b b b b b f
            . . . . f b b b b c b b b c b f
            . . . . f c b b b 1 f f f 1 f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingRight, Predicate.Moving))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . f f f . . . . . . . . f f f
            . f f c c . . . . . . f c b b c
            f f c c . . . . . . f c b b c .
            f c f c . . . . . . f b c c c .
            f f f c c . c c . f c b b c c .
            f f c 3 c c 3 c c f b c b b c .
            f f b 3 b c 3 b c f b c c b c .
            . c b b b b b b c b b c c c . .
            . c 1 b b b 1 b b c c c c . . .
            c b b b b b b b b b c c . . . .
            c b c b b b c b b b b f . . . .
            f b 1 f f f 1 b b b b f c . . .
            f b b b b b b b b b b f c c . .
            . f b b b b b b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
        img`
            . . f f f . . . . . . . . . . .
            f f f c c . . . . . . . . f f f
            f f c c . . c c . . . f c b b c
            f f c 3 c c 3 c c f f b b b c .
            f f b 3 b c 3 b c f b b c c c .
            . c b b b b b b c f b c b c c .
            . c b b b b b b c b b c b b c .
            c b 1 b b b 1 b b b c c c b c .
            c b b b b b b b b c c c c c . .
            f b c b b b c b b b b f c . . .
            f b 1 f f f 1 b b b b f c c . .
            . f b b b b b b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . c c . . c c . . . . . . . .
            . . c 3 c c 3 c c c . . . . . .
            . c b 3 b c 3 b c c c . . . . .
            . c b b b b b b b b f f . . . .
            c c b b b b b b b b f f . . . .
            c b 1 b b b 1 b b c f f f . . .
            c b b b b b b b b f f f f . . .
            f b c b b b c b c c b b b . . .
            f b 1 f f f 1 b f c c c c . . .
            . f b b b b b b f b b c c . . .
            c c f b b b b b c c b b c . . .
            c c c f f f f f f c c b b c . .
            . c c c . . . . . . c c c c c .
            . . c c c . . . . . . . c c c c
            . . . . . . . . . . . . . . . .
        `,
        img`
            . f f f . . . . . . . . f f f .
            f f c . . . . . . . f c b b c .
            f c c . . . . . . f c b b c . .
            c f . . . . . . . f b c c c . .
            c f f . . . . . f f b b c c . .
            f f f c c . c c f b c b b c . .
            f f f c c c c c f b c c b c . .
            . f c 3 c c 3 b c b c c c . . .
            . c b 3 b c 3 b b c c c c . . .
            c c b b b b b b b b c c . . . .
            c b 1 b b b 1 b b b b f c . . .
            f b b b b b b b b b b f c c . .
            f b c b b b c b b b b f . . . .
            . f 1 f f f 1 b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingLeft, Predicate.Moving))
    characterAnimations.loopFrames(playerSprite, [
        img`
            f f f . . . . . . . . f f f . .
            c b b c f . . . . . . c c f f .
            . c b b c f . . . . . . c c f f
            . c c c b f . . . . . . c f c f
            . c c b b c f . c c . c c f f f
            . c b b c b f c c 3 c c 3 c f f
            . c b c c b f c b 3 c b 3 b f f
            . . c c c b b c b b b b b b c .
            . . . c c c c b b 1 b b b 1 c .
            . . . . c c b b b b b b b b b c
            . . . . f b b b b c b b b c b c
            . . . c f b b b b 1 f f f 1 b f
            . . c c f b b b b b b b b b b f
            . . . . f c b b b b b b b b f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
        img`
            . . . . . . . . . . . f f f . .
            f f f . . . . . . . . c c f f f
            c b b c f . . . c c . . c c f f
            . c b b b f f c c 3 c c 3 c f f
            . c c c b b f c b 3 c b 3 b f f
            . c c b c b f c b b b b b b c .
            . c b b c b b c b b b b b b c .
            . c b c c c b b b 1 b b b 1 b c
            . . c c c c c b b b b b b b b c
            . . . c f b b b b c b b b c b f
            . . c c f b b b b 1 f f f 1 b f
            . . . . f c b b b b b b b b f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . c c . . c c . .
            . . . . . . c c c 3 c c 3 c . .
            . . . . . c c c b 3 c b 3 b c .
            . . . . f f b b b b b b b b c .
            . . . . f f b b b b b b b b c c
            . . . f f f c b b 1 b b b 1 b c
            . . . f f f f b b b b b b b b c
            . . . b b b c c b c b b b c b f
            . . . c c c c f b 1 f f f 1 b f
            . . . c c b b f b b b b b b f .
            . . . c b b c c b b b b b f c c
            . . c b b c c f f f f f f c c c
            . c c c c c . . . . . . c c c .
            c c c c . . . . . . . c c c . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . f f f . . . . . . . . f f f .
            . c b b c f . . . . . . . c f f
            . . c b b c f . . . . . . c c f
            . . c c c b f . . . . . . . f c
            . . c c b b f f . . . . . f f c
            . . c b b c b f c c . c c f f f
            . . c b c c b f c c c c c f f f
            . . . c c c b c b 3 c c 3 c f .
            . . . c c c c b b 3 c b 3 b c .
            . . . . c c b b b b b b b b c c
            . . . c f b b b b 1 b b b 1 b c
            . . c c f b b b b b b b b b b f
            . . . . f b b b b c b b b c b f
            . . . . f c b b b 1 f f f 1 f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingRight, Predicate.MovingRight, Predicate.HittingWallDown))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . f f f . . . . . . . . f f f
            . f f c c . . . . . . f c b b c
            f f c c . . . . . . f c b b c .
            f c f c . . . . . . f b c c c .
            f f f c c . c c . f c b b c c .
            f f c 3 c c 3 c c f b c b b c .
            f f b 3 b c 3 b c f b c c b c .
            . c b b b b b b c b b c c c . .
            . c 1 b b b 1 b b c c c c . . .
            c b b b b b b b b b c c . . . .
            c b c b b b c b b b b f . . . .
            f b 1 f f f 1 b b b b f c . . .
            f b b b b b b b b b b f c c . .
            . f b b b b b b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
        img`
            . . f f f . . . . . . . . . . .
            f f f c c . . . . . . . . f f f
            f f c c . . c c . . . f c b b c
            f f c 3 c c 3 c c f f b b b c .
            f f b 3 b c 3 b c f b b c c c .
            . c b b b b b b c f b c b c c .
            . c b b b b b b c b b c b b c .
            c b 1 b b b 1 b b b c c c b c .
            c b b b b b b b b c c c c c . .
            f b c b b b c b b b b f c . . .
            f b 1 f f f 1 b b b b f c c . .
            . f b b b b b b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . c c . . c c . . . . . . . .
            . . c 3 c c 3 c c c . . . . . .
            . c b 3 b c 3 b c c c . . . . .
            . c b b b b b b b b f f . . . .
            c c b b b b b b b b f f . . . .
            c b 1 b b b 1 b b c f f f . . .
            c b b b b b b b b f f f f . . .
            f b c b b b c b c c b b b . . .
            f b 1 f f f 1 b f c c c c . . .
            . f b b b b b b f b b c c . . .
            c c f b b b b b c c b b c . . .
            c c c f f f f f f c c b b c . .
            . c c c . . . . . . c c c c c .
            . . c c c . . . . . . . c c c c
            . . . . . . . . . . . . . . . .
        `,
        img`
            . f f f . . . . . . . . f f f .
            f f c . . . . . . . f c b b c .
            f c c . . . . . . f c b b c . .
            c f . . . . . . . f b c c c . .
            c f f . . . . . f f b b c c . .
            f f f c c . c c f b c b b c . .
            f f f c c c c c f b c c b c . .
            . f c 3 c c 3 b c b c c c . . .
            . c b 3 b c 3 b b c c c c . . .
            c c b b b b b b b b c c . . . .
            c b 1 b b b 1 b b b b f c . . .
            f b b b b b b b b b b f c c . .
            f b c b b b c b b b b f . . . .
            . f 1 f f f 1 b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingLeft, Predicate.MovingLeft, Predicate.HittingWallDown))

    // Idle Animations
    characterAnimations.loopFrames(playerSprite, [
        img`
            f f f . . . . . . . . f f f . .
            c b b c f . . . . . . c c f f .
            . c b b c f . . . . . . c c f f
            . c c c b f . . . . . . c f c f
            . c c b b c f . c c . c c f f f
            . c b b c b f c c 3 c c 3 c f f
            . c b c c b f c b 3 c b 3 b f f
            . . c c c b b c b 1 b b b 1 c .
            . . . c c c c b b 1 b b b 1 c .
            . . . . c c b b b b b b b b b c
            . . . . f b b b b c 1 f f 1 b c
            . . . c f b b b b f 1 f f 1 f f
            . . c c f b b b b f 2 2 2 2 f f
            . . . . f c b b b b 2 2 2 2 f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
        img`
            . . . . . . . . . . . f f f . .
            f f f . . . . . . . . c c f f f
            c b b c f . . . c c . c c c f f
            . c b b b f f c c 3 c c 3 c f f
            . c c c b b f c b 3 c b 3 c f f
            . c c b c b f c b b b b b b c f
            . c b b c b b c b 1 b b b 1 c c
            . c b c c c b b b b b b b b b c
            . . c c c c c b b c 1 f f 1 b c
            . . . c f b b b b f 1 f f 1 f c
            . . . c f b b b b f f f f f f f
            . . c c f b b b b f 2 2 2 2 f f
            . . . . f c b b b 2 2 2 2 2 f .
            . . . . . f c b b b 2 2 2 f . .
            . . . . . . f f f f f f f . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . c c . c c . . .
            . . . . . . c c c 3 c c 3 f . .
            . . . . . c c c b 3 c b 3 c f .
            . . . . f f b b b b b b b b c f
            . . . . f f b b b 1 b b b 1 c c
            . . . f f f c b b b b b b b b c
            . . . f f f f b b c 1 f f 1 b c
            . . . b b b c c b f 1 f f 1 f f
            . . . c c c c f b f f f f f f f
            . . c c c b b f b f 2 2 2 2 f f
            . . . c b b c c b 2 2 2 2 2 f .
            . . c b b c c f f b 2 2 2 f . .
            . c c c c c f f f f f f f . . .
            c c c c . . . . . . . . . . . .
        `,
        img`
            . f f f . . . . . . . . f f f .
            . c b b c f . . . . . . . c f f
            . . c b b c f . . . . . . c c f
            . . c c c b f . . . . . . . f c
            . . c c b b f f . . . . . f f c
            . . c b b c b f c c . c c f f f
            . . c b c c b f c c c c c f f f
            . . . c c c b c b 3 c c 3 c f .
            . . . c c c c b b 3 c b 3 b c .
            . . . . c c b b b b b b b b c c
            . . . c f b b b 1 1 b b b 1 1 c
            . . c c f b b b b b b b b b b f
            . . . . f b b b b c b b b c b f
            . . . . f c b b b 1 f f f 1 f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
    ], 100, characterAnimations.rule(Predicate.NotMoving, Predicate.FacingRight))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . f f f . . . . . . . . f f f
            . f f c c . . . . . . f c b b c
            f f c c . . . . . . f c b b c .
            f c f c . . . . . . f b c c c .
            f f f c c . c c . f c b b c c .
            f f c 3 c c 3 c c f b c b b c .
            f f b 3 b c 3 b c f b c c b c .
            . c 1 b b b 1 b c b b c c c . .
            . c 1 b b b 1 b b c c c c . . .
            c b b b b b b b b b c c . . . .
            c b 1 f f 1 c b b b b f . . . .
            f f 1 f f 1 f b b b b f c . . .
            f f 2 2 2 2 f b b b b f c c . .
            . f 2 2 2 2 b b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
        img`
            . . f f f . . . . . . . . . . .
            f f f c c . . . . . . . . f f f
            f f c c c . c c . . . f c b b c
            f f c 3 c c 3 c c f f b b b c .
            f f c 3 b c 3 b c f b b c c c .
            f c b b b b b b c f b c b c c .
            c c 1 b b b 1 b c b b c b b c .
            c b b b b b b b b b c c c b c .
            c b 1 f f 1 c b b c c c c c . .
            c f 1 f f 1 f b b b b f c . . .
            f f f f f f f b b b b f c . . .
            f f 2 2 2 2 f b b b b f c c . .
            . f 2 2 2 2 2 b b b c f . . . .
            . . f 2 2 2 b b b c f . . . . .
            . . . f f f f f f f . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . c c . c c . . . . . . . .
            . . f 3 c c 3 c c c . . . . . .
            . f c 3 b c 3 b c c c . . . . .
            f c b b b b b b b b f f . . . .
            c c 1 b b b 1 b b b f f . . . .
            c b b b b b b b b c f f f . . .
            c b 1 f f 1 c b b f f f f . . .
            f f 1 f f 1 f b c c b b b . . .
            f f f f f f f b f c c c c . . .
            f f 2 2 2 2 f b f b b c c c . .
            . f 2 2 2 2 2 b c c b b c . . .
            . . f 2 2 2 b f f c c b b c . .
            . . . f f f f f f f c c c c c .
            . . . . . . . . . . . . c c c c
        `,
        img`
            . f f f . . . . . . . . f f f .
            f f c . . . . . . . f c b b c .
            f c c . . . . . . f c b b c . .
            c f . . . . . . . f b c c c . .
            c f f . . . . . f f b b c c . .
            f f f c c . c c f b c b b c . .
            f f f c c c c c f b c c b c . .
            . f c 3 c c 3 b c b c c c . . .
            . c b 3 b c 3 b b c c c c . . .
            c c b b b b b b b b c c . . . .
            c 1 1 b b b 1 1 b b b f c . . .
            f b b b b b b b b b b f c c . .
            f b c b b b c b b b b f . . . .
            . f 1 f f f 1 b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.NotMoving, Predicate.FacingLeft))
    characterAnimations.loopFrames(playerSprite, [
        img`
            f f f . . . . . . . . f f f . .
            c b b c f . . . . . . c c f f .
            . c b b c f . . . . . . c c f f
            . c c c b f . . . . . . c f c f
            . c c b b c f . c c . c c f f f
            . c b b c b f c c 3 c c 3 c f f
            . c b c c b f c b 3 c b 3 b f f
            . . c c c b b c b 1 b b b 1 c .
            . . . c c c c b b 1 b b b 1 c .
            . . . . c c b b b b b b b b b c
            . . . . f b b b b c 1 f f 1 b c
            . . . c f b b b b f 1 f f 1 f f
            . . c c f b b b b f 2 2 2 2 f f
            . . . . f c b b b b 2 2 2 2 f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
        img`
            . . . . . . . . . . . f f f . .
            f f f . . . . . . . . c c f f f
            c b b c f . . . c c . c c c f f
            . c b b b f f c c 3 c c 3 c f f
            . c c c b b f c b 3 c b 3 c f f
            . c c b c b f c b b b b b b c f
            . c b b c b b c b 1 b b b 1 c c
            . c b c c c b b b b b b b b b c
            . . c c c c c b b c 1 f f 1 b c
            . . . c f b b b b f 1 f f 1 f c
            . . . c f b b b b f f f f f f f
            . . c c f b b b b f 2 2 2 2 f f
            . . . . f c b b b 2 2 2 2 2 f .
            . . . . . f c b b b 2 2 2 f . .
            . . . . . . f f f f f f f . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . c c . c c . . .
            . . . . . . c c c 3 c c 3 f . .
            . . . . . c c c b 3 c b 3 c f .
            . . . . f f b b b b b b b b c f
            . . . . f f b b b 1 b b b 1 c c
            . . . f f f c b b b b b b b b c
            . . . f f f f b b c 1 f f 1 b c
            . . . b b b c c b f 1 f f 1 f f
            . . . c c c c f b f f f f f f f
            . . c c c b b f b f 2 2 2 2 f f
            . . . c b b c c b 2 2 2 2 2 f .
            . . c b b c c f f b 2 2 2 f . .
            . c c c c c f f f f f f f . . .
            c c c c . . . . . . . . . . . .
        `,
        img`
            . f f f . . . . . . . . f f f .
            . c b b c f . . . . . . . c f f
            . . c b b c f . . . . . . c c f
            . . c c c b f . . . . . . . f c
            . . c c b b f f . . . . . f f c
            . . c b b c b f c c . c c f f f
            . . c b c c b f c c c c c f f f
            . . . c c c b c b 3 c c 3 c f .
            . . . c c c c b b 3 c b 3 b c .
            . . . . c c b b b b b b b b c c
            . . . c f b b b 1 1 b b b 1 1 c
            . . c c f b b b b b b b b b b f
            . . . . f b b b b c b b b c b f
            . . . . f c b b b 1 f f f 1 f .
            . . . . . f c b b b b b b f . .
            . . . . . . f f f f f f f . . .
        `,
    ], 100, characterAnimations.rule(Predicate.NotMoving, Predicate.FacingRight, Predicate.HittingWallDown))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . f f f . . . . . . . . f f f
            . f f c c . . . . . . f c b b c
            f f c c . . . . . . f c b b c .
            f c f c . . . . . . f b c c c .
            f f f c c . c c . f c b b c c .
            f f c 3 c c 3 c c f b c b b c .
            f f b 3 b c 3 b c f b c c b c .
            . c 1 b b b 1 b c b b c c c . .
            . c 1 b b b 1 b b c c c c . . .
            c b b b b b b b b b c c . . . .
            c b 1 f f 1 c b b b b f . . . .
            f f 1 f f 1 f b b b b f c . . .
            f f 2 2 2 2 f b b b b f c c . .
            . f 2 2 2 2 b b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
        img`
            . . f f f . . . . . . . . . . .
            f f f c c . . . . . . . . f f f
            f f c c c . c c . . . f c b b c
            f f c 3 c c 3 c c f f b b b c .
            f f c 3 b c 3 b c f b b c c c .
            f c b b b b b b c f b c b c c .
            c c 1 b b b 1 b c b b c b b c .
            c b b b b b b b b b c c c b c .
            c b 1 f f 1 c b b c c c c c . .
            c f 1 f f 1 f b b b b f c . . .
            f f f f f f f b b b b f c . . .
            f f 2 2 2 2 f b b b b f c c . .
            . f 2 2 2 2 2 b b b c f . . . .
            . . f 2 2 2 b b b c f . . . . .
            . . . f f f f f f f . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . c c . c c . . . . . . . .
            . . f 3 c c 3 c c c . . . . . .
            . f c 3 b c 3 b c c c . . . . .
            f c b b b b b b b b f f . . . .
            c c 1 b b b 1 b b b f f . . . .
            c b b b b b b b b c f f f . . .
            c b 1 f f 1 c b b f f f f . . .
            f f 1 f f 1 f b c c b b b . . .
            f f f f f f f b f c c c c . . .
            f f 2 2 2 2 f b f b b c c c . .
            . f 2 2 2 2 2 b c c b b c . . .
            . . f 2 2 2 b f f c c b b c . .
            . . . f f f f f f f c c c c c .
            . . . . . . . . . . . . c c c c
        `,
        img`
            . f f f . . . . . . . . f f f .
            f f c . . . . . . . f c b b c .
            f c c . . . . . . f c b b c . .
            c f . . . . . . . f b c c c . .
            c f f . . . . . f f b b c c . .
            f f f c c . c c f b c b b c . .
            f f f c c c c c f b c c b c . .
            . f c 3 c c 3 b c b c c c . . .
            . c b 3 b c 3 b b c c c c . . .
            c c b b b b b b b b c c . . . .
            c 1 1 b b b 1 1 b b b f c . . .
            f b b b b b b b b b b f c c . .
            f b c b b b c b b b b f . . . .
            . f 1 f f f 1 b b b c f . . . .
            . . f b b b b b b c f . . . . .
            . . . f f f f f f f . . . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.NotMoving, Predicate.FacingLeft, Predicate.HittingWallDown))

}
function generateTilemapCollectibles(){
    for(let tileLocation of tiles.getTilesByType(assets.tile`collectibleSpawn`)){
        createCollectible(tileLocation)
        tiles.setTileAt(tileLocation, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `)
    }
}
function createCollectible(tileLocation: tiles.Location){
    let collectibleSprite: Sprite = sprites.create(img`
            . . b b b b . .
            . b 5 5 5 5 b .
            b 5 d 3 3 d 5 b
            b 5 3 5 5 1 5 b
            c 5 3 5 5 1 d c
            c d d 1 1 d d c
            . f d d d d f .
            . . f f f f . .
        `, SpriteKind.Collectible)
    animation.runImageAnimation(collectibleSprite, [
        img`
                . . b b b b . .
                . b 5 5 5 5 b .
                b 5 d 3 3 d 5 b
                b 5 3 5 5 1 5 b
                c 5 3 5 5 1 d c
                c d d 1 1 d d c
                . f d d d d f .
                . . f f f f . .
            `,
        img`
                . . b b b . . .
                . b 5 5 5 b . .
                b 5 d 3 d 5 b .
                b 5 3 5 1 5 b .
                c 5 3 5 1 d c .
                c 5 d 1 d d c .
                . f d d d f . .
                . . f f f . . .
            `,
        img`
                . . . b b . . .
                . . b 5 5 b . .
                . b 5 d 1 5 b .
                . b 5 3 1 5 b .
                . c 5 3 1 d c .
                . c 5 1 d d c .
                . . f d d f . .
                . . . f f . . .
            `,
        img`
                . . . b b . . .
                . . b 5 5 b . .
                . . b 1 1 b . .
                . . b 5 5 b . .
                . . b d d b . .
                . . c d d c . .
                . . c 3 3 c . .
                . . . f f . . .
            `,
        img`
                . . . b b b . .
                . . b 5 5 5 b .
                . b 5 d 3 d 5 b
                . b 5 1 5 3 5 b
                . c d 1 5 3 5 c
                . c d d 1 d 5 c
                . . f d d d f .
                . . . f f f . .
            `,
        img``,
    ], Math.randomRange(75, 125), true)
    tiles.placeOnTile(collectibleSprite, tileLocation)
}
// Game Update for level select
game.onUpdate(function(){
    if(!levelSelect){
        return
    }
    // levelSelectSprite.sayText(currentLevel)
    if (!tiles.tileAtLocationEquals(levelSelectSprite.tilemapLocation(), assets.tile`levelHorizontal`) && !tiles.tileAtLocationEquals(levelSelectSprite.tilemapLocation(), assets.tile`levelVertical`)) {
        for (let location of tiles.getTilesByType(assets.tile`levelHorizontal`)) {
            if (location.column < levelSelectSprite.tilemapLocation().column) {
                tiles.setWallAt(tiles.getTileLocation(location.column - 1, location.row), true)
            } else if (location.column > levelSelectSprite.tilemapLocation().column) {
                tiles.setWallAt(tiles.getTileLocation(location.column + 1, location.row), true)
            }
        }
        for (let location of tiles.getTilesByType(assets.tile`levelVertical`)) {
            if (location.row < levelSelectSprite.tilemapLocation().row) {
                tiles.setWallAt(tiles.getTileLocation(location.column, location.row - 1), true)
            } else if (location.row > levelSelectSprite.tilemapLocation().row) {
                tiles.setWallAt(tiles.getTileLocation(location.column, location.row + 1), true)
            }
        }
        arrowSprite.setFlag(SpriteFlag.Invisible, true)
        sprites.setDataBoolean(arrowSprite, "isVisible", false)
        indicatorSprite.setFlag(SpriteFlag.Invisible, true)
        delta = 0
    }
    if(!sprites.readDataBoolean(arrowSprite, "isVisible")){
        return
    }
    if (sprites.readDataBoolean(arrowSprite, "levelVertical")) {
        arrowSprite.x += Math.sin(delta)
    } else {
        arrowSprite.y += Math.sin(delta)
    }
    delta += 0.125
    delta = delta % 100
    // levelSelectSprite.sayText(currentLevel)
})

// Game Update for Main game
game.onUpdate(function() {
    // console.log(currentLevel)
    if(levelSelect){
        return
    }
    if(playerSprite.vy > 0){
        isFalling = true
    }
    // Changing direction of powerups when they reach a side wall
    changeDirectionX(SpriteKind.GrowPower)
    changeDirectionX(SpriteKind.ShootPower)
    changeDirectionX(SpriteKind.ShrinkPower)
    changeDirectionX(SpriteKind.BatPower)
    changeDirectionX(SpriteKind.Enemy)
    changeDirectionX(SpriteKind.MysteryEnemy)
    changeDirectionX(SpriteKind.ShellEnemy)


    if(tiles.getTilesByType(assets.tile`luckyTile`).length <= 0) {
        tiles.setTileAt(tiles.getTilesByType(assets.tile`depletedTile`)._pickRandom(), assets.tile`luckyTile`)
    }

})
game.onUpdateInterval(1000, function() {
    if (levelSelect) {
        return
    }
    // Making enemies jump
    spriteJump(SpriteKind.Enemy)
})
function spriteJump(spriteType: number){
    for(let sprite of sprites.allOfKind(spriteType)){
        if(sprites.readDataString(sprite, "type") != "ground")
            break
        if (Math.randomRange(1, 100) < 10){
            sprite.vy = Math.randomRange(-50, -100)
        }
    }
}
function changeDirectionX(spriteType: number){
    for (let sprite of sprites.allOfKind(spriteType)) {
        if (sprite.isHittingTile(CollisionDirection.Left) || sprite.isHittingTile(CollisionDirection.Right)) {
            sprite.vx = -sprites.readDataNumber(sprite, "speed")
            sprites.setDataNumber(sprite, "speed", sprite.vx)
        }
    }
}
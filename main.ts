namespace SpriteKind {
    export const Collectible = SpriteKind.create()
    export const Box = SpriteKind.create()
    export const GrowPower = SpriteKind.create()
    export const Tile = SpriteKind.create()
    export const ShootPower = SpriteKind.create()
    export const ShrinkPower = SpriteKind.create()
    export const BatPower = SpriteKind.create()
    export const HeartPower = SpriteKind.create()
    export const InvinciblePower = SpriteKind.create()
    export const WallJumpPower = SpriteKind.create()
    export const GravityPower = SpriteKind.create()
    export const Selector = SpriteKind.create()
    export const Arrow = SpriteKind.create()
    export const Indicator = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
    export const SpinEnemy = SpriteKind.create()
    export const MysteryEnemy = SpriteKind.create()
    export const ShellEnemy = SpriteKind.create()
    export const Chest = SpriteKind.create()
    export const EmptyChest = SpriteKind.create()
    export const Key = SpriteKind.create()
    export const Shop = SpriteKind.create()
    export const Switch = SpriteKind.create()
    export const JumpPadUp = SpriteKind.create()
    export const JumpPadRight = SpriteKind.create()
    export const JumpPadLeft = SpriteKind.create()
    export const Portal = SpriteKind.create()  
}

let currentLevel: number = 9

class PowerUpTileObject {
    asset: Image
    maxCount: number = 0
    location: tiles.Location[] = []
    constructor(asset: Image, count: number){
        this.asset = asset
        this.maxCount = count
    }
    addLocation(tileLocation: tiles.Location) : void {
        this.location.push(tileLocation)
    }
    getLocations() : tiles.Location[]{
        return this.location
    }
    setLocations(tileLocations: tiles.Location[]) : void {
        this.location = tileLocations
    }
}
let powerupTileCountList: PowerUpTileObject[] = [
    new PowerUpTileObject(assets.tile`growTile`, 0),
    new PowerUpTileObject(assets.tile`shootTile`, 0),
    new PowerUpTileObject(assets.tile`shrinkTile`, 0),
    new PowerUpTileObject(assets.tile`batTile`, 0),
    new PowerUpTileObject(assets.tile`heartTile`, 0),
    new PowerUpTileObject(assets.tile`invincibleTile`, 0),
    new PowerUpTileObject(assets.tile`wallJumpTile`, 0),
    new PowerUpTileObject(assets.tile`gravityTile`, 0),
    new PowerUpTileObject(assets.tile`luckyTile`, 0),
]

let keysAmount: number = 0
let levelTransition: boolean = false

let menuSprite: miniMenu.MenuSprite = null
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
let isJumpPadding: boolean = false
let isTeleporting: boolean = false
let isUpsideDown: boolean = false
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
            tilemap`level7`,
            tilemap`level8`,
            tilemap`level9`,
            tilemap`level10`,

        ],
    ]

info.setScore(0)

class EnemyObject {
    images: Image[] = []
    health: number = 0
    animations: Image[][] = []
    
    constructor(image: Image, health: number){
        this.images.push(image)
        this.health = health
    }
    addAnimation(animation: Image[]) : void{
        this.animations.push(animation)
    }
    setAnimations(animations: Image[][]) : void{
        this.animations = animations
    }
    addImage(image: Image) : void{
        this.images.push(image)
    }
}

let airEnemyObject= new EnemyObject(assets.image`drone`, 1)

let groundEnemyObject = new EnemyObject(assets.image`zooKeeper`, 1)
groundEnemyObject.setAnimations(
    [
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
)
let shootingEnemyObject = new EnemyObject(img`
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
        `, 1)
let spinningEnemyObject = new EnemyObject(img`
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
        `, 0)
spinningEnemyObject.addImage(img`
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
        `)
spinningEnemyObject.addImage(img`
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
        `)

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
    if(enemyType < 0 || enemyType >= spinningEnemyObject.images.length){
        console.log("Invalid Spinning Enemy")
        return
    }
    let enemySprite: Sprite = sprites.create(spinningEnemyObject.images[enemyType], SpriteKind.SpinEnemy)
    enemySprite.z = 5
    tiles.placeOnTile(enemySprite, tileLocation)

    let orbitingSpritesList: Sprite[] = []

    for(let i = 0; i < amount; i+=1){
        let orbitingSprite: Sprite = sprites.create(spinningEnemyObject.images[enemyType], SpriteKind.SpinEnemy)
        orbitingSprite.setFlag(SpriteFlag.GhostThroughWalls, true)
        enemySprite.z = 6
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
    enemySprite.z = 5
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
    let enemySprite: Sprite = sprites.create(shootingEnemyObject.images[0], SpriteKind.Enemy)
    enemySprite.z = 5
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
    let enemySprite = sprites.create(groundEnemyObject.images[0], SpriteKind.Enemy)
    enemySprite.z = 5
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
    let enemySprite = sprites.create(airEnemyObject.images[0], SpriteKind.Enemy)
    enemySprite.z = 5
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
        createSpinningEnemy(tileLocation, Math.randomRange(0, spinningEnemyObject.images.length - 1), 3)
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
    info.setLife(5)

    sprites.destroy(levelSelectSprite)
    sprites.destroy(arrowSprite)
    sprites.destroy(indicatorSprite)
    if(levelSelect){
        createLevelSelect()
        return
    }
    
    
    createPlayer()
    createLevel()
    
}
function createLevel() {
    levelTransition = true

    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, img`
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7776677777777767777777777777777777777777777667777777776777777777777777777777777777766777777777677777777777777777777777777776677777777767777777777777777777777777
        7666777777777667777777777777777777777767766677777777766777777777777777777777776776667777777776677777777777777777777777677666777777777667777777777777777777777767
        7767766777667766777766777777777777777766776776677766776677776677777777777777776677677667776677667777667777777777777777667767766777667766777766777777777777777766
        6666667767766766776766777777777777776676666666776776676677676677777777777777667666666677677667667767667777777777777766766666667767766766776766777777777777776676
        6666677766766666766667777777777777666677666667776676666676666777777777777766667766666777667666667666677777777777776666776666677766766666766667777777777777666677
        6666676666666676666677767777776667776667666667666666667666667776777777666777666766666766666666766666777677777766677766676666676666666676666677767777776667776667
        6666666666666776677666667766677766777666666666666666677667766666776667776677766666666666666667766776666677666777667776666666666666666776677666667766677766777666
        6666666666666766667766677677667766666666666666666666676666776667767766776666666666666666666667666677666776776677666666666666666666666766667766677677667766666666
        66b666666666666666666667667776676666666666b666666666666666666667667776676666666666b666666666666666666667667776676666666666b6666666666666666666676677766766666666
        66b6666666666666666666666b6776666666666666b6666666666666666666666b6776666666666666b6666666666666666666666b6776666666666666b6666666666666666666666b67766666666666
        66b6666666666666666666666bb676666666666666b6666666666666666666666bb676666666666666b6666666666666666666666bb676666666666666b6666666666666666666666bb6766666666666
        66b66666669bb666666669966bbb66666666666666b66666669bb666666669966bbb66666666666666b66666669bb666666669966bbb66666666666666b66666669bb666666669966bbb666666666666
        66b66666699dbb666666dd9666bb66666666666666b666666999bb666666999666bb66666666666666b666666999bb666666999666bb66666666666666b666666999bb666666999666bb666666666666
        6bb6669669966bbb69666d9966bb6666666666666bb6669669966bbb69666d9966bb6666666666666bb6669669966bbb69666d9966bb6666666666666bb6669669966bbb69666d9966bb666666666666
        6bb666d96696d9bbb9966d9966bbb666666666666bb666d96696d9bbb9966d9966bbb666666666666bb666d96696d9bbb9966d9966bbb666666666666bb666d96696d9bbb9966d9966bbb66666666666
        6bb66dd9999d996bb99ddd96666bb666666666666bb66dd9999d996bb99ddd96666bb666666666666bb66dd9999d996bb99ddd96666bb666666666666bb66dd9999d996bb99ddd96666bb66666666666
        bbb666d9999d996bb99dd99669dbbb6696666666bbb666d9999d996bb99dd99669dbbb6696666666bbb666d9999d996bb99dd99669dbbb6696666666bbb666d9999d996bb99dd99669dbbb6696666666
        bbbdd6d9999d999bbb9dd999996bbb6699966666bbbdd6d9999d999bbb9dd999996bbb6699966666bbbdd6d9999d999bbb9dd999996bbb6699966666bbbdd6d9999d999bbb9dd999996bbb6699966666
        bbb6ddd9999d9999bb9dd9999d6bbb9699666666bbb6ddd9999d9999bb9dd9999d6bbb9699666666bbb6ddd9999d9999bb9dd9999d6bbb9699666666bbb6ddd9999d9999bb9dd9999d6bbb9699666666
        bbb6ddd999d99999bbbdd9999d9bbb9999669966bbb6ddd999d99999bbbdd9999d9bbb9999669966bbb6ddd999d99999bbbdd9999d9bbb9999669966bbb6ddd999d99999bbbdd9999d9bbb9999669966
        bbbdddd999d999999bbdd9999d9bbbb9999d9996bbbdddd999d999999bbdd9999d9bbbb9999d9996bbbdddd999d999999bbdd9999d9bbbb9999d9996bbbdddd999d999999bbdd9999d9bbbb9999d9996
        bb9dddd99dd9999999bb9999dd9bbbb9999d9999bb9dddd99dd9999999bb9999dd9bbbb9999d9999bb9dddd99dd9999999bb9999dd9bbbb9999d9999bb9dddd99dd9999999bb9999dd9bbbb9999d9999
        bb99ddddd999999999bbb999d999bbb9999d9999bb99ddddd999999999bbb999d999bbb9999d9999bb99ddddd999999999bbb999d999bbb9999d9999bb99ddddd999999999bbb999d999bbb9999d9999
        bb99dddd9999999999dbbbbdd999bbb9999d999bbb99dddd9999999999dbbbbdd999bbb9999d999bbb99dddd9999999999dbbbbdd999bbb9999d999bbb99dddd9999999999dbbbbdd999bbb9999d999b
        bb99ddd99999999999ddbbbb9999bbbb999d999bbb99ddd99999999999ddbbbb9999bbbb999d999bbb99ddd99999999999ddbbbb9999bbbb999d999bbb99ddd99999999999ddbbbb9999bbbb999d999b
        bb99ddd99999999999ddbbbbbb99bbbb999d999bbb99ddd99999999999ddbbbbbb99bbbb999d999bbb99ddd99999999999ddbbbbbb99bbbb999d999bbb99ddd99999999999ddbbbbbb99bbbb999d999b
        b9999dd9999999999ddddbbbbbbbbbbbb999d99bb9999dd9999999999ddddbbbbbbbbbbbb999d99bb9999dd9999999999ddddbbbbbbbbbbbb999d99bb9999dd9999999999ddddbbbbbbbbbbbb999d99b
        b9999ddd999999999dd99999bbbbbbbbb999d99bb9999ddd999999999dd99999bbbbbbbbb999d99bb9999ddd999999999dd99999bbbbbbbbb999d99bb9999ddd999999999dd99999bbbbbbbbb999d99b
        b9999dddd99999999dd999999bbbbbbbb999d9bbb9999dddd99999999dd999999bbbbbbbb999d9bbb9999dddd99999999dd999999bbbbbbbb999d9bbb9999dddd99999999dd999999bbbbbbbb999d9bb
        b9999ddddd999999ddd9999999bbbbbbb999dbbbb9999ddddd999999ddd9999999bbbbbbb999dbbbb9999ddddd999999ddd9999999bbbbbbb999dbbbb9999ddddd999999ddd9999999bbbbbbb999dbbb
        dd99999ddddd9999ddd999999999bbbbb999bbbbdd99999ddddd9999ddd999999999bbbbb999bbbbdd99999ddddd9999ddd999999999bbbbb999bbbbdd99999ddddd9999ddd999999999bbbbb999bbbb
        9d99999ddddddd9ddd9999999999bbbbb99bbbb99d99999ddddddd9ddd9999999999bbbbb99bbbb99d99999ddddddd9ddd9999999999bbbbb99bbbb99d99999ddddddd9ddd9999999999bbbbb99bbbb9
        9d999999dddddddddd9999999999bbbbb99bbb999d999999dddddddddd9999999999bbbbb99bbb999d999999dddddddddd9999999999bbbbb99bbb999d999999dddddddddd9999999999bbbbb99bbb99
        9d999999ddddddddd99999999999bbbbb99bb9999d999999ddddddddd99999999999bbbbb99bb9999d999999ddddddddd99999999999bbbbb99bb9999d999999ddddddddd99999999999bbbbb99bb999
        9dd99999ddddddd9999999999999bbbbb99bbd999dd99999ddddddd9999999999999bbbbb99bbd999dd99999ddddddd9999999999999bbbbb99bbd999dd99999ddddddd9999999999999bbbbb99bbd99
        99dd9999dddddd99999999999999bbbbb99bbd9999dd9999dddddd99999999999999bbbbb99bbd9999dd9999dddddd99999999999999bbbbb99bbd9999dd9999dddddd99999999999999bbbbb99bbd99
        99ddd999dddddd99999999999999bbbbb9bbbdd999ddd999dddddd99999999999999bbbbb9bbbdd999ddd999dddddd99999999999999bbbbb9bbbdd999ddd999dddddd99999999999999bbbbb9bbbdd9
        9999dddddddddd9999999999999bbbbbb9bbb9d99999dddddddddd9999999999999bbbbbb9bbb9d99999dddddddddd9999999999999bbbbbb9bbb9d99999dddddddddd9999999999999bbbbbb9bbb9d9
        9999dddddddddd9999999999999bbbbbbbbb99d99999dddddddddd9999999999999bbbbbbbbb99d99999dddddddddd9999999999999bbbbbbbbb99d99999dddddddddd9999999999999bbbbbbbbb99d9
        999999dddddddd9999999999999bbbbbbbbb99dd999999dddddddd9999999999999bbbbbbbbb99dd999999dddddddd9999999999999bbbbbbbbb99dd999999dddddddd9999999999999bbbbbbbbb99dd
        d9999999dddddd999999999999bbbbbbbbb9999dd9999999dddddd999999999999bbbbbbbbb9999dd9999999dddddd999999999999bbbbbbbbb9999dd9999999dddddd999999999999bbbbbbbbb9999d
        dd9999999ddddd999999999999bbbbbbbbb99999dd9999999ddddd999999999999bbbbbbbbb99999dd9999999ddddd999999999999bbbbbbbbb99999dd9999999ddddd999999999999bbbbbbbbb99999
        dd9999999ddddd999999999999bbbbbbbb999999dd9999999ddddd999999999999bbbbbbbb999999dd9999999ddddd999999999999bbbbbbbb999999dd9999999ddddd999999999999bbbbbbbb999999
        9d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb999999
        9d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb999999
        9d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb999999
        9d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb9999999d9999999ddddd99999999999bbbbbbbbb999999
        9dd999999ddddd99999999999bbbbbbbb99999999dd999999ddddd99999999999bbbbbbbb99999999dd999999ddddd99999999999bbbbbbbb99999999dd999999ddddd99999999999bbbbbbbb9999999
        9dd999999ddddd99999999999bbbbbbbb99999999dd999999ddddd99999999999bbbbbbbb99999999dd999999ddddd99999999999bbbbbbbb99999999dd999999ddddd99999999999bbbbbbbb9999999
        ddd999999ddddd99999999999bbbbbbbb9999999ddd999999ddddd99999999999bbbbbbbb9999999ddd999999ddddd99999999999bbbbbbbb9999999ddd999999ddddd99999999999bbbbbbbb9999999
        dd9999999ddddd99999999999bbbbbbbb9999999dd9999999ddddd99999999999bbbbbbbb9999999dd9999999ddddd99999999999bbbbbbbb9999999dd9999999ddddd99999999999bbbbbbbb9999999
        dd9999999dddddd9999999999bbbbbbbb9999999dd9999999dddddd9999999999bbbbbbbb9999999dd9999999dddddd9999999999bbbbbbbb9999999dd9999999dddddd9999999999bbbbbbbb9999999
        dd9999999dddddd9999999999bbbbbbbb9999999dd9999999dddddd9999999999bbbbbbbb9999999dd9999999dddddd9999999999bbbbbbbb9999999dd9999999dddddd9999999999bbbbbbbb9999999
        dd9999999dddddd9999999999bbbbbbb99999999dd9999999dddddd9999999999bbbbbbb99999999dd9999999dddddd9999999999bbbbbbb99999999dd9999999dddddd9999999999bbbbbbb99999999
        d99999999dddddd9999999999bbbbbbb9999999dd99999999dddddd9999999999bbbbbbb9999999dd99999999dddddd9999999999bbbbbbb9999999dd99999999dddddd9999999999bbbbbbb9999999d
        d99999999dddddd9999999999bbbbbbb999999ddd99999999dddddd9999999999bbbbbbb999999ddd99999999dddddd9999999999bbbbbbb999999ddd99999999dddddd9999999999bbbbbbb999999dd
        d99999999dddddd9999999999bbbbbbb999999ddd99999999dddddd9999999999bbbbbbb999999ddd99999999dddddd9999999999bbbbbbb999999ddd99999999dddddd9999999999bbbbbbb999999dd
        999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd
        999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd
        999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd999999999ddddddd999999999bbbbbbb99999ddd
        999999999dddddddd99999999bbbbbbb9999dddd999999999dddddddd99999999bbbbbbb9999dddd999999999dddddddd99999999bbbbbbb9999dddd999999999dddddddd99999999bbbbbbb9999dddd
        999999999dddddddd99999999bbbbbbb9999dddd999999999dddddddd99999999bbbbbbb9999dddd999999999dddddddd99999999bbbbbbb9999dddd999999999dddddddd99999999bbbbbbb9999dddd
        999999999dddddddd99999999bbbbbbb9999ddd9999999999dddddddd99999999bbbbbbb9999ddd9999999999dddddddd99999999bbbbbbb9999ddd9999999999dddddddd99999999bbbbbbb9999ddd9
        9999999999dddddddd999999bbbbbbbb9999ddd99999999999dddddddd999999bbbbbbbb9999ddd99999999999dddddddd999999bbbbbbbb9999ddd99999999999dddddddd999999bbbbbbbb9999ddd9
        d999999999dddddddd999999bbbbbbbbddddddddd999999999dddddddd999999bbbbbbbbddddddddd999999999dddddddd999999bbbbbbbbddddddddd999999999dddddddd999999bbbbbbbbdddddddd
        ddddd99999dddddddd999999bbbbbbbbbdddddddddddd99999dddddddd999999bbbbbbbbbdddddddddddd99999dddddddd999999bbbbbbbbbdddddddddddd99999dddddddd999999bbbbbbbbbddddddd
        dddddddd99ddddddddd999ddbbbbbbbbbddddddddddddddd99ddddddddd999ddbbbbbbbbbddddddddddddddd99ddddddddd999ddbbbbbbbbbddddddddddddddd99ddddddddd999ddbbbbbbbbbddddddd
        ddddddddddddddddddd9ddddbbbbbbbbbdddddddddddddddddddddddddd9ddddbbbbbbbbbdddddddddddddddddddddddddd9ddddbbbbbbbbbdddddddddddddddddddddddddd9ddddbbbbbbbbbddddddd
        ddddddddddddddddddddddddbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbdddddd
        ddddddddddddddddddddddddbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbddddddddddddddddddddddddddddddbbbbbbbbbbdddddd
        dddddddddddddddddddddddbbbbbbbbbbbdddddddddddddddddddddddddddddbbbbbbbbbbbdddddddddddddddddddddddddddddbbbbbbbbbbbdddddddddddddddddddddddddddddbbbbbbbbbbbdddddd
        dddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddd
        dddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddd
        dddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddd
        dddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddddddddddddddddddddddddddbbbbbbbbbbbbddddd
        ddddddddddddddddddd7777777777bbbbbbdddddddddddddddddddddddd7777777777bbbbbbdddddddddddddddddddddddd7777777777bbbbbbdddddddddddddddddddddddd7777777777bbbbbbddddd
        dddddddddddddd77777777777777777777bddddddddddddddddddd77777777777777777777bddddddddddddddddddd77777777777777777777bddddddddddddddddddd77777777777777777777bddddd
        ddddddddddd7777777777777777777777777ddddddddddddddd7777777777777777777777777ddddddddddddddd7777777777777777777777777ddddddddddddddd7777777777777777777777777dddd
        dddddddd777777777777777777777777777777dddddddddd777777777777777777777777777777dddddddddd777777777777777777777777777777dddddddddd777777777777777777777777777777dd
        ddddd77777777777777777777777777777777777ddddd77777777777777777777777777777777777ddddd77777777777777777777777777777777777ddddd77777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    `)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, img`
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ............................................111111..................................................................................................................................
        .........................................111111111111...............................................................................................................................
        .........................................111111111111...............................................................................................................................
        .......................................111111111111111..............................................................................................................................
        ................................1111...111111111111111..............................................................................................................................
        ................................1111...111111111111111..............................................................................................................................
        .............................111111111111111111111111111111111111...................................................................................................................
        .............................111111111111111111111111111111111111...................................................................................................................
        .............................111111111111111111111111111111111111...................................................................................................................
        .............................1111111111111111111111111111111111111..................................................................................................................
        .............................1111111111111111111111111111111111111..................................................................................................................
        .............................1111111111111111111111111111111111111..................................................................................................................
        .............................1111111111111111111111111111111111111..................................................................................................................
        .............................1111111111111111111111111111111111111..................................................................................................................
        .............................1111111111111111111111111111111111111..................................................................................................................
        ..............................11111111111111111111111111111111111.....................................................................11111.........................................
        ................................1111111111111111111111111111111.......................................................................11111.........................................
        ................................1111111111111111111111111111111....................................................................11111111111......................................
        .................................11111....11111111111111111111...................................................................111111111111111....................................
        ................................................111111111........................................................................111111111111111....................................
        ..........................................................................................................................1111...111111111111111....................................
        ..........................................................................................................................1111...111111111111111....................................
        .......................................................................................................................11111111111111111111111111111111111..........................
        .......................................................................................................................11111111111111111111111111111111111..........................
        .......................................................................................................................11111111111111111111111111111111111..........................
        .......................................................................................................................11111111111111111111111111111111111..........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        .......................................................................................................................1111111111111111111111111111111111111........................
        ........................................................................................................................1111111111111111111111111111111111..........................
        ........................................................................................................................1111111111111111111111111111111111..........................
        ..........................................................................................................................1111111111111111111111111111111...........................
        ..........................................................................................................................1111111111111111111111111111111...........................
        ...........................................................................................................................11111....1111111111111111111.............................
        ...........................................................................................................................11111....1111111111111111111.............................
        ..........................................................................................................................................111111111.................................
        ....................................................................................................................................................................................
        .................................................................................111................................................................................................
        ...............................................................................11111111.............................................................................................
        ..........................................................................111111111111111111........................................................................................
        ..........................................................................1111111111111111111.......................................................................................
        ..........................................................................1111111111111111111.......................................................................................
        ...........................................................................1111111111111111.........................................................................................
        ....................................................................................1111............................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ...........................................111111111................................................................................................................................
        .......................................11111111111111111............................................................................................................................
        .......................................11111111111111111............................................................................................................................
        .....................................111111111111111111111..........................................................................................................................
        ..........................111111.....111111111111111111111..........................................................................................................................
        ..........................111111.....111111111111111111111..........................................................................................................................
        ......................111111111111111111111111111111111111111111111111111...........................................................................................................
        ......................111111111111111111111111111111111111111111111111111...............................................................1111........................................
        ......................111111111111111111111111111111111111111111111111111.............................................................111111111.....................................
        ......................11111111111111111111111111111111111111111111111111111....................................................111..111111111111....................................
        ......................11111111111111111111111111111111111111111111111111111.................................................1111111111111111111111111111............................
        ......................11111111111111111111111111111111111111111111111111111.................................................11111111111111111111111111111...........................
        ......................11111111111111111111111111111111111111111111111111111.................................................11111111111111111111111111111...........................
        ......................11111111111111111111111111111111111111111111111111111.................................................11111111111111111111111111111...........................
        ......................11111111111111111111111111111111111111111111111111111..................................................111111111111111111111111111............................
        ........................1111111111111111111111111111111111111111111111111......................................................111111111111111111111111.............................
        ..........................111111111111111111111111111111111111111111111....................................................................1111111..................................
        ..........................111111111111111111111111111111111111111111111.............................................................................................................
        ............................1111111......1111111111111111111111111111...............................................................................................................
        ..................................................111111111111......................................................................................................................
        ..................................................111111111111......................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
        ....................................................................................................................................................................................
    `)
    keysAmount = 0

    let allSpriteKindsList = [
        SpriteKind.Collectible,
        SpriteKind.EnemyProjectile,
        SpriteKind.SpinEnemy,
        SpriteKind.MysteryEnemy,
        SpriteKind.ShellEnemy,
        SpriteKind.EmptyChest,
        SpriteKind.Key,
        SpriteKind.Shop,
        SpriteKind.Switch,
        SpriteKind.GrowPower,
        SpriteKind.ShootPower,
        SpriteKind.ShrinkPower,
        SpriteKind.BatPower,
        SpriteKind.HeartPower,
        SpriteKind.InvinciblePower,
        SpriteKind.WallJumpPower,
        SpriteKind.JumpPadUp,
        SpriteKind.JumpPadLeft,
        SpriteKind.JumpPadRight,
        SpriteKind.Portal,
        SpriteKind.MiniMenu,
    ]

    for(let spriteType of allSpriteKindsList){
        sprites.destroyAllSpritesOfKind(spriteType)
    }
    // sprites.destroyAllSpritesOfKind()
    scene.setBackgroundColor(9)
    if (currentLevel < 0 || currentLevel >= worldLevelsList[0].length) {
        tiles.setTilemap(tilemap`test`)
    } else {
        tiles.setTilemap(worldLevelsList[currentWorld][currentLevel])
    }



    generateTilemapEnemies()
    generateTilemapCollectibles()
    generateTilemapSwitchWall()
    generateTilemapChests()
    generateTilemapKeys()
    generateTilemapShop()
    generateTilemapJumpPads()
    generateTilemapPortals()
    
    placePlayerOnTilemap()

    

    for(let currentPowerupTile of powerupTileCountList){
        currentPowerupTile.maxCount = tiles.getTilesByType(currentPowerupTile.asset).length
        currentPowerupTile.setLocations(tiles.getTilesByType(currentPowerupTile.asset))
    }
    


    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer0)
    scroller.setCameraScrollingMultipliers(0.25, 0, scroller.BackgroundLayer.Layer0)
    scroller.scrollBackgroundWithSpeed(-5, 0, scroller.BackgroundLayer.Layer1)

    timer.after(1000, function(){
        levelTransition = false
    })
}

function placePlayerOnTilemap() {
    tiles.placeOnRandomTile(playerSprite, assets.tile`startingSpawnTile`)
}

onStart()

function createPortals(startTileLocation: tiles.Location): Sprite{
    let startPortal: Sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 7 7 7 7 7 7 7 7 . . . .
        . . . 7 4 4 4 4 4 4 4 4 7 . . .
        . . 7 4 4 5 5 5 5 5 5 4 4 7 . .
        . 7 4 4 5 5 5 1 1 5 5 5 4 4 7 .
        . 7 4 5 5 5 1 1 5 5 5 5 5 4 7 .
        . 7 4 5 5 1 1 5 5 5 5 5 5 4 7 .
        . 7 4 5 5 5 1 1 1 1 5 5 5 4 7 .
        . 7 4 5 5 5 5 5 5 1 1 5 5 4 7 .
        . 7 4 5 5 5 5 5 1 1 5 5 5 4 7 .
        . 7 4 5 5 5 5 1 1 5 5 5 5 4 7 .
        . 7 4 4 5 5 5 5 5 5 5 5 4 4 7 .
        . . 7 4 4 5 5 5 5 5 5 4 4 7 . .
        . . . 7 4 4 4 4 4 4 4 4 7 . . .
        . . . . 7 7 7 7 7 7 7 7 . . . .
        . . . . b b b b b c c f . . . .
        . . . b b b b b b b c c f . . .
    `, SpriteKind.Portal)

    sprites.setDataSprite(startPortal, "linkedPortal", null)
    tiles.placeOnTile(startPortal, startTileLocation)
    return startPortal
}


function createJumpPad(tileLocation: tiles.Location, jumpType: string){
    let jumpPadSprite: Sprite = null
    if (jumpType == "up"){
       jumpPadSprite = sprites.create(img`
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
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        c c c c c c c c c c c c c c c c
        c c c c c c c c c c c c c c c c
        c c c c c c c c c c c c c c c c
        `, SpriteKind.JumpPadUp)
    } else if (jumpType == "right"){
        jumpPadSprite = sprites.create(img`
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
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `, SpriteKind.JumpPadRight)
    } else if (jumpType == "left") {
        jumpPadSprite = sprites.create(img`
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
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        c c c c c c c c c c c c c c c c
        c c c c c c c c c c c c c c c c
        c c c c c c c c c c c c c c c c
        `, SpriteKind.JumpPadLeft)
    }
    
    sprites.setDataString(jumpPadSprite, "type", jumpType)
    tiles.placeOnTile(jumpPadSprite, tileLocation)
}


function createSwitchWall(switchTile: tiles.Location, wallTile: tiles.Location){
    let switchSprite: Sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 2 2 2 . . . . . . . . .
        . . . . 2 2 2 . . . . . . . . .
        . . . . . 4 . . . . . . . . . .
        . . . . . 4 . . . . . . . . . .
        . . . . . 4 . . . . . . . . . .
        c c c c b 4 d d d d b c c c c c
        c c c c b b b b b b b c c c c c
        c c c c c c c c c c c c c c c c
    `, SpriteKind.Switch)
    let wallSprite: Sprite = sprites.create(img`
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
    `, SpriteKind.Tile)

    tiles.placeOnTile(switchSprite, switchTile)
    tiles.placeOnTile(wallSprite, wallTile)

    sprites.setDataSprite(switchSprite, "myWall", wallSprite)
}

function createSwitch(switchTile: tiles.Location): Sprite {
    let switchSprite: Sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 2 2 2 . . . . . . . . .
        . . . . 2 2 2 . . . . . . . . .
        . . . . . 4 . . . . . . . . . .
        . . . . . 4 . . . . . . . . . .
        . . . . . 4 . . . . . . . . . .
        c c c c b 4 d d d d b c c c c c
        c c c c b b b b b b b c c c c c
        c c c c c c c c c c c c c c c c
    `, SpriteKind.Switch)
    
    tiles.placeOnTile(switchSprite, switchTile)
    sprites.setDataSprite(switchSprite, "myWall", null)
    return switchSprite
}


function createWall(wallTile: tiles.Location, switchQuantity: number): Sprite {
    let wallSprite: Sprite = sprites.create(img`
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
        c c c c c c c c c c c c c c c c
        . . f . . f . . f . . f . . f .
        . . f . . f . . f . . f . . f .
    `, SpriteKind.Tile)

    tiles.placeOnTile(wallSprite, wallTile)
    sprites.setDataNumber(wallSprite, "switchQuantity", switchQuantity)
    return wallSprite
}


function createShopSprite(tileLocation: tiles.Location){
    let shopSprite: Sprite = sprites.create(img`
        ...bbbbbbbbbb...
        ..b1111111111b..
        .b111111111111b.
        .b111111111111b.
        .bddccccccccddb.
        .bdc66666666cdb.
        .bdc61d66666cdb.
        .bdc6d666666cdb.
        .bdc66666666cdb.
        .bdc66666666cdb.
        .bdc66666666cdb.
        .bddccccccccddb.
        .cbbbbbbbbbbbbc.
        fccccccccccccccf
        fbbbbbbbbbbbbbbf
        fbcdddddddddddbf
        fbcbbbbbbbbbbcbf
        fbcbbbbbbbbbbcbf
        fbccccccccccccbf
        fbbbbbbbbbbbbbbf
        fbffffffffffffbf
        ffffffffffffffff
    `, SpriteKind.Shop)
    animation.runImageAnimation(shopSprite, [
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc66666666cdb.
            .bdc66666666cdb.
            .bdc66766766cdb.
            .bdc66666666cdb.
            .bdc66777766cdb.
            .bdc66666666cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc66666666cdb.
            .bdc66666666cdb.
            .bdc66766766cdb.
            .bdc66666666cdb.
            .bdc66777766cdb.
            .bdc66666666cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc66666666cdb.
            .bdc66666666cdb.
            .bdc66766766cdb.
            .bdc66666666cdb.
            .bdc66777766cdb.
            .bdc66666666cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bdc77777777cdb.
            .bdcbbbbbbbbcdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc66666666cdb.
            .bdc66666666cdb.
            .bdc66766766cdb.
            .bdc66666666cdb.
            .bdc66777766cdb.
            .bdc66666666cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc66666666cdb.
            .bdc66666666cdb.
            .bdc66766766cdb.
            .bdc66666666cdb.
            .bdc66777766cdb.
            .bdc66666666cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
        img`
            ...bbbbbbbbbb...
            ..b1111111111b..
            .b111111111111b.
            .b111111111111b.
            .bddccccccccddb.
            .bdc66666666cdb.
            .bdc67666766cdb.
            .bdc66666666cdb.
            .bdc66777666cdb.
            .bdc67666766cdb.
            .bdc66777666cdb.
            .bddccccccccddb.
            .cbbbbbbbbbbbbc.
            fccccccccccccccf
            fbbbbbbbbbbbbbbf
            fbcdddddddddddbf
            fbcbbbbbbbbbbcbf
            fbcbbbbbbbbbbcbf
            fbccccccccccccbf
            fbbbbbbbbbbbbbbf
            fbffffffffffffbf
            ffffffffffffffff
        `,
    ], 50, true)
    tiles.placeOnTile(shopSprite, tileLocation)

    spriteutils.onSpriteUpdateInterval(shopSprite, 100, function(sprite){
        if(menuSprite == null){
            return
        }
        let distanceToPlayer: number = spriteutils.distanceBetween(shopSprite, playerSprite)
        if(distanceToPlayer > 48){
            menuSprite.close()
            menuSprite = null
        }
    })
}

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
    playerSprite.z = 100
    scene.cameraFollowSprite(playerSprite)
    resetPlayerPowerups()
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
    sprites.setDataBoolean(playerSprite, "InvinciblePower", false)
    sprites.setDataBoolean(playerSprite, "WallJumpPower", false)
    sprites.setDataBoolean(playerSprite, "GravityPower", false)
    isFlying = false
    isUpsideDown = false
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
        img`
            . . . . . . . . . . .
            . . . . . . . . . . .
            . . 2 2 . . . 2 2 . .
            . 2 3 2 2 . 2 2 2 2 .
            . 2 3 2 2 2 2 2 2 2 .
            . 2 2 2 2 2 2 2 2 2 .
            . . 2 2 2 2 2 b 2 . .
            . . . 2 2 2 b 2 . . .
            . . . . 2 2 2 . . . .
            . . . . . 2 . . . . .
            . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . b b . . . . . . .
            . . . . . . b 5 5 b . . . . . .
            . . . b b b 5 5 1 1 b b b . . .
            . . . b 5 5 5 5 1 1 5 5 b . . .
            . . . . b d 5 5 5 5 d b . . . .
            . . . . c b 5 5 5 5 b c . . . .
            . . . . c 5 d d d d 5 c . . . .
            . . . . c 5 d c c d 5 c . . . .
            . . . . c c c . . c c c . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            ....................
            ....................
            ....................
            ....................
            ....................
            ....................
            .....7977777777.....
            .....7777777777.....
            ......66666666......
            ......44444444......
            .....4444444444.....
            .....4444444444.....
            .....4444444444.....
            .....4444444444.....
            .....4444444444.....
            .....4444444444.....
            .....4444444444.....
            ......77777777......
            ....................
            ....................
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . a a a a a a a a . . . .
            . . . a a a a a a a a a a . . .
            . . a a a 1 1 1 1 1 1 1 1 . . .
            . . a a 1 1 1 1 1 1 1 1 9 9 . .
            . . a a 1 1 1 3 3 1 1 9 9 9 9 .
            a a a a a a 1 3 3 1 9 9 9 9 9 9
            . a a a a 1 1 3 3 1 1 1 9 9 . .
            . . a a 1 1 1 1 1 1 1 1 9 9 . .
            . . . 1 1 1 1 1 1 1 1 9 9 9 . .
            . . . 9 9 9 9 9 9 9 9 9 9 . . .
            . . . . 9 9 9 9 9 9 9 9 . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        ],
    "kind" : [
        SpriteKind.GrowPower,
        SpriteKind.ShootPower,
        SpriteKind.ShrinkPower,
        SpriteKind.BatPower,
        SpriteKind.HeartPower,
        SpriteKind.InvinciblePower,
        SpriteKind.WallJumpPower,
        SpriteKind.GravityPower,
    ],
    "scale" : [
        0.75,
        0.75,
        0.75,
        0.75,
        1.0,
        1.0,
        0.75,
        1.0,
    ]
}

class PowerUp {
    image: Image
    kind: number

    constructor(image: Image, kind: number){
        this.image = image
        this.kind = kind
    }
}


let playerInventoryList: PowerUp[] = []


let menuItemList: miniMenu.MenuItem[] = [
    miniMenu.createMenuItem("Grow Power", powerUpObject["image"][0]),
    miniMenu.createMenuItem("Shoot Power", powerUpObject["image"][1]),
    miniMenu.createMenuItem("Shrink Power", powerUpObject["image"][2]),
    miniMenu.createMenuItem("Bat Power", powerUpObject["image"][3]),
    miniMenu.createMenuItem("Heart Power", powerUpObject["image"][4]),
    miniMenu.createMenuItem("Invincible Power", powerUpObject["image"][5]),
    miniMenu.createMenuItem("Wall Jump Power", powerUpObject["image"][6]),
]
let menuItemCostList: number[] = [
    150,
    200,
    75,
    400,
    1000,
    5000,
    350,
]

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
    // console.log(direction)
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
        if (isUpsideDown) {
            playerSprite.vy = 200
            return
        }
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
    if (sprites.readDataBoolean(playerSprite, "GravityPower")) {
        return
    }
    if(sprites.readDataBoolean(playerSprite, "InvinciblePower")){
        return
    }
    
    timer.after(5000, function() {
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
function isPlayerJumpPaddingCheck(sprite: Sprite){
    if(!isJumpPadding){
        return
    }
    isJumpPadding = false
    controller.moveSprite(sprite, 100, 0)
    sprite.vx = 0
    sprite.vy = 0
}
scene.onHitWall(SpriteKind.Player, function(sprite, location){
    isPlayerJumpPaddingCheck(sprite)
    let playerTopDirection: CollisionDirection = CollisionDirection.Top
    let playerBottomDirection: CollisionDirection = CollisionDirection.Bottom
    if(isUpsideDown){
        playerTopDirection = CollisionDirection.Bottom
        playerBottomDirection = CollisionDirection.Top
    }
    if (sprite.isHittingTile(playerBottomDirection)){
        isFalling = false
        jumps = 1
    }
    if(sprites.readDataBoolean(sprite, "WallJumpPower")){
        if (sprite.isHittingTile(CollisionDirection.Left) || sprite.isHittingTile(CollisionDirection.Right)) {
            isFalling = false
            jumps = 1
        }
    }
    if (sprite.isHittingTile(playerTopDirection)){
        if(tiles.tileAtLocationEquals(location, assets.tile`luckyTile`) || 
            tiles.tileAtLocationEquals(location, assets.tile`growTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`shootTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`shrinkTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`batTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`heartTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`invincibleTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`wallJumpTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`gravityTile`) ||
            tiles.tileAtLocationEquals(location, assets.tile`depletedTile`) ){
            
            // createCollectible(targetLocation)
            // tiles.setTileAt(location, assets.tile`depletedTile`)
            hitPowerBox(tiles.tileImageAtLocation(location), location)
            
        }
        
        if (tiles.tileAtLocationEquals(location, assets.tile`stoneUnbreakable`)){
            if(sprites.readDataBoolean(sprite, "GrowPower")){
                music.play(music.createSoundEffect(WaveShape.Sawtooth, 1137, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
                destroyTile(assets.tile`stoneUnbreakable`, location, effects.disintegrate, -50)
                return
            } 
            // else if(Math.randomRange(1, 100) < 5){
            //     let targetLocation: tiles.Location = tiles.getTileLocation(location.column, location.row - 1)
            //     createCollectible(targetLocation)
            //     hitPowerBox(img`
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //         . . . . . . . . . . . . . . . .
            //     `, location)
            // }
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
    for(let tileLocation of tiles.getTilesByType(assets.tile`startingSpawnTile`)){
        tiles.setTileAt(tileLocation, assets.tile`checkPointTile`)
    }
    tiles.setTileAt(location, assets.tile`startingSpawnTile`)
})
// Send player back to world select once they reach the exitTile
scene.onOverlapTile(SpriteKind.Player, assets.tile`closedExitTile`, function (sprite, location) {
    sprite.sayText("I must open all the chests!", 500)
    
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`openExitTile`, function (sprite, location) {
    currentLevel += 1
    createLevel()

    // game.gameOver(true)
    // levelSelect = true
    // maxLevel = currentLevel+1
    // sprite.destroy()
    // onStart()
})

// Destroy power ups when they enter the lava
scene.onOverlapTile(SpriteKind.GrowPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.ShootPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.ShrinkPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

})
scene.onOverlapTile(SpriteKind.BatPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
scene.onOverlapTile(SpriteKind.HeartPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
scene.onOverlapTile(SpriteKind.InvinciblePower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
scene.onOverlapTile(SpriteKind.WallJumpPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
scene.onOverlapTile(SpriteKind.GravityPower, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
scene.onOverlapTile(SpriteKind.Collectible, assets.tile`lavaTile`, function (sprite, location) {
    sprite.destroy()
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
    destroyPlayerSprite(sprite, 0, -70, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`topHazardTile`, function (sprite, location) {
    destroyPlayerSprite(sprite, 0, 70, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`rightHazardTile`, function (sprite, location) {
    destroyPlayerSprite(sprite, -70, 0, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`leftHazardTile`, function (sprite, location) {
    destroyPlayerSprite(sprite, 70, 0, 8)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`lavaTile`, function (sprite, location) {
    destroyPlayerSprite(sprite, 0, -70, 8)
})

function destroyPlayerSprite(sprite: Sprite, velocityX: number, velocityY: number, cameraShakeStrength: number){
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
    info.changeLifeBy(-1)

    createPlayer()
    placePlayerOnTilemap()
    replenishPowerUpTiles()
})

function hitPowerBox(tileImage: Image, location: tiles.Location){
    // tiles.setTilemap(assets.tilemap`spriteAssets`)
    let targetLocation: tiles.Location = tiles.getTileLocation(location.column, location.row - 1)
    tiles.setTileAt(location, assets.tile`transparentTile`)
    let powerBoxSprite = sprites.create(tileImage, SpriteKind.Box)
    tiles.placeOnTile(powerBoxSprite, location)
    powerBoxSprite.ay = 250
    powerBoxSprite.vy = -50
    powerBoxSprite.lifespan = 420
    
    if(tileImage == assets.tile`growTile`){
        createPowerUp(0, targetLocation)
    } else if (tileImage == assets.tile`shootTile`){
        createPowerUp(1, targetLocation)
    } else if (tileImage == assets.tile`shrinkTile`){
        createPowerUp(2, targetLocation)
    } else if (tileImage == assets.tile`batTile`) {
        createPowerUp(3, targetLocation)
    } else if (tileImage == assets.tile`heartTile`) {
        createPowerUp(4, targetLocation)
    } else if (tileImage == assets.tile`invincibleTile`) {
        createPowerUp(5, targetLocation)
    } else if (tileImage == assets.tile`wallJumpTile`) {
        createPowerUp(6, targetLocation)
    } else if (tileImage == assets.tile`gravityTile`) {
        createPowerUp(7, targetLocation)
    } else if (tileImage == assets.tile`depletedTile`){
        music.play(music.createSoundEffect(WaveShape.Sine, 200, 600, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        return
    } else {
        createPowerUp(randint(0, powerUpObject["image"].length - 1), targetLocation)
    }
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 600, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)

}
sprites.onDestroyed(SpriteKind.Box, function(sprite){
    tiles.setTileAt(sprite.tilemapLocation(), assets.tile`depletedTile`)
    let sum: number = 0
    for(let value of powerupTileCountList){
        sum += value.maxCount
    }
   
    let depletedTileList: tiles.Location[] = tiles.getTilesByType(assets.tile`depletedTile`)
    if(depletedTileList.length == sum){
       replenishPowerUpTiles()

        // tiles.setTileAt(tiles.getTilesByType(assets.tile`depletedTile`)._pickRandom(), currentPowerupTiles._pickRandom()["asset"])
    }
})
function replenishPowerUpTiles(){
    let currentPowerupTiles = powerupTileCountList.filter(function (value, index) {
        if (value.maxCount > 0) {
            return true
        } else {
            return false
        }
    })
    for (let powerTileObject of currentPowerupTiles) {
        for (let tileLocation of powerTileObject.getLocations()) {
            tiles.setTileAt(tileLocation, powerTileObject.asset)
        }

    }
}

function createInvertedPlayerWalkingAnimation() {
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . f f f f f f f f f . . . .
            . . . f d b b d d c d d f . . .
            . . . f e f f b d f b d f . . .
            . . f e e e e f e f f e f . . .
            . f f e e e e f e f f e f . . .
            f e f f e e e e e e e f . . . .
            f e f . f e e e e f f f f f . .
            f e f . . f f e e d d d d d f .
            f e f . c f e e d d d c c c c c
            f f . c d b e e d d c d d d d c
            . . . c d b e e d d d d e e d c
            . . . f d d e e d f d d f d c .
            . . . . f f e e d f d d f d c .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
        img`
            . . f f f f . . . . . . . . . .
            . . f d d c f . . . . . . . . .
            . . f e f f f f f f f f f f f f
            . . f e e e e f e f b d f b d f
            . f f e e e e f e f d d f d d f
            f e f f e e e e e e e f f f f .
            f e f . f e e e e f f f f f f .
            f e f . c f f e e e d d d d f .
            f f . c d b e e e d d c c c c c
            . . . c d b e e d d c d d d d c
            . . . f d d e e d d d d e e d c
            . . . . f f e e d f d d f d c .
            . . . . . f e e d f d d f d c .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
        img`
            . . f f f . . . f f f f f f f .
            . f d d c f . . f d d d c d d f
            . f b f f f f f f c d d b d d f
            . . f e e e f f f e e f f e f .
            . . f e e e e f e e f e f f . .
            . f f f e e e e e e e f . . . .
            f e f . f e e e e f f f f f . .
            f e f . . f f e e e d c c c f .
            f e f . . f e e e d c d d d d c
            f e f . c f e e d d d d e e d c
            f f . c d b e e d f d d f d d c
            . . . c d b e e d f d d f d c .
            . . . f d d e e d d d d d d c .
            . . . . f f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
        img`
            . . . . . . f f f f f f f . . .
            . . . . . f f d d d c d d f . .
            . . . . f f f c d d b d d f . .
            . . f f d d c e e f f e f . . .
            . . f f b e e e e e f f . . . .
            . f f f e e e e e e e f . . . .
            f e f . f e e e e e d f f f . .
            f e f . . f f e e d c d d d f .
            f e f . . f e e d d d d e e d c
            f e f . . f e e d f d d f d d c
            . f f . c f e e d f d d f d d c
            . . . c d b e e d d d d d d c .
            . . . c d b e e e d d d d d c .
            . . . f d d e e e e d d d f . .
            . . . . f f f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingRight, Predicate.MovingRight, Predicate.HittingWallUp))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . . . f f f f f f f f f . . .
            . . . f d d c d d b b d f . . .
            . . . f d b f d b f f e f . . .
            . . . f e f f e f e e e e f . .
            . . . f e f f e f e e e e f f .
            . . . . f e e e e e e e f f e f
            . . f f f f f e e e e f . f e f
            . f d d d d d e e f f . . f e f
            c c c c c d d d e e f c . f e f
            c d d d d c d d e e b d c . f f
            c d e e d d d d e e b d c . . .
            . c d f d d f d e e d d f . . .
            . c d f d d f d e e f f . . . .
            . . f d d d d e e e f . . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
        img`
            . . . . . . . . . . f f f f . .
            . . . . . . . . . f c d d f . .
            f f f f f f f f f f f f e f . .
            f d b f d b f e f e e e e f . .
            f d d f d d f e f e e e e f f .
            . f f f f e e e e e e e f f e f
            . f f f f f f e e e e f . f e f
            . f d d d d e e e f f c . f e f
            c c c c c d d e e e b d c . f f
            c d d d d c d d e e b d c . . .
            c d e e d d d d e e d d f . . .
            . c d f d d f d e e f f . . . .
            . c d f d d f d e e f . . . . .
            . . f d d d d e e e f . . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
        img`
            . f f f f f f f . . . f f f . .
            f d d c d d d f . . f c d d f .
            f d d b d d c f f f f f f b f .
            . f e f f e e f f f e e e f . .
            . . f f e f e e f e e e e f . .
            . . . . f e e e e e e e f f f .
            . . f f f f f e e e e f . f e f
            . f c c c d e e e f f . . f e f
            c d d d d c d e e e f . . f e f
            c d e e d d d d e e f c . f e f
            c d d f d d f d e e b d c . f f
            . c d f d d f d e e b d c . . .
            . c d d d d d d e e d d f . . .
            . . f d d d d e e e f f . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
        img`
            . . . f f f f f f f . . . . . .
            . . f d d c d d d f f . . . . .
            . . f d d b d d c f f f . . . .
            . . . f e f f e e c d d f f . .
            . . . . f f e e e e e b f f . .
            . . . . f e e e e e e e f f f .
            . . f f f d e e e e e f . f e f
            . f d d d c d e e f f . . f e f
            c d e e d d d d e e f . . f e f
            c d d f d d f d e e f . . f e f
            c d d f d d f d e e f c . f f .
            . c d d d d d d e e b d c . . .
            . c d d d d d e e e b d c . . .
            . . f d d d e e e e d d f . . .
            . . . f e e e e e f f f . . . .
            . . . . f f f f f . . . . . . .
        `,
    ], 100, characterAnimations.rule(Predicate.FacingLeft, Predicate.MovingLeft, Predicate.HittingWallUp))
}
function createInvertedPlayerJumpingAnimation(){
    characterAnimations.loopFrames(playerSprite, [
        img`
                . . . . . . . . . . f f f f . .
                . . . . . . . . . f c d d f . .
                f f f f f f f f f f f f e f . .
                f d b f d b f e f e e e e f . .
                f d d f d d f e f e e e e f f .
                . f f f f e e e e e e e f f e f
                . f f f f f f e e e e f . f e f
                . f d d d d e e e f f c . f e f
                c c c c c d d e e e b d c . f f
                c d d d d c d d e e b d c . . .
                c d e e d d d d e e d d f . . .
                . c d f d d f d e e f f . . . .
                . c d f d d f d e e f . . . . .
                . . f d d d d e e e f . . . . .
                . . . f e e e e e f . . . . . .
                . . . . f f f f f . . . . . . .
        `
    ], 100, characterAnimations.rule(Predicate.Moving, Predicate.FacingLeft))
    characterAnimations.loopFrames(playerSprite, [
        img`
                . . f f f f . . . . . . . . . .
                . . f d d c f . . . . . . . . .
                . . f e f f f f f f f f f f f f
                . . f e e e e f e f b d f b d f
                . f f e e e e f e f d d f d d f
                f e f f e e e e e e e f f f f .
                f e f . f e e e e f f f f f f .
                f e f . c f f e e e d d d d f .
                f f . c d b e e e d d c c c c c
                . . . c d b e e d d c d d d d c
                . . . f d d e e d d d d e e d c
                . . . . f f e e d f d d f d c .
                . . . . . f e e d f d d f d c .
                . . . . . f e e e d d d d f . .
                . . . . . . f e e e e e f . . .
                . . . . . . . f f f f f . . . .
        `
    ], 100, characterAnimations.rule(Predicate.Moving, Predicate.FacingRight))
}
function createInvertPlayerIdleAnimation() {
    characterAnimations.loopFrames(playerSprite, [
        img`
            . . f f f f f f f f f f f f f .
            . f d d f e e e d d b e f f f f
            . f f f f f f e b b f e f f e f
            . f f d d f e f f e e e f . e f
            . . f d b f e e f f e e f . e f
            . . f f f f f e e e e e f . f f
            . . f e e e f f e e e f . . . .
            . f d d d d e e e f f . . . . .
            c c c c c d d e e e f c . . . .
            c d d d d c d d e e b d c . . .
            c d e e d d d d e e b d c . . .
            . c d f d d f d e e d d f . . .
            . c d f d d f d e e f f . . . .
            . . f d d d d e e e f . . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
        img`
            . f f f f f f f f f f f f f . .
            . f d d f e e f d d b f f f f .
            . f b d f e e f b b f f f e f .
            . . f f e e e e f f f f f e f .
            . . . f e e e e e e f f f e f .
            . . . . f e e e e e e e f f f .
            . . . . f f f e e f e e e f . .
            . . . c d d d d e e f f e f f f
            . . c d d d d d d e e f f d d f
            . c d c c c c d d d e d f b d f
            . c c d d d d c d d e d f f f .
            . c d d e e d d d d e d d f . .
            . . f f f d d f f d e f f . . .
            . . . f d d d d d e e f . . . .
            . . . . f e e e e e f . . . . .
            . . . . . f f f f f . . . . . .
        `,
        img`
            . f f f f f f f f f f f f f . .
            . f d d f f f f d d b f f f f .
            . f b d f e e f b b f f f e f .
            . . f f e e e e f f f f f e f .
            . . . f e e e e e e f f f e f .
            . . . . f e e e e e e e f f f .
            . . . . f f f e e f e e e f f f
            . . . c d d d d e e f f f d d f
            . . c d d d d d d d e f f b d f
            . c d d c c c c d d d e f f f f
            . c d c d d d d c d d e f f . .
            . c d d d e e d d d d e d f . .
            . . f d f f d d f f d f f . . .
            . . . f d d d d d d e f . . . .
            . . . . f e e e e e f . . . . .
            . . . . . f f f f f . . . . . .
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
            . f f f f f f f f f f f f f . .
            . f d d f f e e d d b f f f f .
            . f b d f e e f b b f f f e f .
            . f f e e e f f f f f f f e f .
            . . f e e f e e e e f f . e f .
            . . f f f e e e e f f f . f f .
            . f d d f e f f f e e f . . . .
            . f b d f f f e e e e f . . . .
            c f f f f d d d e e f c f . . .
            c d d d d c d d e e b d c . . .
            c d e e d d d d e e b d c . . .
            . c d d d f d d e e d d f . . .
            . . f d d f d d e e f f . . . .
            . . f d d d d e e e f . . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
        img`
            . . f f f f f f f f f f f f f .
            . f d d f d d f d d b e f f f f
            . f b d f d b f b b f e f f e f
            . . f e e f e e f e e e f . e f
            . . . f e e f e e f e e f . e f
            . . . . f f e e e e e e f . f f
            . . f f f f f e e e e f . . . .
            . f d d d d e e e f f . . . . .
            c c c c c d d e e e f c . . . .
            c d d d d c d d e e b d c . . .
            c d e e d d d d e e b d c . . .
            . c d f d d f d e e d d f . . .
            . c d f d d f d e e f f . . . .
            . . f d d d d e e e f . . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
        img`
            . . f f f f f f f f f f f f f .
            . f d d f d d f d d b e f f f f
            . f b d f d b f b b f e f f e f
            . . f e e f e e f e e e f . e f
            . . . f e e f e e f e e f . e f
            . . . . f f e e e e e e f . f f
            . . f f f f f e e e e f . . . .
            . f d d d d e e e f f . . . . .
            c c c c c d d e e e f c . . . .
            c d d d d c d d e e b d c . . .
            c d e e d d d d e e b d c . . .
            . c d f d d f d e e d d f . . .
            . c d f d d f d e e f f . . . .
            . . f d d d d e e e f . . . . .
            . . . f e e e e e f . . . . . .
            . . . . f f f f f . . . . . . .
        `,
    ], 200, characterAnimations.rule(Predicate.HittingWallUp, Predicate.NotMoving, Predicate.FacingLeft))
    characterAnimations.loopFrames(playerSprite, [
        img`
            . f f f f f f f f f f f f f . .
            f f f f e b d d e e e f d d f .
            f e f f e f b b e f f f f f f .
            f e . f e e e f f e f d d f f .
            f e . f e e f f e e f b d f . .
            f f . f e e e e e f f f f f . .
            . . . . f e e e f f e e e f . .
            . . . . . f f e e e d d d d f .
            . . . . c f e e e d d c c c c c
            . . . c d b e e d d c d d d d c
            . . . c d b e e d d d d e e d c
            . . . f d d e e d f d d f d c .
            . . . . f f e e d f d d f d c .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
        img`
            . . f f f f f f f f f f f f f .
            . f f f f b d d f e e f d d f .
            . f e f f f b b f e e f d b f .
            . f e f f f f f e e e e f f . .
            . f e f f f e e e e e e f . . .
            . f f f e e e e e e e f . . . .
            . . f e e e f e e f f f . . . .
            f f f e f f e e d d d d c . . .
            f d d f f e e d d d d d d c . .
            f d b f d e d d d c c c c d c .
            . f f f d e d d c d d d d c c .
            . . f d d e d d d d e e d d c .
            . . . f f e d f f d d f f f . .
            . . . . f e e d d d d d f . . .
            . . . . . f e e e e e f . . . .
            . . . . . . f f f f f . . . . .
        `,
        img`
            . . f f f f f f f f f f f f f .
            . f f f f b d d f f f f d d f .
            . f e f f f b b f e e f d b f .
            . f e f f f f f e e e e f f . .
            . f e f f f e e e e e e f . . .
            . f f f e e e e e e e f . . . .
            f f f e e e f e e f f f . . . .
            f d d f f f e e d d d d c . . .
            f d b f f e d d d d d d d c . .
            f f f f e d d d c c c c d d c .
            . . f f e d d c d d d d c d c .
            . . f d e d d d d e e d d d c .
            . . . f f d f f d d f f d f . .
            . . . . f e d d d d d d f . . .
            . . . . . f e e e e e f . . . .
            . . . . . . f f f f f . . . . .
        `,
        img`
            . . f f f f f f f f f f f f f .
            . f e f f b d d f e e f d d f .
            . f e f f f b b f f e f d b f .
            . f e . f f e e e f f e f f f .
            . f f . f f e e e e e f f f f f
            . . . . f f f f f e e e f d d f
            . . . . f e e e f f f e f d d f
            . . . c d b e e d d c d d f f c
            . . . c d b e e d d d d e e d c
            . . . f d d e e d f f d d d c .
            . . . . f f e e d d d d d f . .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . f f f f f f f f f f f f f .
            . f f f f b d d e e f f d d f .
            . f e f f f b b f e e f d b f .
            . f e f f f f f f f e e e f f .
            . f e . f f e e e e f e e f . .
            . f f . f f f e e e e f f f . .
            . . . . f e e f f f e f d d f .
            . . . . f e e e e f f f d b f .
            . . . f c f e e d d d f f f f c
            . . . c d b e e d d c d d d d c
            . . . c d b e e d d d d e e d c
            . . . f d d e e d d f d d d c .
            . . . . f f e e d d f d d f . .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
        img`
            . f f f f f f f f f f f f f . .
            f f f f e b d d f d d f d d f .
            f e f f e f b b f b d f d b f .
            f e . f e e e f e e f e e f . .
            f e . f e e f e e f e e f . . .
            f f . f e e e e e e f f . . . .
            . . . . f e e e e f f f f f . .
            . . . . . f f e e e d d d d f .
            . . . . c f e e e d d c c c c c
            . . . c d b e e d d c d d d d c
            . . . c d b e e d d d d e e d c
            . . . f d d e e d f d d f d c .
            . . . . f f e e d f d d f d c .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
        img`
            . f f f f f f f f f f f f f . .
            f f f f e b d d f d d f d d f .
            f e f f e f b b f b d f d b f .
            f e . f e e e f e e f e e f . .
            f e . f e e f e e f e e f . . .
            f f . f e e e e e e f f . . . .
            . . . . f e e e e f f f f f . .
            . . . . . f f e e e d d d d f .
            . . . . c f e e e d d c c c c c
            . . . c d b e e d d c d d d d c
            . . . c d b e e d d d d e e d c
            . . . f d d e e d f d d f d c .
            . . . . f f e e d f d d f d c .
            . . . . . f e e e d d d d f . .
            . . . . . . f e e e e e f . . .
            . . . . . . . f f f f f . . . .
        `,
    ], 200, characterAnimations.rule(Predicate.HittingWallUp, Predicate.NotMoving, Predicate.FacingRight))
}
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

function jumpPadLaunch(sprite: Sprite, velocityX: number, velocityY: number, canMove: boolean){
    isJumpPadding = true
    if(!canMove)
        controller.moveSprite(sprite, 0, 0)

    sprite.vx = velocityX
    sprite.vy = velocityY
    
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.JumpPadUp, function(sprite, otherSprite){
    jumpPadLaunch(sprite, 0, -250, true)
    animation.runImageAnimation(otherSprite, [
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 1 . . . . . 1 1 1 1 1 1
            . . . . . 1 1 1 1 1 . . . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 . . . . . . . . 1 1 1 1
            . . . . 1 1 1 . . 1 1 1 . . . .
            . . . . . . . 1 1 . . . . . . .
            . . . . 1 1 1 . . 1 1 1 . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 . . . . . . . . . . . . 1 1
            . . 1 1 . . . . . . . . 1 1 . .
            . . . . 1 1 . . . . 1 1 . . . .
            . . . . . . 1 1 1 1 . . . . . .
            . . . . 1 1 . . . . 1 1 . . . .
            . . 1 1 . . . . . . . . 1 1 . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 . . . . . . . . . . . . 1 1
            . . 1 1 . . . . . . . . 1 1 . .
            . . . . 1 . . . . . . 1 . . . .
            . . . . . 1 1 . . 1 1 . . . . .
            . . . . . . . 1 1 . . . . . . .
            . . . . . 1 1 . . 1 1 . . . . .
            . . . . 1 . . . . . . 1 . . . .
            . . 1 1 . . . . . . . . 1 1 . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
    ], 50, false)
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    pause(1500)
    animation.runImageAnimation(otherSprite, [
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 . . . . . . . . . . . . 1 1
            . . 1 1 . . . . . . . . 1 1 . .
            . . . . 1 . . . . . . 1 . . . .
            . . . . . 1 1 . . 1 1 . . . . .
            . . . . . . . 1 1 . . . . . . .
            . . . . . 1 1 . . 1 1 . . . . .
            . . . . 1 . . . . . . 1 . . . .
            . . 1 1 . . . . . . . . 1 1 . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 . . . . . . . . . . . . 1 1
            . . 1 1 . . . . . . . . 1 1 . .
            . . . . 1 1 . . . . 1 1 . . . .
            . . . . . . 1 1 1 1 . . . . . .
            . . . . 1 1 . . . . 1 1 . . . .
            . . 1 1 . . . . . . . . 1 1 . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 . . . . . . . . 1 1 1 1
            . . . . 1 1 1 . . 1 1 1 . . . .
            . . . . . . . 1 1 . . . . . . .
            . . . . 1 1 1 . . 1 1 1 . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 1 . . . . . 1 1 1 1 1 1
            . . . . . 1 1 1 1 1 . . . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
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
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        c c c c c c c c c c c c c c c c
        c c c c c c c c c c c c c c c c
        c c c c c c c c c c c c c c c c
        `,
        ], 50, false)
    otherSprite.setFlag(SpriteFlag.Ghost, false) 
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.JumpPadRight, function (sprite, otherSprite) {   
    jumpPadLaunch(sprite, 150, -250, false)
    animation.runImageAnimation(otherSprite, [
        img`
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
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 1 . . . . . 1 1 1 1 1 1
            . . . . . 1 1 1 1 1 . . . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . 2 2 2
            . . . . . . . . . . . . . 2 2 2
            . . . . . . . . . . . . 1 2 2 2
            . . . . . . . . . . . 1 . 2 2 2
            . . . . . . . . . . 1 . . 2 2 2
            . . . . . . . . . . 1 . . 2 2 2
            . . . . . . . . . 1 1 . . 2 2 2
            . . . . . . . 1 1 . 1 . . 2 2 2
            . . . . . . 1 . . 1 . 1 . 2 2 2
            . . . . . 1 . . . 1 . . 1 2 2 2
            . . . . 1 . . . . . 1 . . 2 2 2
            . . . . 1 . . . . . 1 . . 2 2 2
            . . . 1 . . . . . . 1 . . 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
    ], 50, false)
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    
    pause(1500)
    animation.runImageAnimation(otherSprite, [
        img`
            . . . . . . . . . . . . . 2 2 2
            . . . . . . . . . . . . . 2 2 2
            . . . . . . . . . . . . 1 2 2 2
            . . . . . . . . . . . 1 . 2 2 2
            . . . . . . . . . . 1 . . 2 2 2
            . . . . . . . . . . 1 . . 2 2 2
            . . . . . . . . . 1 1 . . 2 2 2
            . . . . . . . 1 1 . 1 . . 2 2 2
            . . . . . . 1 . . 1 . 1 . 2 2 2
            . . . . . 1 . . . 1 . . 1 2 2 2
            . . . . 1 . . . . . 1 . . 2 2 2
            . . . . 1 . . . . . 1 . . 2 2 2
            . . . 1 . . . . . . 1 . . 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 1 . . . . . 1 1 1 1 1 1
            . . . . . 1 1 1 1 1 . . . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
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
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
    ], 50, false)
    
    otherSprite.setFlag(SpriteFlag.Ghost, false)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.JumpPadLeft, function (sprite, otherSprite) {
    jumpPadLaunch(sprite, -150, -250, false)
    animation.runImageAnimation(otherSprite, [
        img`
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
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 1 1 . . . . . 1 1 1 1 1
            . . . . . . 1 1 1 1 1 . . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            2 2 2 . . . . . . . . . . . . .
            2 2 2 . . . . . . . . . . . . .
            2 2 2 1 . . . . . . . . . . . .
            2 2 2 . 1 . . . . . . . . . . .
            2 2 2 . . 1 . . . . . . . . . .
            2 2 2 . . 1 . . . . . . . . . .
            2 2 2 . . 1 1 . . . . . . . . .
            2 2 2 . . 1 . 1 1 . . . . . . .
            2 2 2 . 1 . 1 . . 1 . . . . . .
            2 2 2 1 . . 1 . . . 1 . . . . .
            2 2 2 . . 1 . . . . . 1 . . . .
            2 2 2 . . 1 . . . . . 1 . . . .
            2 2 2 . . 1 . . . . . . 1 . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
    ], 50, false)
    sprite.vy = -200
    sprite.vx = -500
    otherSprite.setFlag(SpriteFlag.Ghost, true)

    pause(1500)
    animation.runImageAnimation(otherSprite, [
        img`
            2 2 2 . . . . . . . . . . . . .
            2 2 2 . . . . . . . . . . . . .
            2 2 2 1 . . . . . . . . . . . .
            2 2 2 . 1 . . . . . . . . . . .
            2 2 2 . . 1 . . . . . . . . . .
            2 2 2 . . 1 . . . . . . . . . .
            2 2 2 . . 1 1 . . . . . . . . .
            2 2 2 . . 1 . 1 1 . . . . . . .
            2 2 2 . 1 . 1 . . 1 . . . . . .
            2 2 2 1 . . 1 . . . 1 . . . . .
            2 2 2 . . 1 . . . . . 1 . . . .
            2 2 2 . . 1 . . . . . 1 . . . .
            2 2 2 . . 1 . . . . . . 1 . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            1 1 1 1 1 1 . . . . . 1 1 1 1 1
            . . . . . . 1 1 1 1 1 . . . . .
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
        img`
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
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `,
    ], 50, false)

    otherSprite.setFlag(SpriteFlag.Ghost, false)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Switch, function(sprite, otherSprite){
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    let wallSprite = sprites.readDataSprite(otherSprite, "myWall")
    otherSprite.setImage(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . 7 7 7 . . . . .
        . . . . . . . . 7 7 7 . . . . .
        . . . . . . . . . 4 . . . . . .
        . . . . . . . . . 4 . . . . . .
        . . . . . . . . . 4 . . . . . .
        c c c c b d d d d 4 b c c c c c
        c c c c b b b b b b b c c c c c
        c c c c c c c c c c c c c c c c
    `)
    if(!wallSprite){
        // sprite.sayText("No wall", 100)
        return
    }
    sprites.changeDataNumberBy(wallSprite, "switchQuantity", -1)
    
    if (sprites.readDataNumber(wallSprite, "switchQuantity") > 0){
        return
    }
    // check to see if the current Switch quantity is 0.


    tiles.setWallAt(wallSprite.tilemapLocation(), false)
    wallSprite.lifespan = 350
    animation.runImageAnimation(wallSprite, [
        img`
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
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
        `,
        img`
            . . f . . f . . f . . f . . f .
            c c c c c c c c c c c c c c c c
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
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
        `,
        img`
            . . f . . f . . f . . f . . f .
            . . f . . f . . f . . f . . f .
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
        `,        
    ], 50, false)
    
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Portal, function(sprite, otherSprite){
    let destinationPortalSprite: Sprite = sprites.readDataSprite(otherSprite, "linkedPortal")
    if (!destinationPortalSprite){
        return
    }
    
    isTeleporting = true
    tiles.placeOnTile(sprite, destinationPortalSprite.tilemapLocation())
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    destinationPortalSprite.setFlag(SpriteFlag.Ghost, true)
    otherSprite.setImage(img`
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
        . . . . b b b b b c c f . . . .
        . . . b b b b b b b c c f . . .
    `)
    destinationPortalSprite.setImage(img`
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
        . . . . b b b b b c c f . . . .
        . . . b b b b b b b c c f . . .
    `)
    pause(100)
    sprite.vy = -50
    
    timer.after(2500, function(){
        otherSprite.setFlag(SpriteFlag.Ghost, false)
        destinationPortalSprite.setFlag(SpriteFlag.Ghost, false)
        otherSprite.setImage(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . 7 4 4 4 4 4 4 4 4 7 . . .
            . . 7 4 4 5 5 5 5 5 5 4 4 7 . .
            . 7 4 4 5 5 5 1 1 5 5 5 4 4 7 .
            . 7 4 5 5 5 1 1 5 5 5 5 5 4 7 .
            . 7 4 5 5 1 1 5 5 5 5 5 5 4 7 .
            . 7 4 5 5 5 1 1 1 1 5 5 5 4 7 .
            . 7 4 5 5 5 5 5 5 1 1 5 5 4 7 .
            . 7 4 5 5 5 5 5 1 1 5 5 5 4 7 .
            . 7 4 5 5 5 5 1 1 5 5 5 5 4 7 .
            . 7 4 4 5 5 5 5 5 5 5 5 4 4 7 .
            . . 7 4 4 5 5 5 5 5 5 4 4 7 . .
            . . . 7 4 4 4 4 4 4 4 4 7 . . .
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . . b b b b b c c f . . . .
            . . . b b b b b b b c c f . . .
        `)
        destinationPortalSprite.setImage(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . 7 4 4 4 4 4 4 4 4 7 . . .
            . . 7 4 4 5 5 5 5 5 5 4 4 7 . .
            . 7 4 4 5 5 5 1 1 5 5 5 4 4 7 .
            . 7 4 5 5 5 1 1 5 5 5 5 5 4 7 .
            . 7 4 5 5 1 1 5 5 5 5 5 5 4 7 .
            . 7 4 5 5 5 1 1 1 1 5 5 5 4 7 .
            . 7 4 5 5 5 5 5 5 1 1 5 5 4 7 .
            . 7 4 5 5 5 5 5 1 1 5 5 5 4 7 .
            . 7 4 5 5 5 5 1 1 5 5 5 5 4 7 .
            . 7 4 4 5 5 5 5 5 5 5 5 4 4 7 .
            . . 7 4 4 5 5 5 5 5 5 4 4 7 . .
            . . . 7 4 4 4 4 4 4 4 4 7 . . .
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . . b b b b b c c f . . . .
            . . . b b b b b b b c c f . . .
        `)
        isTeleporting = false
    })
})


sprites.onOverlap(SpriteKind.Player, SpriteKind.Collectible, function(sprite, otherSprite){
    sprites.destroy(otherSprite)
    info.changeScoreBy(5)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Chest, function(sprite, otherSprite){
    if(keysAmount <= 0){
        return
    }
    otherSprite.setImage(img`
        . b b b b b b b b b b b b b b .
        b e 4 4 4 4 4 4 4 4 4 4 4 4 4 b
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e e 4 4 4 4 4 4 4 4 4 4 e e b
        b b b b b b b d d b b b b b b b
        . b b b b b b c c b b b b b b .
        b c c c c c b c c b c c c c c b
        b c c c c c c b b c c c c c c b
        b c c c c c c c c c c c c c c b
        b c c c c c c c c c c c c c c b
        b b b b b b b b b b b b b b b b
        b e e e e e e e e e e e e e e b
        b e e e e e e e e e e e e e e b
        b c e e e e e e e e e e e e c b
        b b b b b b b b b b b b b b b b
        . b b . . . . . . . . . . b b .
    `)
    otherSprite.setKind(SpriteKind.EmptyChest)
    let amount: number = Math.randomRange(15, 30)
    while(amount > 0){
        createChestCollectibles(otherSprite)
        amount--
    }
    keysAmount--
    checkCollectedChestAmount()
})
function checkCollectedChestAmount(){
    if(sprites.allOfKind(SpriteKind.Chest).length == 0){
        for(let exitLocation of tiles.getTilesByType(assets.tile`closedExitTile`)){
            tiles.setTileAt(exitLocation, assets.tile`openExitTile`)
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shop, function(sprite, otherSprite){
    if(menuSprite){
        return
    }
    menuSprite = miniMenu.createMenuFromArray(menuItemList)
    menuSprite.setMenuStyleProperty(miniMenu.MenuStyleProperty.Rows, 3)
    menuSprite.setMenuStyleProperty(miniMenu.MenuStyleProperty.Columns, 1)
    menuSprite.setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menuSprite.setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, 15)
    menuSprite.setStyleProperty(miniMenu.StyleKind.DefaultAndSelected, miniMenu.StyleProperty.IconTextSpacing, 1)
    menuSprite.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 90)
    menuSprite.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 80)
    menuSprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    menuSprite.setTitle("Cost: 50")
    menuSprite.onSelectionChanged(function(selection, selectedIndex){
        
        menuSprite.setTitle("Cost: " + menuItemCostList[selectedIndex].toString())
    })
    menuSprite.onButtonPressed(controller.B, function(selection, selectedIndex){
        if(info.score() < menuItemCostList[selectedIndex]){
            playerSprite.sayText("I need more coins", 1000)
            return
        } else if(playerInventoryList.length >= 3){
            playerSprite.sayText("My Inventory is full", 1000)
            return
        }
        info.changeScoreBy(-menuItemCostList[selectedIndex])
        playerInventoryList.push(new PowerUp(powerUpObject["image"][selectedIndex], powerUpObject["kind"][selectedIndex]))
            // {
            //     "image": powerUpObject["image"][selectedIndex],
            //     "kind": powerUpObject["kind"][selectedIndex]
            // })
        playerSprite.sayText(playerInventoryList.length, 1000)
            
    })
})

controller.player2.A.onEvent(ControllerButtonEvent.Pressed, function() {
    if(playerInventoryList.length <= 0){
        playerSprite.sayText("I have no items", 1000)
        return
    }
    let powerUpInfo: PowerUp = playerInventoryList.removeAt(0)
    let powerUpSprite: Sprite = sprites.create(powerUpInfo.image, powerUpInfo.kind)
    powerUpSprite.setPosition(playerSprite.x, playerSprite.y - 24)
    powerUpSprite.ay = 250
    playerSprite.sayText(playerInventoryList.length, 1000)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Key, function(sprite, otherSprite){
    otherSprite.destroy()
    keysAmount++
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
    destroyPlayerSprite(otherSprite, 0, -70, 8)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(sprite, otherSprite){
    if(sprites.readDataBoolean(sprite, "InvinciblePower")){
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        info.changeScoreBy(25)
        return
    }
    if(sprite.bottom < otherSprite.y){
        sprite.vy = -100
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        info.changeScoreBy(25)
    } else {
        destroyPlayerSprite(sprite, 0, -70, 8)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.SpinEnemy, function(sprite, otherSprite){
    if (sprites.readDataBoolean(sprite, "InvinciblePower")) {
        return
    }
    destroyPlayerSprite(sprite, 0, -70, 8)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.MysteryEnemy, function(sprite, otherSprite){
    otherSprite.destroy(effects.disintegrate, 1000)
    music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

})
sprites.onOverlap(SpriteKind.Player, SpriteKind.MysteryEnemy, function(sprite, otherSprite){
    if (sprites.readDataBoolean(sprite, "InvinciblePower")) {
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        info.changeScoreBy(5)
        return
    }
    if(sprite.bottom < otherSprite.y){
        sprite.vy = -100
        otherSprite.destroy()
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

        info.changeScoreBy(25)
        createShellEnemy(otherSprite)
    } else {
        destroyPlayerSprite(sprite, 0, -70, 8)
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.ShellEnemy, function(sprite, otherSprite){
    sprite.destroy()
    music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)

    otherSprite.vy -= 100
    otherSprite.destroy(effects.disintegrate, 1000)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ShellEnemy, function(sprite, otherSprite){
    if (sprites.readDataBoolean(sprite, "InvinciblePower")) {
        otherSprite.destroy(effects.disintegrate, 1000)
        music.play(music.createSoundEffect(WaveShape.Triangle, 2430, 1, 255, 0, 400, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        info.changeScoreBy(5)
        return
    }
    if(Math.abs(otherSprite.vx) > 0){
        if(sprite.bottom < otherSprite.bottom){
            otherSprite.vx = 0
        } else {
            destroyPlayerSprite(sprite, 0, -70, 8)
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

sprites.onOverlap(SpriteKind.Player, SpriteKind.HeartPower, function(sprite, otherSprite){
    otherSprite.destroy()
    info.changeLifeBy(1)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.InvinciblePower, function(sprite, otherSprite){
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

    if (sprites.readDataBoolean(sprite, "InvinciblePower")) {
        return
    }
    sprites.setDataBoolean(sprite, "InvinciblePower", true)

    info.startCountdown(10)

})

sprites.onOverlap(SpriteKind.Player, SpriteKind.WallJumpPower, function (sprite, otherSprite) {
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

    if (sprites.readDataBoolean(sprite, "WallJumpPower")) {
        return
    }
    sprites.setDataBoolean(sprite, "WallJumpPower", true)

})
sprites.onOverlap(SpriteKind.Player, SpriteKind.GravityPower, function(sprite, otherSprite){
    otherSprite.destroy()
    resetPlayerPowerups()
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 825, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)

    if(sprites.readDataBoolean(sprite, "GravityPower")){
        return
    }
    sprites.setDataBoolean(sprite, "GravityPower", true)
    switchGravity()
})

function switchGravity() {
    isUpsideDown = true
    playerSprite.ay = -300
    info.startCountdown(15)
    createInvertedPlayerWalkingAnimation()
    createInvertedPlayerJumpingAnimation()
    createInvertPlayerIdleAnimation()
}

function generateTilemapPortals(){
    let portalSpawnTiles: tiles.Location[] = tiles.getTilesByType(assets.tile`portalSpawnTile`)
    
    let currentPortal: Sprite = null
    let previousPortal: Sprite = null 
    
    for (let count = 0; count < portalSpawnTiles.length; count++){
        currentPortal = createPortals(portalSpawnTiles[count])
        if(previousPortal){
            sprites.setDataSprite(previousPortal, "linkedPortal", currentPortal)
        }
        previousPortal = currentPortal
            
        tiles.setTileAt(portalSpawnTiles[count], img`
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
    sprites.setDataSprite(previousPortal, "linkedPortal", sprites.allOfKind(SpriteKind.Portal)[0])
    
}

function generateTilemapJumpPads(){
    for (let tileLocation of tiles.getTilesByType(assets.tile`jumpSpawnTile`)) {
        createJumpPad(tileLocation, "up")
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
    for (let tileLocation of tiles.getTilesByType(assets.tile`jumpRightSpawnTile`)) {
        createJumpPad(tileLocation, "right")
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
    for (let tileLocation of tiles.getTilesByType(assets.tile`jumpLeftSpawnTile`)) {
        createJumpPad(tileLocation, "left")
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

function generateTilemapSwitchWall(){
    let switchQuantity: number = tiles.getTilesByType(assets.tile`switchSpawnTile`).length
    let wallQuantity: number = tiles.getTilesByType(assets.tile`removableWallSpawnTile`).length
    
    if(wallQuantity <= 0){
        return
    }

    let wallSwitchRatio: number = Math.floor(switchQuantity / wallQuantity)

    let currentSwitches: Sprite[] = []
    let currentWalls: Sprite[] = []

    for (let tileLocation of tiles.getTilesByType(assets.tile`switchSpawnTile`)){
        let switchSprite: Sprite = createSwitch(tileLocation)
        tiles.setTileAt(tileLocation, assets.tile`transparentTile`)
        currentSwitches.push(switchSprite)
    }
    for (let tileLocation of tiles.getTilesByType(assets.tile`removableWallSpawnTile`)){
        let wallSprite: Sprite = createWall(tileLocation, wallSwitchRatio)
        tiles.setTileAt(tileLocation, assets.tile`transparentTile`)
        switchQuantity -= wallSwitchRatio
        wallQuantity -= 1
        if(wallQuantity > 0){
            wallSwitchRatio = Math.floor(switchQuantity / wallQuantity)
        }
        currentWalls.push(wallSprite)
    }
    console.log(currentSwitches)
    let wallSprite: Sprite = null
    while(currentWalls.length > 0){
        wallSprite = currentWalls.pop()
        if(!wallSprite){
            break
        }
        currentSwitches = currentSwitches.sort(sortByDistance)
        
        console.log(currentSwitches)
        let count: number = 0
        while (count < sprites.readDataNumber(wallSprite, "switchQuantity")){
            let switchSprite: Sprite = currentSwitches.pop()
            sprites.setDataSprite(switchSprite, "myWall", wallSprite)
            count++
        }
    }
    function sortByDistance(sprite1: Sprite, sprite2: Sprite): number{
        let length1: number = spriteutils.distanceBetween(wallSprite, sprite1)
        let length2: number = spriteutils.distanceBetween(wallSprite, sprite2)
        
        console.log(length1)
        console.log(length2)

        if (length1 < length2){
            return 1
        } else if (length1 >= length2){
            return -1
        } else {
            return 0
        }
    }
}

function generateTilemapShop(){
    for(let tileLocation of tiles.getTilesByType(assets.tile`shopSpawnTile`)){
        createShopSprite(tileLocation)
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
function generateTilemapKeys(){
    for (let tileLocation of tiles.getTilesByType(assets.tile`keySpawn`)) {
        createKey(tileLocation)
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
function generateTilemapChests(){
    for(let tileLocation of tiles.getTilesByType(assets.tile`chestTileSpawn`)){
        createChest(tileLocation)
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
function createKey(tileLocation: tiles.Location){
    let keySprite: Sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . 5 5 5 5 . . .
        . . . 5 5 5 5 5 5 5 . . 5 . . .
        . . . 5 . 5 . 5 . 5 . . 5 . . .
        . . . 5 . 5 . . . 5 5 5 5 . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Key)
    sprites.setDataNumber(keySprite, "delta", Math.randomRange(0, 12))
    tiles.placeOnTile(keySprite, tileLocation)
}
function createChest(tileLocation: tiles.Location){
    let chestSprite: Sprite = sprites.create(img`
        . . b b b b b b b b b b b b . .
        . b e 4 4 4 4 4 4 4 4 4 4 e b .
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e e 4 4 4 4 4 4 4 4 4 4 e e b
        b e e e e e e e e e e e e e e b
        b e e e e e e e e e e e e e e b
        b b b b b b b d d b b b b b b b
        c b b b b b b c c b b b b b b c
        c c c c c c b c c b c c c c c c
        b e e e e e c b b c e e e e e b
        b e e e e e e e e e e e e e e b
        b c e e e e e e e e e e e e c b
        b b b b b b b b b b b b b b b b
        . b b . . . . . . . . . . b b .
    `, SpriteKind.Chest)
    chestSprite.z = 0
    tiles.placeOnTile(chestSprite, tileLocation)
}

function createChestCollectibles(sprite: Sprite){
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
    collectibleSprite.setPosition(sprite.x, sprite.y)
    collectibleSprite.setVelocity(Math.randomRange(-50, 50), Math.randomRange(-125, -80))
    sprites.setDataNumber(collectibleSprite, "velocityY", collectibleSprite.vy)
    sprites.setDataNumber(collectibleSprite, "velocityX", collectibleSprite.vx)
    collectibleSprite.ay = 200
    // collectibleSprite.fx = 20
    collectibleSprite.setFlag(SpriteFlag.GhostThroughSprites, true)
    collectibleSprite.lifespan = 5000

    timer.after(750, function() {
        collectibleSprite.setFlag(SpriteFlag.GhostThroughSprites, false)
    })
}
scene.onHitWall(SpriteKind.Collectible, function(sprite, tileLocation){
    if(sprite.isHittingTile(CollisionDirection.Bottom)){
        if (Math.abs(sprites.readDataNumber(sprite, "velocityY"))  < 25 ){
            sprite.setVelocity(0, 0)
            return
        }
        sprite.vy = (0.5) * sprites.readDataNumber(sprite, "velocityY")
        sprite.vx = (0.5) * sprites.readDataNumber(sprite, "velocityX")

        sprites.setDataNumber(sprite, "velocityY", sprite.vy)
        sprites.setDataNumber(sprite, "velocityX", sprite.vx)
    }
    if(sprite.isHittingTile(CollisionDirection.Left) || sprite.isHittingTile(CollisionDirection.Right)){
        sprites.setDataNumber(sprite, "velocityX", sprite.vx)
        sprite.vx = (-1)*sprites.readDataNumber(sprite, "velocityX")
    }
})

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
game.onUpdate(function(){
    for(let sprite of sprites.allOfKind(SpriteKind.Key)){
        sprite.y += (0.5)*Math.sin(sprites.readDataNumber(sprite, "delta") + delta)
        
    }
    delta += 0.125
    delta = delta % 1000
    
})

game.onUpdate(function() {
    // console.log(currentLevel)
    // playerSprite.sayText(isUpsideDown)


    // scroller.scrollBackgroundWithSpeed(-0.25*playerSprite.vx, 0)
    
    if(levelSelect){
        return
    }
    if(isUpsideDown){
        if (playerSprite.vy < 0 && !isFalling) {
            timer.after(200, function () {
                isFalling = true
            })

        }
    } else if (playerSprite.vy > 0 && !isFalling) {
        timer.after(200, function () {
            isFalling = true
        })

    }



    
    if (playerSprite.isOutOfScreen(game.currentScene().camera) && !isTeleporting && !levelTransition){ 
        resetPlayerPowerups()
        placePlayerOnTilemap()
    }
    // Changing direction of powerups when they reach a side wall
    changeDirectionX(SpriteKind.Enemy)
    changeDirectionX(SpriteKind.MysteryEnemy)
    changeDirectionX(SpriteKind.ShellEnemy)
    
    for(let powerKind of powerUpObject["kind"]){
        changeDirectionX(powerKind)
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
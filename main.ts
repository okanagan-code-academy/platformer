namespace SpriteKind {
    export const Collectible = SpriteKind.create()
    export const Box = SpriteKind.create()
    export const GrowPower = SpriteKind.create()
    export const Tile = SpriteKind.create()
    export const ShootPower = SpriteKind.create()
}
let level: number = -1
let jumps: number = 0
let playerSprite: Sprite = null
let isFalling: boolean = false
info.setScore(0)

function selectLevel() {
    scene.setBackgroundColor(9)
    if (level == -1) {
        tiles.setTilemap(tilemap`test`)
        createCollectiblesOnTilemap()
    }
    createPlayer()
}
selectLevel()

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
    controller.moveSprite(playerSprite, 100, 0)
    playerSprite.ay = 300
    createPlayerWalkingAnimation()
    createPlayerJumpingAnimation()
    createPlayerIdleAnimation()
    resetPlayerPowerups()
    tiles.placeOnRandomTile(playerSprite, assets.tile`spawnTile`)
}
function resetPlayerPowerups(){
    playerSprite.scale = 1
    sprites.setDataBoolean(playerSprite, "GrowPower", false)
    sprites.setDataBoolean(playerSprite, "ShootPower", false)
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
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . e e e e e e e e e 4 . . .
            . . . f f f f f f f f f . . . .
            . . . . f f f . . . . . . . . .
            . . . f f f . . . . . . . . . .
            . . f f f . . . . . . . . . . .
            . . f f . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        ],
    "kind" : [
        SpriteKind.GrowPower,
        SpriteKind.ShootPower,
    ]
}
// A function to create a Powerup
function createPowerUp(powerUpType: number, targetLocation: tiles.Location){
    let powerUpSprite: Sprite = sprites.create(powerUpObject["image"][powerUpType], powerUpObject["kind"][powerUpType])
    powerUpSprite.ay = 300
    powerUpSprite.setVelocity(Math.randomRange(-50, -25), -100)
    tiles.placeOnTile(powerUpSprite, targetLocation)
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jumps > 0 && !isFalling){
        isFalling = true
        playerSprite.vy = -200
        jumps -= 1
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function(){
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
        }
        if (tiles.tileAtLocationEquals(location, assets.tile`depletedTile`)){
            hitPowerBox(assets.tile`depletedTile`, location)
        }
        if (tiles.tileAtLocationEquals(location, assets.tile`stoneUnbreakable`)){
            if(sprites.readDataBoolean(sprite, "GrowPower")){
                destroyTile(assets.tile`stoneUnbreakable`, location)
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
        }
    }
})

function destroyTile(tileImage: Image, targetLocation: tiles.Location){
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
    tileSprite.vy = -50
    tileSprite.destroy(effects.disintegrate, 150)

}


// Update checkpoint once player overlaps
scene.onOverlapTile(SpriteKind.Player, assets.tile`checkPointTile`, function(sprite, location){
    for(let tileLocation of tiles.getTilesByType(assets.tile`spawnTile`)){
        tiles.setTileAt(tileLocation, assets.tile`checkPointTile`)
    }
    tiles.setTileAt(location, assets.tile`spawnTile`)
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
function destroySprite(sprite: Sprite, velocityX: number, velocityY: number, cameraShakeStrength: number){
    sprite.vx = 70
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprites.destroy(sprite, effects.none, 1000)
    scene.cameraShake(cameraShakeStrength, 500)
}

sprites.onDestroyed(SpriteKind.Player, function(sprite){
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


sprites.onOverlap(SpriteKind.Player, SpriteKind.Collectible, function(sprite, otherSprite){
    sprites.destroy(otherSprite)
    info.changeScoreBy(5)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.GrowPower, function(sprite, otherSprite){
    otherSprite.destroy()
    if(sprites.readDataBoolean(sprite, "GrowPower")){
        return
    }
    sprites.setDataBoolean(sprite, "GrowPower", true)
    sprite.scale = 1.5
    sprite.vy = -100
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ShootPower, function (sprite, otherSprite) {
    otherSprite.destroy()
    if (sprites.readDataBoolean(sprite, "ShootPower")) {
        return
    }
    sprites.setDataBoolean(sprite, "ShootPower", true)
})

function createCollectiblesOnTilemap(){
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
game.onUpdate(function() {
    if(playerSprite.vy > 0){
        isFalling = true
    }
    for(let powerUp of sprites.allOfKind(SpriteKind.GrowPower)){
        if (powerUp.isHittingTile(CollisionDirection.Left)){
            powerUp.vx = Math.randomRange(25, 50)
        } else if (powerUp.isHittingTile(CollisionDirection.Right)){
            powerUp.vx = Math.randomRange(-50, -25)
        }
    }
    for (let powerUp of sprites.allOfKind(SpriteKind.ShootPower)) {
        if (powerUp.isHittingTile(CollisionDirection.Left)) {
            powerUp.vx = Math.randomRange(25, 50)
        } else if (powerUp.isHittingTile(CollisionDirection.Right)) {
            powerUp.vx = Math.randomRange(-50, -25)
        }
    }
    // playerSprite.sayText(isFalling)
    if(tiles.getTilesByType(assets.tile`luckyTile`).length <= 0) {
        tiles.setTileAt(tiles.getTilesByType(assets.tile`depletedTile`)._pickRandom(), assets.tile`luckyTile`)
    }

})

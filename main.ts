namespace SpriteKind {
    export const Gas = SpriteKind.create()
    export const BackgroundCharacter = SpriteKind.create()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // Placeholder code to use when importing graphics in Javascript mode using process described here....
    // 
    // https://learn.adafruit.com/next-level-makecode-arcade-games/asset-tool
    mySprite = sprites.create(assets.image`Ship3`, 0)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    timeSinceLastShot = game.runtime() - timeOfShot
    if (timeSinceLastShot > shotDelay) {
        timeOfShot = game.runtime()
        projectile = sprites.createProjectileFromSprite(assets.image`Red Laser 1`, mySprite, 0, -130)
        music.knock.play()
        if (info.score() > 0) {
            info.changeScoreBy(-1)
        }
    }
})
sprites.onOverlap(SpriteKind.Gas, SpriteKind.Projectile, function (sprite, otherSprite) {
    sprite.destroy(effects.hearts, 100)
    otherSprite.destroy()
    music.bigCrash.play()
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    sprite.destroy(effects.ashes, 100)
    otherSprite.destroy()
    info.changeScoreBy(3)
    music.smallCrash.play()
})
function createShip () {
    pause(500)
    mySprite = sprites.create(assets.image`Ship2`, SpriteKind.Player)
    mySprite.startEffect(effects.halo, 500)
    mySprite.x = randint(5, 155)
    mySprite.y = 100
    controller.moveSprite(mySprite)
    mySprite.setStayInScreen(true)
    statusbar = statusbars.create(12, 2, StatusBarKind.Energy)
    statusbar.attachToSprite(mySprite, -28, 0)
    statusbar.setColor(5, 2)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Gas, function (sprite, otherSprite) {
    // This sets the amount of fuel each donut that is captured will refuel the ship
    statusbar.value += 35
    otherSprite.destroy(effects.spray, 100)
    music.beamUp.play()
})
function splashScreen () {
    scene.setBackgroundImage(assets.image`SciFiSplash2`)
    game.setDialogTextColor(10)
    game.showLongText("WELCOME SCI-FI SOLDIER", DialogLayout.Bottom)
    game.showLongText("The year is 4680.... Time to GET MORE DOWN!", DialogLayout.Bottom)
}
statusbars.onZero(StatusBarKind.Energy, function (status) {
    info.changeLifeBy(-1)
    mySprite.destroy(effects.disintegrate, 200)
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.destroy()
    }
    music.zapped.play()
    if (info.life() > 0) {
        createShip()
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    statusbar.value = 100
    otherSprite.destroy(effects.spray, 500)
    sprite.destroy(effects.disintegrate, 500)
    music.pewPew.play()
    if (info.life() > 0) {
        pause(1000)
        createShip()
    }
})
// on start:
// trigger function splashScreen to display background graphics and instructions for the game
// Set initial state of variables
// trigger createShip function to spawn the spaceship
//  
// 
let fuel_tone = 0
let myFuel: Sprite = null
let myEnemy: Sprite = null
let statusbar: StatusBarSprite = null
let projectile: Sprite = null
let timeOfShot = 0
let mySprite: Sprite = null
let shotDelay = 0
let timeSinceLastShot = 0
splashScreen()
timeSinceLastShot = 0
shotDelay = 350
info.setLife(3)
info.setScore(0)
scene.setBackgroundImage(assets.image`Planet Bgnd`)
effects.starField.startScreenEffect()
let myEnemyCurrentVY = 50
let enemySpawnTimer = 1500
createShip()
game.onUpdateInterval(enemySpawnTimer, function () {
    myEnemy = sprites.createProjectileFromSprite(assets.image`Ghost`, mySprite, randint(-10, 10), myEnemyCurrentVY * randint(0.8, 1.3))
    myEnemy.x = randint(5, 155)
    myEnemy.y = 0
    myEnemy.setKind(SpriteKind.Enemy)
})
game.onUpdateInterval(4000, function () {
    myFuel = sprites.createProjectileFromSide(assets.image`DonutFuel`, 0, 20)
    myFuel.x = randint(5, 155)
    myFuel.setKind(SpriteKind.Gas)
})
game.onUpdateInterval(300, function () {
    statusbar.value += -2
    if (info.life() <= 0) {
        game.over(false)
    }
    if (statusbar.value < 25) {
        music.playTone(fuel_tone, music.beat(BeatFraction.Sixteenth))
        fuel_tone += -5
    } else {
        fuel_tone = 260
    }
    myEnemyCurrentVY += 0.25
})

@namespace
class SpriteKind:
    Gas = SpriteKind.create()
    BackgroundCharacter = SpriteKind.create()

def on_b_pressed():
    global mySprite
    mySprite = sprites.create(assets.image("""
        Ship3
    """), 0)
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

def on_a_pressed():
    global timeSinceLastShot, timeOfShot, projectile
    timeSinceLastShot = game.runtime() - timeOfShot
    if timeSinceLastShot > shotDelay:
        timeOfShot = game.runtime()
        projectile = sprites.create_projectile_from_sprite(assets.image("""
            Red Laser 1
        """), mySprite, 0, -130)
        music.knock.play()
        if info.score() > 0:
            info.change_score_by(-1)
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_on_overlap(sprite, otherSprite):
    sprite.destroy(effects.hearts, 100)
    otherSprite.destroy()
    music.big_crash.play()
sprites.on_overlap(SpriteKind.Gas, SpriteKind.projectile, on_on_overlap)

def on_on_overlap2(sprite2, otherSprite2):
    sprite2.destroy(effects.ashes, 100)
    otherSprite2.destroy()
    info.change_score_by(3)
    music.small_crash.play()
sprites.on_overlap(SpriteKind.enemy, SpriteKind.projectile, on_on_overlap2)

def createShip():
    global mySprite, statusbar
    pause(500)
    mySprite = sprites.create(assets.image("""
        Ship2
    """), SpriteKind.player)
    mySprite.start_effect(effects.halo, 500)
    mySprite.x = randint(5, 155)
    mySprite.y = 100
    controller.move_sprite(mySprite)
    mySprite.set_stay_in_screen(True)
    statusbar = statusbars.create(12, 2, StatusBarKind.energy)
    statusbar.attach_to_sprite(mySprite, -28, 0)
    statusbar.set_color(5, 2)

def on_on_overlap3(sprite3, otherSprite3):
    statusbar.value += 25
    otherSprite3.destroy(effects.spray, 100)
    music.beam_up.play()
sprites.on_overlap(SpriteKind.player, SpriteKind.Gas, on_on_overlap3)

def splashScreen():
    scene.set_background_image(assets.image("""
        SciFiSplash2
    """))
    game.set_dialog_text_color(10)
    game.show_long_text("WELCOME SCI-FI SOLDIER", DialogLayout.BOTTOM)
    game.show_long_text("The year is 4680.... Time to GET MORE DOWN!",
        DialogLayout.BOTTOM)

def on_on_zero(status):
    info.change_life_by(-1)
    mySprite.destroy(effects.disintegrate, 200)
    for value in sprites.all_of_kind(SpriteKind.enemy):
        value.destroy()
    music.zapped.play()
    if info.life() > 0:
        createShip()
statusbars.on_zero(StatusBarKind.energy, on_on_zero)

def on_on_overlap4(sprite4, otherSprite4):
    info.change_life_by(-1)
    statusbar.value = 100
    otherSprite4.destroy(effects.spray, 500)
    sprite4.destroy(effects.disintegrate, 500)
    music.pew_pew.play()
    if info.life() > 0:
        pause(1000)
        createShip()
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, on_on_overlap4)

myFuel: Sprite = None
myEnemy: Sprite = None
statusbar: StatusBarSprite = None
projectile: Sprite = None
timeOfShot = 0
mySprite: Sprite = None
shotDelay = 0
timeSinceLastShot = 0
splashScreen()
timeSinceLastShot = 0
shotDelay = 350
info.set_life(3)
info.set_score(0)
scene.set_background_image(assets.image("""
    Planet Bgnd
"""))
effects.star_field.start_screen_effect()
myEnemyCurrentVY = 50
enemySpawnTimer = 1500
createShip()

def on_update_interval():
    global myEnemy
    myEnemy = sprites.create_projectile_from_sprite(assets.image("""
            Ghost
        """),
        mySprite,
        randint(-10, 10),
        myEnemyCurrentVY * randint(0.8, 1.3))
    myEnemy.x = randint(5, 155)
    myEnemy.y = 0
    myEnemy.set_kind(SpriteKind.enemy)
game.on_update_interval(enemySpawnTimer, on_update_interval)

def on_update_interval2():
    global myFuel
    myFuel = sprites.create_projectile_from_side(assets.image("""
        DonutFuel
    """), 0, 20)
    myFuel.x = randint(5, 155)
    myFuel.set_kind(SpriteKind.Gas)
game.on_update_interval(4000, on_update_interval2)

def on_update_interval3():
    global myEnemyCurrentVY
    statusbar.value += -2
    if info.life() <= 0:
        game.over(False)
    myEnemyCurrentVY += 0.25
game.on_update_interval(200, on_update_interval3)

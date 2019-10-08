let cursors
let player
let ground
let items
let score = 0

class SceneMain extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("map.json", "../assets/map.json")
    this.load.image("tiles.png", "../assets/tiles.png")

    // let x
    // x = this.textures.createCanvas("player.png", 16, 16)
    // x.context.fillStyle = "#cccccc"
    // x.context.fillRect(0, 0, 16, 16)
    // x.refresh()

    this.load.spritesheet("player.png", "../assets/player.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 1,
    })
  }

  create() {
    cursors = this.input.keyboard.createCursorKeys()

    const map = this.add.tilemap("map.json")
    const tiles = map.addTilesetImage("tiles", "tiles.png")
    map.createStaticLayer("background", tiles)
    ground = map.createDynamicLayer("ground", tiles)
    ground.setCollisionByExclusion([-1])
    this.physics.world.bounds.width = ground.width
    this.physics.world.bounds.height = ground.height
    items = map.createDynamicLayer("items", tiles)
    items.setTileIndexCallback(37, this.collectDiamond)
    items.setTileIndexCallback(47, this.collectTreasure)

    const spawn = map.findObject("objects", obj => obj.name === "spawn")
    player = this.physics.add.sprite(spawn.x, spawn.y, "player.png")
    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player.png", {
        start: 0,
        end: 3,
      }),
      frameRate: 3,
      repeat: -1,
    })
    this.anims.create({
      key: "player-run",
      frames: this.anims.generateFrameNumbers("player.png", {
        start: 8,
        end: 15,
      }),
      frameRate: 12,
      repeat: -1,
    })
    player.setCollideWorldBounds(true)
    this.physics.add.collider(player, ground)
    this.physics.add.overlap(player, items)

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(player)
  }

  update() {
    // auto
    // player.body.setVelocityX(100)
    // manual
    if (cursors.left.isDown) {
      player.body.setVelocityX(-100)
      player.setFlipX(true)
      player.anims.play("player-run", true)
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(100)
      player.setFlipX(false)
      player.anims.play("player-run", true)
    } else {
      player.body.setVelocityX(0)
      player.anims.play("player-idle", true)
    }

    if (cursors.space.isDown && player.body.onFloor()) {
      player.body.setVelocityY(-200)
    }
    if (!player.body.onFloor()) {
      player.anims.stop()
      player.setTexture("player.png", 10)
    }

    if (player.y + player.height / 2 >= ground.height) {
      this.scene.restart()
    }
  }

  collectDiamond(_, diamond) {
    items.removeTileAt(diamond.x, diamond.y)
    score += 10
    console.log(score)
  }
  collectTreasure(_,treasure) {
    items.removeTileAt(treasure.x, treasure.y)
    score += 100
    console.log(score)
    console.log('finished')
    alert('finished')
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  pixelArt: true,
  zoom: 2,
  parent: "game",
  scene: SceneMain,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 550 },
      // debug: true,
    },
  },
})

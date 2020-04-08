export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("standing", "assets/images/standing.png");
    this.load.image("background", "assets/images/desert.png");
    
    this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");

    this.load.spritesheet("attack", "assets/spritesheets/attack.png",{
      frameWidth: 50,
      frameHeight: 35
    });
    
    this.load.spritesheet("idle", "assets/spritesheets/idle.png",{
      frameWidth: 50,
      frameHeight: 35
    });

    this.load.spritesheet("knight-idle", "assets/spritesheets/knight-idle.png",{
      frameWidth: 90,
      frameHeight: 45
    });

    this.load.spritesheet("knight-attack", "assets/spritesheets/knight-attack.png",{
      frameWidth: 90,
      frameHeight: 45
    });

  }

  create() {
    this.scene.start('MainScene');
     

    this.anims.create({
      key: "attack_anim",
      frames: this.anims.generateFrameNumbers("attack", { start: 0, end: 4}),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "idle_anim",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 1}),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "knight-idle",
      frames: this.anims.generateFrameNumbers("knight-idle", { start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "knight-attacl",
      frames: this.anims.generateFrameNumbers("knight-attack", { start: 0, end: 4}),
      frameRate: 5,
      repeat: -1
    });
  }
}

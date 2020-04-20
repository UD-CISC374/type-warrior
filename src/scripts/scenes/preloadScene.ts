import Player from "../objects/player";

export default class PreloadScene extends Phaser.Scene {
  private commands: Map<string, [string, boolean, number]>;
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("standing", "assets/images/standing.png");
    this.load.image("background", "assets/images/desert.png");
    this.load.image("shop_background", "assets/images/shop_background.jpg");

    this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");

    this.load.spritesheet("sword-attack", "assets/spritesheets/sword-attack.png", {
      frameWidth: 50,
      frameHeight: 35
    });

    this.load.spritesheet("attack", "assets/spritesheets/punch.png", {
      frameWidth: 47,
      frameHeight: 25
    });

    this.load.spritesheet("idle", "assets/spritesheets/idle.png", {
      frameWidth: 50,
      frameHeight: 35
    });

    this.load.spritesheet("knight-idle", "assets/spritesheets/knight-idle.png", {
      frameWidth: 90,
      frameHeight: 45
    });

    this.load.spritesheet("knight-attack", "assets/spritesheets/knight-attack.png", {
      frameWidth: 90,
      frameHeight: 60
    });

    this.load.spritesheet("magic_cast", "assets/spritesheets/magic_cast.png", {
      frameWidth: 50,
      frameHeight: 30
    });

  }

  create() {
    this.anims.create({
      key: "sword-attack_anim",
      frames: this.anims.generateFrameNumbers("sword-attack", { start: 0, end: 4 }),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "attack_anim",
      frames: this.anims.generateFrameNumbers("attack", { start: 0, end: 4 }),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "idle_anim",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "knight-idle",
      frames: this.anims.generateFrameNumbers("knight-idle", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "knight-attack",
      frames: this.anims.generateFrameNumbers("knight-attack", { start: 0, end: 4 }),
      frameRate: 5,
      repeat: 0
    });

    this.anims.create({
      key: "magic_anim",
      frames: this.anims.generateFrameNumbers("magic_cast", {}),
      frameRate: 7,
      repeat: 0
    });

    //declaring commands
    this.commands = new Map();

    // misc commands
    this.commands.set("help", ["Brings up command list", true, 0]);
    this.commands.set("fight onward!", ["Move to next level", true, 0]);
    this.commands.set("shop!", ["Transports you to a shop to upgrade your hero", true, 0]);
    this.commands.set("shop list!", ["While in shop shows you available purchases", true, 0]);


    // movement commands
    this.commands.set("move left", ["Move your character to the left", true, 0]);
    this.commands.set("move right", ["Move your character to the right", true, 0]);
    this.commands.set("move forward", ["Advance your character forwards", true, 0]);
    this.commands.set("move backward", ["Retreat backwards", true, 0]);
    this.commands.set("turn around", ["Rotate your character 180", true, 0]);



    // default attack commands (punches)
    this.commands.set("attack left", ["attack to the left direction", true, 0]);
    this.commands.set("attack right", ["attack to the right direction", true, 0]);
    this.commands.set("attack forward", ["attack in front", true, 0]);
    this.commands.set("attack backward", ["attack behind you", true, 0]);
    this.commands.set("block", ["Take 0 damage until another command is entered", true, 0]);

    // purchasable commands
    // sword commands
    this.commands.set("attack left with sword", ["attack to the left direction", false, 100]);
    this.commands.set("attack right with sword", ["attack to the right direction with a sword", false, 100]);
    this.commands.set("attack forward with sword", ["attack in front", false, 100]);
    this.commands.set("attack backward with sword", ["attack behind you", false, 100]);

    // start the main scene and pass it the commands list
    let start_level:number = 1;
    this.scene.start('MainMenuScene', { commands: this.commands, level: start_level });
  }
}

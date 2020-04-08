import ExampleObject from '../objects/exampleObject';


export default class MainScene extends Phaser.Scene {
  private player;
  private background: Phaser.GameObjects.TileSprite;
  private words: string;
  private health: integer;
  private wordLabel: Phaser.GameObjects.BitmapText;
  private healthLabel: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    //this.player = this.add.image(this.scale.width / 2 - 50, this.scale.height / 2 - 20, "standing");
    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "idle");
    this.player.play("idle_anim");



    this.player.setScale(2, 2);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    for(let i : number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
      this.input.keyboard.addKey(i);
    }

    this.words = "";
    this.health = 100;
    this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
    this.healthLabel = this.add.bitmapText(this.scale.width - 75, 5, "pixelFont", "health", 16);
  }

  update() {
    //this.player.play("idle_anim");

    this.wordLabel.text = "Command:    " + this.words;
    this.healthLabel.text = "Health: " + this.health;
    this.addLetters();
    this.movePlayer();
   // this.player.play("idle_anim");
  }

  addLetters() {
    let key_a : number = Phaser.Input.Keyboard.KeyCodes.A;
    let key_z : number = Phaser.Input.Keyboard.KeyCodes.Z;
    
    for(let i : number = key_a; i <= key_z; i++) {
      if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[i])) {
        this.words += String.fromCharCode(i+32);
        return;
      }
    }

    if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.SPACE])) {
      this.words += " ";
      return;
    }

    if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.BACKSPACE])) {
      this.words = "";
      return;
    }
  }

  movePlayer() {
    if (this.words == "move left") {
      this.player.x -= 25;
      this.words = "";
      this.player.play("idle_anim");
    }

    if (this.words == "move right") {
      this.player.x += 25;
      this.words = "";
      this.player.play("idle_anim");
    }

    if(this.words == "attack"){
      //this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "idle");
      this.player.play("attack_anim");
      
      //this.player.play("idle_anim");
      //AnimationTimeline
      this.words = "";
    }
  }
}
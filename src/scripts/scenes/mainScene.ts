import ExampleObject from '../objects/exampleObject';


export default class MainScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Image;
  private background: Phaser.GameObjects.TileSprite;
  private words: string;
  private wordLabel: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    this.player = this.add.image(this.scale.width / 2 - 50, this.scale.height / 2 - 20, "standing");

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    for(let i : number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
      this.input.keyboard.addKey(i);
    }

    this.words = "";

    this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
  }

  update() {
    this.wordLabel.text = "Command:    " + this.words;
    this.addLetters();
    this.movePlayer();
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
    }

    if (this.words == "move right") {
      this.player.x += 25;
      this.words = "";
    }
  }
}
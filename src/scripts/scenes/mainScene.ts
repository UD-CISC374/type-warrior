import Player from '../objects/player';
import command from '../objects/command';

export default class MainScene extends Phaser.Scene {
  private player: Player;
  private knight: Phaser.Physics.Arcade.Sprite;
  private enemy_exists: boolean;

  private background: Phaser.GameObjects.TileSprite;
  private words: string;
  private wordLabel: Phaser.GameObjects.BitmapText;
  private healthLabel: Phaser.GameObjects.BitmapText;
  private EnemyisFlipped: boolean;
  private enemy_health: number;
  
 
  private allComs: Array<command>;
  private commands: string[];
  private commandDisplay: Phaser.GameObjects.BitmapText;
  
  //list of commands
  private helpC: command;
  private shopC: command;
  private leftC: command;
  private rightC: command;
  private forwardC: command;
  private backwardC: command;
  private turnaC: command;
  private aleftC: command;
  private arightC: command;
  private aforwardC: command;
  private abackwardC: command;


  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    this.knight = this.physics.add.sprite(250, 100, "knight-idle");
    this.knight.play("knight-idle");
    this.enemy_health = 10;
    this.enemy_exists = true;
    this.player = new Player(this, this.scale.width / 2 - 8, this.scale.height - 64);
    

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    for (let i: number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
      this.input.keyboard.addKey(i);
    }

    this.words = "";
    //declaring commands
    this.allComs = [];
    this.commands = [""];

    this.helpC = new command("help", "Brings up command list", true); 
    this.allComs.push(this.helpC);

    this.leftC = new command("move left", "Move your character to the left", true);
    this.allComs.push(this.leftC);

    this.rightC = new command("move right", "Move your character to the right", true);
    this.allComs.push(this.rightC);

    this.forwardC = new command("move forward", "Advance your character forwards", true);
    this.allComs.push(this.forwardC);

    this.backwardC = new command("move backward", "Retreat backwards", true);
    this.allComs.push(this.backwardC);
    
    this.turnaC = new command("turn around", "Rotate your character 180", true);
    this.allComs.push(this.turnaC);

    this.aleftC = new command("attack left", "attack to the left direction", true);
    this.allComs.push(this.aleftC);

    this.arightC = new command("attack right", "attack to the right direction", true);
    this.allComs.push(this.arightC);

    this.aforwardC = new command("attack forward", "attack in front", true);
    this.allComs.push(this.aforwardC);

    this.abackwardC = new command("attack backward", "attack behind you", true);
    this.allComs.push(this.abackwardC);

    this.shopC = new command("shop!", "Transports you to a shop to upgrade your hero", true);
    this.allComs.push(this.shopC);
   // this.commands = ["\n" + "move forward" + "\n" + "move left" + 
   // "\n" + "move right" + "\n" + "attack left" + "\n" + "attack right"];

    for(let i = 0; i < this.allComs.length; i++){
      if(this.allComs[i].isUnlocked() == true){
        this.commands = [this.commands + "\n" + this.allComs[i].getName() + " : " + this.allComs[i].getDescrip()];
      }
    }
    this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
    this.healthLabel = this.add.bitmapText(this.scale.width - 75, 5, "pixelFont", "health", 16);
    this.commandDisplay = this.add.bitmapText(10, 15, "pixelFont", "display", 16);
    this.commandDisplay.tint = 0x00000;
  }

  update() {
    
    this.commandDisplay.setVisible(false);
    this.wordLabel.text = "Command:    " + this.words;
    this.healthLabel.text = "Health: " + this.enemy_health;//this.player.get_health();
    this.commandDisplay.text = "Commands: " + this.commands;
    this.addLetters();

    this.hit_enemy();

    if (this.player.movePlayer(this.words)) {
      this.words = "";
    }

    if (this.words == "fight onward!" && !this.enemy_exists) {
      this.knight.x = 250;
      this.knight.y = 100;
      this.knight.setVisible(true);
      this.enemy_health = 100;
      this.enemy_exists = true;
      this.words = "";
    }

    if (this.words == "shop!") {
      this.scene.start('ShopScene', { player: this.player });
    }

    if (this.words == this.helpC.getName()){
      this.commandDisplay.setVisible(true);
    }

    this.moveEnemies();
  }

  moveEnemies() {
    if (this.knight.x < this.player.x - 25) {
      this.knight.x += .05;
      if (this.EnemyisFlipped) { this.knight.setFlipX(false); this.EnemyisFlipped = false; }
    } else if (this.knight.x > this.player.x + 25) {
      this.knight.x -= .05;
      if (!this.EnemyisFlipped) { this.knight.setFlipX(true); this.EnemyisFlipped = true; }

    }
    if (this.knight.y < this.player.y - 25) {
      this.knight.y += .05;
    } else if (this.knight.y > this.player.y + 25) {
      this.knight.y -= .05;
    }
  }

  addLetters() {
    let key_a: number = Phaser.Input.Keyboard.KeyCodes.A;
    let key_z: number = Phaser.Input.Keyboard.KeyCodes.Z;

    for (let i: number = key_a; i <= key_z; i++) {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[i])) {
        this.words += String.fromCharCode(i + 32);
        return;
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.SPACE])) {
      this.words += " ";
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.BACKSPACE])) {
      this.words = "";
      return;
    }

    if (this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.SHIFT].isDown &&
      Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ONE])) {
      this.words += "!";
      return;
    }
  }

  hit_enemy() {
    if ((this.words == "attack right") && (this.knight.x > this.player.x) && (this.knight.x < this.player.x + 50) &&
      (this.knight.y < this.player.y + 25) && (this.knight.y > this.player.y - 25)) {
      this.enemy_health -= 10;
    } else if ((this.words == "attack left") && (this.knight.x < this.player.x) && (this.knight.x > this.player.x - 50) &&
      (this.knight.y < this.player.y + 25) && (this.knight.y > this.player.y - 25)) {
      this.enemy_health -= 10;
    } else if ((this.words == "attack forward") && (this.knight.y < this.player.y) && (this.knight.y > this.player.y - 50) &&
      (this.knight.x < this.player.x + 25) && (this.knight.x > this.player.x - 25)) {
      this.enemy_health -= 10;
    } else if ((this.words == "attack backward") && (this.knight.y > this.player.y) && (this.knight.y < this.player.y + 50) &&
      (this.knight.x < this.player.x + 25) && (this.knight.x > this.player.x - 25)) {
      this.enemy_health -= 10;
    }

    if (this.enemy_health <= 0) {
      this.knight.setVisible(false);
      this.knight.x = -50;
      this.knight.y = -50;
      this.enemy_exists = false;
    }
  }
}
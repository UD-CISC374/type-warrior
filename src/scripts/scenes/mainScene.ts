import Player from '../objects/player';


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

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    this.knight = this.physics.add.sprite(250, 100, "knight-attack");
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
    this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
    this.healthLabel = this.add.bitmapText(this.scale.width - 75, 5, "pixelFont", "health", 16);
  }

  update() {

    this.wordLabel.text = "Command:    " + this.words;
    this.healthLabel.text = "Health: " + this.enemy_health;//this.player.get_health();
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
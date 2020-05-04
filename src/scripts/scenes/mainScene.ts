import Player from '../objects/player';
import Enemy from '../objects/enemy';
import Fireball from '../objects/fireball';

export default class MainScene extends Phaser.Scene {
  // the player
  private player: Player;

  // the current enemy
  private current_enemy: Enemy;
  private enemies: Array<Enemy>;
  // the background
  private background: Phaser.GameObjects.TileSprite;

  // the players typing input as a string
  private words: string;

  // the bitmap texts that display to the screen
  private wordLabel: Phaser.GameObjects.BitmapText;
  private healthLabel: Phaser.GameObjects.BitmapText;
  private commandDisplay: Phaser.GameObjects.BitmapText;
  private coinDisplay: Phaser.GameObjects.BitmapText;
  private levelDisplay: Phaser.GameObjects.BitmapText;
  private WPMLabel: Phaser.GameObjects.BitmapText;
  private fightDisplay: Phaser.GameObjects.BitmapText;
  private suggestDisplay: Phaser.GameObjects.BitmapText;
  private suggestCommandsDisplay: Phaser.GameObjects.BitmapText;
  private critDisplay: Phaser.GameObjects.BitmapText;

  // Command storage 
  private commands: string[];
  private command_map: Map<string, [string, boolean]>;
  private store_map: Map<string, number>;
  private suggestedCommands: string[];

  // time tracker for the enemy attack delay
  private timeAttack: number;

  // the level the player is currently on
  private level: number;

  // time tracker for WPM
  private timeWPM: number;

  // the last tracked WPM of the player
  private WPM: number;
  private numCommands: number;
  private typos: number;

  private tintTime: number;

  // fireball group
  private fireballs: Phaser.GameObjects.Group;

  // the constructor for the scene
  constructor() {
    super({ key: 'MainScene' });
  }

  // init function. Allows passing the player object between scenes
  init(data) {
    // initiate the background as the back most image
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    // inititates the enemy over top the background
    this.enemies = [];

    // check if the player is passed from another scene
    if (data.player == undefined) {
      // if the player isn't passed, initiate the default player
      // temporary variables to get the data from the passed map
      let temp_player: Player = new Player(this, this.scale.width / 2 - 8, this.scale.height - 64);
      let temp_shopCom: Map<string, number> = new Map();
      let temp_commands: Map<string, [string, boolean]> = new Map();
      // for each loop to get the data from the passed map
      data.commands.forEach(function (value, key) {
        if (value[1]) {
          // if the command is true or available to use it is added to the players command list
          temp_player.add_command(key, value[1]);
        } else {
          // otherwise it is added to the shop list
          temp_shopCom.set(key, value[2]);
        }
        // adds all the passed commands to the scenes list of all commands
        temp_commands.set(key, [value[0], value[1]]);
      });
      // sets the scenes variables to the temporary variables used for the for each loop
      this.command_map = temp_commands;
      this.store_map = temp_shopCom;
      this.player = temp_player;
    } else {
      // if the player is passed from another scene, create the player over top the background
      this.player = new Player(this, data.player.x, data.player.y);
      // use the function in the player object to transfer all the important data from the passed player to the scene's player
      this.player.make_player(data.player);
      // updates the scenes command list
      this.update_commands();
    }
    this.level = data.level;
    this.typos = 0;
  }

  // create function for the scene
  create() {
    // set the start numCommands to 0
    this.numCommands = 0;

    // add the necessary input keys for the player to type
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    for (let i: number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
      this.input.keyboard.addKey(i);
    }

    // initiate the words to an empty string
    this.words = "help";

    // initiate the player words per minute to 0
    this.WPM = 0;

    // inititates the comms string to use for the command display
    let comms: string[] = [""];
    this.command_map.forEach(function (value, key) {
      if (value[1]) {
        comms = [comms + "\n" + key + " : " + value[0]];
      }
    });
    this.commands = comms;

    // inititate the bitmaps to display
    this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
    this.healthLabel = this.add.bitmapText(this.scale.width - 75, 5, "pixelFont", "health", 16);
    this.commandDisplay = this.add.bitmapText(10, 40, "pixelFont", "display", 16);
    this.commandDisplay.tint = 0x00000;
    this.suggestCommandsDisplay = this.add.bitmapText(10, 25, "pixelFont", "Suggested: ", 16);

    this.coinDisplay = this.add.bitmapText(this.scale.width - 175, 5, "pixelFont", "Coins", 16);
    this.coinDisplay.setText("Coins: " + this.player.get_coins());
    this.levelDisplay = this.add.bitmapText(this.scale.width - 175, 25, "pixelFont", "Coins", 16);
    this.timeAttack = this.time.now;
    this.WPMLabel = this.add.bitmapText(10, this.scale.height - 10, "pixelFont", "WPM:", 16);
    this.WPMLabel.tint = 0x00000;
    this.fightDisplay = this.add.bitmapText(0, this.scale.height - 170, "pixelFont", "'fight onward!' to continue", 40);
    this.fightDisplay.setVisible(false);
    this.fightDisplay.tint = 0x00000;
    this.suggestDisplay = this.add.bitmapText(10, this.scale.height - 30, "pixelFont", "try 'shop' or 'help", 20);
    this.suggestDisplay.tint = 0x00000;
    this.critDisplay = this.add.bitmapText(this.scale.width - 175, this.scale.height - 10, "pixelFont", "WPM OVER 90; CRIT ACTIVATED", 16);
    this.critDisplay.tint = 0x000000;
    this.critDisplay.setVisible(false);

    // inititate fireballs group
    this.fireballs = this.add.group();
    this.fireballs.runChildUpdate = true;

    this.physics.add.overlap(this.enemies, this.fireballs, this.fireball_collision, undefined, this);
  }
  fireball_collision(enemy, fireball) {
    enemy.hit_with_fireball();
    fireball.destroy();
    if (enemy.get_health() <= 0) {
      let index = this.enemies.indexOf(enemy, 0);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }

      enemy.kill();
    }
  }

  // the update function
  update() {
    // display critdisplay?
    if (this.WPM > 90) {
      this.critDisplay.setVisible(true);
    } else {
      this.critDisplay.setVisible(false);
    }
    // check if the current typed thing is a typo
    if (this.check_typo()) {
      // if there is a typo, do something ...
      this.typos += 1;
      this.tintTime = this.time.now;
      this.background.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
      this.words = "";
    } else if (this.time.now > (this.tintTime + 1000)) {
      this.background.clearTint();
    }

    if (!this.player.visible) {
      this.scene.start('EndGameScene', { WPM: this.WPM, typos: this.typos });
      //this.scene.start('MainMenuScene');
    }

    this.player.move();

    // checks if the player wants to open the shop
    if (this.words == "shop!") {
      this.scene.start('ShopScene', { player: this.player, commands: this.store_map, level: this.level });
    }

    this.suggestedCommands = this.checkContain();
    // update the display of the WPM
    this.WPMLabel.text = "Average WPM: " + Math.round(this.WPM);

    // set the commandDisplay to default false
    this.commandDisplay.setVisible(false);

    // update the command display to hold all available commands
    this.commandDisplay.text = "Commands: " + this.commands;
    this.suggestCommandsDisplay.text = "Suggested: " + this.suggestedCommands;
    // update the coins display with the players current coins
    this.coinDisplay.setText("Coins: " + this.player.get_coins());

    //update level display
    this.levelDisplay.setText("Level " + this.level);

    // if the player types in "help" then the available commands are displayed to the screen
    if (this.words == "help") {
      this.commandDisplay.setVisible(true);
    }

    // update the word label to display what the player has typed
    this.wordLabel.text = "Command:    " + this.words;

    // update the health label to display the character's current health
    this.healthLabel.text = "Health: " + this.player.get_health();

    let words_wpm: string = this.words;
    // check if the player is typing
    this.addLetters();
    // if a letter is added, start the WPM timer
    if (words_wpm == "" && this.words != "") {
      this.timeWPM = this.time.now;
    }
    // update enemy position
    if (this.words != "help") {
      for (let i = 0; i < this.enemies.length; i++) {
        //this.current_enemy.setVisible(false);
        this.enemies[i].move(this.player);
      }
    }
    //check if enemy is in range to attack
    if (this.enemies.length != 0) {
      this.fightDisplay.setVisible(false);
      if (this.player.get_health() > 0) {
        for (let i = 0; i < this.enemies.length; i++) {
          this.current_enemy = this.enemies[i];
          if (this.current_enemy.within_range(this.player)) {
            //The 7000 is in milliseconds, therefore 
            //there is a 7 second delay between enemy attacks
            //we need to change this later to make 7000 be based off difficulty 
            //of enemy
            /* if (this.time.now > this.timeAttack + (10000)) {
              this.current_enemy.hit_Player(this.player);
              this.timeAttack = this.time.now;
            }*/
            this.current_enemy.hit_Player(this.player);
          }
        }
      }
    } else {
      this.fightDisplay.setVisible(true);
    }

    if (this.player.get_health() <= 0) {
      this.player.setVisible(false);
    }

    if (!Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER])) {
      return;
    }

    if (this.command_map.get(this.words) != undefined) {
      this.timeWPM = this.time.now - this.timeWPM;
      this.WPM = (this.WPM * this.numCommands + this.getWPM()) / (this.numCommands + 1);
      this.numCommands++;
    }

    // spawns a new enemy if there is none and the player types in the correct command
    if (this.words == "fight onward!" && this.enemies.length == 0) {
      if (this.level == 1) {
        this.current_enemy = new Enemy(this, 250, 100, 1);
        this.enemies.push(this.current_enemy);
      } else {
        this.enemies = [];
        for (let i = 0; i < this.level / 2; i++) {
          let x = Math.random() * 500;
          let y = Math.random() * 500;
          let z = Phaser.Math.Between(0, 1);
          this.current_enemy = new Enemy(this, x, y, z);
          this.enemies.push(this.current_enemy);
        }
      }
      this.words = "";
    }

    //EASTER EGG
    if (this.words == "plus ultra!") {
      this.player.add_coins(10000000);
    }

    // check if the player entered a valid command
    if (this.player.command(this.words)) {
      // checks if the enemy is attacked by the command
      for (let i = 0; i < this.enemies.length; i++) {
        this.current_enemy = this.enemies[i];
        if (this.current_enemy.hit_enemy(this.player, this.words, this.WPM)) {
          this.enemies[i].setActive(false);
          let index = this.enemies.indexOf(this.enemies[i], 0);
          if (index > -1) {
            this.enemies.splice(index, 1);
          }
          this.player.add_coins(this.current_enemy.get_coins());
        }
      }
      if (this.enemies.length == 0) {
        this.level += 1;
      }
    }

    if (this.words.includes("fireball")) {
      if (this.words.includes("forward")) {
        this.fireballs.add(new Fireball(this, this.player, 0));
      } else if (this.words.includes("right")) {
        this.fireballs.add(new Fireball(this, this.player, 1));
      } else if (this.words.includes("backward")) {
        this.fireballs.add(new Fireball(this, this.player, 2));
      } else if (this.words.includes("left")) {
        this.fireballs.add(new Fireball(this, this.player, 3));
      }
    }

    // reset the player's entered words
    this.words = "";
  }

  // listens for player input and update accordingly
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

  update_commands() {
    let temp_commands: Map<string, [string, boolean]> = this.command_map;
    let temp_playerComms: Map<string, boolean> = this.player.get_commands();
    this.command_map.forEach(function (value, key) {
      if (temp_playerComms.get(key) != undefined) {
        temp_commands.set(key, [value[0], true]);
      }
    });
    this.command_map = temp_commands;
  }

  getWPM(): number {
    let minutes: number = this.timeWPM * (0.001 / 60);
    return this.words.split(" ").length / minutes;
  }

  checkContain(): string[] {
    if (this.words == "") {
      return [""];
    }
    let temp = this.words;
    let result = false;
    let suggestedCommands = [""];
    this.command_map.forEach(function (value, key) {
      if (key.includes(temp) && value[1]) {
        suggestedCommands = [suggestedCommands + key + "\n"];
      }
    });
    return suggestedCommands;
  }

  check_typo(): boolean {
    let EASTER_EGG: string = "plus ultra!";
    if (EASTER_EGG.includes(this.words)) {
      return false;
    }
    let output = true;
    let temp_words = this.words;
    this.command_map.forEach(function (value, key) {
      if (key.includes(temp_words) && value[1]) {
        output = false;
      }
    });
    return output;
  }
}
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
  private typoDisplay: Phaser.GameObjects.BitmapText;

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

  // the number of commands that have been entered for calculating WPM
  private numCommands: number;

  // typo counter
  private typos: number;

  // timer for the typo red tint
  private tintTime: number;

  // fireball group
  private fireballs: Phaser.GameObjects.Group;

  // boolean for tutorial
  private inTutorial: boolean;

  // array to hold commands for tutorial
  private tutorialCommands: Array<string>;

  // counter for movement in tutorial
  private tutorialMove: number;

  // display for tutorial text
  private tutorialLabel: Phaser.GameObjects.BitmapText;

  // the constructor for the scene
  constructor() {
    super({ key: 'MainScene' });
  }

  // init function. Allows passing the player object between scenes
  init(data): void {
    if (data.tutorial == undefined) {
      this.inTutorial = true;
    } else {
      this.inTutorial = false;
    }
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
  create(): void {

    // set the tutorial array full of commands that need to be performed
    this.tutorialCommands = new Array<string>();
    this.tutorialCommands.push("" + "help");
    this.tutorialCommands.push("" + "shop!");
    this.tutorialCommands.push("" + "block");
    this.tutorialCommands.push("" + "attack right");
    this.tutorialCommands.push("" + "attack left");
    this.tutorialCommands.push("" + "attack down");
    this.tutorialCommands.push("" + "attack up");
    this.tutorialCommands.push("right");
    this.tutorialCommands.push("left");
    this.tutorialCommands.push("down");
    this.tutorialCommands.push("up");

    // set the tutorial movement counter to 0
    this.tutorialMove = 0;

    // initiate the tutorial label
    this.tutorialLabel = this.add.bitmapText(75, 115, "pixelFont", "", 18);
    this.tutorialLabel.tint = 0x000000;

    // set the start numCommands to 0
    this.numCommands = 0;

    // add the necessary input keys for the player to type
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    for (let i: number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
      this.input.keyboard.addKey(i);
    }

    // initiate the words to an empty string
    this.words = "";

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
    this.wordLabel.tint = 0x000000;

    this.healthLabel = this.add.bitmapText(this.scale.width - 75, 5, "pixelFont", "health", 16);
    this.healthLabel.tint = 0x000000;

    this.commandDisplay = this.add.bitmapText(10, 40, "pixelFont", "display", 16);
    this.commandDisplay.tint = 0x00000;
    this.commandDisplay.setDepth(1);

    this.suggestCommandsDisplay = this.add.bitmapText(10, 25, "pixelFont", "Suggested: ", 16);
    this.suggestCommandsDisplay.tint = 0x000000;

    this.coinDisplay = this.add.bitmapText(this.scale.width - 175, 5, "pixelFont", "Coins", 16);
    this.coinDisplay.setText("Coins: " + this.player.get_coins());
    this.coinDisplay.tint = 0x000000;

    this.levelDisplay = this.add.bitmapText(this.scale.width - 175, 25, "pixelFont", "Coins", 16);
    this.levelDisplay.tint = 0x000000;

    this.WPMLabel = this.add.bitmapText(10, this.scale.height - 10, "pixelFont", "WPM:", 16);
    this.WPMLabel.tint = 0x00000;

    this.fightDisplay = this.add.bitmapText(0, this.scale.height - 120, "pixelFont", "'fight onward!' to continue", 40);
    this.fightDisplay.setVisible(false);
    this.fightDisplay.tint = 0x00000;
    this.fightDisplay.setDepth(1);

    this.suggestDisplay = this.add.bitmapText(10, this.scale.height - 30, "pixelFont", "try 'shop' or 'help", 20);
    this.suggestDisplay.tint = 0x00000;

    this.critDisplay = this.add.bitmapText(this.scale.width - 175, this.scale.height - 10, "pixelFont", "WPM OVER 90; CRIT ACTIVATED", 16);
    this.critDisplay.tint = 0x000000;
    this.critDisplay.setVisible(false);

    this.typoDisplay = this.add.bitmapText(this.scale.width / 4, this.scale.height / 2, "pixelFont", "OH NO! TYPO!", 50);
    this.typoDisplay.setVisible(false);

    // set the enemy attack timer
    this.timeAttack = this.time.now;

    // inititate fireballs group
    this.fireballs = this.add.group();
    this.fireballs.runChildUpdate = true;

    // add the collisions for fireballs and enemies
    this.physics.add.overlap(this.enemies, this.fireballs, this.fireball_collision, undefined, this);
  }

  // define the collision function
  fireball_collision(enemy, fireball): void {
    // calls fireball damaging function for enemy
    enemy.hit_with_fireball();
    // destroys the fireball that hit the enemy
    fireball.destroy();
    // if the fireball kills the enemy 
    if (enemy.get_health() <= 0) {
      // remove the enemy from the enemies array
      let index = this.enemies.indexOf(enemy, 0);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }

      // give the player coins
      this.player.add_coins(enemy.get_coins());

      // kill the enemy
      enemy.kill();

      // if kill last enemy, increment level
      if (this.enemies.length == 0) {
        this.level++;
      }
    }
  }

  // the update function
  update(): void {
    // if not in the help command, allow movement
    if (this.words != "help") {
      this.player.move();
    }

    // if the tutorial is active
    if (this.inTutorial) {
      // update the tutorial label with this function
      this.update_tutorialLabel();
      // updates the words label to display what is being typed during the tutorial
      this.wordLabel.text = "Command:    " + this.words;
      // gets the next command in the tutorial 
      let next_comm: string = this.tutorialCommands[this.tutorialCommands.length - 1];

      // if the next command is one of the movement commands and the player is moving with the correct arrow key
      if ((next_comm == "up" && this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.UP].isDown) ||
        (next_comm == "down" && this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.DOWN].isDown) ||
        (next_comm == "left" && this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.LEFT].isDown) ||
        (next_comm == "right" && this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.RIGHT].isDown)) {
        // move the player in that direction
        this.player.movement(next_comm);
        // increment the movement counter for the tutorial 
        this.tutorialMove++;
        // reset words to a blank string just in case
        this.words = "";
        // if the player moved the correct distance
        if (this.tutorialMove == 50) {
          // stop movement
          this.player.movement("");
          // reset the tutorail movement counter to 0
          this.tutorialMove = 0;
          // remove the command
          this.tutorialCommands.pop();
        }
        // block the tutorial from running any other code until movement is done
        return;
      }
      // if the player is at this point in the tutorial, stop them from doing anything else until they hit backspace
      if (this.tutorialLabel.text == "This would open up the shop for you to \nupgrade and heal! \nPress backspace to clear message") {
        return;
      }
      // allow the player to type
      this.addLetters();
      // check for typos, if there is one, reset the typed words to empty string
      if (this.check_typo()) {
        this.words = "";
      } else if (this.words == next_comm) {
        // if the player typed in the correct command and it is the shop! command
        if (next_comm == ("" + "shop!")) {
          // change the tutorial label appropraitely
          this.tutorialLabel.text = "This would open up the shop for you to \nupgrade and heal! \nPress backspace to clear message";
        } else if (next_comm == ("" + "help")) {
          // if the command is is the help command, remove the help command from the tutorial array
          this.tutorialCommands.pop();
          // make sure the commands array is empty then make the label for it invisible
          if (this.tutorialCommands.length == 0) {
            this.tutorialLabel.setVisible(false);
          }
        } else {
          // if the command isn't any of the special cases, run the commnd on the player
          this.player.command(next_comm);
          // reset words to empty string
          this.words = "";
          // remove the command
          this.tutorialCommands.pop();
        }
      }
      // if the tutorial array is empty, exit tutorial
      if (this.tutorialCommands.length == 0) {
        this.inTutorial = false;
      }
      // otherwise block the rest of the game from running
      return;
    }

    // check if the player is moving with the arrow keys
    let up: boolean = this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.UP].isDown;
    let down: boolean = this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.DOWN].isDown;
    let left: boolean = this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.LEFT].isDown;
    let right: boolean = this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.RIGHT].isDown;
    // if help command is up, block the movement
    if (this.words == "help") {
      up = false;
      down = false;
      left = false;
      right = false;
    }
    if (up) {
      this.player.movement("up");
    } else if (down) {
      this.player.movement("down");
    }
    if (left) {
      this.player.movement("left");
    } else if (right) {
      this.player.movement("right");
    }
    if (!up && !down && !left && !right) {
      // if the player isn't moveing reset their animation to the idle one
      this.player.movement("");
    }
    // display critdisplay
    if (this.WPM > 90) {
      this.critDisplay.setVisible(true);
    } else {
      this.critDisplay.setVisible(false);
    }
    // check if the current typed thing is a typo
    if (this.check_typo()) {
      // if there is a typo turn the screen red for a short time, show that a typo was entered, and increment the typo counter
      this.typos += 1;
      this.tintTime = this.time.now;
      this.background.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
      this.words = "";
      this.typoDisplay.setVisible(true);
    } else if (this.time.now > (this.tintTime + 1000)) {
      this.background.clearTint();
      this.typoDisplay.setVisible(false);
    }

    if (!this.player.visible) {
      this.scene.start('EndGameScene', { WPM: this.WPM, typos: this.typos });
      //this.scene.start('MainMenuScene');
    }

    // update the display of the WPM
    this.WPMLabel.text = "Average WPM: " + Math.round(this.WPM);

    // set the commandDisplay to default false
    this.commandDisplay.setVisible(false);

    // update the command display to hold all available commands
    this.commandDisplay.text = "Commands: " + this.commands + "\nbackspace or enter to exit help";
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

    // block the game from doing anything else while the help command is up
    if (this.words == "help") {
      if (this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.BACKSPACE].isDown || this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER].isDown) {
        this.words = "";
      } else {
        return;
      }
    }

    // checks if the player wants to open the shop
    if (this.words == "shop!" && this.enemies.length == 0) {
      this.scene.start('ShopScene', { player: this.player, commands: this.store_map, level: this.level });
    } else if (this.words == "shop!") {
      this.words = "";
    }

    // update the suggested commands string[]
    this.suggestedCommands = this.checkContain();

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
            this.current_enemy.hit_Player(this.player);
          }
        }
      }
    } else {
      this.fightDisplay.setVisible(true);
    }

    // check if the player died
    if (this.player.get_health() <= 0) {
      this.player.setVisible(false);
    }

    // block player commands until enter is pressed
    if (!Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER])) {
      return;
    }

    // if the command exists, get the WPM
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
        // add the collisions for fireballs and enemies
        this.physics.add.overlap(this.enemies, this.fireballs, this.fireball_collision, undefined, this);
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

    // adds fireballs when cast
    if (this.words.includes("fireball")) {
      if (this.words.includes("up")) {
        this.fireballs.add(new Fireball(this, this.player, 0));
      } else if (this.words.includes("right")) {
        this.fireballs.add(new Fireball(this, this.player, 1));
      } else if (this.words.includes("down")) {
        this.fireballs.add(new Fireball(this, this.player, 2));
      } else if (this.words.includes("left")) {
        this.fireballs.add(new Fireball(this, this.player, 3));
      }
    }

    // reset the player's entered words
    this.words = "";
  }

  // listens for player input and update accordingly
  addLetters(): void {
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

  update_commands(): void {
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

  move_player(): void {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.UP])) {
      this.player.movement("up");
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.DOWN])) {
      this.player.movement("down");
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.LEFT])) {
      this.player.movement("left");
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.RIGHT])) {
      this.player.movement("right");
    }
  }

  update_tutorialLabel(): void {
    if (this.tutorialLabel.text == "This would open up the shop for you to \nupgrade and heal! \nPress backspace to clear message") {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.BACKSPACE])) {
        this.words = "";
        this.tutorialCommands.pop();
      }
    }
    let next_comm: string = this.tutorialCommands[this.tutorialCommands.length - 1];
    if (next_comm == "up" || next_comm == "down" || next_comm == "left" || next_comm == "right") {
      this.tutorialLabel.text = "Press and hold the " + next_comm + " arrow to move " + next_comm + "!";
      return;
    }
    this.tutorialLabel.text = "Type '" + next_comm + "'";
  }
}
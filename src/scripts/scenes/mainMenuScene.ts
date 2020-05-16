export default class MainScene extends Phaser.Scene {
    // command list and starting level to be passed to the main scene on game start
    private commands: Map<string, [string, boolean, number]>;
    private level: number;

    // the string containing the words the player types
    private words: string;

    // background of the main menu
    private background: Phaser.GameObjects.TileSprite;

    // the word label to display what the player is typing
    private wordLabel: Phaser.GameObjects.BitmapText;

    // the menu display bitmaptext
    private menuLabel: Phaser.GameObjects.BitmapText;
    private menuOptions: string[];

    // holds the option the player selected as a number; 1 is new game, 2 is help for now
    private menuOption: number;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    init(data) {
        this.commands = data.commands;
        this.level = data.level;
    }

    create() {
        // initiate the background as the back most image
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
        this.background.setOrigin(0, 0);

        // add the necessary input keys for the player to type
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        for (let i: number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
            this.input.keyboard.addKey(i);
        }

        // initiate the words string to an empty string
        this.words = "";

        // set the players option selected to 0, meaning that no option is selected yet
        this.menuOption = 0;

        // add the word label to the scene so the player can see what they are typing
        this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
        // adds the menu label to the scene with options 
        this.menuLabel = this.add.bitmapText(this.scale.width / 4, 55, "pixelFont", "Command", 22);
        let temp_bool: boolean = false; // temporary boolean set to false so we can have a way to check later if there is a save game
        // if there is a save game on file, allow loading the save with load or auto loading the most recent save with continue
        if (temp_bool) {
            this.menuOptions = ["Type one of the following...\n     Continue\n     New Game\n     Load\n     Help"];
            // otherwise display the only the new game option and the help option where you can view the basic information about how to play the game
        } else {
            this.menuOptions = ["Type one of the following...\n     New Game"];
        }
        this.menuLabel.setText(this.menuOptions);
    }

    update() {
        // listener to see if the player is typing
        this.addLetters();
        // update the word label to display what the player has typed
        this.wordLabel.text = "Command:    " + this.words;

        switch (this.menuOption) {
            case 0:
                // if no option is selected, ignore this switch statement
                break;
            case 1:
                // if the player selected new game, then listen to see if they press enter to start the mainscene
                if (this.words != "" || Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER]) ||
                    this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.BACKSPACE].isDown) {
                    this.scene.start('MainScene', { commands: this.commands, level: this.level });
                }
                break;
            case 2:
                // if the player selected help, then listen to see if they press enter to go back to the options list
                if (this.words != "" || Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER]) ||
                    this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.BACKSPACE].isDown) {
                    this.menuLabel.setText(this.menuOptions);
                    this.menuLabel.setX(this.scale.width / 4);
                    this.menuOption = 0;
                    this.words = "";
                }
                break;
            default:
                // if for some reason the menuoption is set to an option that isn't available, ignore this switch statement
                break;
        }

        // if the player presses enter after typing new game, show them the description of the game
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER])) {
            if (this.words == "new game") {
                this.menuLabel.setX(0);
                this.menuLabel.text = "Use Arrow Keys to Move\nType attack + a direction to attack\nType block to block damage\nHit the enter key to enter a command\nHit backspace to delete what you've typed\npress any key to start game...";
                this.menuOption = 1;
                this.words = "";
            } else if (this.words == "help") {
                this.menuLabel.setX(0);
                this.menuLabel.text = "Use Arrow Keys to Move\nType attack + a direction to attack\nType block to block damage\nHit the enter key to enter a command\nHit backspace to delete what you've typed\npress any key to go back to the options list...";
                this.menuOption = 2;
                this.words = "";
            } else {
                this.words = "";
            }
        }
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
}
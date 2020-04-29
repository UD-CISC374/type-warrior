import Player from "../objects/player";

export default class shopScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite;
    private player: Player;
    private wordLabel: Phaser.GameObjects.BitmapText;
    private words: string;
    private command_shopList: Map<string, number>;
    private shoplist_display: Phaser.GameObjects.BitmapText;
    private shoplist: string[];
    private heal_player: number;
    private coinDisplay: Phaser.GameObjects.BitmapText;
    private shopExplanation: Phaser.GameObjects.BitmapText;

    private level: number;

    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data) {
        this.player = data.player;

        this.shoplist = [""];

        this.command_shopList = data.commands;

        this.level = data.level;
    }

    create() {
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "shop_background");
        this.background.setOrigin(0, 0);

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        for (let i: number = Phaser.Input.Keyboard.KeyCodes.A; i <= Phaser.Input.Keyboard.KeyCodes.Z; i++) {
            this.input.keyboard.addKey(i);
        }

        this.shoplist_display = this.add.bitmapText(10, 15, "pixelFont", "display", 16);
        this.shoplist_display.tint = 0xff6611;
        this.shoplist_display.setVisible(false);
        this.shoplist_display.text = "Available Purchases: " + this.shoplist;

        this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
        this.wordLabel.tint = 0xff6611;
        this.words = "";
        this.shopExplanation = this.add.bitmapText(10, 25, "pixelFont", 
        "To open the list of items you can buy, type shoplist," +
        "\nHeal displays the cost to fully heal back up to your max health" +
        "\nto heal, type heal and it will take either the amount to fully heal" +
        "\nif you have enough, or all of your coins and heal at a fraction" +
        "\nof your health proportionate to the price you pay," +
        "\nTo buy a command listed in the shoplist, type" +
        "\n'buy' + the command you want to buy," +
        "\nType exit to exit the shop", 16);
        this.shopExplanation.tint = 0xff6611;


        this.coinDisplay = this.add.bitmapText(10, this.scale.height-20, "pixelFont", "Coins", 20);
        this.coinDisplay.setText("Coins: " + this.player.get_coins());
        this.coinDisplay.tint = 0xff6611;

        let temp_shoplist: string[] = this.shoplist;
        this.command_shopList.forEach(function (value, key) {
            temp_shoplist = [temp_shoplist + "\n" + key + " : " + value];
        });
        this.shoplist = temp_shoplist;
    }

    update() {
        this.wordLabel.text = "Command:    " + this.words;
        this.addLetters();

        // update the coins display with the players current coins
        this.coinDisplay.setText("Coins: " + this.player.get_coins());

        this.heal_player = Math.round((100 - this.player.get_health()) / 2);
        this.shoplist_display.text = "Available Purchases: " + this.shoplist + "\nheal player: " + this.heal_player + "\nupgrade strength: " + (this.player.get_strength() * 10) + " coins" + "\nType 'close shoplist' to close this list...";

        // update the shoplist string
        let temp_shoplist: string[] = [""];
        this.command_shopList.forEach(function (value, key) {
            temp_shoplist = [temp_shoplist + "\n" + key + " : " + value];
        });
        this.shoplist = temp_shoplist;

        if(Phaser.Input.Keyboard.JustUp(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER])) {
            if(this.words == "Not Enough Coins!") {
                this.words = "";
            }
            if(this.words == "upgrade strength"){
                if(this.player.get_coins() >= (this.player.get_strength() * 10)){
                    this.player.subtract_coins((this.player.get_strength() * 10));
                    this.player.addStrength(1);
                }else{
                    this.words = "Not Enough Coins!";
                }
            }
            if (this.words == "exit") {
                this.scene.start('MainScene', { player: this.player, level: this.level });
            } else if (this.words == "shoplist") {
                this.shoplist_display.setVisible(true);
                this.shopExplanation.setVisible(false);
                this.words = "";
            } else if (this.words == "close shoplist") {
                this.shoplist_display.setVisible(false);
                this.shopExplanation.setVisible(true);
                this.words = "";
            } else if (this.words == "help") {
    
            } else if (this.words == "heal") {
                if (this.player.get_coins() < this.heal_player) {
                    this.player.heal(this.player.get_coins() * 2);
                    this.heal_player -= this.player.get_coins();
                    this.player.subtract_coins(this.player.get_coins());
                } else {
                    this.player.heal(this.heal_player * 2);
                    this.player.subtract_coins(this.heal_player);
                    this.heal_player = 0;
                }
                this.words = "";
            }
    
            let temp_words: string = this.words;
            let temp_player: Player = this.player;
            let temp_commands: Map<string, number> = this.command_shopList;
            this.command_shopList.forEach(function (value, key) {
                if (temp_words == ("buy " + key)) {
                    if(!(temp_player.get_coins() >= value)) {
                        temp_words = "Not Enough Coins!";
                    } else {
                        temp_player.add_command(key, true);
                        temp_player.subtract_coins(value);
                        temp_commands.delete(key);
                    }
                }
            });
            this.words = temp_words;
            this.player = temp_player;
            this.command_shopList = temp_commands;

            if(this.words != "Not Enough Coins!") {
                this.words = "";
            }
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
}
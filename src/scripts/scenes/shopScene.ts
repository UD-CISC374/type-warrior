import Player from "../objects/player";

export default class shopScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite;
    private player: Player;
    private wordLabel: Phaser.GameObjects.BitmapText;
    private words: string;
    private command_shopList: Map<string, number>;
    private shoplist_display: Phaser.GameObjects.BitmapText;
    private shoplist: string[];

    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data) {
        this.player = data.player;

        this.shoplist = [""];

        this.command_shopList = data.commands;
    }

    create() {
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "shop_background");
        this.background.setOrigin(0, 0);

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
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

        let temp_shoplist: string[] = this.shoplist;
        this.command_shopList.forEach(function (value, key) {
            temp_shoplist = [temp_shoplist + "\n" + key + " : " + value];
        });
        this.shoplist = temp_shoplist;
    }

    update() {
        this.wordLabel.text = "Command:    " + this.words;
        this.addLetters();

        this.shoplist_display.text = "Available Purchases: " + this.shoplist;

        if (this.words == "done!") {
            this.scene.start('MainScene', { player: this.player });
        } else if (this.words == "shop list!") {
            this.shoplist_display.setVisible(true);
            this.words = "";
        } else if (this.words == "close shop list!") {
            this.shoplist_display.setVisible(false);
            this.words = "";
        } else if (this.words == "help") {

        }

        let temp_words: string = this.words;
        let temp_player: Player = this.player;
        let temp_commands: Map<string, number> = this.command_shopList;
        this.command_shopList.forEach(function (value, key) {
            if (temp_words == ("buy " + key)) {
                temp_player.add_command(key, true);
                temp_commands.delete(key);
                temp_words = "";
            }
        });
        this.words = temp_words;
        this.player = temp_player;
        this.command_shopList = temp_commands;

        let temp_shoplist: string[] = [""];
        this.command_shopList.forEach(function (value, key) {
            temp_shoplist = [temp_shoplist + "\n" + key + " : " + value];
        });
        this.shoplist = temp_shoplist;
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
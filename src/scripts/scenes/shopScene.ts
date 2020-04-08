import Player from "../objects/player";

export default class shopScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite;
    private player: Player;
    private wordLabel: Phaser.GameObjects.BitmapText;
    private words: String;

    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data) {
        this.player = data.player;
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

        this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
        this.words = "";
    }

    update() {
        this.wordLabel.text = "Command:    " + this.words;
        this.addLetters();

        if(this.words == "done!") {
            this.scene.start('MainScene', {player: this.player});
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
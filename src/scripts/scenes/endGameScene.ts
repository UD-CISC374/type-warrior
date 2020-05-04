export default class EndGameScene extends Phaser.Scene {
    // variables
    WPM: number;
    typo_count: number;

    // background for the End Game Scene
    private background: Phaser.GameObjects.TileSprite;

    // the Label used to display on the End Game Scene
    private endGameLabel: Phaser.GameObjects.BitmapText;

    constructor() {
        super({ key: 'EndGameScene' });
    };

    init(data): void {
        this.WPM = data.WPM;
        this.typo_count = data.typos;
    }

    create(): void {
        // add background to the scene
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
        this.background.setOrigin(0, 0);

        // add enter to keyboard to restart game
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // add the endgame bitmaptext label to the scene
        this.endGameLabel = this.add.bitmapText(10, 25, "pixelFont", "Your average WPM = " + Math.round(this.WPM) + "\nYour number of typos = "
            + this.typo_count + "\n\nPress Enter to go back to main menu...", 25);
        this.endGameLabel.setTint(0xffffff);
    }

    update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ENTER])) {
            this.scene.start('PreloadScene');
        }
    }
}
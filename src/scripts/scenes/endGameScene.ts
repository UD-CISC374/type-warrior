export default class EndGameScene extends Phaser.Scene {
    // variables
    
    // background for the End Game Scene
    private background: Phaser.GameObjects.TileSprite;

    // the Label used to display on the End Game Scene
    private endGameLabel: Phaser.GameObjects.BitmapText;

    constructor() {
        super({ key: 'EndGameScene' });
    };

    init(): void {

    }

    create(): void {
        // add background to the scene
        //this.background = this.add.tileSprite();

        // add the endgame bitmaptext label to the scene
        this.endGameLabel = this.add.bitmapText(10, 5, "pixelFont", "", 16);
    }

    update(): void {

    }
}
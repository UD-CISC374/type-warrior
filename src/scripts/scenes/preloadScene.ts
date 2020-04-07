export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("standing", "assets/images/Stand.png");
    this.load.image("background", "assets/images/bg.png");
    this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");

  }

  create() {
    this.scene.start('MainScene');
  }
}

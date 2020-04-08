export default class Player extends Phaser.GameObjects.Sprite {
    private health : number;

    constructor(scene : Phaser.Scene, x : number, y : number) {
        super(scene, x, y, "idle");
        scene.add.existing(this);
    }
}
export default class Player extends Phaser.Physics.Arcade.Sprite {
    private health : number;

    constructor(scene : Phaser.Scene, x : number, y : number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.health = 100;
        scene.add.existing(this);
    }
}
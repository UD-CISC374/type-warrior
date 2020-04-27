export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, attacker: Phaser.Physics.Arcade.Sprite, direction: number) {
        switch(direction) {
            case 0:
                super(scene,attacker.x,attacker.y, 'idle');
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
    }
}
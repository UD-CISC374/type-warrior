import Player from "./player";

export default class Fireball extends Phaser.Physics.Arcade.Sprite {
    private direction: number;

    constructor(scene: Phaser.Scene, player: Player, direction: number) {
        switch (direction) {
            case 0:
                super(scene, player.x, player.y, 'Fireball_UD');
                this.play('Fireball_UD_anim');
                break;
            case 1:
                super(scene, player.x, player.y, 'Fireball_LR');
                this.play('Fireball_LR_anim');
                break;
            case 2:
                super(scene, player.x, player.y, 'Fireball_UD');
                this.play('Fireball_UD_anim');
                this.setFlipY(true);
                break;
            case 3:
                super(scene, player.x, player.y, 'Fireball_LR');
                this.play('Fireball_LR_anim');
                this.setFlipX(true);
                break;
            default:
                super(scene, player.x, player.y, '');
                break;
        }
        this.direction = direction;
    }

    update(): void {
        switch (this.direction) {
            case 0:
                this.x -= 10;
                break;
            case 1:
                this.y += 10;
                break;
            case 2:
                this.x += 10;
                break;
            case 3:
                this.y -= 10;
                break;
            default:
                break;
        }
    }
}
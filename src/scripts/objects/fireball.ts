import Player from "./player";

export default class Fireball extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private direction: number;

    constructor(scene: Phaser.Scene, player: Player, direction: number) {
        switch (direction) {
            case 0:
                super(scene, player.x, player.y, 'Fireball_UD');
                this.play('fireball_UD_anim');
                break;
            case 1:
                super(scene, player.x, player.y, 'Fireball_LR');
                this.play('fireball_LR_anim');
                this.setFlipX(true);
                break;
            case 2:
                super(scene, player.x, player.y, 'Fireball_UD');
                this.play('fireball_UD_anim');
                this.setFlipY(true);
                break;
            case 3:
                super(scene, player.x, player.y, 'Fireball_LR');
                this.play('fireball_LR_anim');
                break;
            default:
                super(scene, player.x, player.y, '');
                break;
        }
        this.direction = direction;
        scene.physics.world.enableBody(this);
        this.scene.add.existing(this);
    }

    update(): void {
        switch (this.direction) {
            case 0:
                this.y -= 5;
                break;
            case 1:
                this.x += 5;
                break;
            case 2:
                this.y += 5;
                break;
            case 3:
                this.x -= 5;
                break;
            default:
                break;
        }

        if (this.y > this.scene.scale.height || this.x > this.scene.scale.width || this.y < 0 || this.x < 0) {
            this.destroy();
        }
    }
}
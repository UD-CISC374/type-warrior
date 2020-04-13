import Player from "./player";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    // properties of an enemy
    private health: number;
    private is_flipped: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, difficulty: number) {
        super(scene, x, y, '');
        switch (difficulty) {
            case 0:
                this.setTexture('knight-idle');
                this.play("knight-idle");
                this.health = 10;
                break;
            default:
                this.setTexture('knight-idle');
                this.play("knight-idle");
                this.health = 10;
                break;
        };
        this.is_flipped = false;
        this.scene.add.existing(this);
    }

    public move(player: Player) {
        if (this.x < player.x - 25) {
            this.x += .05;
            if (this.is_flipped) { this.setFlipX(false); this.is_flipped = false; }
        } else if (this.x > player.x + 25) {
            this.x -= .05;
            if (!this.is_flipped) { this.setFlipX(true); this.is_flipped = true; }

        }
        if (this.y < player.y - 25) {
            this.y += .05;
        } else if (this.y > player.y + 25) {
            this.y -= .05;
        }
    }

    public hit_enemy(player: Player, words: string): boolean {
        if ((words == "attack right") && (this.x > player.x) && (this.x < player.x + 50) &&
            (this.y < player.y + 25) && (this.y > player.y - 25)) {
            this.health -= 10;
        } else if ((words == "attack left") && (this.x < player.x) && (this.x > player.x - 50) &&
            (this.y < player.y + 25) && (this.y > player.y - 25)) {
            this.health -= 10;
        } else if ((words == "attack forward") && (this.y < player.y) && (this.y > player.y - 50) &&
            (this.x < player.x + 25) && (this.x > player.x - 25)) {
            this.health -= 10;
        } else if ((words == "attack backward") && (this.y > player.y) && (this.y < player.y + 50) &&
            (this.x < player.x + 25) && (this.x > player.x - 25)) {
            this.health -= 10;
        }

        if (this.health <= 0) {
            this.destroy();
            return false;
        } else {
            return true;
        }
    }
}
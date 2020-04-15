import Player from "./player";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    // properties of an enemy
    private max_health: number;
    private current_health: number;
    private is_flipped: boolean;
    private health_bar: Phaser.GameObjects.Rectangle;
    private inRange: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, difficulty: number) {
        super(scene, x, y, '');
        switch (difficulty) {
            case 0:
                // this.setTexture('knight-idle');
                this.play("knight-idle");
                this.max_health = 50;
                this.current_health = 50;
                break;
            default:
                // this.setTexture('knight-idle');
                this.play("knight-idle");
                this.max_health = 50;
                this.current_health = 50;
                break;
        };
        this.is_flipped = false;
        this.health_bar = new Phaser.GameObjects.Rectangle(this.scene, x + 10, y - 25, (this.current_health / this.max_health) * 75, 5, 0xff0000);
        this.scene.add.existing(this.health_bar);
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
        if (this.y < player.y) {
            this.y += .25;
        } else if (this.y > player.y) {
            this.y -= .25;
        }


        if (this.current_health > 0) {
            this.health_bar.setX(this.x + 5);
            this.health_bar.setY(this.y - 25);
            this.health_bar.setSize((this.current_health / this.max_health) * 75, 5);
        } else {
            this.health_bar.destroy();
        }
    }

    public hit_enemy(player: Player, words: string): boolean {
        if ((words.includes("attack right")) && (this.x > player.x) && (this.x < player.x + 50) &&
            (this.y < player.y + 25) && (this.y > player.y - 25)) {
            if (words == "attack right") {
                this.current_health -= 10;
            } else if (words == "attack right with sword") {
                this.current_health -= 30;
            }
        } else if ((words == "attack left") && (this.x < player.x) && (this.x > player.x - 50) &&
            (this.y < player.y + 25) && (this.y > player.y - 25)) {
            this.current_health -= 10;
        } else if ((words == "attack forward") && (this.y < player.y) && (this.y > player.y - 50) &&
            (this.x < player.x + 25) && (this.x > player.x - 25)) {
            this.current_health -= 10;
        } else if ((words == "attack backward") && (this.y > player.y) && (this.y < player.y + 50) &&
            (this.x < player.x + 25) && (this.x > player.x - 25)) {
            this.current_health -= 10;
        }

        if (this.current_health <= 0) {
            this.destroy();
            return true;
        } else {
            return false;
        }
    }

    get_health() {
        return this.current_health;
    }

    public within_range(player: Player) {
        this.inRange = false;
        if ((this.x > player.x) && (this.x < player.x + 50) &&
            (this.y < player.y + 25) && (this.y > player.y - 25)) {
            this.inRange = true;
        } else if ((this.x < player.x) && (this.x > player.x - 50) &&
            (this.y < player.y + 25) && (this.y > player.y - 25)) {
            this.inRange = true;
        } else if ((this.y < player.y) && (this.y > player.y - 50) &&
            (this.x < player.x + 25) && (this.x > player.x - 25)) {
            this.inRange = true;
        } else if ((this.y > player.y) && (this.y < player.y + 50) &&
            (this.x < player.x + 25) && (this.x > player.x - 25)) {
            this.inRange = true;
        }
        return this.inRange;
    }

    public hit_Player(player: Player) {

        this.play('knight-attack');
        this.once('animationcomplete', () => {
            this.play("knight-idle");
        });
        player.set_health((player.get_health() - 25));

    }
}
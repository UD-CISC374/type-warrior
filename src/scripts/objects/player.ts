export default class Player extends Phaser.Physics.Arcade.Sprite {
    private health: number;
    private is_flipped: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.setScale(2, 2);
        this.health = 100;
        this.is_flipped = false;
        scene.add.existing(this);
    }

    public movePlayer(words: string) {
        if (words == "move left") {
            if (!this.is_flipped) {
                this.setFlipX(true);
                this.is_flipped = true;
            }
            this.x -= 25;
            return true;
        }

        if (words == "move right") {
            if (this.is_flipped) {
                this.setFlipX(false);
                this.is_flipped = false;
            }
            this.x += 25;
            return true;
        }

        if (words == "move forward") {
            this.y -= 25;
            return true;
        }

        if (words == "move backward") {
            this.y += 25;
            return true;
        }

        if (words == "turn around") {
            this.setFlipX(!this.is_flipped);
            this.is_flipped = !this.is_flipped;
            return true;
        }

        if (words == "attack right") {
            this.setFlipX(false);
            this.is_flipped = false;
            this.play("attack_anim");
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack left") {
            this.setFlipX(true);
            this.is_flipped = true;
            this.play("attack_anim");
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack forward") {
            this.play("attack_anim");
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack backward") {
            this.play("attack_anim");
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
    }

    public get_health() {
        return this.health;
    }
}
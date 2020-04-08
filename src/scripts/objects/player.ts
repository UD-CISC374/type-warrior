export default class Player extends Phaser.Physics.Arcade.Sprite {
    private health: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.setScale(2, 2);
        this.health = 100;
        scene.add.existing(this);
    }

    public movePlayer(words: string) {
        if (words == "move left") {
            this.x -= 25;
            return true;
        }

        if (words == "move right") {
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

        if (words == "attack") {
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
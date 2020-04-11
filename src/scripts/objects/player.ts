export default class Player extends Phaser.Physics.Arcade.Sprite {
    private health: number;
    private is_flipped: boolean;
    private weapon: string;
    private whichAttack: string;
    private commands: Map<string,boolean>;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.setScale(2, 2);
        this.health = 100;
        this.is_flipped = false;
        this.weapon = "fist";
        this.commands = new Map();
        this.commands.set("move left", false);
        scene.add.existing(this);
    }

    public movePlayer(words: string) {
        if(this.weapon == "fist"){
            this.whichAttack = "attack_anim";
        }
        //filler for buying sword
        if (words == "sword"){
            this.whichAttack = "sword-attack_anim";
            this.weapon = "sword";
            return true;
        }

        if (words == "move left") {
            if(!this.commands.get("move left")) {
                return true;
            }
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
            this.play(this.whichAttack);
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack left") {
            this.setFlipX(true);
            this.is_flipped = true;
            this.play(this.whichAttack);
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack forward") {
            this.play(this.whichAttack);
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack backward") {
            this.play(this.whichAttack);
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
    }

    public get_health() {
        return this.health;
    }

    public set_health(new_health: number) {
        this.health = new_health;
    }

    public make_player(a_player: Player) {
        this.health = a_player.health;
        this.is_flipped = a_player.is_flipped;
        this.weapon = a_player.weapon;
        this.whichAttack = a_player.whichAttack;
        this.commands = a_player.commands;
    }

    public add_command(key: string, value: boolean) {
        this.commands.set(key, value);
    }

}
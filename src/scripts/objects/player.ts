export default class Player extends Phaser.Physics.Arcade.Sprite {

    //stats
    private maxHealth: number;
    private health: number;
    private strength: number;
    private speed: number;

    private is_flipped: boolean;
    private commands: Map<string, boolean>;
    private coins: number;
    private blocking: boolean;
    private health_bar: Phaser.GameObjects.Rectangle;
    private x_destination: number;
    private y_destination: number;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.setScale(2, 2);
        this.maxHealth = 100;
        this.health = 100;
        this.strength = 0;
        this.speed = 0;
        this.is_flipped = false;
        this.commands = new Map();
        this.coins = 0;
        this.health_bar = new Phaser.GameObjects.Rectangle(this.scene, x + 5, y - 25, (this.health / this.maxHealth) * 75, 5, 0x00ff00);
        this.x_destination = this.x;
        this.y_destination = this.y;
        scene.add.existing(this.health_bar);
        scene.add.existing(this);
    }

    public move(): void {
        if (this.health > 0) {
            this.health_bar.setX(this.x + 5);
            this.health_bar.setY(this.y - 25);
            // gradual shrink of healthbar when player takes damage
            if (this.health_bar.width != Math.round((this.health / this.maxHealth) * 75)) {
                this.health_bar.width -= 1;
            }
        } else {
            this.health_bar.destroy();
        }

        // if the player is at where they are supposed to be at, do nothing
        if (this.x == this.x_destination && this.y == this.y_destination) {
            return;
        }

        // if the player isn't in the correct x location move toward it
        if (this.x > this.x_destination) {
            this.x -= 1;
        } else if (this.x < this.x_destination) {
            this.x += 1;
        }

        // if the player isn't in the correct y location move toward it
        if (this.y > this.y_destination) {
            this.y -= 1;
        } else if (this.y < this.y_destination) {
            this.y += 1;
        }

        // if the movement brings the player to the correct x and y location, switch from movement animation to idle animation
        if (this.x == this.x_destination && this.y == this.y_destination) {
            this.play("idle_anim");
        }
    }

    public command(words: string) {
        if (words == "block") {
            this.blocking = true;
        } else {
            this.blocking = false;
        }

        if (words == "move left") {
            if (!this.is_flipped) {
                this.setFlipX(true);
                this.is_flipped = true;
            }
            this.x_destination = this.x - 25;
            this.play("player_move_anim");
            return true;
        }

        if (words == "move right") {
            if (this.is_flipped) {
                this.setFlipX(false);
                this.is_flipped = false;
            }
            this.x_destination = this.x + 25;
            this.play("player_move_anim");
            return true;
        }

        if (words == "move forward") {
            this.y_destination = this.y - 25;
            this.play("player_move_anim");
            return true;
        }

        if (words == "move backward") {
            this.y_destination = this.y + 25;
            this.play("player_move_anim");
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
            this.play('attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack left") {
            this.setFlipX(true);
            this.is_flipped = true;
            this.play('attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack forward") {
            this.play('attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if (words == "attack backward") {
            this.play('attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

        if ((words == "attack right with sword") && (this.commands.get("attack right with sword") != undefined)) {
            this.setFlipX(false);
            this.is_flipped = false;
            this.play('sword-attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        if ((words == "attack left with sword") && (this.commands.get("attack left with sword") != undefined)) {
            this.setFlipX(true);
            this.is_flipped = true;
            this.play('sword-attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        if ((words == "attack forward with sword") && (this.commands.get("attack forward with sword") != undefined)) {
            this.play('sword-attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        if ((words == "attack backward with sword") && (this.commands.get("attack backward with sword") != undefined)) {
            this.play('sword-attack_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }

    }

    public get_strength(){
        return this.strength;
    }

    public addStrength(amount: number){
        this.strength += amount;
    }

    public get_speed(){
        return this.speed;
    }

    public addSpeed(amount: number){
        this.speed += amount;
    }

    public get_health() {
        return this.health;
    }

    public get_commands() {
        return this.commands;
    }

    public get_coins() {
        return this.coins;
    }

    public set_health(new_health: number) {
        this.health = new_health;
    }

    public make_player(a_player: Player) {
        this.health = a_player.health;
        this.is_flipped = a_player.is_flipped;
        this.commands = a_player.commands;
        this.coins = a_player.coins;
    }

    public add_command(key: string, value: boolean) {
        this.commands.set(key, value);
    }

    public add_commands(commands: Map<string, boolean>) {
        this.commands = commands;
    }

    public add_coins(coins: number) {
        this.coins += coins;
    }

    public heal(heal_amount: number) {
        this.health += heal_amount;
        if (this.health > 100) {
            this.health = 100;
        }
    }

    public subtract_coins(coin_loss: number) {
        this.coins -= coin_loss;
        if (this.coins < 0) {
            this.coins = 0;
        }
    }

    public isBlocking() {
        return this.blocking;
    }
}
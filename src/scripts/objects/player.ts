import Hitbox from "./fireball";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    //stats
    private maxHealth: number;
    private health: number;
    private strength: number;
    private speed: number;

    private blocking: boolean;
    private block_timer: Phaser.GameObjects.Rectangle;
    block_time: number;
    private shield: Phaser.GameObjects.Image;

    private is_flipped: boolean;
    private commands: Map<string, boolean>;
    private coins: number;
    private health_bar: Phaser.GameObjects.Rectangle;
    private x_destination: number;
    private y_destination: number;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.setScale(2, 2);
        this.maxHealth = 100;
        this.health = 100;
        this.strength = 1;
        this.speed = 1;
        this.is_flipped = false;
        this.commands = new Map();
        this.coins = 0;
        this.block_time = this.scene.time.now;
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

        if (this.blocking) {
            this.block_timer.setX(this.x + 5);
            this.block_timer.setY(this.y - 35)
            if (this.block_timer.width >= 0) {
                this.block_timer.width -= 1;
            } else {
                this.block_timer.setVisible(false);
                this.shield.setVisible(false);
            }
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

    public command(words: string): boolean {
        if (words == "block") {
            this.shield = this.scene.add.image(this.x, this.y + 10, "shield");
            this.shield.setScale(.15);
            this.block_timer = new Phaser.GameObjects.Rectangle(this.scene, this.x + 5, this.y - 15, 100, 5, 0x0000ff);
            this.scene.add.existing(this.block_timer);
            this.shield.setVisible(true);
            this.blocking = true;
            return true;
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
        if ((words == "cast fireball right") && (this.commands.get("cast fireball right") != undefined)) {
            this.setFlipX(false);
            this.is_flipped = false;
            this.play('magic_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        if ((words == "cast fireball left") && (this.commands.get("cast fireball left") != undefined)) {
            this.setFlipX(true);
            this.is_flipped = true;
            this.play('magic_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        if ((words == "cast fireball forward") && (this.commands.get("cast fireball forward") != undefined)) {
            this.play('magic_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        if ((words == "cast fireball backward") && (this.commands.get("cast fireball backward") != undefined)) {
            this.play('magic_anim');
            this.once('animationcomplete', () => {
                this.play("idle_anim");
            });
            return true;
        }
        return false;
    }

    public get_strength(): number {
        return this.strength;
    }

    public addStrength(amount: number): void {
        this.strength += amount;
    }

    public get_speed(): number {
        return this.speed;
    }

    public addSpeed(amount: number): void {
        this.speed += amount;
    }

    public get_health(): number {
        return this.health;
    }

    public get_commands(): Map<string, boolean> {
        return this.commands;
    }

    public get_coins(): number {
        return this.coins;
    }

    public set_health(new_health: number): void {
        this.health = new_health;
    }

    public make_player(a_player: Player): void {
        this.health = a_player.health;
        this.is_flipped = a_player.is_flipped;
        this.commands = a_player.commands;
        this.coins = a_player.coins;
        this.strength = a_player.strength;
    }

    public add_command(key: string, value: boolean): void {
        this.commands.set(key, value);
    }

    public add_commands(commands: Map<string, boolean>): void {
        this.commands = commands;
    }

    public add_coins(coins: number): void {
        this.coins += coins;
    }

    public heal(heal_amount: number): void {
        this.health += heal_amount;
        if (this.health > 100) {
            this.health = 100;
        }
    }

    public subtract_coins(coin_loss: number): void {
        this.coins -= coin_loss;
        if (this.coins < 0) {
            this.coins = 0;
        }
    }

    public isBlocking(): boolean {
        return this.blocking;
    }

    public stopBlock(): void {
        this.blocking = false;
        this.block_timer.setVisible(false);
        this.shield.setVisible(false);
    }
}
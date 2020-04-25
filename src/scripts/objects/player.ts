export default class Player extends Phaser.Physics.Arcade.Sprite {
    
    private maxHealth: number;
    private health: number;
    private is_flipped: boolean;
    private commands: Map<string, boolean>;
    private coins: number;
    private blocking: boolean;
    private health_bar: Phaser.GameObjects.Rectangle;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "idle");
        this.play("idle_anim");
        this.setScale(2, 2);
        this.maxHealth = 100;
        this.health = 100;
        this.is_flipped = false;
        this.commands = new Map();
        this.coins = 0;
        this.health_bar = new Phaser.GameObjects.Rectangle(this.scene, x + 5, y - 25, (this.health / this.maxHealth) * 75, 5, 0x00ff00);
        scene.add.existing(this.health_bar);
        scene.add.existing(this);
    }

    public movePlayer(words: string) {
        if (this.health > 0) {
            this.health_bar.setX(this.x + 5);
            this.health_bar.setY(this.y - 25);
            this.health_bar.setSize((this.health / this.maxHealth) * 75, 5);
        } else {
            this.health_bar.destroy();
        }


        if(words == "block"){
            this.blocking = true;
        }else{
            this.blocking = false;
        }

        if (words == "move left") {
            if (!this.commands.get("move left")) {
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
        if(this.health > 100) {
            this.health = 100;
        }
    }

    public subtract_coins(coin_loss: number) {
        this.coins -= coin_loss;
        if(this.coins < 0) {
            this.coins = 0;
        }
    }

    public isBlocking(){
        return this.blocking;
    }
}
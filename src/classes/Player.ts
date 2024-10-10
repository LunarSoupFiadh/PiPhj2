export class Player extends Phaser.Physics.Arcade.Sprite {


    jumpKey: Phaser.Input.Keyboard.Key | undefined;
    leftKey: Phaser.Input.Keyboard.Key | undefined;
    rightKey: Phaser.Input.Keyboard.Key | undefined;
    downKey: Phaser.Input.Keyboard.Key | undefined;
    interactKey: Phaser.Input.Keyboard.Key | undefined;
    swapKey: Phaser.Input.Keyboard.Key | undefined;

    isDodging: boolean | undefined;
    isCrouching: boolean | undefined;

    currentLevel: integer | undefined;
    currentAnimPrefix: string | undefined;

    bar: HTMLElement;
    hp: number = 100;
    score: number = 1;
    airtime: number = 0;
    offsetY: number;
    speed: number;
    attackKey: Phaser.Input.Keyboard.Key | undefined;
    dodgeKey: Phaser.Input.Keyboard.Key | undefined;

    inputLock: number = 300;
    

    constructor(scene: Phaser.Scene, x: number, y: number,
         texture: string | Phaser.Textures.Texture, frame?: string | number, currentLevel?: integer | undefined){
    
        super(scene, x, y, texture, frame);

        scene.physics.world.enableBody(this);
        this.setCollideWorldBounds(true);

        
        //Player Input
        this.jumpKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.downKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.interactKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.swapKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.attackKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.dodgeKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        if(currentLevel) {
            if(currentLevel < 1) currentLevel = 1;
            this.currentLevel = currentLevel;

        } else this.currentLevel = 1;

        this.currentAnimPrefix = "Lv" + this.currentLevel + "_";
        
        //walk 160, crouch 100
        this.speed = 120;

        //body size
        
        this.setBodySize(22, 38, false);
        this.body?.setOffset(44,this.offsetY = 43);
        this.scale = 0.7;
        this.anims.play(this.currentAnimPrefix + 'Fall', true);
    }

    playerUpdate() {
        this.handleProperties();
        this.handleInput();
    }
    handleProperties() {
        if(this.flipX && this.state != "wallSlide") {
            this.body?.setOffset(53,this.offsetY);
        } else this.body?.setOffset(44,this.offsetY);

        if(this.isCrouching) {
            this.offsetY = 53;
            this.setBodySize(22, 28, false);
        } else {
            this.offsetY = 43;
            this.setBodySize(22, 38, false);
        }

        if(this.state == "wallSlide") {
            this.airtime = 0;
            this.currentAnimPrefix = "Lv" + this.currentLevel + "_";
            this.anims.play(this.currentAnimPrefix + 'Wall_Slide', true)
        }

        if (this.isCrouching && this.state == "jumping") {
            this.speed *= 1.1;
            if (this.speed >= 200) this.speed = 200;
        } else if(this.isCrouching || this.state == "jumping") {
            this.speed = 80;
        } else this.speed = 120;

    }

    handleInput() {
        if (!this.body) return;
        if (this.state == "jumping") {
            this.airtime++;
            this.body.velocity.y += this.airtime/1.5;
            if (this.airtime >= 25 && this.body.velocity.y <= -80) {
                this.body.velocity.y += 0.51;
            }
            if (this.body.velocity.y > -10) {
                if (this.anims.getName() != this.currentAnimPrefix + 'Fall') {
                    this.anims.play(this.currentAnimPrefix + 'Fall_Transition', true);
                }
                this.anims.play(this.currentAnimPrefix + 'Fall', true);
                this.body.velocity.y += 4;
            } else {
                this.anims.play(this.currentAnimPrefix + 'Jump', true);
            }
        }
        if (this.body.touching.down || this.body.onFloor()) {
            this.state = "idle";
            this.airtime = 0;
        }
        if (this.inputLock <= 0) {
            this.inputLock = 0;
        } else {
            this.inputLock--;
        }
        
        if (this.attackKey?.isDown && !this.isDodging) {
            this.state = "attacking"
        }

        if (Phaser.Input.Keyboard.JustDown(this.dodgeKey!) && this.inputLock < 1 && this.state != 'jumping') {
            if (this.isCrouching) {
                this.currentAnimPrefix = "Lv" + this.currentLevel + "_";
            }
            if (this.flipX) {
                this.setVelocityX(-this.speed * 1.4);
            }
            else this.setVelocityX(this.speed * 1.4);
            this.anims.play(this.currentAnimPrefix + 'Roll', true);
            this.isDodging = true;
            this.state = "roll";
            this.inputLock = 36;
        } else if (this.inputLock < 1) {
            this.isDodging = false;
            if (this.isCrouching) {
                this.currentAnimPrefix = "Lv" + this.currentLevel + "_Crouch_";
            }
        }

        if (this.leftKey?.isDown && !this.isDodging) {
            this.setVelocityX(-this.speed);
            if(this.state == "wallSlide") {
                this.setFlipX(false);
            } else {
                this.setFlipX(true);
            }

            if (this.body.touching.down || this.body.onFloor()) this.state = "running";
            
            if (this.state == "running") this.anims.play(this.currentAnimPrefix + 'Walk', true);
        }
        else if (this.rightKey?.isDown && !this.isDodging) {
            this.setVelocityX(this.speed);
            if(this.state == "wallSlide") {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }

            if (this.body.touching.down || this.body.onFloor()) this.state = "running";
                
            if (this.state == "running") this.anims.play(this.currentAnimPrefix + 'Walk', true);
        }
        if (this.jumpKey?.isDown && !this.isDodging) {
            if (this.body.touching.down || this.body.onFloor() || this.state == "wallSlide") {
                this.setVelocityY(-160);
                if (this.state == "wallSlide") {
                    if (this.flipX) {
                        this.setVelocityX(-200);
                    } else this.setVelocityX(200);
                }
                this.state = "jumping";
            }
            else if (this.airtime <= 20 && this.airtime >= 5) {
                this.setVelocityY(this.body.velocity.y - 5);
                console.log("boooooost");
                
            }
        }
        if (this.downKey?.isDown) {
            this.setVelocityY(this.body.velocity.y + 10);
            if (this.body.touching.down || this.body.onFloor()) {
                this.isCrouching = true;
                this.currentAnimPrefix = "Lv" + this.currentLevel + "_Crouch_";
                if ('Crouch' !in this.anims.getName().toString) {
                    this.anims.play(this.currentAnimPrefix + 'Transition', true)   
                }
            }
        } else {
            this.isCrouching = false;
            this.currentAnimPrefix = "Lv" + this.currentLevel + "_";
        }
        
        if (!this.leftKey?.isDown && !this.rightKey?.isDown && !this.isDodging) {
            this.body.velocity.x = this.body.velocity.x * 0.6;
            if(Math.abs(this.body.velocity.x) < 20) this.body.velocity.x = 0;

        }

        if(this.state == 'idle' && !this.isDodging) {
            this.anims.play(this.currentAnimPrefix + 'Idle', true);
        }

    }
}

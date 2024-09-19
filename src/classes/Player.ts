export class Player extends Phaser.Physics.Arcade.Sprite {


    jumpKey: Phaser.Input.Keyboard.Key | undefined;
    leftKey: Phaser.Input.Keyboard.Key | undefined;
    rightKey: Phaser.Input.Keyboard.Key | undefined;
    downKey: Phaser.Input.Keyboard.Key | undefined;
    interactKey: Phaser.Input.Keyboard.Key | undefined;
    swapKey: Phaser.Input.Keyboard.Key | undefined;

    isAttacking: boolean | undefined;

    /*  guide on this value:
        7   8   9
        4   5   6
        1   2   3
        the value is based on a standard numpad
    */
    currentDirection: integer | undefined;
    
    currentLevel: integer | undefined;
    
    bar: HTMLElement;
    hp: number = 100;
    score: number = 1;
    airtime: number = 0;

    

    constructor(scene: Phaser.Scene, x: number, y: number,
         texture: string | Phaser.Textures.Texture, frame?: string | number, currentLevel?: integer | undefined){
    
        super(scene, x, y, texture, frame);

        scene.physics.world.enableBody(this);
        this.setCollideWorldBounds(true);

        
        //Player Input
        this.jumpKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.leftKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.downKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.interactKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.swapKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        if(currentLevel) {
            if(currentLevel < 1) currentLevel = 1;
            this.currentLevel = currentLevel;

        } else this.currentLevel = 1;

        

        //body size
        this.body?.setSize(26, 80);
        this.body?.setOffset(50,0);
        this.scale = 1;

        //this.drawHPBar();
        this.createUI();
    }

    createUI() {
        let hpBarContainer = document.createElement("div");
        hpBarContainer.id = "hpBar"

        let hpBarTitle = document.createElement("h3")
        hpBarContainer.appendChild(hpBarTitle);
        hpBarTitle.innerHTML = "HP:";

        let hpBarOutline = document.createElement("div");
        let bar = document.createElement("div");

        hpBarContainer.appendChild(hpBarOutline);
        hpBarOutline.appendChild(bar);
        bar.id = "bar"

        this.scene.add.dom(64, 64, hpBarContainer);

        this.bar = bar;
    }

    playerUpdate() {
        this.handleInput();
    }

    handleInput() {
        if (!this.body) return;

        if (this.state == "jumping") {
            this.airtime++;
        } else this.airtime = 0;

        if (this.leftKey?.isDown)
            {
                this.setVelocityX(-160);
                this.setFlipX(true);

                if (this.body.touching.down) this.state = "running";
                
                if (this.state == "running") this.anims.play('Lv'+this.currentLevel+'_Walk', true);
            }
        else if (this.rightKey?.isDown)
            {
                this.setVelocityX(160);
                this.setFlipX(false);

                if (this.body.touching.down) this.state = "running";
                 
                if (this.state == "running") this.anims.play('Lv'+this.currentLevel+'_Walk', true);
            }
        if (this.jumpKey?.isDown)
            {
                if (this.body.touching.down) {
                    this.setVelocityY(-160);
                    this.state = "jumping"
                }
                else if (this.airtime <= 200 && this.airtime >= 600) {
                    this.body.velocity.add(new Phaser.Math.Vector2(0, -20));
                }
            }
        else if (this.downKey?.isDown)
            {
                this.setVelocityY(160);
    
                this.state = "crouching";
            }
        if (!this.leftKey?.isDown && !this.rightKey?.isDown)
            {
                this.body.velocity.x = this.body.velocity.x * 0.6;
                if(Math.abs(this.body.velocity.x) < 20) this.body.velocity.x = 0;

            }

        if(this.body.velocity.x == 0 && this.body.velocity.y == 0) {
            this.anims.play('Lv'+this.currentLevel+'_Idle');
        }

        }

        setHP(percentage: number) {

            this.bar.animate([{width:percentage.toString()+"px"}], {
                duration:100,
                fill:"forwards",
            });

            //this.bar.style.width = percentage.toString() +"px";

            if (this.hp <= 0)
            {
                this.hp = 100;

                this.scene.scene.start("Game");
            }
        }
}

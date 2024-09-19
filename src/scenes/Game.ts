    import { Physics, Scene, Tilemaps} from 'phaser';
    import { Player } from '../classes/Player';
    import { Block } from '../classes/Block';

    export class Game extends Scene
    {
        camera: Phaser.Cameras.Scene2D.Camera;
        background: Phaser.GameObjects.Image;
        msg_text : Phaser.GameObjects.Text;
        cursors : Phaser.Types.Input.Keyboard.CursorKeys | undefined;
        player : Player;
        gameOver : boolean;
        currentMap: Tilemaps.Tilemap;
        groundLayer: Tilemaps.TilemapLayer | undefined | any;
        wallLayer: Tilemaps.TilemapLayer | undefined | any;
        objectLayer: Tilemaps.TilemapLayer | undefined | any;
        walls: Phaser.Physics.Arcade.StaticGroup;
        crystals: Phaser.Physics.Arcade.StaticGroup;
        //blocks: Phaser.Physics.Arcade.Group;
        ground: Phaser.GameObjects.Rectangle;
        playerLight: Phaser.GameObjects.Light;
        spawn: Phaser.Physics.Arcade.Sprite;
        maxScore: number;
        

        constructor ()
        {
            super('Game');
        }

        create ()
        {
            this.maxScore = 0;
            this.lights.enable();
            this.lights.setAmbientColor(0x050505);
            
            //  Input Events
            this.cursors = this.input.keyboard?.createCursorKeys();
            
            //  The player
            this.player = this.physics.add.existing(new Player(this, 530, 480, 'Lv1_Idle', 1));
            
            this.ground = this.add.rectangle(this.physics.world.bounds.width/2, this.physics.world.bounds.height-10, this.physics.world.bounds.width, 10, 0x008000);

            this.physics.world.enableBody(this.ground, 1);
            this.physics.add.collider(this.ground, this.player);
            /*
            //map
            this.currentMap = this.make.tilemap({key: 'map' + this.player.currentLevel});
            const tileset = this.currentMap.addTilesetImage('DebugTiles', 'debugTiles');

            if(tileset) {
                console.log("generating map")
                this.groundLayer = this.currentMap.createLayer('ground', tileset);
                this.groundLayer?.setCollisionByProperty({"collides":true});
                this.wallLayer = this.currentMap.getObjectLayer('wall');
                this.walls = this.physics.add.staticGroup();
                this.blocks = this.physics.add.group();
                this.crystals = this.physics.add.staticGroup();
                // The following 3 errors can be ignorded
                this.wallLayer.objects.forEach(element => {
                    let wall = this.physics.add.staticSprite(element.x+16, element.y-16, 'wall');
                    wall.setPipeline('Light2D');
                    this.walls.add(wall);
                    console.log(wall + " created");
                });

                console.log("wall generation complete");

                this.crystals = this.physics.add.staticGroup();
                
                this.objectLayer = this.currentMap.getObjectLayer('objects');
                
                this.objectLayer.objects.forEach(object => {
                    console.log(object);
                    if (object.gid == 3) {
                        this.spawn = this.physics.add.staticSprite(object.x+16, object.y-16, 'spawn')
                        this.player.x = object.x+16;
                        this.player.y = object.y-16;
                        console.log("player spawn position set");
                    } else if (object.gid == 4) {
                        let crystal = this.physics.add.staticSprite(object.x+16, object.y-16, 'crystal');
                        crystal.setPipeline('Light2D');
                        crystal.body.setSize(28, 28, true)
                        this.crystals.add(crystal);
                        console.log(crystal + " created");
                        this.maxScore += 1;
                    } else  if (object.gid == 12) {
                        let block = this.physics.add.sprite(object.x+16, object.y-16, 'block');
                        block.setPipeline('Light2D');
                        block.body.setSize(28, 28, true)
                        this.blocks.add(block);
                    }
                });

                //add colliders for this.player and this.crystals (see the this.walls collider above)
                //same thing for blocks
                //add functions for colliding with blocks and with crystals
                this.physics.add.collider(this.player, this.walls, this.collideWall, undefined, this);
                this.physics.add.overlap(this.player, this.crystals, this.collideCrystal, undefined, this);

                //colliders for blocks
                this.physics.add.collider(this.player, this.blocks);
                this.physics.add.collider(this.blocks, this.blocks, this.blocksCollide, undefined, this);
                this.physics.add.collider(this.blocks, this.walls);
                this.physics.add.collider(this.blocks, this.crystals);

                this.physics.add.overlap(this.player, this.spawn, this.checkForScore, undefined, this);
                
                

                //DJWIAHDLWAHLDHWALIDAW

                /*  Was used to show current collision of the world border, currently unused.
                
                this.groundLayer?.renderDebug(debugGraphics, {
                    tileColor: null,
                    collidingTileColor: new Phaser.Display.Color(240, 230, 40, 255),
                    faceColor: new Phaser.Display.Color(200, 100, 240, 255)
                })
            }
            */
            // player part 2
            this.add.existing(this.player);
            this.player.setPipeline('Light2D');
            this.physics.add.collider(this.player, this.groundLayer);

            this.playerLight = this.lights.addLight(this.player.x, this.player.y, 32, 0xffffff, 1);

            // camera
            this.camera = this.cameras.main;
            this.camera.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
            this.camera.startFollow(this.player, false, 0.6, 0.6);
            this.camera.setZoom(2, 2);
            this.camera.setBackgroundColor(0xffffff);

            /* unused text from the Phaser3 template.
            this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
                fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            });
            this.msg_text.setOrigin(0.5);
            */
        }

        /*
        blocksCollide(block1: Block, block2: Block) {
            if(block1.body!.y >= block2.body!.y) {
                block2.setVelocityY(-100);
                block1.setVelocityY(100);
            }
            if(block1.body!.x >= block2.body!.x) {
                block2.setVelocityX(-100);
                block1.setVelocityX(100);
            }
        }
        */

        //  collides by milo
        collideWall(player: Player, wall: any) {
            //  Add logic for colliding with walls, for example the following destroy logic
            if (player.interactKey?.isDown) {
                if(player.jumpKey?.isDown && wall.y + 1 < player.body?.top!){
                    wall.destroy();
                }
                if(player.rightKey?.isDown && wall.x - 1 > player.body?.right!){
                    wall.destroy();
                }
                if(player.downKey?.isDown && wall.y - 1 > player.body?.bottom!){
                    wall.destroy();
                }
                if(player.leftKey?.isDown && wall.x - 1 < player.body?.left!){
                    wall.destroy();
                }
            }
        }

        collideCrystal(player: Player, crystal: any){
            player.score += 1;
            crystal.destroy();
        }

        checkForScore(player: Player){
            if(player.score >= this.maxScore) {
                this.gameOver = true;
            }
        }



        // update based on template
        update ()
        {
            this.player.playerUpdate();
            this.playerLight.setPosition(this.player.x, this.player.y);
            this.playerLight.setRadius(64 + (this.player.score * 64));
            this.playerLight.setIntensity(1)
            /*
            this.blocks.getChildren().forEach(element => {
                element.body!.velocity.x = element.body!.velocity.x * 0.6
                element.body!.velocity.y = element.body!.velocity.y * 0.6
                if (Math.abs(element.body!.velocity.x) < 20) {element.body!.velocity.x = 0;}
                if (Math.abs(element.body!.velocity.y) < 20) {element.body!.velocity.y = 0;}
                console.log('blub');
            });
            */
            if (this.gameOver)
            {
                this.scene.start('GameOver',);
            }

        }
    }

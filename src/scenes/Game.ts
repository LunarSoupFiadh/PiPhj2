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
        groundTileset: Tilemaps.Tileset | null;

        backgroundTileLayer: Tilemaps.TilemapLayer | undefined | any;
        groundLayer: Tilemaps.TilemapLayer | undefined | any;
        objectLayer: Tilemaps.TilemapLayer | undefined | any;
        
        ground: Phaser.GameObjects.Rectangle;

        playerLight: Phaser.GameObjects.Light;
        spawn: Phaser.Physics.Arcade.Sprite;
        maxScore: number;
        
        backgroundTiles: Physics.Arcade.StaticGroup;
        wallSlideTiles: Physics.Arcade.StaticGroup;
        platformTiles: Physics.Arcade.StaticGroup;
        groundTiles: Phaser.Physics.Arcade.StaticGroup;
        
        tilesetType: string;
        dataToCompare: undefined;
        
        
        

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
            this.player = this.physics.add.existing(new Player(this, 30, 10, 'Lv1_Idle', 1));
            
            this.ground = this.add.rectangle(this.physics.world.bounds.width/2, this.physics.world.bounds.height-10, this.physics.world.bounds.width, 10, 0x008000);

            this.physics.world.enableBody(this.ground, 1);
            this.physics.add.collider(this.ground, this.player);
            //map
            this.currentMap = this.make.tilemap({key: "map1"});
            this.groundTileset = this.currentMap.addTilesetImage('terrain', 'overworld');
            
            this.backgroundTiles = this.physics.add.staticGroup();
            this.groundTiles = this.physics.add.staticGroup();

            this.tilesetType = "ov";
                
            if(this.groundTileset) {
                console.log("generating map")
                
                this.backgroundTileLayer = this.currentMap.getObjectLayer('background');
                // The following errors can be ignorded
                this.backgroundTileLayer.objects.forEach(object => {
                    console.log(object);
                    let tile = this.physics.add.staticSprite(object.x+8, object.y-8, this.tilesetType + (object.gid -1))
                    this.backgroundTiles.add(tile);
                    console.log(tile + " created")
                })

                this.groundLayer = this.currentMap.getObjectLayer('ground');
                // The following errors can be ignorded
                this.groundLayer.objects.forEach(object => {
                    let tile = this.physics.add.staticSprite(object.x+16, object.y-16, this.tilesetType + (object.gid -1));
                    
                    this.dataToCompare = tile.getData('wallSlideAllowed');
                    console.log(this.dataToCompare);
                    if(this.dataToCompare != undefined) {
                        if (this.dataToCompare == true) {
                            this.wallSlideTiles.add(tile);
                        }
                    }
                    this.dataToCompare = tile.getData('isPlatform');
                    console.log(this.dataToCompare);
                    if(this.dataToCompare != undefined) {
                        if (this.dataToCompare == true) {
                            this.platformTiles.add(tile);
                        }
                    }
                    this.dataToCompare = tile.getData('collides');
                    console.log(this.dataToCompare);
                    if(this.dataToCompare != undefined) {
                        if (this.dataToCompare == true) {
                            this.groundTiles.add(tile)
                        }
                    }
                    ;
                })

                
                this.objectLayer = this.currentMap.getObjectLayer('objects');
                
                this.objectLayer.objects.forEach(object => {
                    console.log(object.properties);
                    let tile = this.physics.add.staticSprite(object.x+8, object.y-8, this.tilesetType + (object.gid -1))
                    
                });
                
                //add colliders for this.player and this.crystals (see the this.walls collider above)
                //same thing for blocks
                //add functions for colliding with blocks and with crystals
                this.physics.add.collider(this.player, this.groundTiles);
                this.physics.add.collider(this.player, this.wallSlideTiles, this.wallSlideFunction, undefined, this);
                this.physics.add.collider(this.player, this.platformTiles, this.platformFunction, undefined, this);


                //DJWIAHDLWAHLDHWALIDAW

                /*  Was used to show current collision of the world border, currently unused.
                
                this.groundLayer?.renderDebug(debugGraphics, {
                    tileColor: null,
                    collidingTileColor: new Phaser.Display.Color(240, 230, 40, 255),
                    faceColor: new Phaser.Display.Color(200, 100, 240, 255)
                })
                    */
            }
            
            // player part 2
            this.add.existing(this.player);
            this.player.setPipeline('Light2D');
            this.physics.add.collider(this.player, this.groundLayer!,);

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
        platformFunction(player: Player, platform: Physics.Arcade.Sprite) {
            if(player.body!.bottom > platform.body!.top) {
                platform.body!.checkCollision.down = false;
            }
        }
        wallSlideFunction(player: Player, wall: any) {
            throw new Error('Method not implemented.');
        }

        
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
function createPlatform(this: any, tile: Tilemaps.Tile) {
    
    if (tile.properties) {

    }
}


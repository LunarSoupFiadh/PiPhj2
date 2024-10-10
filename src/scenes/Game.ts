    import { Physics, Scene, Tilemaps} from 'phaser';
    import { Player } from '../classes/Player';
    import { Block } from '../classes/Block';
import EnemySpawner from '../classes/EnemySpawner';

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
        animatedTileset: Tilemaps.Tileset | null;

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
        wallClimbables: Phaser.Physics.Arcade.StaticGroup;

        tilesetType: string;
        dataToCompare: undefined;
        animatedLayer: Tilemaps.TilemapLayer | null;
        background_0: Phaser.GameObjects.TileSprite;
        background_1: Phaser.GameObjects.TileSprite;
        background_2: Phaser.GameObjects.TileSprite;
        background_3: Phaser.GameObjects.TileSprite;
        background_4: Phaser.GameObjects.TileSprite;
        background_5: Phaser.GameObjects.TileSprite;
        background_6: Phaser.GameObjects.TileSprite;

        //enemies
        enemies: Phaser.Physics.Arcade.Group;
        

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
            this.animatedTileset = this.currentMap.addTilesetImage('animated', 'overworldAnim');
            
            this.backgroundTiles = this.physics.add.staticGroup();
            this.groundTiles = this.physics.add.staticGroup();
            this.wallClimbables = this.physics.add.staticGroup();

            this.enemies = this.physics.add.group();

            this.tilesetType = "ov";

            //background for parallax
            this.background_0 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_0");
            this.background_1 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_1");
            this.background_2 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_2");
            this.background_3 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_3");
            this.background_4 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_4");
            this.background_5 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_5");
            this.background_6 = this.add.tileSprite(0, 0, this.currentMap.width*16, this.currentMap.height*16, "AV_6");
            
            this.background_0.setScale(2);
            this.background_1.setScale(2);
            this.background_2.setScale(2);
            this.background_3.setScale(2);
            this.background_4.setScale(2);
            this.background_5.setScale(2);
            this.background_6.setScale(2);
            
            if(this.groundTileset) {
                console.log("generating map")
                
                this.backgroundTileLayer = this.currentMap.createLayer('background', this.groundTileset);
                /*
                // The following errors can be ignorded
                this.backgroundTileLayer.objects.forEach(object => {
                    console.log(object);
                    let tile = this.physics.add.staticSprite(object.x+16, object.y-16, this.tilesetType + (object.gid -1))
                    this.backgroundTiles.add(tile);
                    console.log(tile + " created")
                })
                */
                
                // The following errors can be ignorded
                this.groundLayer = this.currentMap.createLayer('ground', this.groundTileset);
                this.groundLayer?.setCollisionByProperty({"collides":true});
                this.groundLayer?.forEachTile(tile => {
                    if (tile.properties["isPlatform"]) {
                        tile.setCollision(false, false, true, false, true);
                    }
                    if (tile.properties["wallSlideAllowed"]) {
                        let wallClimbBlock = this.physics.add.staticSprite(tile.x*16+8, tile.y*16+8,'empty')
                        this.wallClimbables.add(wallClimbBlock);
                    }
                })
                this.physics.add.collider(this.player, this.wallClimbables, this.wallSlideFunction, undefined, this);
                this.animatedLayer = this.currentMap.createLayer('water', this.animatedTileset!);
                /*
                
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
*/

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
            this.physics.add.collider(this.player, this.groundLayer!,);

            

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
        
        wallSlideFunction(player: Player) {
            player.state = 'wallSlide';
            console.log("wallSlideTest");
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
        

        checkForScore(player: Player){
            if(player.score >= this.maxScore) {
                this.gameOver = true;
            }
        }



        // update based on template
        update ()
        {
            this.player.playerUpdate();
            this.updateParallax();
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
        updateParallax() {
            //Ich hasse diese Scheiße
            this.background_0.setX(this.camera.scrollX + this.camera.width);
            this.background_1.setX(this.camera.scrollX *0.99 + this.camera.width);
            this.background_2.setX(this.camera.scrollX *0.95 + this.camera.width);
            this.background_3.setX(this.camera.scrollX *0.90 + this.camera.width);
            this.background_4.setX(this.camera.scrollX *0.90 + this.camera.width);
            this.background_5.setX(this.camera.scrollX *0.90 + this.camera.width);
            this.background_6.setX(this.camera.scrollX + this.camera.width);

            this.background_0.setY(this.camera.scrollY/2);
            this.background_1.setY(this.camera.scrollY/2);
            this.background_2.setY(this.camera.scrollY/2);
            this.background_3.setY(this.camera.scrollY/2);
            this.background_4.setY(this.camera.scrollY/2);
            this.background_5.setY(this.camera.scrollY/2);
            this.background_6.setY(this.camera.scrollY/2);
        }
    }

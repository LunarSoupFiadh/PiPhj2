import { Scene } from 'phaser';

export class Preloader extends Scene
{
    map: any;
    tileset: any;
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.aseprite({
            key: 'player',
            textureURL: 'player/All_Anims.png',
            atlasURL: 'player/All_Anims.json'
        });

        this.load.aseprite({
            key: 'golem',
            textureURL: 'enemies/Golem.png',
            atlasURL: 'enemies/Golem.json'
        });
        this.load.aseprite({
            key: 'goblin',
            textureURL: 'enemies/EnemyGoblinSaber.png',
            atlasURL: 'enemies/EnemyGoblinSaber.json'
        });
        this.load.aseprite({
            key: 'slime',
            textureURL: 'enemies/EnemySlimeRevamped.png',
            atlasURL: 'enemies/EnemySlimeRevamped.json'
        });

        this.load.tilemapTiledJSON('map1', 'maps/map1.json');

        this.load.image("overworld", 'maps/Overworld.png');
        this.load.image("overworldAnim", 'maps/OverworldAnimation.png');
        this.load.image("underground", 'maps/Underground.png');
        this.load.image("undergroundAnim", 'maps/UndergroundAnimation.png');
        this.load.image("flowers", 'maps/Blumen.png');

        this.load.image("empty", 'tiles/terrain/overworld/2.png')

        //backgrounds for parallax
        for (let index = 0; index <= 6; index++) {
            this.load.image("AV_"+index, 'backgrounds/AV_' + index + ".png");
        }
        for (let index = 0; index <= 2; index++) {
            if (index != 0) {
                this.load.image("FM_"+index, 'backgrounds/FM_' + index + ".png");
            } else {
                this.load.image("FM_"+index, 'backgrounds/FM_' + index + ".gif");
            }
        }
        for (let index = 0; index <= 143; index++) {
            this.load.image("ov" + index, 'tiles/terrain/overworld/' + index + ".png");
            this.load.image("un" + index, 'tiles/terrain/overworld/' + index + ".png");
        }


    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.anims.createFromAseprite('player');
        this.anims.createFromAseprite('golem');
        this.anims.createFromAseprite('goblin');
        this.anims.createFromAseprite('slime');
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}

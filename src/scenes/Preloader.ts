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
            key: 'idle',
            textureURL: 'sprites/player_idle.png',
            atlasURL: 'sprites/player_idle.json'
        });
        this.load.aseprite({
            key: 'walk',
            textureURL: 'sprites/player_walk.png',
            atlasURL: 'sprites/player_walk.json'
        });
        this.load.aseprite({
            key: 'bird',
            textureURL: 'sprites/Animals WIP.png',
            atlasURL: 'sprites/Animals WIP.json'
        });
        this.load.image('logo', 'logo.png');
        this.load.image('debugTiles', 'sprites/DebugTiles.png');
        this.load.image('crystal', 'sprites/Crystal.png');
        
        this.load.aseprite({
            key: 'enemy',
            textureURL: 'sprites/Enemy.png',
            atlasURL: 'sprites/Enemy.json'
        });
        this.load.aseprite({
            key: 'enemySpawn',
            textureURL: 'sprites/EnemySpawn.png',
            atlasURL: 'sprites/EnemySpawn.json'
        });
        this.load.image('wall', 'sprites/Wall.png');
        this.load.image('block', 'sprites/Block.png');
        this.load.image('spawn', 'sprites/Spawn.png');

        this.load.tilemapTiledJSON('map0', 'maps/testmap.json');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.anims.createFromAseprite('walk');
        this.anims.createFromAseprite('idle');
        this.anims.createFromAseprite('bird');
        

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}

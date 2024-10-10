export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private static enemies: Enemy[] = []; // Static array that holds all enemies

    private enemyType: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, enemyType: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
    
        scene.physics.world.enableBody(this);
        this.setCollideWorldBounds(true);

        this.enemyType = enemyType;
        Enemy.enemies.push(this); // Automatically add an Enemy to the static array when it's created
        console.log(`Enemy of type ${this.enemyType} positioned at (${x}, ${y})`);
        this.anims.play('Idle', true);
    }

    public enemyUpdate(){
        this.anims.play("Idle",true);
    }

    public static getEnemies(): Enemy[] {
        return Enemy.enemies; // A Method which retrieves all Enemy's
    }
}
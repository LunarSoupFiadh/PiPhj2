export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    enemyType: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, enemyType:string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.enemyType = enemyType;

        scene.physics.world.enableBody(this);
        this.setCollideWorldBounds(true);
        
        this.anims.play('Idle', true);
    }

    public enemyUpdate(){
        this.anims.play(this.getAnimationByEnemyType(),true);
    }

    public setSizeAndScale() {
        switch(this.enemyType) {
            case "golem": super.setSize(52,52); break;
            case "goblin": 
            case "slime": super.setSize(26,26); this.setOffset(26,40);this.setScale(0.5); break;
            default: return "Idle";
        }
    }

    private getAnimationByEnemyType() {
        switch(this.enemyType) {
            case "golem": return "Idle";
            case "goblin": return "Attack";
            case "slime": return "Wobble";
            default: return "Idle";
        }
    }
}
export class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture){
   
       super(scene, x, y, texture, 0);

       scene.physics.world.enableBody(this);
       this.setCollideWorldBounds(true);
       this.body!.setSize(26, 26, true);
    }

    blockUpdate(){
        this.body!.velocity.x = this.body!.velocity.x * 0.6
        this.body!.velocity.y = this.body!.velocity.y * 0.6
        if (Math.abs(this.body!.velocity.x) < 20) {this.body!.velocity.x = 0;}
        if (Math.abs(this.body!.velocity.y) < 20) {this.body!.velocity.y = 0;}
        console.log('blub');
    }
}
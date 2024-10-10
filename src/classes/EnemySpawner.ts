import { Scene } from 'phaser';
import Enemy from './Enemy';



// Enemy list Access
const allEnemies = Enemy.getEnemies();
console.log(`Current enemies: ${allEnemies.length}`);

export default class EnemySpawner {
    public spawnRate: number;
    public enemyType: string;
    public spawnPosition: { x: number, y: number };
    public maxEnemies: number;
    public spawnedEnemies: number = 0;
    private enemies: Enemy[] = [];
    private scene: Scene;

    constructor(scene: Scene,spawnRate: number, enemyType: string, spawnPosition: { x: number, y: number }, maxEnemies: number) {
        this.scene = scene;
        this.spawnRate = spawnRate;
        this.enemyType = enemyType;
        this.spawnPosition = spawnPosition;
        this.maxEnemies = maxEnemies;
    }

    public startSpawning() {
        setInterval(() => {
            if (this.spawnedEnemies < this.maxEnemies) {
                this.spawnEnemy();
            }
        }, this.spawnRate);
    }

    private spawnEnemy() {
        const enemy = new Enemy(this.scene, this.spawnPosition.x, this.spawnPosition.y, 'golem', this.enemyType);

        enemy.setPosition(this.spawnPosition.x, this.spawnPosition.y);

        this.enemies.push(enemy);

        this.spawnedEnemies++;

        // Debug log
        console.log(`Spawned ${this.enemyType} at (${this.spawnPosition.x}, ${this.spawnPosition.y}). Total enemies: ${this.spawnedEnemies}`);
    }
}
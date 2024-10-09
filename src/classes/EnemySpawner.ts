import Enemy from './Enemy';

const enemy = new Enemy('goblin');
enemy.setPosition(100, 200);

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

    constructor(spawnRate: number, enemyType: string, spawnPosition: { x: number, y: number }, maxEnemies: number) {
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
        const enemy = new Enemy(this.enemyType);

        enemy.setPosition(this.spawnPosition.x, this.spawnPosition.y);

        this.enemies.push(enemy);

        this.spawnedEnemies++;

        // Debug log
        console.log(`Spawned ${this.enemyType} at (${this.spawnPosition.x}, ${this.spawnPosition.y}). Total enemies: ${this.spawnedEnemies}`);
    }
}
export default class Enemy {
    private static enemies: Enemy[] = []; // Static array that holds all enemies

    private type: string;

    constructor(type: string) {
        this.type = type;
        Enemy.enemies.push(this); // Automatically add an Enemy to the static array when it's created
    }

    public setPosition(x: number, y: number) {
        console.log(`Enemy of type ${this.type} positioned at (${x}, ${y})`);
    }

    public static getEnemies(): Enemy[] {
        return Enemy.enemies; // A Method which retrieves all Enemy's
    }
}
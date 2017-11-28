// Automatically generated by Eta v2's /scripts/generate.ts
export class Entity {
    public position: Vector2;
    public char: string;
    public color: string;
    public constructor(init: Partial<Entity>) {
        Object.assign(this, init);
    }
}
export class Level {
    public size: Vector2 = new Vector2(256, 32);
    public entities: Entity[] = [];
    public buildRender(): string {
        const rows: string[][] = new Array(this.size.y).fill(0).map(r => new Array(this.size.x).fill("."));
        this.entities.forEach(e => {
            let render: string = e.char;
            if (e.color) {
                render = `<span style="color: ${e.color};">${e.char}</span>`;
            }
            rows[e.position.y][e.position.x] = render;
        });
        return rows.map(r => r.join("")).join("\n");
    }
}
export class Vector2 {
    public x: number;
    public y: number;
    public constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    public add(other: Vector2 | number): Vector2 {
        return this.calculate(other, (a, b) => a + b);
    }
    public sub(other: Vector2 | number): Vector2 {
        return this.calculate(other, (a, b) => a - b);
    }
    public mul(other: Vector2 | number): Vector2 {
        return this.calculate(other, (a, b) => a * b);
    }
    public div(other: Vector2 | number): Vector2 {
        return this.calculate(other, (a, b) => a / b);
    }
    public min(other: Vector2 | number): Vector2 {
        return this.calculate(other, Math.min);
    }
    public max(other: Vector2 | number): Vector2 {
        return this.calculate(other, Math.max);
    }
    public getLinearDistance(other: Vector2): number {
        const distance = this.calculate(other, (a, b) => Math.pow(a - b, 2));
        return Math.sqrt(distance.x + distance.y);
    }
    /**
     * Moves this vector closer to 0 by "increment" amount
     */
    public toZero(increment: number): Vector2 {
        return this.calculate(increment, (v, i) => {
            if (v === 0) return 0;
            if (v > 0) return v - i;
            else return v + i;
        });
    }
    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
    public calculate(other: Vector2 | number, transform: (a: number, b: number) => number): Vector2 {
        if (typeof(other) === "number") {
            return new Vector2(transform(this.x, other), transform(this.y, other));
        } else {
            return new Vector2(transform(this.x, other.x), transform(this.y, other.y));
        }
    }
}
export class Player extends Entity {
    public char = "@";
    public color = "lightgreen";
}

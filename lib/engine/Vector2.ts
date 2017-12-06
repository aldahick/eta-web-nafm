export default class Vector2 {
    public x: number;
    public y: number;

    public constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public equals(other: Vector2): boolean {
        return other.x === this.x && other.y === this.y;
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

    public calculate(other: Vector2 | number, worker: (a: number, b: number) => number): Vector2 {
        if (typeof(other) === "number") {
            return new Vector2(worker(this.x, other), worker(this.y, other));
        } else {
            return new Vector2(worker(this.x, other.x), worker(this.y, other.y));
        }
    }

    public transform(worker: (value: number) => number): Vector2 {
        return new Vector2(worker(this.x), worker(this.y));
    }
}

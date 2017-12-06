import Direction from "./Direction";

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

    public lessThan(other: Vector2 | number): boolean {
        if (typeof(other) === "number") other = new Vector2(other, other);
        return other.x > this.x && other.y > this.y;
    }

    public moreThan(other: Vector2 | number): boolean {
        if (typeof(other) === "number") other = new Vector2(other, other);
        return other.x < this.x && other.y < this.y;
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

    public getLinePointsTo(other: Vector2): Vector2[] {
        const points: Vector2[] = [];
        const slope: number = (other.y - this.y) / (other.x - this.x);
        for (let x = this.x + 1; x < other.x; x++) {
            points.push(new Vector2(x, Math.floor(slope * x + this.y)));
        }
        return points;
    }

    public getDirectionTo(other: Vector2): Direction {
        if (this.y === other.y) {
            return this.x > other.x ? Direction.Left : Direction.Right;
        } else if (this.x === other.x) {
            return this.y > other.y ? Direction.Up : Direction.Down;
        }
        return undefined;
    }
}

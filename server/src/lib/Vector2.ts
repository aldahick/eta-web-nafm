export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) { }

  public calculate(other: Vector2 | number, worker: (a: number, b: number) => number): Vector2 {
    if (typeof(other) === "number") {
      return new Vector2(worker(this.x, other), worker(this.y, other));
    } else {
      return new Vector2(worker(this.x, other.x), worker(this.y, other.y));
    }
  }
}

import type { Vector3 } from "./vectors";

export class Ray {
    constructor(
        public origin: Vector3,
        public direction: Vector3
    ) {}

    pointAtParameter(t: number): Vector3 {
        return this.origin.add(this.direction.scale(t));
    }
}

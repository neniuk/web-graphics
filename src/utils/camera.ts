import { Vector3 } from "./vectors";

export interface Viewport {
    x: number;
    y: number;
    width: number;
    height: number;
    perspective: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface Perspective {
    fovY: number;
    near: number;
    far: number;
}

export class Camera {
    constructor(
        public dimensions: Dimensions,
        public viewport: Viewport,
        public perspective: Perspective,
        public position: Vector3,
        public rotation: Vector3
    ) {}
}

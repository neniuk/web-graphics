import { Vector3 } from "./vectors";
import type { Camera } from "./camera";
import type { Light } from "./light";
import type { Material } from "./material";
import type { ObjectBase } from "./object/object";

export class Scene {
    constructor(
        public camera: Camera,
        public lights: Light[],
        public objects: ObjectBase[],
        public materials: Material[],
        public ambientLight: Vector3 = Vector3.zero(),
        public backgroundColor: Vector3 = Vector3.zero()
    ) {}

    getNumLights(): number {
        return this.lights.length;
    }

    getLight(i: number): Light {
        return this.lights[i];
    }
}

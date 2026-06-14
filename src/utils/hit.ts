import { Material } from "./material";
import { Vector3 } from "./vectors";

export class Hit {
    constructor(
        public t: number = Number.POSITIVE_INFINITY,
        public material: Material | null = null,
        public normal: Vector3 = Vector3.zero()
    ) {}

    set(t: number, m: Material, n: Vector3): void {
        this.t = t;
        this.material = m;
        this.normal = n;
    }

    static copy(h: Hit): Hit {
        return new Hit(h.t, h.material, h.normal.clone());
    }
}

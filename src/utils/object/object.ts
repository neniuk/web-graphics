import { Hit } from "../hit";
import { Material } from "../material";
import { Ray } from "../ray";

export abstract class ObjectBase {
    constructor(protected material: Material) {}

    abstract intersect(ray: Ray, hit: Hit, tmin: number): boolean;
}

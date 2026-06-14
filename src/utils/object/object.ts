import { Hit } from "../hit";
import { Material } from "../material";
import { Ray } from "../ray";
import { Vector3 } from "../vectors";

export abstract class Object {
    constructor(protected material: Material) {}

    abstract intersect(ray: Ray, hit: Hit, tmin: number): boolean;
}

export class Triangle extends Object {
    constructor(
        public a: Vector3,
        public b: Vector3,
        public c: Vector3,
        public material: Material
    ) {
        super(material);
    }

    intersect(ray: Ray, hit: Hit, tmin: number): boolean {
        // const edgeBA: Vector3 = this.b.sub(this.a);
        // const edgeCA: Vector3 = this.c.sub(this.a);
        // const normal: Vector3 = edgeBA.cross(edgeCA);

        // const m: Matrix3 = Matrix3.zero();
        // m.setColumnVector3(0, edgeBA);
        // m.setColumnVector3(1, edgeCA);
        // m.setColumnVector3(2, ray.direction.negate());

        // const rhs: Vector3 = ray.origin.sub(this.a);

        // const x: Vector3 = m.inverse().mulv(rhs);
        // const beta: number = x.x;
        // const gamma: number = x.y;
        // const t: number = x.z;

        // if (beta + gamma > 1.0 || beta < 0.0 || gamma < 0.0 || t <= tmin || t >= hit.t) return false;

        // hit.set(t, this.material, normal.normalize());
        // return true;

        const edge1 = this.b.sub(this.a);
        const edge2 = this.c.sub(this.a);

        const pvec = ray.direction.cross(edge2);
        const det = edge1.dot(pvec);

        if (Math.abs(det) < 1e-8) return false;

        const invDet = 1 / det;

        const tvec = ray.origin.sub(this.a);
        const u = tvec.dot(pvec) * invDet;
        if (u < 0 || u > 1) return false;

        const qvec = tvec.cross(edge1);
        const v = ray.direction.dot(qvec) * invDet;
        if (v < 0 || u + v > 1) return false;

        const t = edge2.dot(qvec) * invDet;

        if (t <= tmin || t >= hit.t) return false;

        const normal = edge1.cross(edge2).normalize();

        hit.set(t, this.material, normal);
        return true;
    }
}

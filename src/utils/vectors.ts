// prettier-ignore
export class Vector2 {
    constructor(
        public x: number,
        public y: number
    ) {}

    static zero(): Vector2 {
        return new Vector2(0.0, 0.0);
    }

    add(v: Vector2): Vector2 {
        return new Vector2(
            this.x + v.x,
            this.y + v.y
        );
    }

    sub(v: Vector2): Vector2 {
        return new Vector2(
            this.x - v.x,
            this.y - v.y
        );
    }

    mul(v: Vector2): Vector2 {
        return new Vector2(
            this.x * v.x,
            this.y * v.y
        );
    }

    scale(n: number): Vector2 {
        return new Vector2(
            this.x * n,
            this.y * n
        );
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    normalize(): Vector2 {
        const len: number = this.length();
        if (len === 0) return Vector2.zero();
        return this.scale(1 / len);
    }

    reflect(n: Vector2): Vector2 {
        const scale: number = 2 * this.dot(n);
        return this.sub(n.scale(scale));
    }

    negate(): Vector2 {
        return this.scale(-1);
    }

    distance(v: Vector2): number {
        return this.sub(v).length();
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}

// prettier-ignore
export class Vector3 {
    constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}

    static zero(): Vector3 {
        return new Vector3(0.0, 0.0, 0.0);
    }

    static fromVector4(v: Vector4): Vector3 {
        return new Vector3(v.x, v.y, v.z);
    }

    toVector4(w: number = 1.0): Vector4 {
        return new Vector4(this.x, this.y, this.z, w);
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    add(v: Vector3): Vector3 {
        return new Vector3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }

    sub(v: Vector3): Vector3 {
        return new Vector3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }

    mul(v: Vector3): Vector3 {
        return new Vector3(
            this.x * v.x,
            this.y * v.y,
            this.z * v.z
        );
    }

    scale(n: number): Vector3 {
        return new Vector3(
            this.x * n,
            this.y * n,
            this.z * n
        );
    }

    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    normalize(): Vector3 {
        const len: number = this.length();
        if (len === 0) return Vector3.zero();
        return this.scale(1 / len);
    }

    reflect(n: Vector3): Vector3 {
        const scale: number = 2 * this.dot(n);
        return this.sub(n.scale(scale));
    }

    negate(): Vector3 {
        return this.scale(-1);
    }

    distance(v: Vector3): number {
        return this.sub(v).length();
    }
}

// prettier-ignore
export class Vector4 {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
    ) {}

    static zero(): Vector4 {
        return new Vector4(0.0, 0.0, 0.0, 0.0);
    }

    static fromVector3(v: Vector3, w: number = 1.0): Vector4 {
        return new Vector4(
            v.x,
            v.y,
            v.z,
            w
        );
    }

    toVector3(): Vector3 {
        return new Vector3(
            this.x,
            this.y,
            this.z
        );
    }

    clone(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    add(v: Vector4): Vector4 {
        return new Vector4(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z,
            this.w + v.w
        );
    }

    sub(v: Vector4): Vector4 {
        return new Vector4(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z,
            this.w - v.w
        );
    }

    mul(v: Vector4): Vector4 {
        return new Vector4(
            this.x * v.x,
            this.y * v.y,
            this.z * v.z,
            this.w * v.w
        );
    }

    scale(n: number): Vector4 {
        return new Vector4(
            this.x * n,
            this.y * n,
            this.z * n,
            this.w * n
        );
    }

    dot(v: Vector4): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    normalize(): Vector4 {
        const len: number = this.length();
        if (len === 0) return Vector4.zero();
        return this.scale(1 / len);
    }

    reflect(n: Vector4): Vector4 {
        const scale: number = 2 * this.dot(n);
        return this.sub(n.scale(scale));
    }

    negate(): Vector4 {
        return this.scale(-1);
    }

    distance(v: Vector4): number {
        return this.sub(v).length();
    }
}

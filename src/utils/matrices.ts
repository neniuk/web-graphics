import type { Vector4 } from "./vectors";

type _Matrix4x4 = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
];

export class Matrix4 {
    constructor(private _data: _Matrix4x4) {}

    get(row: number, col: number): number {
        return this._data[row][col];
    }

    set(row: number, col: number, value: number): void {
        this._data[row][col] = value;
    }

    static identity(): Matrix4 {
        return new Matrix4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    static zero(): Matrix4 {
        return new Matrix4([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]);
    }

    multiplyM(matrix: Matrix4): Matrix4 {
        const a: _Matrix4x4 = this._data;
        const b: _Matrix4x4 = matrix._data;

        const ab: _Matrix4x4 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        for (let i = 0; i < 4; i++) {
            const a0: number = a[i][0];
            const a1: number = a[i][1];
            const a2: number = a[i][2];
            const a3: number = a[i][3];

            ab[i][0] = a0 * b[0][0] + a1 * b[1][0] + a2 * b[2][0] + a3 * b[3][0];
            ab[i][1] = a0 * b[0][1] + a1 * b[1][1] + a2 * b[2][1] + a3 * b[3][1];
            ab[i][2] = a0 * b[0][2] + a1 * b[1][2] + a2 * b[2][2] + a3 * b[3][2];
            ab[i][3] = a0 * b[0][3] + a1 * b[1][3] + a2 * b[2][3] + a3 * b[3][3];
        }

        return new Matrix4(ab);
    }

    multiplyV(vector: Vector4): Vector4 {
        const x =
            vector.x * this.get(0, 0) +
            vector.y * this.get(0, 1) +
            vector.z * this.get(0, 2) +
            vector.w * this.get(0, 3);
        const y =
            vector.x * this.get(1, 0) +
            vector.y * this.get(1, 1) +
            vector.z * this.get(1, 2) +
            vector.w * this.get(1, 3);
        const z =
            vector.x * this.get(2, 0) +
            vector.y * this.get(2, 1) +
            vector.z * this.get(2, 2) +
            vector.w * this.get(2, 3);
        const w =
            vector.x * this.get(3, 0) +
            vector.y * this.get(3, 1) +
            vector.z * this.get(3, 2) +
            vector.w * this.get(3, 3);

        return { x, y, z, w };
    }
}

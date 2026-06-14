import { Vector3, Vector4 } from "./vectors";

// prettier-ignore
type _Matrix4x4 = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
];

// prettier-ignore
type _Matrix3x3 = [
    [number, number, number],
    [number, number, number],
    [number, number, number],
]

export class Matrix3 {
    constructor(private _data: _Matrix3x3) {}

    static identity(): Matrix3 {
        return new Matrix3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]);
    }

    static zero(): Matrix3 {
        return new Matrix3([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    }

    get(row: number, col: number): number {
        if (row < 0 || row > 2 || col < 0 || col > 2) throw new Error(`Invalid row or col indices for Matrix3`);
        return this._data[row][col];
    }

    set(row: number, col: number, value: number): void {
        if (row < 0 || row > 2 || col < 0 || col > 2) throw new Error(`Invalid row or col indices for Matrix3`);
        this._data[row][col] = value;
    }

    getRowVector3(row: number): Vector3 {
        if (row < 0 || row > 2) throw new Error("Invalid row index for Matrix3");

        return new Vector3(this._data[row][0], this._data[row][1], this._data[row][2]);
    }

    setRowVector3(row: number, vector: Vector3): void {
        if (row < 0 || row > 2) throw new Error("Invalid row index for Matrix3");

        this._data[row][0] = vector.x;
        this._data[row][1] = vector.y;
        this._data[row][2] = vector.z;
    }

    getColumnVector3(col: number): Vector3 {
        if (col < 0 || col > 2) throw new Error("Invalid column index for Matrix3");

        return new Vector3(this._data[0][col], this._data[1][col], this._data[2][col]);
    }

    setColumnVector3(col: number, vector: Vector3): void {
        if (col < 0 || col > 2) throw new Error("Invalid column index for Matrix3");

        this._data[0][col] = vector.x;
        this._data[1][col] = vector.y;
        this._data[2][col] = vector.z;
    }

    mulm(matrix: Matrix3): Matrix3 {
        const a: _Matrix3x3 = this._data;
        const b: _Matrix3x3 = matrix._data;

        const ab: _Matrix3x3 = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        for (let i = 0; i < 3; ++i) {
            const a0: number = a[i][0];
            const a1: number = a[i][1];
            const a2: number = a[i][2];

            ab[i][0] = a0 * b[0][0] + a1 * b[1][0] + a2 * b[2][0];
            ab[i][1] = a0 * b[0][1] + a1 * b[1][1] + a2 * b[2][1];
            ab[i][2] = a0 * b[0][2] + a1 * b[1][2] + a2 * b[2][2];
        }

        return new Matrix3(ab);
    }

    mulv(vector: Vector3): Vector3 {
        const x = vector.x * this.get(0, 0) + vector.y * this.get(0, 1) + vector.z * this.get(0, 2);
        const y = vector.x * this.get(1, 0) + vector.y * this.get(1, 1) + vector.z * this.get(1, 2);
        const z = vector.x * this.get(2, 0) + vector.y * this.get(2, 1) + vector.z * this.get(2, 2);

        return new Vector3(x, y, z);
    }

    inverse(): Matrix3 {
        const a = this.get(0, 0);
        const b = this.get(0, 1);
        const c = this.get(0, 2);

        const d = this.get(1, 0);
        const e = this.get(1, 1);
        const f = this.get(1, 2);

        const g = this.get(2, 0);
        const h = this.get(2, 1);
        const i = this.get(2, 2);

        const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

        if (Math.abs(det) < 1e-8) {
            throw new Error("Matrix is not invertible (Matrix3)");
        }

        const invDet = 1.0 / det;
        return new Matrix3([
            [(e * i - f * h) * invDet, (c * h - b * i) * invDet, (b * f - c * e) * invDet],
            [(f * g - d * i) * invDet, (a * i - c * g) * invDet, (c * d - a * f) * invDet],
            [(d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet],
        ]);
    }
}

export class Matrix4 {
    constructor(private _data: _Matrix4x4) {}

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

    get(row: number, col: number): number {
        if (row < 0 || row > 3 || col < 0 || col > 3) throw new Error(`Invalid row or col indices for Matrix4`);
        return this._data[row][col];
    }

    set(row: number, col: number, value: number): void {
        if (row < 0 || row > 3 || col < 0 || col > 3) throw new Error(`Invalid row or col indices for Matrix4`);
        this._data[row][col] = value;
    }

    getRowVector4(row: number): Vector4 {
        if (row < 0 || row > 3) throw new Error("Invalid row index for Matrix4");

        return new Vector4(this._data[row][0], this._data[row][1], this._data[row][2], this._data[row][3]);
    }

    setRowVector4(row: number, vector: Vector4): void {
        if (row < 0 || row > 3) throw new Error("Invalid row index for Matrix4");

        this._data[row][0] = vector.x;
        this._data[row][1] = vector.y;
        this._data[row][2] = vector.z;
        this._data[row][3] = vector.w;
    }

    getColumnVector4(col: number): Vector4 {
        if (col < 0 || col > 3) throw new Error("Invalid column index for Matrix4");

        return new Vector4(this._data[0][col], this._data[1][col], this._data[2][col], this._data[3][col]);
    }

    setColumnVector4(col: number, vector: Vector4): void {
        if (col < 0 || col > 3) throw new Error("Invalid column index for Matrix4");

        this._data[0][col] = vector.x;
        this._data[1][col] = vector.y;
        this._data[2][col] = vector.z;
        this._data[3][col] = vector.w;
    }

    mulm(matrix: Matrix4): Matrix4 {
        const a: _Matrix4x4 = this._data;
        const b: _Matrix4x4 = matrix._data;

        const ab: _Matrix4x4 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        for (let i = 0; i < 4; ++i) {
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

    mulv(vector: Vector4): Vector4 {
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

        return new Vector4(x, y, z, w);
    }

    inverse(): Matrix4 {
        const n = 4;

        const m: number[][] = [];
        for (let i = 0; i < n; i++) {
            m[i] = [];
            for (let j = 0; j < n; j++) {
                m[i][j] = this._data[i][j];
            }
            for (let j = 0; j < n; j++) {
                m[i][j + n] = i === j ? 1 : 0;
            }
        }

        for (let col = 0; col < n; col++) {
            let pivotRow = col;
            let maxVal = Math.abs(m[col][col]);

            for (let r = col + 1; r < n; r++) {
                const val = Math.abs(m[r][col]);
                if (val > maxVal) {
                    maxVal = val;
                    pivotRow = r;
                }
            }

            if (maxVal === 0) throw new Error("Matrix is not invertible (Matrix4)");

            if (pivotRow !== col) {
                [m[col], m[pivotRow]] = [m[pivotRow], m[col]];
            }

            const pivot = m[col][col];
            for (let j = 0; j < 2 * n; j++) {
                m[col][j] /= pivot;
            }

            for (let r = 0; r < n; r++) {
                if (r === col) continue;

                const factor = m[r][col];
                for (let j = 0; j < 2 * n; j++) {
                    m[r][j] -= factor * m[col][j];
                }
            }
        }

        const result: _Matrix4x4 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                result[i][j] = m[i][j + n];
            }
        }

        return new Matrix4(result);
    }
}

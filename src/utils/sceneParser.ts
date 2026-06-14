import { Vector3 } from "./vectors";
import { Camera } from "./camera";
import { Light } from "./light";
import { Material } from "./material";

export enum ProjectionType {
    Orthographic,
    Perspective,
}

export class SceneParser {
    private _camera: Camera | null = null;

    private _backgroundColor: Vector3 = Vector3.zero();
    private _ambientLight: Vector3 = Vector3.zero();

    private _lights: Light[] = [];
    private _materials: Material[] = [];

    private _currentMaterial: Material | null = null;

    private _group: GroupObject | null = null;

    constructor(filename?: string) {
        if (filename) this.parseFile();
    }

    get camera(): Camera | null {
        return this._camera;
    }

    set camera(camera: Camera) {
        this._camera = camera;
    }

    get backgroundColor(): Vector3 {
        return this._backgroundColor;
    }

    get ambientLight(): Vector3 {
        return this._ambientLight;
    }

    getNumLights(): number {
        return this._lights.length;
    }

    getLight(i: number): Light {
        if (i < 0 || i >= this._lights.length) {
            throw new Error("Light index out of bounds");
        }
        return this._lights[i];
    }

    getNumMaterials(): number {
        return this._materials.length;
    }

    getMaterial(i: number): Material {
        if (i < 0 || i >= this._materials.length) {
            throw new Error("Material index out of bounds");
        }
        return this._materials[i];
    }

    get group(): GroupObject | null {
        return this._group;
    }

    parseFile();
}

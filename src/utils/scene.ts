import * as fs from "fs";
import type { Camera } from "./camera";
import type { Light } from "./light";
import type { Material } from "./material";
import type { Object } from "./object/object";
import { Vector3 } from "./vectors";

export class Scene {
    constructor(
        public camera: Camera,
        public lights: Light[],
        public objects: Object[],
        public materials: Material[]
    ) {}

    loadGltf(path: string) {
        this.renderCache.subMeshes.clear();
        this.renderCache.vertices.clear();
        this.renderCache.indices.clear();
        this.renderCache.boundingBoxMin = new Vector3(
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY
        );
        this.renderCache.boundingBoxMax = new Vector3(
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY
        );

        const gltf: any = JSON.parse(fs.readFileSync(file, "utf8"));
        const buffer = fs.readFileSync(binPath);
    }
}

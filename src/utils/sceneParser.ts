import { Vector3 } from "./vectors";
import { Quaternion, Vector3 as ThreeVector3 } from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import type { BufferGeometry, Group, Mesh, Object3D, Object3DEventMap, TypedArray } from "three";
import { Triangle } from "./object/triangle";
import { Scene } from "./scene";
import { DirectionalLight, Light, PointLight } from "./light";
import { Camera } from "./camera";
import { PhongMaterial } from "./material";

export enum ProjectionType {
    Orthographic,
    Perspective,
}

export class SceneParser {
    constructor(
        public sceneUrl: string,
        public gltf: GLTF | null = null,
        public width: number,
        public height: number
    ) {}

    async loadGltf() {
        const loader: GLTFLoader = new GLTFLoader();

        const loadedGltf: GLTF = await loader.loadAsync(this.sceneUrl);
        this.gltf = loadedGltf;
    }

    readVertex(arr: TypedArray, i: number) {
        return new Vector3(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]);
    }

    private fromThreeVector(v: ThreeVector3): Vector3 {
        return new Vector3(v.x, v.y, v.z);
    }

    extractTriangles(scene: Group): Triangle[] {
        const triangles: Triangle[] = [];

        scene.traverse((obj: Object3D<Object3DEventMap>) => {
            const mesh = obj as Mesh;
            if (!mesh.isMesh) return;

            const geometry = mesh.geometry as BufferGeometry;
            geometry.applyMatrix4(mesh.matrixWorld);

            const pos: TypedArray = geometry.attributes.position.array;
            const index: TypedArray | undefined = geometry.index?.array;

            if (!index) return;

            for (let i = 0; i < index.length; i += 3) {
                const a = this.readVertex(pos, index[i]);
                const b = this.readVertex(pos, index[i + 1]);
                const c = this.readVertex(pos, index[i + 2]);

                triangles.push(new Triangle(a, b, c, this.createDefaultPhongMaterial()));
            }
        });

        return triangles;
    }

    buildScene(): Scene {
        const triangles: Triangle[] = [];
        const lights: Light[] = [];

        const gltf = this.gltf!;
        const scene = gltf.scene;

        const material = this.createDefaultPhongMaterial();

        let camera: Camera = this.createDefaultCamera();
        let ambientLight = new Vector3(0.2, 0.2, 0.2);

        scene.updateWorldMatrix(true, true);

        scene.traverse((obj: Object3D<Object3DEventMap>) => {
            // ---- Camera ----
            if ((obj as any).isPerspectiveCamera) {
                const cam = obj as any;
                const worldPosition = new ThreeVector3();
                const worldQuaternion = new Quaternion();
                const right = new ThreeVector3(1, 0, 0);
                const up = new ThreeVector3(0, 1, 0);
                const forward = new ThreeVector3(0, 0, -1);

                cam.getWorldPosition(worldPosition);
                cam.getWorldQuaternion(worldQuaternion);
                right.applyQuaternion(worldQuaternion).normalize();
                up.applyQuaternion(worldQuaternion).normalize();
                forward.applyQuaternion(worldQuaternion).normalize();

                camera = {
                    dimensions: {
                        width: this.width,
                        height: this.height,
                    },
                    viewport: {
                        x: 0,
                        y: 0,
                        width: this.width,
                        height: this.height,
                        perspective: this.width / this.height,
                    },
                    perspective: {
                        fovY: (cam.fov * Math.PI) / 180.0,
                        near: cam.near,
                        far: cam.far,
                    },
                    position: this.fromThreeVector(worldPosition),
                    rotation: new Vector3(cam.rotation.x, cam.rotation.y, cam.rotation.z),
                    basis: {
                        right: this.fromThreeVector(right),
                        up: this.fromThreeVector(up),
                        forward: this.fromThreeVector(forward),
                    },
                };
            }

            // ---- Lights ----
            if ((obj as any).isAmbientLight) {
                const light = obj as any;

                ambientLight = new Vector3(
                    light.color.r * light.intensity,
                    light.color.g * light.intensity,
                    light.color.b * light.intensity
                );
            }

            if ((obj as any).isPointLight) {
                const light = obj as any;
                const position = new ThreeVector3();
                light.getWorldPosition(position);

                lights.push(
                    new PointLight(
                        this.fromThreeVector(position),
                        new Vector3(
                            light.color.r * light.intensity,
                            light.color.g * light.intensity,
                            light.color.b * light.intensity
                        ),
                        0.0,
                        0.0,
                        1.0
                    )
                );
            }

            if ((obj as any).isDirectionalLight) {
                const light = obj as any;
                const worldQuaternion = new Quaternion();
                light.getWorldQuaternion(worldQuaternion);
                const direction = new ThreeVector3(0, 0, -1).applyQuaternion(worldQuaternion).normalize();

                lights.push(
                    new DirectionalLight(
                        this.fromThreeVector(direction),
                        new Vector3(
                            light.color.r * light.intensity,
                            light.color.g * light.intensity,
                            light.color.b * light.intensity
                        )
                    )
                );
            }

            // ---- Meshes ----
            const mesh = obj as Mesh;
            if (!mesh.isMesh) {
                return;
            }

            const geometry = (mesh.geometry as BufferGeometry).clone();
            geometry.applyMatrix4(mesh.matrixWorld);

            const pos = geometry.attributes.position.array;
            const index = geometry.index?.array;

            if (!index) {
                return;
            }

            for (let i = 0; i < index.length; i += 3) {
                const a = this.readVertex(pos, index[i]);
                const b = this.readVertex(pos, index[i + 1]);
                const c = this.readVertex(pos, index[i + 2]);

                triangles.push(new Triangle(a, b, c, material));
            }
        });

        return new Scene(camera, lights, triangles, [], ambientLight);
    }

    createDefaultCamera(): Camera {
        return {
            dimensions: { width: this.width, height: this.height },
            viewport: {
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                perspective: this.width / this.height,
            },
            perspective: { fovY: 1.0, near: 0.1, far: 1000.0 },
            position: new Vector3(0.0, 0.0, 10),
            rotation: Vector3.zero(),
        };
    }

    createDefaultPhongMaterial(): PhongMaterial {
        return new PhongMaterial(new Vector3(0.8, 0.8, 0.8), Vector3.zero(), new Vector3(1.0, 1.0, 1.0), 32);
    }
}

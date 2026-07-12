import { Vector2, Vector3, Vector4 } from "./vectors";
import { Matrix4 } from "./matrices";
import { Camera } from "./camera";
import { RayTracer } from "./rayTracer";
import { Ray } from "./ray";
import { Hit } from "./hit";

export interface Vertex {
    position: Vector3;
    normal: Vector3;
}

export interface Model {
    vertices: Vertex[];
    faces: number[][];
}

export interface Transformations {
    translation: Vector3;
    rotation: Vector3;
    scaling: Vector3;
}

export class Renderer {
    private _ctx: CanvasRenderingContext2D;
    private _camera: Camera;
    private _transformations: Transformations;

    constructor(camera: Camera, ctx: CanvasRenderingContext2D) {
        this._ctx = ctx;
        this._ctx.fillStyle = "rgb(255 255 255)";
        this._camera = camera;
        this._transformations = {
            translation: Vector3.zero(),
            rotation: Vector3.zero(),
            scaling: new Vector3(1.0, 1.0, 1.0),
        };
    }

    resize(width: number, height: number): void {
        this._camera.dimensions.width = width;
        this._camera.dimensions.height = height;
        this._camera.viewport.width = width;
        this._camera.viewport.height = height;
        this._camera.viewport.perspective = width / height;
    }

    translate(vec: Vector3): void {
        this._transformations.translation.x += vec.x;
        this._transformations.translation.y += vec.y;
        this._transformations.translation.z += vec.z;
    }

    rotateY(angle: number): void {
        this._transformations.rotation.y += angle;
    }

    rotateX(angle: number): void {
        this._transformations.rotation.x += angle;
    }

    rotateZ(angle: number): void {
        this._transformations.rotation.z += angle;
    }

    scale(s: number): void {
        this._transformations.scaling.x *= s;
        this._transformations.scaling.y *= s;
        this._transformations.scaling.z *= s;
    }

    private _NDCToScreen(vec: Vector3): Vector2 {
        const screenX = ((vec.x + 1.0) / 2.0) * this._camera.dimensions.width;
        const screenY = ((1.0 - vec.y) / 2.0) * this._camera.dimensions.height;
        return new Vector2(screenX, screenY);
    }

    private _modelToWorldMatrix(): Matrix4 {
        const translation: Matrix4 = Matrix4.identity();
        translation.set(0, 3, this._transformations.translation.x);
        translation.set(1, 3, this._transformations.translation.y);
        translation.set(2, 3, this._transformations.translation.z);

        const rotation: Matrix4 = Matrix4.identity();
        rotation.set(0, 0, Math.cos(this._transformations.rotation.y));
        rotation.set(0, 2, Math.sin(this._transformations.rotation.y));
        rotation.set(2, 0, -Math.sin(this._transformations.rotation.y));
        rotation.set(2, 2, Math.cos(this._transformations.rotation.y));

        const scaling: Matrix4 = Matrix4.identity();
        scaling.set(0, 0, this._transformations.scaling.x);
        scaling.set(1, 1, this._transformations.scaling.y);
        scaling.set(2, 2, this._transformations.scaling.z);

        return translation.mulm(rotation).mulm(scaling);
    }

    private _worldToCameraMatrix(): Matrix4 {
        if (this._camera.basis) {
            const { right, up, forward } = this._camera.basis;
            const cameraPosition = this._camera.position;
            const backward = forward.negate();

            const matrix = Matrix4.identity();
            matrix.set(0, 0, right.x);
            matrix.set(0, 1, right.y);
            matrix.set(0, 2, right.z);
            matrix.set(0, 3, -right.dot(cameraPosition));
            matrix.set(1, 0, up.x);
            matrix.set(1, 1, up.y);
            matrix.set(1, 2, up.z);
            matrix.set(1, 3, -up.dot(cameraPosition));
            matrix.set(2, 0, backward.x);
            matrix.set(2, 1, backward.y);
            matrix.set(2, 2, backward.z);
            matrix.set(2, 3, -backward.dot(cameraPosition));

            return matrix;
        }

        const cameraPosition = this._camera.position;
        const cameraRotation = this._camera.rotation;

        const translation = Matrix4.identity();
        translation.set(0, 3, -cameraPosition.x);
        translation.set(1, 3, -cameraPosition.y);
        translation.set(2, 3, -cameraPosition.z);

        const rotation_x = Matrix4.identity();
        rotation_x.set(1, 1, Math.cos(-cameraRotation.x));
        rotation_x.set(1, 2, -Math.sin(-cameraRotation.x));
        rotation_x.set(2, 1, Math.sin(-cameraRotation.x));
        rotation_x.set(2, 2, Math.cos(-cameraRotation.x));

        const rotation_y = Matrix4.identity();
        rotation_y.set(0, 0, Math.cos(-cameraRotation.y));
        rotation_y.set(0, 2, Math.sin(-cameraRotation.y));
        rotation_y.set(2, 0, -Math.sin(-cameraRotation.y));
        rotation_y.set(2, 2, Math.cos(-cameraRotation.y));

        const rotation_z = Matrix4.identity();
        rotation_z.set(0, 0, Math.cos(-cameraRotation.z));
        rotation_z.set(0, 1, -Math.sin(-cameraRotation.z));
        rotation_z.set(1, 0, Math.sin(-cameraRotation.z));
        rotation_z.set(1, 1, Math.cos(-cameraRotation.z));

        const rotation = rotation_z.mulm(rotation_y).mulm(rotation_x);

        return rotation.mulm(translation);
    }

    private _cameraToClipMatrix(): Matrix4 {
        const fovY = this._camera.perspective.fovY;
        const aspect = this._camera.dimensions.width / this._camera.dimensions.height;
        const near = this._camera.perspective.near;
        const far = this._camera.perspective.far;

        const f = 1.0 / Math.tan(fovY * 0.5);
        const matrix = Matrix4.zero();
        matrix.set(0, 0, f / aspect);
        matrix.set(1, 1, f);
        matrix.set(2, 2, (far + near) / (near - far));
        matrix.set(2, 3, (2 * far * near) / (near - far));
        matrix.set(3, 2, -1);
        return matrix;
    }

    drawTriangleMesh(model: Model) {
        const modelToWorld = this._modelToWorldMatrix();
        const worldToCamera = this._worldToCameraMatrix();
        const cameraToClip = this._cameraToClipMatrix();

        const verticesLength: number = model.vertices.length;
        const faces: number[][] = model.faces;
        for (let i = 0; i < faces.length; i++) {
            const face = faces[i];
            if (face.length !== 3) continue;

            const v1Idx = face[0];
            const v2Idx = face[1];
            const v3Idx = face[2];
            if (
                !(
                    v1Idx >= 0 &&
                    v1Idx < verticesLength &&
                    v2Idx >= 0 &&
                    v2Idx < verticesLength &&
                    v3Idx >= 0 &&
                    v3Idx < verticesLength
                )
            )
                continue;

            const v1: Vertex = model.vertices[v1Idx];
            const v2: Vertex = model.vertices[v2Idx];
            const v3: Vertex = model.vertices[v3Idx];

            const vec1: Vector4 = Vector4.fromVector3(v1.position);
            const vec2: Vector4 = Vector4.fromVector3(v2.position);
            const vec3: Vector4 = Vector4.fromVector3(v3.position);

            const worldV1 = modelToWorld.mulv(vec1);
            const worldV2 = modelToWorld.mulv(vec2);
            const worldV3 = modelToWorld.mulv(vec3);

            const cameraV1 = worldToCamera.mulv(worldV1);
            const cameraV2 = worldToCamera.mulv(worldV2);
            const cameraV3 = worldToCamera.mulv(worldV3);

            const clipV1 = cameraToClip.mulv(cameraV1);
            const clipV2 = cameraToClip.mulv(cameraV2);
            const clipV3 = cameraToClip.mulv(cameraV3);

            if (clipV1.w <= 0 || clipV2.w <= 0 || clipV3.w <= 0) continue;

            const ndcV1: Vector3 = new Vector3(clipV1.x / clipV1.w, clipV1.y / clipV1.w, clipV1.z / clipV1.w);
            const ndcV2: Vector3 = new Vector3(clipV2.x / clipV2.w, clipV2.y / clipV2.w, clipV2.z / clipV2.w);
            const ndcV3: Vector3 = new Vector3(clipV3.x / clipV3.w, clipV3.y / clipV3.w, clipV3.z / clipV3.w);

            const screenV1: Vector2 = this._NDCToScreen(ndcV1);
            const screenV2: Vector2 = this._NDCToScreen(ndcV2);
            const screenV3: Vector2 = this._NDCToScreen(ndcV3);

            this.drawTriangle(screenV1, screenV2, screenV3);
        }
    }

    clear() {
        this._ctx.clearRect(0, 0, this._camera.dimensions.width, this._camera.dimensions.height);
    }

    drawRayTraced(rayTracer: RayTracer) {
        const width = rayTracer.renderWidth;
        const height = rayTracer.renderHeight;

        const imageData = this._ctx.createImageData(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const ray = this.makeCameraRay(x, y, width, height);

                const hit = new Hit(Number.POSITIVE_INFINITY);

                const color = rayTracer.traceRay(ray, 1e-4, 3, 1.0, hit);

                const i = (y * width + x) * 4;
                imageData.data[i + 0] = Math.min(255, Math.max(0, color.x * 255));
                imageData.data[i + 1] = Math.min(255, Math.max(0, color.y * 255));
                imageData.data[i + 2] = Math.min(255, Math.max(0, color.z * 255));
                imageData.data[i + 3] = 255;
            }
        }

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;

        const tempCtx = tempCanvas.getContext("2d")!;
        tempCtx.putImageData(imageData, 0, 0);

        this._ctx.imageSmoothingEnabled = false;

        this._ctx.drawImage(tempCanvas, 0, 0, this._camera.dimensions.width, this._camera.dimensions.height);
    }

    makeCameraRay(x: number, y: number, width: number, height: number): Ray {
        const aspect = width / height;
        const fov = this._camera.perspective.fovY;
        const scale = Math.tan(fov * 0.5);

        const px = (((x + 0.5) / width) * 2 - 1) * aspect * scale;
        const py = (1 - ((y + 0.5) / height) * 2) * scale;

        if (this._camera.basis) {
            const { right, up, forward } = this._camera.basis;
            const dir = right.scale(px).add(up.scale(py)).add(forward).normalize();

            return new Ray(this._camera.position, dir);
        }

        let dir = new Vector3(px, py, -1).normalize();

        const rot = this._camera.rotation;

        let cy = Math.cos(rot.z);
        let sy = Math.sin(rot.z);
        dir = new Vector3(dir.x * cy - dir.y * sy, dir.x * sy + dir.y * cy, dir.z);

        cy = Math.cos(rot.y);
        sy = Math.sin(rot.y);
        dir = new Vector3(dir.x * cy + dir.z * sy, dir.y, -dir.x * sy + dir.z * cy);

        cy = Math.cos(rot.x);
        sy = Math.sin(rot.x);
        dir = new Vector3(dir.x, dir.y * cy - dir.z * sy, dir.y * sy + dir.z * cy);

        return new Ray(this._camera.position, dir.normalize());
    }

    drawTriangle(vec1: Vector2, vec2: Vector2, vec3: Vector2) {
        this._ctx.fillStyle = `rgb(255 255 255)`;

        this._ctx.beginPath();
        this._ctx.moveTo(vec1.x, vec1.y);
        this._ctx.lineTo(vec2.x, vec2.y);
        this._ctx.lineTo(vec3.x, vec3.y);
        this._ctx.closePath();

        this._ctx.fill();
    }

    drawPoint(vtx: Vertex, size: number = 10) {
        this._ctx.fillRect(vtx.position.x, vtx.position.y, size, size);
    }

    drawPoints(vtxs: Vertex[], size: number = 10) {
        vtxs.forEach((vtx: Vertex) => {
            this._ctx.fillRect(vtx.position.x, vtx.position.y, size, size);
        });
    }
}

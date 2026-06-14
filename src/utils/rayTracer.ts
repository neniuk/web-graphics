import { Hit } from "./hit";
import { Ray } from "./ray";
import { Vector3 } from "./vectors";
import { SceneParser } from "./sceneParser";
import { AppState } from "./appState";
import type { Material } from "./material";
import type { IncidentIllumination } from "./light";

export class RayTracer {
    constructor(
        private _scene: SceneParser,
        private _state: AppState
    ) {}

    traceRay(ray: Ray, tmin: number, bounces: number, refractionIndex: number, hit: Hit): Vector3 {
        hit = new Hit(Number.POSITIVE_INFINITY);

        let intersect: boolean = false;
        if (this._scene.group != null) {
            intersect = this._scene.group.intersect(ray, hit, tmin);
        }

        if (!intersect) return this._scene.backgroundColor;

        const material: Material | null = hit.material;
        if (material == null) throw new Error("Material does not exist");

        const normal: Vector3 = hit.normal;
        const point: Vector3 = ray.pointAtParameter(hit.t);

        let answer: Vector3 = this._scene.ambientLight.mul(material.diffuseColor(point));
        for (let i: number = 0; i < this._scene.getNumLights(); ++i) {
            const incidentIllumination: IncidentIllumination = this._scene.getLight(i).getIncidentIllumination(point);

            let blocked: boolean = false;
            if (this._state.shadows) {
                const epsilon: number = 1e-4;
                const sOrigin: Vector3 = point.add(normal.scale(epsilon));
                const sRay: Ray = new Ray(sOrigin, incidentIllumination.dirToLight);

                const sHit: Hit = new Hit(Number.POSITIVE_INFINITY);
                if (this._scene.group.intersect(sRay, sHit, epsilon)) {
                    if (sHit.t < incidentIllumination.distance - epsilon) blocked = true;
                }
            }

            if (!blocked) {
                answer = answer.add(
                    material.shade(
                        ray,
                        hit,
                        incidentIllumination.dirToLight,
                        incidentIllumination.incidentIntensity,
                        this._state.shadeBack
                    )
                );
            }
        }

        if (bounces >= 1) {
            if (material.reflectiveColor(point).length() > 0.0) {
                const epsilon: number = 1e-4;

                const dirNormalized = ray.direction.normalize();
                const normalNormalized = normal.normalize();

                const mirrorOrigin: Vector3 = point.add(normal.scale(epsilon));
                const idealMirrorDirection: Vector3 = dirNormalized
                    .sub(normal.scale(2 * dirNormalized.dot(normal)))
                    .normalize();

                const mirrorRay: Ray = new Ray(mirrorOrigin, idealMirrorDirection);
                const mirrorHit: Hit = new Hit(Number.POSITIVE_INFINITY);
                const mirrorAnswer: Vector3 = this.traceRay(
                    mirrorRay,
                    epsilon,
                    bounces - 1,
                    refractionIndex,
                    mirrorHit
                );

                answer = answer.add(mirrorAnswer.mul(material.reflectiveColor(point)));
            }

            if (material.transparentColor(point).length() > 0.0) {
                // TODO: Do refraction.
            }
        }
        return answer;
    }
}

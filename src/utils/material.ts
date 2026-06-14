import { Vector3 } from "./vectors";
import { Hit } from "./hit";
import { Ray } from "./ray";

export abstract class Material {
    protected diffuse_color: Vector3;
    protected reflective_color: Vector3;
    protected transparent_color: Vector3;
    protected refraction_index: number;
    protected texture: unknown | null = null;

    constructor(
        diffuse_color: Vector3 = Vector3.zero(),
        reflective_color: Vector3 = Vector3.zero(),
        transparent_color: Vector3 = Vector3.zero(),
        refraction_index: number = 1.0,
        texture?: unknown
    ) {
        this.diffuse_color = diffuse_color;
        this.reflective_color = reflective_color;
        this.transparent_color = transparent_color;
        this.refraction_index = refraction_index;
        this.texture = texture ?? null;
    }

    abstract diffuseColor(point: Vector3): Vector3;
    abstract reflectiveColor(point: Vector3): Vector3;
    abstract transparentColor(point: Vector3): Vector3;
    abstract refractionIndex(point: Vector3): number;

    abstract shade(ray: Ray, hit: Hit, dirToLight: Vector3, incidentIntensity: Vector3, shadeBack: boolean): Vector3;

    toJSON() {
        return {
            m_diffuse_color: this.diffuse_color,
            m_reflective_color: this.reflective_color,
            m_transparent_color: this.transparent_color,
            m_refraction_index: this.refraction_index,
        };
    }

    fromJSON(j: any) {
        this.diffuse_color = j.diffuse_color;
        this.reflective_color = j.reflective_color;
        this.transparent_color = j.transparent_color;
        this.refraction_index = j.refraction_index;
    }
}

export class PhongMaterial extends Material {
    private specularColor: Vector3;
    private exponent: number;

    constructor(diffuse: Vector3, reflective: Vector3, specularColor: Vector3, exponent: number) {
        super(diffuse, reflective);
        this.specularColor = specularColor;
        this.exponent = exponent;
    }

    diffuseColor(_point: Vector3): Vector3 {
        return this.diffuse_color;
    }

    reflectiveColor(_point: Vector3): Vector3 {
        return this.reflective_color;
    }

    transparentColor(_point: Vector3): Vector3 {
        return this.transparent_color;
    }

    refractionIndex(_point: Vector3): number {
        return this.refraction_index;
    }

    shade(ray: Ray, hit: Hit, dirToLight: Vector3, incidentIntensity: Vector3, shadeBack: boolean): Vector3 {
        let hitNormal: Vector3 = hit.normal;

        const rayIsFromBehind: boolean = ray.direction.dot(hitNormal) > 0.0;
        if (rayIsFromBehind && !shadeBack) {
            return Vector3.zero();
        } else if (rayIsFromBehind && shadeBack) {
            hitNormal = hitNormal.negate();
        }

        const hitNormalNormalized = hitNormal.normalize();

        const d: number = Math.max(dirToLight.dot(hitNormalNormalized), 0.0);
        const baseColor: Vector3 = this.diffuseColor(ray.pointAtParameter(hit.t));
        const diffuse: Vector3 = baseColor.mul(incidentIntensity).scale(d);

        let specular: Vector3 = Vector3.zero();
        if (d > 0.0) {
            const viewerDirection: Vector3 = ray.direction.negate().normalize();

            const idealReflectionVector: Vector3 = hitNormalNormalized
                .scale(2.0 * hitNormalNormalized.dot(dirToLight))
                .sub(dirToLight)
                .normalize();

            const specularComponent: number = Math.pow(
                Math.max(viewerDirection.dot(idealReflectionVector), 0.0),
                this.exponent
            );

            const specularColor = incidentIntensity.mul(this.specularColor);
            specular = specularColor.scale(specularComponent);
        }

        return diffuse.add(specular);
    }
}

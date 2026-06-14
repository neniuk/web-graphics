import { Vector3 } from "./vectors";

export interface IncidentIllumination {
    dirToLight: Vector3;
    incidentIntensity: Vector3;
    distance: number;
}

export abstract class Light {
    abstract getIncidentIllumination(point: Vector3): IncidentIllumination;
}

export class DirectionalLight extends Light {
    constructor(
        public direction: Vector3 = new Vector3(0.0, 0.0, 0.0),
        public intensity: Vector3 = new Vector3(1.0, 1.0, 1.0)
    ) {
        super();
    }

    getIncidentIllumination(_point: Vector3): IncidentIllumination {
        return {
            dirToLight: this.direction.negate().normalize(),
            distance: Number.POSITIVE_INFINITY,
            incidentIntensity: this.intensity,
        };
    }
}

export class PointLight extends Light {
    constructor(
        public position: Vector3,
        public intensity: Vector3,
        public constantAttenuation: number,
        public linearAttenuation: number,
        public quadraticAttenuation: number
    ) {
        super();
    }

    getIncidentIllumination(point: Vector3): IncidentIllumination {
        const distance: number = this.position.distance(point);
        const attenuation: number =
            1.0 /
            (this.quadraticAttenuation * Math.pow(distance, 2) +
                this.linearAttenuation * distance +
                this.constantAttenuation);
        return {
            dirToLight: this.position.sub(point).normalize(),
            distance: distance,
            incidentIntensity: this.intensity.scale(attenuation),
        };
    }
}

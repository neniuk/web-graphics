export interface RayTracerState {
    cameraSpeed: number;
    cameraToWorld: number[][];
    downscaleFactor: number;
    guiWidth: number;
    roptBounces: number;
    roptDepthMax: number;
    roptDepthMin: number;
    roptDisplayUv: boolean;
    roptFilterRadius: number;
    roptHeight: number;
    roptParallelize: boolean;
    roptPixelFilter: string;
    roptRandomSeed: number;
    roptSamplesPerPixel: number;
    roptSamplingPattern: string;
    roptShadeBack: boolean;
    roptShadows: boolean;
    roptShowProgress: boolean;
    roptStatistics: boolean;
    roptTransparentShadows: boolean;
    roptWidth: number;
    scenePath: string;
}

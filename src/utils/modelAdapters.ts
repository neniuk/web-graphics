import type { Model, Vertex } from "./renderer";
import type { Triangle } from "./object/triangle";
import { Vector3 } from "./vectors";

export function trianglesToModel(triangles: Triangle[]): Model {
    const vertices: Vertex[] = [];
    const faces: number[][] = [];

    for (const triangle of triangles) {
        const normal = triangle.b.sub(triangle.a).cross(triangle.c.sub(triangle.a)).normalize();
        const start = vertices.length;

        vertices.push(
            { position: triangle.a, normal },
            { position: triangle.b, normal },
            { position: triangle.c, normal }
        );
        faces.push([start, start + 1, start + 2]);
    }

    return { vertices, faces };
}

export function triangleLikeObjectsToModel(objects: unknown[]): Model {
    const triangles = objects.filter((object): object is Triangle => {
        if (object == null || typeof object !== "object") return false;

        const maybeTriangle = object as { a?: unknown; b?: unknown; c?: unknown };
        return (
            maybeTriangle.a instanceof Vector3 &&
            maybeTriangle.b instanceof Vector3 &&
            maybeTriangle.c instanceof Vector3
        );
    });

    return trianglesToModel(triangles);
}

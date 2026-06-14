import type { Model, Vertex } from "./renderer";
import { Vector3 } from "./vectors";

export function parseOBJ(objText: string): Model {
    const vertices: Vertex[] = [];
    const faces: number[][] = [];

    const lines = objText.split("\n");

    for (let line of lines) {
        line = line.trim();

        if (line === "" || line.startsWith("#")) {
            continue;
        }

        const parts = line.split(/\s+/);
        const type = parts[0];

        if (type === "v") {
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            const z = parseFloat(parts[3]);

            vertices.push({
                position: new Vector3(x, y, z),
                normal: Vector3.zero(),
            });
        } else if (type === "vn") {
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            const z = parseFloat(parts[3]);

            if (vertices.length > 0) {
                vertices[vertices.length - 1].normal = new Vector3(x, y, z);
            }
        } else if (type === "vt") {
            // TODO: texture coords
            continue;
        } else if (type === "vp") {
            // TODO: parameter space vertices
            continue;
        } else if (type === "f") {
            const faceIndices: number[] = [];

            for (let i = 1; i < parts.length; i++) {
                const vertexData = parts[i].split("/");

                const vertexIndex = parseInt(vertexData[0], 10) - 1;
                faceIndices.push(vertexIndex);
            }

            faces.push(faceIndices);
        } else if (type === "l") {
            // TODO: line elements
            continue;
        } // TODO: other types
    }

    return { vertices, faces };
}

export async function loadOBJModelFromURL(url: string): Promise<Model> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load OBJ file: ${response.statusText}`);
    }
    const text = await response.text();
    return parseOBJ(text);
}

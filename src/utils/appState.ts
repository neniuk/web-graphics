export class AppState<T extends Record<string, any>> {
    constructor(public data: T) {}

    static parse<T extends Record<string, any>>(json: string): AppState<T> {
        return new AppState(JSON.parse(json));
    }

    dump(): string {
        return JSON.stringify(this.data, null, 4);
    }

    loadFromObject(obj: Partial<T>): void {
        Object.assign(this.data, obj);
    }
}

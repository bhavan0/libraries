interface IDictionary<T> {
    add(key: string, value: T): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): T[];
}

export class Dictionary<T> implements IDictionary<T> {

    private dKeys: string[] = [];
    private dValues: T[] = [];

    constructor(init?: { key: string; value: T; }[]) {
        if (init) {
            for (const iterator of init) {
                this.add(iterator.key, iterator.value);
            }
        }
    }

    add(key: string, value: T): void {
        this.dKeys.push(key);
        this.dValues.push(value);
    }

    remove(key: string): void {
        if (this.dKeys.indexOf(key, 0) >= 0) {
            const index = this.dKeys.indexOf(key, 0);
            this.dKeys.splice(index, 1);
            this.dValues.splice(index, 1);
        }
    }

    get(key: string): T {
        const index = this.dKeys.indexOf(key, 0);
        if (index >= 0) {
            return this.dValues[index];
        }
    }

    update(key: string, value: T): void {
        const index = this.dKeys.indexOf(key, 0);
        if (index >= 0) {
            this.dValues[index] = value;
        }
    }

    keys(): string[] {
        return this.dKeys;
    }

    values(): T[] {
        return this.dValues;
    }

    containsKey(key: string): boolean {
        if (this.dKeys.indexOf(key, 0) < 0) {
            return false;
        }

        return true;
    }

    toLookup(): IDictionary<T> {
        return this;
    }
}

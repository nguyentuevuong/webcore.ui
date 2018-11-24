export const randomId = (): string => Math.random().toString(36).slice(2, 12);

export class Random {
    public static get id() {
        return randomId();
    }
}

export { Random as random }
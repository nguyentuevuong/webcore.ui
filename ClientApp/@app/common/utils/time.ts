import { _ } from '@app/providers';

export class Time {

    public static getHour(value: number | string) {
        if (typeof value == 'number') {
            return Math.floor(value / 60);
        } else if (typeof value == 'string') {
            return Math.floor((Time.toInt(value) || 0) / 60);
        }
    }

    public static getMinute(value: number | string) {
        if (typeof value == 'number') {
            return Math.floor(value % 60);
        } else if (typeof value == 'string') {
            return Math.floor((Time.toInt(value) || 0) % 60);
        }
    }

    public static format = (value: number) => {
        let hour: number = Math.floor(value / 60),
            minute: number = Math.floor(value % 60);

        return `${_.padStart(hour.toString(), 2, '0')}:${_.padStart(minute.toString(), 2, '0')}`;
    }

    public static toInt = (value: string): number | undefined => {
        let rg = /\d{1,4}/g,
            raw = value.replace(/:/g, '');

        if (!raw.match(rg)) {
            return undefined;
        } else {
            return Number(raw.replace(rg, (value: string) => {
                return `${(Math.floor(Number(value) / 100) * 60) + Math.floor(Number(value) % 100)}`;
            }));
        }
    }
}

export { Time as time };
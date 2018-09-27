import { _ } from '@app/providers';

export class Clock {

    public static toInt = (value: string): number | undefined => {
        let rg = /\d{1,4}/g,
            raw: string = value.replace(/-:/g, '');

        if (!raw.match(rg)) {
            return undefined;
        } else {
            let numb: number = Number(raw.replace(rg, (value: string) => {
                if (value.indexOf('-') != 0) {
                    return `${(Math.floor(Number(value) / 100) * 60) + Math.floor(Number(value) % 100)}`;
                } else {
                    return `${(Math.floor(Number(value) / 100) * 60) + Math.floor(Number(value) % 100) - 1440}`;
                }
            }));

            return value.indexOf('-') != 0 ? numb : 0 - numb;
        }
    }
}

export { Clock as clock };
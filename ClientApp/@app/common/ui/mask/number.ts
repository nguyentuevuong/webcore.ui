import { ko } from '@app/providers';

export class Number {
    specsKeys: Array<number> = [8, 9, 13, 16, 17, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];

    constructor(input: HTMLInputElement, min: number, max: number, decimalLength: number = 0) {
        let self = this,
            minILenght = String(min).replace(/\.\d+/, '').length,
            maxILenght = String(max).replace(/\.\d+/, '').length,
            minDLength = String(min).replace(/\d+/, '').length,
            maxDLength = String(max).replace(/\d+/, '').length,
            iLength = Math.max(maxILenght, minILenght),
            dLength = Math.max(maxDLength, minDLength, decimalLength);

        ko.utils.registerEventHandler(input, 'keydown', (evt: KeyboardEvent) => {
            if (self.specsKeys.indexOf(evt.keyCode) == -1) {
                let val = self.getValue(evt),
                    minValue = val,
                    maxValue = val;



                if (val.indexOf('.') == -1) {
                    for (var i = val.length + 1; i <= iLength; i++) {
                        minValue += '0';
                        maxValue += '9';
                    }
                }


            }
        });
    }

    private getValue(evt: KeyboardEvent) {
        let input = evt.target as HTMLInputElement,
            value = input.value,
            ss: number = input.selectionStart || 0,
            se: number = input.selectionEnd || 0;

        // calc new value after keypress
        if (ss == se) {
            if (ss == 0) {
                return evt.key + value;
            } else if (se == value.length) {
                return value + evt.key;
            } else {
                return value.substring(0, ss) + evt.key + value.substring(se, value.length);
            }
        } else {
            return value.replace(value.substring(ss, se), evt.key);
        }
    }
}
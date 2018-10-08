import { ko } from '@app/providers';

const DIGIT: string = '9',
    ALPHA: string = 'A',
    ALPHANUM: string = 'S',
    BY_PASS_KEYS: Array<number> = [8, 9, 13, 32, 37, 38, 39, 40],
    isAllowedKeyCode: (keyCode: number) => boolean = (keyCode: number) => BY_PASS_KEYS.indexOf(keyCode) == -1,
    convert2PlaceHolder: (pattern: string, mask?: string) => string = (pattern: string, mask?: string) => pattern.replace(/(A|S|9)/g, mask || '_');

export class InputMask {
    private options: IInputMaskOptions = { bind: 'string', mask: String };
    private listeners: { [evt: string]: Array<Function> } = {};

    private _value: string = "";

    constructor(private element: HTMLInputElement, options?: IInputMaskOptions) {
        let self = this;

        if (!!options) {
            self.options = options;
        }

        debugger;

        element.addEventListener('focus', (evt: FocusEvent) => {

        });

        // outfocus event
        element.addEventListener('blur', (evt: FocusEvent) => {

        });

        element.addEventListener('paste', (evt: ClipboardEvent) => {

        });

        element.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (!isAllowedKeyCode(evt.keyCode)) {

            }
        });

        element.addEventListener('keyup', (evt: KeyboardEvent) => {

        });
    }

    get success() {
        let self = this,
            element = self.element;

        return self.validator(element.value);
    }

    get value() {
        let self = this;

        return self._value;
    }

    set value(value: string) {
        let self = this;

        if (self.validator(value)) {
            self._value = value;

            //self.element.value = value;
        }
    }

    updateOptions(options: IInputMaskOptions) {
        let self = this;

        self.options = options || { mask: String };

        self.validator(self.element.value);

        return self;
    }

    private validator(value: string) {
        let self = this,
            options: IInputMaskOptions = self.options;

        if (options.mask instanceof RegExp) {

        } else if (options.mask instanceof String) {

        }

        return false;
    }

    private get CursorPosition(): { start: number; end: number; } {
        let self = this,
            element: HTMLInputElement = self.element;

        // IE < 9 Support
        if (document.selection) {
            element.focus();
            let range: Range = document.selection.createRange(),
                rangelen = range.text.length;

            range.moveStart('character', -element.value.length);

            let start = range.text.length - rangelen;

            return {
                'start': start,
                'end': start + rangelen
            };
        }
        // IE >=9 and other browsers
        else if (element.selectionStart || element.selectionStart == 0) {
            return {
                'start': element.selectionStart || 0,
                'end': element.selectionEnd || 0
            };
        } else {
            return {
                'start': 0,
                'end': 0
            };
        }
    }

    private setCursorPosition(start: number, end?: number) {
        let self = this,
            element: HTMLInputElement = self.element;

        // IE >= 9 and other browsers
        if (element.setSelectionRange) {
            element.focus();
            element.setSelectionRange(start, end || start);
        }
        // IE < 9
        else if (element.createTextRange) {
            var range = element.createTextRange();
            range.collapse(true);
            range.setStart(element, start);
            range.setEnd(element, end || start);
        }
    }

    on(evt: string, handler: Function) {
        let self = this;

        if (!self.listeners[evt]) {
            self.listeners[evt] = [];
        }

        self.listeners[evt].push(handler);

        return self;
    }

    off(evt: string, handler?: Function) {
        let self = this;

        if (!self.listeners[evt]) {
            return;
        }

        if (!handler) {
            delete self.listeners[evt];
            return;
        }

        const hIndex = self.listeners[evt].indexOf(handler);

        if (hIndex >= 0) {
            self.listeners[evt].splice(hIndex, 1);
        }

        return self;
    }
}

export { InputMask as mask };

interface IInputMaskOptions {
    bind: string,
    mask: RegExp | Date | Number | String | Function | Array<IInputMaskOptions>;
    definitions?: {
        min?: Date | Number;
        max?: Date | Number;
        pattern?: String;
        excepts?: Array<Date | Number | String> | Function;
        [key: string]: any;
    };
}
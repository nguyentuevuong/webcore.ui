import { ko } from '@app/providers';

export class InputMask {
    private options: IInputMaskOptions = { mask: String };
    private listeners: { [evt: string]: Array<Function> } = {};

    private _value: string = "";

    constructor(private element: HTMLInputElement, options?: IInputMaskOptions) {
        let self = this;

        if (!!options) {
            self.options = options;
        }

        ko.utils.registerEventHandler(element, 'keydown', (evt: KeyboardEvent) => {

        });

        ko.utils.triggerEvent(element, "");

        element.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (!self.validator(element.value)) {
                evt.preventDefault();
            }
        })
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
    mask: RegExp | Date | Number | String | Function | Array<IInputMaskOptions>;
    definitions?: {
        min?: Date | Number;
        max?: Date | Number;
        pattern?: String;
        excepts?: Array<Date | Number | String> | Function;
        [key: string]: any;
    };
}
// Type version 1.0.0
// Type definitions for imask 3.3.0
// Project: https://github.com/uNmAnNeR/imaskjs
// Definitions by: Bleser92 <https://github.com/Bleser92>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface MaskOptions {
    mask?: string | Number | RegExp | MaskOptions[],
    min?: number,
    max?: number,
    definitions?: '0' | 'a' | '*',
    lazy?: boolean,
    placeholderChar?: string, // defaults to '_'
    groups?: any,
    scale?: number,  // digits after point, 0 for integers
    signed?: boolean,  // disallow negative
    thousandsSeparator?: string,  // any single char
    padFractionalZeros?: boolean,  // if true, then pads zeros at end to the length of scale
    normalizeZeros?: boolean,  // appends or removes zeros at ends
    radix?: string,  // fractional delimiter
    mapToRadix?: string[]  // symbols to process as radix
    prepare?: (val: any) => any,
    commit: (value: any, masked: Masked) => void,
    parse?: any,
    validate?: () => boolean,
}


export declare class IMask {
    new(el: Element, opts?: MaskOptions): InputMask
}

export declare class InputMask {
    public readonly mask: string;
    public value: string;
    public unmaskedValue: string;
    public typedValue: string;
    public readonly selectionStart: string;
    public cursorPos: number;

    constructor(el: Element, opts?: MaskOptions)

    public updateValue(): void
    public updateControl(): void
    public updateOptions(opts: MaskOptions): void
    public updateCursor(cursorPos: number): void
    public alignCursor(): void
    public alignCursorFriendly(): void
    public on(ev: string, handler: any): void
    public off(ev: string, handler: any): void
    public destroy(): void
}


export declare class Masked {
    public value: any;
    public unmaskedValue: string;
    public typedValue: any;
    public rawInputValue: any;
    public readonly isComplete: boolean;

    constructor(opts: MaskOptions)

    public updateOptions(opts: MaskOptions): void
    public clone(): Masked
    public assign(source: any): any
    public reset(): void
    public resolve(value: any): any
}


export declare class MaskedPattern extends Masked {
}

export declare class MaskedNumber extends Masked {
}

export declare class MaskedDate extends Masked {
}

export declare class MaskedRegExp extends Masked {
}

export declare class MaskedFunction extends Masked {
}

export declare class MaskedDynamic extends Masked {
}


export function createMask(opts: MaskOptions): Masked;
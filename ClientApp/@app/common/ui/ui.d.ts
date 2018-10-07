declare interface HTMLInputElement {
    createTextRange?(): Range;
}

declare interface Document {
    selection?: {
        createRange: () => Range
    }
}

declare interface Range {
    text: string;
    moveStart: (selection: string, start: number) => void
}
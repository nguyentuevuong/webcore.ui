export interface IView {
    afterRender(): void
}

export interface IDispose {
    dispose(): void;
}

export interface IModal {
    onClose(callback: void): void;
}
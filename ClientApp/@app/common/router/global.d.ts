declare interface History {
    listener(listener: (data: any, url: string) => void): () => void;
}
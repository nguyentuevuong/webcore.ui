declare interface History {
    listener: (listener: (data: any, url: string) => void) => void;
    initState: (data: any, title: string, url?: string | null) => void;
}
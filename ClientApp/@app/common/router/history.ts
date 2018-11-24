import { ko } from '@app/providers';

let locz = window.location,
    history = window.history,
    pushState = history.pushState,
    replaceState = history.replaceState,
    go = history.go,
    back = history.back,
    forward = history.forward,
    _listener = (data: any, url: string) => { console.error('Plz register once listener for history state change!') };

ko.utils.extend(history, {
    listener: (listener: (data: any, url: string) => void) => {
        _listener = listener;

        return () => _listener = (data: any, url: string) => { console.error('Plz register once listener for history state change!') };
    },
    go: (delta?: number) => {
        go.apply(history, [delta]);
        _listener.apply(history, [history.state, locz.pathname]);
    },
    back: () => {
        back.apply(history);
        _listener.apply(history, [history.state, locz.pathname]);
    },
    forward: () => {
        forward.apply(history);
        _listener.apply(history, [history.state, locz.pathname]);
    },
    pushState: function (data: any, title: string, url?: string | null) {
        if (ko.utils.size(arguments) == 1) {
            url = data;
        } else if (ko.utils.size(arguments) == 2) {
            url = title;
        }

        pushState.apply(history, [data, title, url]);
        _listener.apply(history, [history.state, locz.pathname]);
    },
    replaceState: function (data: any, title: string, url?: string | null) {
        if (ko.utils.size(arguments) == 1) {
            url = data;
        } else if (ko.utils.size(arguments) == 2) {
            url = title;
        }

        replaceState.apply(history, [data, title, url]);
        _listener.apply(history, [history.state, locz.pathname]);
    }
});

// replace state when back or forward button clicked
ko.utils.registerEventHandler(window, 'popstate', () => history.replaceState(history.state, locz.pathname));

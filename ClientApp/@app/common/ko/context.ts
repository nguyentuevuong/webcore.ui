import { ko } from '@app/providers';

let hasOwnProperty = Object.prototype.hasOwnProperty,
    origBinding2Desc = ko.applyBindingsToDescendants;

ko.utils.extend(ko, {
    applyBindingsToDescendants: (viewModelOrBindingContext: any, rootNode: HTMLElement) => {
        if (viewModelOrBindingContext.$component) {
            ko.utils.extend(viewModelOrBindingContext, {
                $vm: viewModelOrBindingContext.$component
            })
        }

        origBinding2Desc(viewModelOrBindingContext, rootNode);
    }
});

ko.utils.extend(ko.utils, {
    extendBindingsAccessor: (accessor: () => any, prop: any) => {
        let oldBindings = accessor();

        ko.utils.objectForEach(oldBindings, (key: string, value: any) => {
            if (ko.utils.has(prop, key) && prop[key] instanceof Function) {
                let oldFunc1 = prop[key],
                    oldFunc2 = oldBindings[key];

                prop[key] = function () {
                    oldFunc1.apply(prop, arguments);
                    oldFunc2.apply(oldBindings, arguments);
                };
            }
        });

        return () => ko.utils.extend(oldBindings, prop);
    },
    extendAllBindingsAccessor: (accessor: KnockoutAllBindingsAccessor, prop: any) => {
        let oldBindings = accessor();

        ko.utils.extend(oldBindings, prop);

        return ko.utils.extend(() => oldBindings, {
            get: (key: string) => ko.utils.get(oldBindings, key),
            has: (key: string) => ko.utils.has(oldBindings, key)
        });
    },
    size: (object: Array<any> | string | any | Function) => {
        if (object instanceof Function) {
            if (!ko.isObservable(object)) {
                object = object.apply();
            } else {
                object = ko.toJS(object);
            }
        }

        if (typeof object === 'string') {
            return object.length;
        }

        if (object instanceof Array) {
            return [].slice.call(object).length;
        }

        return Object.keys(object).length;
    },
    has: (obj: any, prop: string) => {
        return obj != null && hasOwnProperty.call(obj, prop);
    },
    isNull: (obj: any) => {
        return obj == null;
    },
    get: (object: any | undefined, path: Array<string> | string, defaultVal?: any) => {
        let _path = Array.isArray(path) ? path : (path || '').split('.').filter(i => i.length);

        if (!_path.length) {
            return object === undefined ? defaultVal : object
        }

        return ko.utils.get(object[_path.shift() || -1], _path, defaultVal);
    },
    set: (object: any, path: Array<string> | string, value: any) => {
        let _path = Array.isArray(path) ? path : (path || '').split('.').filter(i => i.length),
            child: string = _path.shift() || '';

        if (_path.length) {
            if (!ko.utils.has(object, child)) {
                object[child] = {};
            }

            if (object[child] instanceof Object) {
                ko.utils.set(object[child], _path, value);
            }
        } else {
            object[child] = value;
        }

        return object;
    },
    merge: (object: any, source: any) => {
        ko.utils.objectForEach(source, (key: string, value: any) => {
            let override = ko.utils.get(object, key);

            if (ko.utils.isNull(override)) {
                ko.utils.set(object, key, value);
            } else if (override instanceof Object) {
                ko.utils.merge(override, value);
            }
        });

        return object;
    },
    keys: (object: Array<any> | string | any | Function) => {
        if (object instanceof Function) {
            if (!ko.isObservable(object)) {
                object = object.apply();
            } else {
                object = ko.toJS(object);
            }
        }

        if (object instanceof Array || typeof object === 'string') {
            return [].slice.call(object).map((v: any, i: number) => String(i));
        }

        return Object.keys(object);
    }
})
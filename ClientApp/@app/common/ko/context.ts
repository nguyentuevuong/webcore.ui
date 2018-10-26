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
    has: (obj: any, prop: string) => {
        return obj != null && hasOwnProperty.call(obj, prop);
    },
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
            get: (key: string) => oldBindings[key],
            has: (key: string) => key in oldBindings
        });
    },
    arraySize: (array: Array<any> | KnockoutObservableArray<any>) => {
        return [].slice.call(ko.toJS(array)).length;
    }
})
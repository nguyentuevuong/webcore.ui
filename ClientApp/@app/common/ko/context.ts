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
    extendAllBindingsAccessor: (accessor: KnockoutAllBindingsAccessor, prop: any) => {
        let oldBindings = accessor();

        ko.utils.extend(oldBindings, prop);

        return ko.utils.extend(() => oldBindings, {
            get: (key: string) => oldBindings[key],
            has: (key: string) => key in oldBindings
        });
    }
})
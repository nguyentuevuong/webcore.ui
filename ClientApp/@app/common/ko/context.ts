import { ko } from '@app/providers';

let origBinding2Desc = ko.applyBindingsToDescendants;

ko.utils.extend(ko, {
    applyBindingsToDescendants: (viewModelOrBindingContext: any, rootNode: HTMLElement) => {
        if (viewModelOrBindingContext.$component) {
            ko.utils.extend(viewModelOrBindingContext, {
                $vm: viewModelOrBindingContext.$component
            })
        }

        origBinding2Desc(viewModelOrBindingContext, rootNode);

        if (viewModelOrBindingContext.$vm) {
            let ard = viewModelOrBindingContext.$vm.afterRender;

            if (ard && ard.apply && !ard.runOne) {
                ard.apply(viewModelOrBindingContext.$vm);

                ko.utils.extend(ard, { runOne: true });
            }
        }
    }
});
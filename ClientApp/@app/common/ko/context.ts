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

        
    }
});
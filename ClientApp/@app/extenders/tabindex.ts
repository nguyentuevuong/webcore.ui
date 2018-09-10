import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    $tabindex: (target: KnockoutObservable<number>, tabindex: string) => {
        // extend tabindex prop of observable
        if (_.has(target, '$tabindex')) {
            target.$tabindex!(ko.toJS(tabindex));
        } else {
            ko.utils.extend(target, {
                $tabindex: ko.isObservable(tabindex) ? tabindex : ko.observable(ko.toJS(tabindex))
            });
        }

        return target;
    }
});
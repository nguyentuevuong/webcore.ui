import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    $disabled: (target: KnockoutObservable<number>, disabled: KnockoutObservable<boolean> | boolean) => {
        // extend disabled prop of observable
        if (_.has(target, '$disabled')) {
            target.$disabled!(ko.toJS(disabled));
        } else {
            ko.utils.extend(target, {
                $disabled: ko.isObservable(disabled) ? disabled : ko.observable(ko.toJS(disabled))
            });
        }

        return target;
    }
});
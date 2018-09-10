import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    $focus: (target: KnockoutObservable<number>, focus: KnockoutObservable<boolean> | boolean) => {
        // extend name prop of observable
        if (_.has(target, '$focus')) {
            target.$focus!(ko.toJS(focus));
        } else {
            ko.utils.extend(target, {
                $focus: ko.isObservable(focus) ? focus : ko.observable(focus)
            });
        }

        return target;
    }
});
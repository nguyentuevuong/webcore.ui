import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    $name: (target: KnockoutObservable<number>, name: string) => {
        // extend name prop of observable
        if (_.has(target, '$name')) {
            target.$name!(ko.toJS(name));
        } else {
            ko.utils.extend(target, {
                $name: ko.observable(ko.toJS(name))
            });
        }

        return target;
    }
});
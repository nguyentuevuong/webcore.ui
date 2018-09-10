import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    name: (target: KnockoutObservable<number>, name: KnockoutObservable<string> | string) => {
        // extend name prop of observable
        if (_.has(target, 'name')) {
            target.name!(ko.toJS(name));
        } else {
            ko.utils.extend(target, {
                name: ko.isObservable(name) ? name : ko.observable(name)
            });
        }

        return target;
    }
});
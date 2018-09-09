import { ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    name: (target: KnockoutObservable<number>, name: KnockoutObservable<string> | string) => {
        ko.utils.extend(target, {
            name: ko.isObservable(name) ? name : ko.observable(name)
        });

        return target;
    }
});
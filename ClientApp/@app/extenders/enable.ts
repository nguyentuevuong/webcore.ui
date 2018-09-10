import { _, ko } from '@app/providers';

ko.utils.extend(ko.extenders, {
    $enable: (target: KnockoutObservable<number>, enable: KnockoutObservable<boolean> | boolean) => {
        // extend disabled prop of observable
        if (_.has(target, '$disable')) {
            target.$disable!(!ko.toJS(enable));
        } else {
            ko.utils.extend(target, {
                $disable: ko.observable(!ko.toJS(enable))
            });
        }

        // extend enable prop of observable
        if (_.has(target, '$enable')) {
            target.$enable!(ko.toJS(enable));
        } else {
            ko.utils.extend(target, {
                $enable: ko.observable(ko.toJS(enable))
            });
        }

        return target;
    }
});
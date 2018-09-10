import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    $focus: (target: ValidationObservable<number>, focus: boolean) => {
        extend(target);
        
        // extend name prop of observable
        if (_.has(target, '$focus')) {
            target.$focus!(ko.toJS(focus));
        } else {
            ko.utils.extend(target, {
                $focus: ko.observable(ko.toJS(focus))
            });
        }

        return target;
    }
});
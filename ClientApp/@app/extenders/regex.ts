import { ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    regex: (target: ValidationObservable<number>, pattern: RegExp) => {
        extend(target);

        // extend name prop of observable
        if (!pattern) {
            target.removeValidate('regex');
        } else {
            target.addValidate('regex', (value: any) => {
                console.log(value);
                if (!pattern.test(value)) {
                    target.removeError('regex');
                } else {
                    target.addError('regex', `This value is not match with pattern: \/${pattern.source}\/${pattern.global ? 'g' : ''}${pattern.ignoreCase ? 'i' : ''}${pattern.multiline ? 'm' : ''}`);
                }
            });
        }

        return target;
    }
});
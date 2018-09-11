import { _, ko } from '@app/providers';
import { extend } from '@app/extenders/validation';

ko.utils.extend(ko.extenders, {
    regex: (target: ValidationObservable<number>, pattern: RegExp | IRegex) => {
        extend(target);

        // extend name prop of observable
        if (!pattern) {
            target.removeValidate('regex');
        } else {
            target.addValidate('regex', (value: any) => {

                if (_.has(pattern, 'test')) {
                    pattern = <RegExp>pattern;

                    if (!pattern.test(value)) {
                        target.removeError('regex');
                    } else {
                        let g = pattern.global ? 'g' : '',
                            i = pattern.ignoreCase ? 'i' : '',
                            m = pattern.multiline ? 'm' : '';

                        target.addError('regex', `This value is not match with pattern: \/${pattern.source}\/${g}${m}${i}`);
                    }
                } else {
                    let param: IRegex = <IRegex>pattern,
                        regex: RegExp = param.pattern;

                    if (!regex.test(value)) {
                        target.removeError('regex');
                    } else {
                        target.addError('regex', param.message);
                    }
                }
            });
        }

        return target;
    }
});

interface IRegex {
    pattern: RegExp;
    message: string;
}
import { component } from '@app/common/ko';
import * as ko from 'knockout';

@component({
    url: 'sample/focus',
    title: 'Focus',
    icon: 'fa fa-hand-pointer-o',
    template: `
        <h3>Sample of focus: <span data-bind="text: hasFocus()"></span></h3>
        <hr />
        <div class="form-group">
            <div class="input-group">
                <input type="text" class="form-control" data-bind='hasFocus: hasFocus'>
                <div class="input-group-append">
                    <span class="input-group-text" data-bind='click: focus'>Focus</span>
                </div>
            </div>
        </div>
    `
})
class SampleFocusViewModel {
    hasFocus: KnockoutObservable<boolean> = ko.observable(true);

    focus = () => {
        let self = this;

        self.hasFocus(true);
    }
}





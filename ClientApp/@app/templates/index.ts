export const input = `
<!-- ko init: {
    $width: ko.toJS($vm.control.$width) || 0,
    $columns: ko.toJS($vm.control.$columns) || ['col-md-12', 'col-md-12']
} -->
<!-- ko if: ko.toJS($vm.control.$name) -->
<div data-bind="css: ($columns && $columns[0]) || 'col-md-12'">
    <label data-bind="label: $vm.control"></label>
</div>
<!-- /ko -->
<div data-bind="css: ($columns && $columns[1]) || 'col-md-12',
                style: {
                    'flex': $width ? '0 0 ' + $width + 'px' : ''
                }">
    <div class="input-group" 
            data-bind=" init: { $icons: ko.toJS($vm.control.$icons) || {} }, 
                        css: {
                            'input-group-transparent': $icons.before || $icons.after
                        }">
        <!-- ko if: $icons.before -->
        <div class="input-group-prepend">
            <span class="input-group-text" 
                data-bind=" css: $icons.before.indexOf('#') == -1 && $icons.before,
                            i18n: $icons.before.indexOf('#') == 0 && $icons.before.replace('#', '')"></span>
        </div>
        <!-- /ko -->
        <!-- ko if: $icons.after -->
        <div class="input-group-append">
            <span class="input-group-text"
                data-bind=" css: $icons.after.indexOf('#') == -1 && $icons.after,
                            i18n: $icons.after.indexOf('#') == 0 && $icons.after.replace('#', '')"></span>
        </div>
        <!-- /ko -->
        <!-- ko if: !ko.toJS($vm.control.$multiline) -->
        <input type="text" class="form-control"
            data-bind=" hasFocus: $vm.control.$focus,
                        css: { 'is-invalid': $vm.control.hasError },
                        attr: ko.toJS($vm.control.$attr),
                        enable: ko.toJS($vm.control.$enable) != false" />
        <!-- /ko -->
        <!-- ko ifnot: !ko.toJS($vm.control.$multiline) -->
            <textarea class="form-control"
                data-bind=" hasFocus: $vm.control.$focus,
                            css: { 'is-invalid': $vm.control.hasError }, 
                            attr: ko.toJS($vm.control.$attr),
                            enable: ko.toJS($vm.control.$enable) != false"></textarea>
        <!-- /ko -->
        <!-- ko ifnot: ko.toJS(ko.errors.showDialog) -->
        <div class="invalid-feedback" data-bind="i18n: $vm.control.validationMessage, params: { name: $vm.control.$name }"></div>
        <!-- /ko -->
    </div>
</div>
<!-- /ko -->`;


export const inputs = `
`;
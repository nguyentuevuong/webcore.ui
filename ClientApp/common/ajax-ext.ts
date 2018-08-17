import * as $ from 'jquery';

// config global options ajax
$.ajaxPrefilter((options) => {
    $.extend(options, {
        url: ('/nippo/api/' + options.url).replace(/([^:]\/)\/+/g, "$1")
    });
});

/*$(() => {
    $.ajax({
        url: '/company/save',
        method: 'POST',
        dataType: 'JSON',
        data: {
            companyCode: 'COM002',
            companyName: 'Abc Name'
        },
        success: (data) => {
            debugger;
        },
        error: (msg) => {
            debugger;
        }
    });
});*/
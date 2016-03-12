/*
 * Custom Javascript code for the 'perl-libxml-by-example' project
 */

jQuery(function($) {
    'use strict';

    var sandbox_base_url = '_static/xpath-sandbox/xpath-sandbox.html'
    $('.xpath-try').each(function() {
        var xpath = this.textContent;
        var qs = '?q=' + encodeURIComponent(xpath);
        $(this).append(
            $('<a />').addClass('xpath-try-it')
                .text('Try it!')
                .attr('href', sandbox_base_url + qs)
        );
    });

});

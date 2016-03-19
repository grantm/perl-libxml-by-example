/*
 * Custom Javascript code for the 'perl-libxml-by-example' project
 */

jQuery(function($) {
    'use strict';

    // Wrap the img tag for each illustration in a link to just the image

    $('.illustration').each(function() {
        var $img = $(this);
        $img.wrap( $('<a />').attr('href', $img.attr('src')) );
    });


    // Add in the 'Try it!' links to link from XPath expressions to load that
    // expression in the XPath Sandbox

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

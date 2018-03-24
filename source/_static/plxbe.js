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

    // Add a class to every metacpan link

    $('a').each(function() {
        var $this = $(this);
        var href = $this.attr('href') || '';
        if(href.match(/^https?:\/\/metacpan.org/)) {
            $this.addClass('metacpan')
                 .attr('title', 'View docs for ' + $this.text() + ' on metacpan.org');
        }
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

    // Add the hover-effect linkages on the on the XML::LibXML::Reader page

    var $linked_section = $('#the-reader-loop');
    if($linked_section.length > 0) {
        var add_link_handlers = function($el, i) {
            var cls = 'show-event-' + i;
            $el.mouseover(function() { $linked_section.addClass(cls); })
               .mouseout (function() { $linked_section.removeClass(cls); });
        };

        var $events = $('#linked-events pre');
        var lines = $events.text().split('\n');
        $events.empty();
        $(lines).each(function(i, text){
            if(i > 0) {
                $events.append('\n');
            }
            var match = text.match(/^ *(\d+)/);
            var $span = $('<span />').text(text);
            if(match) {
                var cls = 'event-' + match[1];
                $span.addClass(cls).text(text);
                add_link_handlers($span, match[1]);
            }
            $events.append($span);
        });

        var $nodes = $('#linked-nodes .code pre');
        var xml_source = $nodes.text().replace(/\n$/, '').replace(/\n/g, '\u21b5\n');
        var chunks = xml_source.match(/(?:<[^>]+>|[^<]+)/g);
        $nodes.empty();
        $(chunks).each(function(i, text) {
            var cls = 'event-' + (1 + i);
            var $span = $('<span />').addClass(cls).text(text);
            add_link_handlers($span, i + 1);
            $nodes.append($span)
        });

        $linked_section.find('li').each(function() {
            var $li = $(this);
            var match = $li.text().match(/^At step (\d+)/);
            if(match && match.length === 2) {
                $li.addClass('event-' + match[1]);
                add_link_handlers($li, match[1]);
            }
        });

        $('span.linked-prompt').text(
            '(try mousing over to see the relationship between the events and the parsed XML source)'
        );
    }

});

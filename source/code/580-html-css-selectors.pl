#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;
use HTML::Selector::XPath qw(selector_to_xpath);

my $show_matches = ($ARGV[0] || '') eq '-v';

my $dom = XML::LibXML->load_html(
    location        => 'css-zen-garden.html',
    recover         => 1,
    suppress_errors => 1,
);

my($xpath);

select_nodes($dom, '#zen-supporting h3');
select_nodes($dom, '.designer-name');
select_nodes($dom, '.preamble abbr');
select_nodes($dom, '.preamble h3, .requirements h3');

exit;

sub select_nodes {
    my($dom, $selector) = @_;

    my $xpath = selector_to_xpath($selector);
    say "\nSelector: $selector";
    say "XPath:    $xpath";
    return unless $show_matches;
    say "$_" foreach find_by_css($dom, $selector)->to_literal_list;
}

sub find_by_css {
    my($dom, $selector) = @_;
    my $xpath = selector_to_xpath($selector);
    return $dom->findnodes($xpath);
}


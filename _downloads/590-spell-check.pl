#!/usr/bin/perl
#
# Spell check the generated HTML for this project using aspell - after
# stripping out elements that don't need to be checked.
#

use 5.010;
use strict;
use warnings;
use autodie;

use FindBin;
use XML::LibXML;
use HTML::Selector::XPath qw(selector_to_xpath);

chdir($FindBin::Bin);
my $ignore_list = './590-ignore-words.pws';   # an aspell personal dictionary

open my $pipe, "| aspell --personal=$ignore_list list | sort -u ";
binmode $pipe, ':utf8';

my $pattern = "../../build/html/*.html";
my @files = glob($pattern) or die "No files match pattern: $pattern";
foreach my $filename (@files) {
    my $dom = XML::LibXML->load_html(
        location        => $filename,
        recover         => 1,
        suppress_errors => 1,
    );

    my($body) = $dom->findnodes('/html/body') or next;

    foreach my $selector (
        'script',
        'nav',
        'ul.wy-breadcrumbs',
        'tt.literal',
        'table.highlighttable',
        'div.highlight',
        'footer',
    ) {
        my $xpath = selector_to_xpath($selector);
        foreach my $node ($body->findnodes($xpath)) {
            $node->parentNode->removeChild($node);
        }
    }

    say $pipe $body->to_literal();

    # Also include specific snippets of text not icludedn the body text

    foreach my $xpath ('//title', '//@title', '//@alt') {
        say $pipe $_ foreach $dom->findnodes($xpath)->to_literal_list;
    }
}


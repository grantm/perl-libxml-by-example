#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

binmode(STDOUT, ':utf8');

my $dom = XML::LibXML->load_xml(location => 'http://techcrunch.com/feed/');

foreach my $title ($dom->findnodes('//item/title')) {
    say $title->to_literal();
}


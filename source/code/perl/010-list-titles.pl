#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $filename = 'source/code/xml/playlist.xml';

my $parser = XML::LibXML->new();
my $doc    = $parser->parse_file($filename);

foreach my $title ($doc->findnodes('/playlist/movie/title')) {
    say $title->to_literal();
}


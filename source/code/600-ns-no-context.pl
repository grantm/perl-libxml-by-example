#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $filename = 'xml-libxml.svg';

my $dom = XML::LibXML->load_xml(location => $filename);

my $match_count = $dom->findnodes('//title')->size;
say "XPath: //title  Matching node count: $match_count";


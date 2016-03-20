#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML qw(:libxml);

my $dom = XML::LibXML->load_xml(location => 'book.xml');

my $book = $dom->documentElement;

my $result = $book->childNodes;
say '$result is a ', ref($result);
my $i = 1;
foreach my $i (1..$result->size) {
    my $node = $result->get_node($i);
    say $node->nodeName if $node->nodeType == XML_ELEMENT_NODE;
}

say '';

foreach my $node ($book->childNodes) {
    say $node->nodeName if $node->nodeType == XML_ELEMENT_NODE;
}

say '';

say 'Authors: ', join ', ', $book->findnodes('.//author')->to_literal_list;

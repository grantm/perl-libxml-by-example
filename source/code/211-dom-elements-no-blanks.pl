#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML qw(:libxml);

my $dom = XML::LibXML->load_xml(location => 'book.xml', no_blanks => 1);

my $book = $dom->documentElement;

my @children = $book->childNodes;
my $count = @children;
say "\$book has $count child nodes:";
my $i = 0;
foreach my $child (@children) {
    say $i++, ": is a ", ref($child), ', name = ', $child->nodeName;
}


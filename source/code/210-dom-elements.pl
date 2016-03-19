#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML qw(:libxml);

my $dom = XML::LibXML->load_xml(location => 'book.xml');

my $book = $dom->documentElement;
say '$book is a ', ref($book);
say '$book->nodeName is: ', $book->nodeName;

my($isbn) = $book->getChildrenByTagName('isbn');
say '$isbn is a ', ref($isbn);
say '$isbn->nodeName is: ', $isbn->nodeName;
say '$isbn->to_literal returns: ', $isbn->to_literal;
say '$isbn stringifies to: ', $isbn;

my @children = $book->childNodes;
my $count = @children;
say "\$book has $count child nodes:";
my $i = 0;
foreach my $child (@children) {
    say $i++, ": is a ", ref($child), ', name = ', $child->nodeName;
}

my @elements = grep { $_->nodeType == XML_ELEMENT_NODE } $book->childNodes;
$count = @elements;
say "\$book has $count child elements:";
$i = 0;
foreach my $child (@elements) {
    say $i++, ": is a ", ref($child), ', name = ', $child->nodeName;
}

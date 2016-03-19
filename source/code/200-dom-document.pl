#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;
use Data::Dumper;

my $dom = XML::LibXML->load_xml(location => 'book.xml');

say '$dom is a ', ref($dom);
say '$dom->nodeName is: ', $dom->nodeName;
say 'XML Version is: ', $dom->version;
say 'Document encoding is: ', $dom->encoding;
my $is_or_not = $dom->standalone ? 'is' : 'is not';
say "Document $is_or_not standalone";

say "DOM as XML:\n", $dom->toString;

say "DOM as a string:\n", $dom;

my $book = $dom->documentElement;
say '$dom->documentElement is a ', ref($book);
say '$dom->documentElement->nodeName = ', $book->nodeName;


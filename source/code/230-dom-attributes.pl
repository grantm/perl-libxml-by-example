#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML qw(:libxml);

my $dom = XML::LibXML->load_xml(location => 'book.xml');

my $book = $dom->documentElement;
my($dim) = $book->getChildrenByTagName('dimensions');

say '$dim->getAttribute("width") = ', $dim->getAttribute("width");
say '$dim->{width} = ', $dim->{width};

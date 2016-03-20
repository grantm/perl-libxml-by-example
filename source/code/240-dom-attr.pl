#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML qw(:libxml);

my $dom = XML::LibXML->load_xml(location => 'book.xml');

# You probably don't need this object interface for attributes at all.
# The previous example showed how to access attributes directly via
# the Element object.

my $book = $dom->documentElement;
my($dim) = $book->getChildrenByTagName('dimensions');
my($width_attr) = $dim->getAttributeNode('width');

say '$width_attr is a ', ref($width_attr);
say '$width_attr->nodeName: ', $width_attr->nodeName;
say '$width_attr->value: ', $width_attr->value;
say '$width_attr as a string: ', $width_attr;

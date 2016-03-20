#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $dom = XML::LibXML->load_xml(location => 'fish-and-chips.xml');

my $item = $dom->documentElement;
my($text) = $item->childNodes();

say '$text is a ', ref($text);
say '$text->data = ', $text->data;
say '$text->nodeValue = ', $text->nodeValue;
say '$text->to_literal = ', $text->to_literal;
say '$text->toString = ', $text->toString;
say '$text as a string: ', $text;

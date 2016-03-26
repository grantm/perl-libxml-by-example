#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;
use XML::LibXML::XPathContext;

my $filename = 'xml-libxml.svg';
my $dom = XML::LibXML->load_xml(location => $filename);

my $xpc = XML::LibXML::XPathContext->new($dom);
$xpc->registerNs('vg',  'http://www.w3.org/2000/svg');
$xpc->registerNs('dub', 'http://purl.org/dc/elements/1.1/');

my($match1) = $xpc->findnodes('//vg:title');
say 'XPath: //vg:title   Matched: ', $match1;

my($match2) = $xpc->findnodes('//dub:title');
say 'XPath: //dub:title  Matched: ', $match2;


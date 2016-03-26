#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;
use XML::LibXML::XPathContext;

my $filename = 'xml-libxml.svg';
my $dom = XML::LibXML->load_xml(location => $filename, no_blanks => 1);

my $xpc = XML::LibXML::XPathContext->new($dom);
$xpc->registerNs('svg', 'http://www.w3.org/2000/svg');
$xpc->registerNs('dc',  'http://purl.org/dc/elements/1.1/');

my($metadata) = $xpc->findnodes('//svg:metadata') or die "No metadata";

foreach my $el ($xpc->findnodes('.//dc:*', $metadata)) {
    my $name  = $el->localname;
    my $value = $el->to_literal or next;
    say "$name=$value";
}


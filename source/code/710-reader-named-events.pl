#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML::Reader;

my $filename = 'country.xml';

my $reader = XML::LibXML::Reader->new(location => $filename)
    or die "cannot read file '$filename': $!\n";

my %type_name = (
    &XML_READER_TYPE_ELEMENT                 => 'ELEMENT',
    &XML_READER_TYPE_ATTRIBUTE               => 'ATTRIBUTE',
    &XML_READER_TYPE_TEXT                    => 'TEXT',
    &XML_READER_TYPE_CDATA                   => 'CDATA',
    &XML_READER_TYPE_ENTITY_REFERENCE        => 'ENTITY_REFERENCE',
    &XML_READER_TYPE_ENTITY                  => 'ENTITY',
    &XML_READER_TYPE_PROCESSING_INSTRUCTION  => 'PROCESSING_INSTRUCTION',
    &XML_READER_TYPE_COMMENT                 => 'COMMENT',
    &XML_READER_TYPE_DOCUMENT                => 'DOCUMENT',
    &XML_READER_TYPE_DOCUMENT_TYPE           => 'DOCUMENT_TYPE',
    &XML_READER_TYPE_DOCUMENT_FRAGMENT       => 'DOCUMENT_FRAGMENT',
    &XML_READER_TYPE_NOTATION                => 'NOTATION',
    &XML_READER_TYPE_WHITESPACE              => 'WHITESPACE',
    &XML_READER_TYPE_SIGNIFICANT_WHITESPACE  => 'SIGNIFICANT_WHITESPACE',
    &XML_READER_TYPE_END_ELEMENT             => 'END_ELEMENT',
);

say " Step | Node Type               | Depth | Name";
say "------+-------------------------+-------+-------";

my $step = 1;
while($reader->read) {
    printf(
        " %3u  | %-22s  | %4u  | %s\n",
        $step++,
        $type_name{$reader->nodeType},
        $reader->depth,
        $reader->name
    );
}



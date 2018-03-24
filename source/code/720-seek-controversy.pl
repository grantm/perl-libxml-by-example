#!/usr/bin/perl

use 5.010;
use strict;
use warnings;
use autodie;

use PerlIO::gzip;
use XML::LibXML::Reader;

binmode(STDOUT, ':utf8');

my $filename = 'enwiki-latest-abstract1-abridged.xml.gz';
open my $fh, '<:gzip', $filename;

my $reader = XML::LibXML::Reader->new(IO => $fh);

my $controversy_xpath = q{./links/sublink[contains(./anchor, 'Controvers')]};

while($reader->read) {
    next unless $reader->nodeType == XML_READER_TYPE_ELEMENT;
    next unless $reader->name eq 'doc';
    my $doc = $reader->copyCurrentNode(1);
    if(my($target) = $doc->findnodes($controversy_xpath)) {
        say 'Title: ', $doc->findvalue('./title');
        say '  ', $target->findvalue('./anchor');
        say '  ', $target->findvalue('./link');
        say '';
    }
    $reader->next;
}


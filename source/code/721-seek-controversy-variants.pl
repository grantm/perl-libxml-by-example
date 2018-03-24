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

my $controversy_xpath = q{/doc/links/sublink[contains(./anchor, 'Controvers')]};

while($reader->read) {
    next unless $reader->nodeType == XML_READER_TYPE_ELEMENT;
    next unless $reader->name eq 'doc';
    my $xml = $reader->readOuterXml;
    if($xml =~ /Controvers/) {
        my $doc = XML::LibXML->load_xml(string => $xml);
        if(my($target) = $doc->findnodes($controversy_xpath)) {
            say 'Title: ', $doc->findvalue('/doc/title');
            say '  ', $target->findvalue('./anchor');
            say '  ', $target->findvalue('./link');
            say '';
        }
    }
    $reader->next;
}


__END__

my $xml = $reader->readOuterXml;
my $doc = XML::LibXML->load_xml(string => $xml);

my $doc_pattern = XML::LibXML::Pattern->new('/feed/doc');
while($reader->read) {
    next unless $reader->matchesPattern($doc_pattern);

$reader->nextPatternMatch($pattern);


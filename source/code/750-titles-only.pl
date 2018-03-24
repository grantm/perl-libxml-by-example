#!/usr/bin/perl

use 5.010;
use strict;
use warnings;
use autodie;

use XML::LibXML::Reader;

binmode(STDOUT, ':utf8');

my $filename = 'enwiki-latest-abstract1-structure.xml';

my $reader = XML::LibXML::Reader->new(location => $filename);
$reader->preservePattern('/feed/doc/title');
$reader->finish;

say $reader->document->toString(1);


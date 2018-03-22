#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML::Reader;

my $filename = 'country.xml';

my $reader = XML::LibXML::Reader->new(location => $filename)
    or die "cannot read file '$filename': $!\n";

while($reader->read) {
    printf(
        "Node type: %2u  Depth: %2u  Name: %s\n",
        $reader->nodeType,
        $reader->depth,
        $reader->name
    );
}



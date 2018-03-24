#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML::Reader;

my $filename = 'book-borkened.xml';
open my $fh, '<', $filename;

eval {
    my $reader = XML::LibXML::Reader->new(IO => $fh);
    $reader->finish;
};
if($@) {
    say "Error during parse: '$@'";
}
else {
    say "No parse errors were encountered";
}

exit 0;

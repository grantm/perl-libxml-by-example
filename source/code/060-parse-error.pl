#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

#my $filename = 'book.xml';
my $filename = 'book-borkened.xml';

my $dom = eval {
    XML::LibXML->load_xml(location => $filename);
};
if($@) {
    # Log failure and exit
    print "Error parsing '$filename':\n$@";
    exit 0;
}

foreach my $author ($dom->findnodes('//author')) {
    say $author->to_literal();
}


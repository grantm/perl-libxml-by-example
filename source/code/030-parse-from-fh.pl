#!/usr/bin/perl

use 5.010;
use strict;
use warnings;
use open ':encoding(utf8)';   # would mess up XML file
binmode(STDOUT, ':utf8');

use XML::LibXML;

my $filename = 'carte-latin1.xml';
open my $fh, '<', $filename;  # affected by 'use open' above
binmode $fh, ':raw';          # turn off effects of 'use open'

my $dom = XML::LibXML->load_xml(IO => $fh);

foreach my $course ($dom->findnodes('//cours')) {
    say $course->{nom};
    foreach my $dish ($course->findnodes('./plat')) {
        say "* " . $dish->to_literal();
    }
    say '';
}


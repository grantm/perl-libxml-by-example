#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $filename = 'untidy.html';

my $dom = XML::LibXML->load_html(
    location  => $filename,
    recover   => 1,
);

say $dom->toStringHTML();


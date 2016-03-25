#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $dom = XML::LibXML->load_html(
    location  => 'people.html',
    recover   => 1,
);

my($xpath);

# Match <li> elements whose class attribute contains 'member'

$xpath = '//li[contains(@class, "member")]';
say "$_" foreach $dom->findnodes($xpath)->to_literal_list;

say '';

# Match <li> elements with the class 'member'

$xpath = '//li[contains(concat(" ", @class, " "), " member ")]';
say "$_" foreach $dom->findnodes($xpath)->to_literal_list;


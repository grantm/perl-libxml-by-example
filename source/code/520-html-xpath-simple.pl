#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $filename = 'css-zen-garden.html';

my $dom = XML::LibXML->load_html(
    location        => $filename,
    recover         => 1,
    suppress_errors => 1,
);

my $xpath = '//div[@id="zen-supporting"]//h3';
say "$_" foreach $dom->findnodes($xpath)->to_literal_list;


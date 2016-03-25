#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;
use URI::URL;
use JSON qw(to_json);

my $base_url = 'http://csszengarden.com/';
my $filename = 'css-zen-garden.html';

my $dom = XML::LibXML->load_html(
    location        => $filename,
    recover         => 1,
    suppress_errors => 1,
);

my @designs;
my $xpath = '//h3[contains(.,"Select a Design")]/..//li';
foreach my $design ($dom->findnodes($xpath)) {
    my($name, $designer) = $design->findnodes('./a')->to_literal_list;
    my($url) = $design->findnodes('./a/@href')->to_literal_list;
    $url = URI::URL->new($url, $base_url)->abs;
    push @designs, {
        name      => $name,
        designer  => $designer,
        url       => "$url",
    };
}

say to_json(\@designs, {pretty => 1});

#!/usr/bin/perl

use 5.010;
use strict;
use warnings;
use autodie;

use XML::LibXML;

my $dom = XML::LibXML::Document->new('1.0', 'UTF-8');
my $title = $dom->createElement('title');
$title->appendText("Caf\x{e9} lunch: \x{20ac}12.50");
$dom->setDocumentElement($title);

my $filename = 'temp-utf8.xml';
open my $out, '>:raw', $filename;
print $out $dom->toString(1);

say $dom->toString(1);
system("xxd $filename");
unlink($filename);
say '';


# Same again but Latin-1 instead of UTF-8 (block scoped to reuse variables)
{

my $dom = XML::LibXML::Document->new('1.0', 'ISO8859-1');
my $title = $dom->createElement('title');
$title->appendText("Caf\x{e9} lunch: \x{20ac}12.50");
$dom->setDocumentElement($title);

open my $out, '>:raw', $filename;
print $out $dom->toString(1);

system("xxd $filename");
unlink($filename);

}


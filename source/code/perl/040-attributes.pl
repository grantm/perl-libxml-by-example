#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use XML::LibXML;

my $filename = 'playlist.xml';

my $dom = XML::LibXML->load_xml(location => $filename);

my($movie) = $dom->findnodes('//movie[@id="tt3659388"]');

# Three alternative ways to access attribute values

# Select the attribute value with XPath
{

    my $cast = join ', ', map {
        $_->to_literal();
    } $movie->findnodes('./cast/person/@name');
    say 'Starring: ', $cast;

}


# Select the element with XPath and extract the element value via a DOM method
{

    my $cast = join ', ', map {
        $_->getAttribute('name');
    } $movie->findnodes('./cast/person');
    say 'Starring: ', $cast;

}


# Select the element with XPath and extract the element value via tied hash
{

    my $cast = join ', ', map {
        $_->{name};
    } $movie->findnodes('./cast/person');
    say 'Starring: ', $cast;

}


# Same as above but access multiple attributes
{

    my $cast = join "\n", map {
        " * $_->{name} (as $_->{role})";
    } $movie->findnodes('./cast/person');
    say "\nStarring:\n", $cast;

}

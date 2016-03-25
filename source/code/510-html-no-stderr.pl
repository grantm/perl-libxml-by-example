#!/usr/bin/perl

use 5.010;
use strict;
use warnings;

use File::Spec;
use XML::LibXML;

warn "message to STDERR before parsing\n";
my $dom = parse_html_file('untidy.html');
warn "message to STDERR after parsing\n";

say $dom->toStringHTML();

exit;

sub parse_html_file {
    my($filename) = @_;

    local(*STDERR);
    open STDERR, '>>', File::Spec->devnull();
    return XML::LibXML->load_html(
        location        => $filename,
        recover         => 1,
        suppress_errors => 1,
    );
};

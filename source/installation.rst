
Installing XML::LibXML
======================

You *can* install the XML::LibXML module using standard tools like `cpanm
<https://metacpan.org/pod/distribution/App-cpanminus/bin/cpanm>`_, but there
are a couple of factors to consider first.  Because the module wraps a C
library, to install this way you must have a C compiler installed and you must
have already installed the ``libxml2`` library along with its development
header files.

There may be easier install options for your platform.

Installing on Windows
---------------------

Strawberry Perl
~~~~~~~~~~~~~~~

The most popular Perl distribution for Windows is `Strawberry Perl
<http://strawberryperl.com/>`_, which happens to include XML::LibXML in the
base Perl installer.  So if you have Strawberry Perl, you already have
XML::LibXML.

ActivePerl
~~~~~~~~~~

Another popular Perl distribution for Windows is `ActivePerl
<http://www.activestate.com/activeperl/downloads>`_ from ActiveState (who also
package Perl for Mac OS X, Linux and Solaris).  ActivePerl includes a tool
called PPM (Perl Package Manager) for installing pre-built Perl modules.  You
can use the PPM graphical user interface to `search for the XML::LibXML package
<http://code.activestate.com/ppm/search:XML::LibXML/>`_ then click to select
and install it.  A command-line interface is also available::

    ppm install XML-LibXML

Installing on Linux
-------------------

If you are using the system Perl binary, you can install a pre-compiled version
of XML::LibXML and the underlying libxml2 library from your distribution's
package archive.

On systems using dpkg/apt (Debian, Ubuntu, Mint, etc.)::

    sudo apt-get install libxml-libxml-perl

On systems using rpm/yum (RedHat, CentOS, Fedora, etc.)::

    sudo yum install "perl(XML::LibXML)"

Manual installation
~~~~~~~~~~~~~~~~~~~

If for some reason you want to compile and install a version of XML::LibXML
directly from CPAN, you must first install both the ``libxml2`` library and
the header files for linking against the library.  The easiest way to do this
is to use your distribution's packages.  For example on Debian::

    sudo apt-get install libxml2 libxml2-dev

You can test that the library is correctly installed and your PATH is set up
correctly  with this command::

    xml2-config --version

For more information about manual builds, refer to the README file in the
`XML::LibXML distribution <https://metacpan.org/release/XML-LibXML>`_.

Installing on Mac OS X
----------------------

You can install the ``libxml2`` library using homebrew::

    brew install libxml2

If you do not have Homebrew, you can install it at the `homebrew website
<https://brew.sh/>`_.

Once you have the ``libxml2`` library installed, you can install the
XML::LibXML Perl module using standard tools such as ``cpan`` or ``cpanm``.


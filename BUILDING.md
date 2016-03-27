Build Instructions
==================

If you wish to contribute to this project this document describes (briefly)
how to re-generate the HTML pages from the .rst (reStructuredText) source.

The HTML is generated using [Sphinx](http://www.sphinx-doc.org/) which in turn
uses [Docutils](http://docutils.sourceforge.net/), the
[Jinja2](http://jinja.pocoo.org/) templating engine and 'make'.  On my Ubuntu
system I installed the dependencies with:

    sudo apt-get install python3-sphinx docutils-doc python-pil-doc python3-pil-dbg sphinx-doc build-essential

Some texlive dependencies will also be required in order to make the 'latexpdf'
build target work but there are other issues blocking that currently.

If you're not using a Debian/Ubuntu system, refer to those projects for manual
installation instructions.

The Sphinx site includes a [reStructuredText
Primer](http://www.sphinx-doc.org/rest.html) which should help you get up to
speed with the markup.

To generate the HTML, run the command:

    make html

You can then view the resulting generated files under `build/html`.


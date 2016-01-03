.. highlight:: none
    :linenothreshold: 1

A Basic Example
===============

Let's start with an XML file [#f1]_ containing details of five different movies:

.. literalinclude:: /code/xml/playlist.xml
    :language: xml
    :linenos:

The following script will extract and print each movie title, in the order they
appear in the XML:

.. literalinclude:: /code/perl/010-list-titles.pl
    :language: perl

and will produce the following output::

    Apollo 13
    Solaris
    Ender's Game
    Interstellar
    The Martian

If we break the example down line-by-line we see that after a standard
boilerplate section, the script loads the ``XML::LibXML`` module:

.. sidebar:: Is XML::LibXML installed?

    If you don't have the ``XML::LibXML`` module installed on your system,
    you'll get an error like this:

        ``Can't locate XML/LibXML.pm in @INC ... at ./source/code/perl/010-list-titles.pl line 7.``

    If you do get this error, then refer to :doc:`installation` for help on
    installing ``XML::LibXML``.

.. literalinclude:: /code/perl/010-list-titles.pl
    :language: perl
    :lines: 7

Next, a parser object is created:

.. literalinclude:: /code/perl/010-list-titles.pl
    :language: perl
    :lines: 11

The parser object's ``parse_file()`` method is called to parse the XML file and
return a document object:

.. literalinclude:: /code/perl/010-list-titles.pl
    :language: perl
    :lines: 12

The ``$doc`` variable now contains an object representing all the elements of
the XML document arranged in a tree structure known as a
:doc:`Document Object Model <dom>` or 'DOM'.

Finally we get to the guts of the script where the ``findnodes()`` method is
called to search the DOM for the elements we're interested in and a ``foreach``
loop is used to iterate through the matching elements:

.. literalinclude:: /code/perl/010-list-titles.pl
    :language: perl
    :lines: 14-16

The ``findnodes()`` method takes one argument - an **XPath expression**.  This
is a string describing the location and characteristics of the elements we want
to find.  XPath is a query language and the way we use it to select elements
from the DOM is similar to the way we use SQL to select records from a
relational database.  See :doc:`xpath` for examples of more complex queries.

Each time through the loop, ``$title`` will contain an object from the DOM
which is the next element matching the XPath expression.  This object provides
a number of properties and methods that can be used to access the element and
its attributes, as well as the text content and 'child' elements that may be
contained within it.  The example script simply calls the ``to_literal()``
method on the object - which returns the text content of the element *and all
its child elements* (but does not include any of the attributes).

A more complex example
----------------------

Now let's look at a slightly more complex example.  This script takes the same
XML input and extracts more details from each ``<movie>`` element:

.. literalinclude:: /code/perl/012-movie-details.pl
    :language: perl

and will produce the following output::

    Title:    Apollo 13
    Director: Ron Howard
    Rating:   PG
    Duration: 140 minutes
    Starring: Tom Hanks, Bill Paxton, Kevin Bacon, Gary Sinise, Ed Harris

    Title:    Solaris
    Director: Steven Soderbergh
    Rating:   PG-13
    Duration: 99 minutes
    Starring: George Clooney, Natascha McElhone, Ulrich Tukur

    Title:    Ender's Game
    Director: Gavin Hood
    Rating:   PG-13
    Duration: 114 minutes
    Starring: Asa Butterfield, Harrison Ford, Hailee Steinfeld

    Title:    Interstellar
    Director: Christopher Nolan
    Rating:   PG-13
    Duration: 169 minutes
    Starring: Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine

    Title:    The Martian
    Director: Ridley Scott
    Rating:   PG-13
    Duration: 144 minutes
    Starring: Matt Damon, Jessica Chastain, Kristen Wiig

Let's look more closely at the main loop:

.. literalinclude:: /code/perl/012-movie-details.pl
    :language: perl
    :lines: 14-24

.. rubric:: Footnotes

.. [#f1] This XML file was created specifically for this example using
   information from `IMDb <http://imdb.com/>`_.

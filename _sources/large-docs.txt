
.. highlight:: none
    :linenothreshold: 1

Working With Large Documents
============================

The examples so far have all started by creating a data structure called a
:doc:`Document Object Model <dom>` to represent the whole XML document.  Using
:doc:`XPath expressions <xpath>` to navigate the DOM can be both powerful and
convenient, but the cost in memory consumption can be quite high.  For example,
parsing a 50MB XML file into a DOM might need 500MB of memory.

If you routinely work with very large XML documents, you might find that
``XML::LibXML``'s DOM parser wants to consume more memory than your system has
installed.  In such cases, you can instead use the 'pull parser' API which
is accessed via the ``XML::LibXML::Reader`` interface.


The Reader Loop
---------------

To gain a better understanding of how the reader API is used, let's start by
seeing what happens when we parse this very simple XML document:

.. literalinclude:: /code/country.xml
    :language: xml
    :linenos:

This script loads the reader API and parses the XML file:

.. literalinclude:: /code/700-reader-events.pl
    :language: perl

and produces the following output:

.. literalinclude:: /_output/700-reader-events.pl-out
    :language: none

We can see from the output that the ``while`` loop executes 11 times.  As the
XML document is parsed, the ``$reader`` object acts as a cursor advancing
through the document.  Each time a 'node' has been parsed, the ``read``
method returns to allow the state of the parse and the current node to be
interrogated.

To make sense of it we really need to turn those 'Node Type' numbers into
something a bit more readable.  The ``XML::LibXML::Reader`` module exports a
set of constants for this purpose.  Here's a modified version of the script:

.. literalinclude:: /code/710-reader-named-events.pl
    :language: perl

that produces the following tidier output:

.. literalinclude:: /_output/710-reader-named-events.pl-out
    :language: none
    :name: linked-events

.. role:: linked-prompt

from the same XML :linked-prompt:`\ ` :

.. literalinclude:: /code/country.xml
    :language: none
    :linenos:
    :name: linked-nodes

Some things to note:

* At step 1, when the ``read`` method returns for the first time, the cursor
  has advanced to the closing '>' of the ``<country>`` start tag.  We could
  retrieve an attribute value by calling ``$reader->getAttribute('code')`` but
  we can't examine child elements or text nodes because the parser has not seen
  them yet.

* At step 2, the parser has processed a chunk of text and found that it
  contains only whitespace (side note: all whitespace is considered to be
  'significant' unless a DTD is loaded and defines which whitespace is
  insignificant).  Although we can get access to the text, the ``$reader``
  object can no longer tell us that it is a child of a ``<country>`` element -
  the parser has discarded that information already.

* At step 3, the parser can tell us the current node is a ``<name>`` element,
  and the ``depth`` method can tell us that there is one ancestor element.
  However there is no way to determine the name of the parent element.

* At step 4 a text node has been identified and we can call ``$reader->value``
  to get the text string ``"Ireland"``, but the parser can no longer tell us
  the name of the element it belongs to.

* At step 5 we have reached the end of the ``<name>`` element, but we no longer
  have access to the text it contained.

But now you surely get the idea - the ``XML::LibXML::Reader`` API is able to
keep its memory requirements low by discarding data from one parse step before
proceeding to the next.  The vastly lowered memory demands come at the cost of
significantly lowered convenience for the programmer.  However, as we'll see in
the next section, there is a middle ground that can provide the convenience of
the DOM API combined with the reduced memory usage of the Reader API.

Bring Back the DOM
------------------

Huge XML documents usually contain a long list of similar elements.  For
example Wikipedia make XML 'dumps' available
`for download <https://dumps.wikimedia.org/enwiki/latest/>`_.

At the time of writing, the ``enwiki-latest-abstract1.xml.gz`` file was about
100MB in size - about 800MB uncompressed.  However it contained information
summarising over half a million Wikipedia articles.  So whilst the file is very
large, the ``<doc>`` elements describing each article are, on average, less
than 1.5KB.  The following extract is reformatted for clarity to illustrate
the file structure:

.. literalinclude:: /code/enwiki-latest-abstract1-structure.xml
    :language: xml
    :linenos:

To process this file, we can use the Reader API to locate each ``<doc>``
element and then parse that element *and all its children* into a DOM fragment.
We can then use the familiar and convenient XPath tools and DOM methods to
process each fragment.

Another useful technique when working with large files is to leave the files in
their compressed form and use a Perl IO layer to decompress them on the fly.
You can achieve this using the `PerlIO::gzip
<https://metacpan.org/pod/PerlIO::gzip>`_ module from CPAN.

To illustrate these techniques, the following script uses the Reader API to
pick out each ``<doc>`` element and slurp it into a DOM fragment.  Then XPath
queries are used to examine the child nodes and determine if the ``<doc>`` is
'interesting' - does it have a sub-heading that contains variant of the word
"controversy"?  Uninteresting elements are skipped, interesting elements are
reported in summary form: article title, interesting subheading, URL.

.. literalinclude:: /code/720-seek-controversy.pl
    :language: perl

In the script above, ``$doc`` is a DOM fragment that can be queried and
manipulated using the DOM methods described in earlier chapters.

At the start of the ``while`` loop, a couple of conditional ``next`` statements
allow skipping quickly to the start of the next ``<doc>`` element.  Depending
on the document you're dealing with, you might need to also use the ``depth``
method to avoid deeply nested elements that also happened to be named "doc".

The call to ``$reader->copyCurrentNode(1)`` creates a DOM fragment from the
current element.  The ``1`` passed as an argument is a boolean flag that causes
all child elements to be included.

In order to build the DOM fragment, the ``$reader`` has to process all content
up to the matching ``XML_READER_TYPE_END_ELEMENT`` node.  You may be surprised
to learn that this does not advance the cursor.  So the next call to
``$reader->read`` will advance to the first child node of the current
``<doc>``.  In our case, that would be a waste of time - there is no need to
use the Reader API to re-process the child nodes that we already processed with
the DOM API.  Therefore after processing a ``<doc>``, we call ``$reader->next``
to skip directly to the node following the matching ``</doc>`` end tag.  When
this script was used to process the full-sized file, adding this call to
``next`` reduced the run time by almost 50%.

When processing files with millions of elements, a small optimisation in the
main loop can make a noticeable difference to the run time.  For example,
building the DOM fragment is a relatively expensive operation.  The call to
``$reader->copyCurrentNode(1)`` is equivalent to:

.. literalinclude:: /code/721-seek-controversy-variants.pl
    :language: perl
    :lines: 39-40

As an optimisation, we can avoid the step of building the DOM fragment if a
quick regex check of the source XML tells us that it doesn't contain the word
we're going to look for with the XPath query.  This rewritten main loop shave
about 20% off the run time:

.. literalinclude:: /code/721-seek-controversy-variants.pl
    :language: perl
    :lines: 18-34

Error Handling
--------------

Error handling is a little different with the Reader API vs the DOM API.  The
DOM API will parse the whole document and throw an exception immediately if it
encounters and error in the XML.  So if there's an error you won't get a DOM.

The Reader API on the other hand will start returning nodes to your script via
``$reader->read`` as soon as the parsing starts [#f1]_.  If there is an error in your
document, you won't know until your parser reaches the error - then you'll get
the exception.

You need to bear this in mind when parsing with the Reader API.  For example if
you were reading elements to populate records in a database, you might want to
wrap all the database INSERT statement in a transaction so that you can roll
them all back if you encounter a parse error.

Another useful technique is to parse the document twice, once to check the XML
is well-formed and once to actually process it.  The ``finish`` method provides
a quick way to parse from the current position to the end of the document:

.. literalinclude:: /code/730-reader-parse-error.pl
    :language: perl
    :lines: 13-14

You'll then need to reopen the file and create a new Reader object for the
second parse.

In some applications you might scan through the file looking for a specific
section.  Once the target has been located and the required information
extracted, you might not need to look at any more elements.  However as we've
seen, you should call ``finish`` to ensure there are no errors in the rest of
the XML.

Working With Patterns
---------------------

Our sample script is identifying elements at the top of the main loop by
examining the node type and the node name:

.. literalinclude:: /code/721-seek-controversy-variants.pl
    :language: perl
    :lines: 20-22

Although these are simple checks, they do still involve two method calls and
passing scalar values across the XS boundary between ``libxml`` and the Perl
runtime.  An alternative approach is to compile a 'pattern' (essentially a
simplified subset of XPath) using `XML::LibXML::Pattern
<https://metacpan.org/pod/XML::LibXML::Pattern>`_ and run a complex set of
checks with a single method call:

.. literalinclude:: /code/721-seek-controversy-variants.pl
    :language: perl
    :lines: 42-44

In our example, the ``<doc>`` elements that we're interested in are all
adjacent, so when we finish processing one, the very next element is another
``<doc>``.  If your document is not structured this way, you might find it
useful to skip over large sections of document to find the next element that
matches a pattern, like this:

.. literalinclude:: /code/721-seek-controversy-variants.pl
    :language: perl
    :lines: 46

You can also use patterns with the ``preservePattern`` method to create a DOM
subset of a larger document. For example:

.. literalinclude:: /code/750-titles-only.pl
    :language: perl
    :lines: 12-18

Which will produce this output:

.. literalinclude:: /_output/750-titles-only.pl-out
    :language: none

Note, this technique does construct the DOM in memory and then serialise it at
the end, so if you have a huge document and many nodes match the pattern then
you will consume a large amount of memory.

.. rubric:: Footnotes

.. [#f1]

    In practice, the Reader API will read the XML in chunks and check each
    chunk is well-formed before it starts delivering node events.  This means
    that a short document with an error may trigger an exception before any
    nodes have been delivered.

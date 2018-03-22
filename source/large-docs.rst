
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

We can see from the output that the ``while`` loop executed 11 times.  As the
XML document was parsed, the ``$reader`` object acts as a cursor advancing
through the document.  Each time one whole 'node' has been parsed, the ``read``
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


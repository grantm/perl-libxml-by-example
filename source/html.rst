.. highlight:: none
    :linenothreshold: 1

Working with HTML
=================

If you ever need to extract text and data from HTML documents, the ``libxml``
parser and DOM provide very useful tools.  You might imagine that ``libxml``
would only work with XHTML and even then only strictly well-formed documents.
In fact, the parser has an HTML mode that handles unclosed tags like ``<img>``
and ``<br>`` and is even able to recover from parse errors caused by poorly
formed HTML.

Let's start with this mess of HTML tag soup:

.. literalinclude:: /code/untidy.html
    :language: none

To read the file in, you'd use the ``load_html()`` method rather than
``load_xml()``.  You'll almost certainly want to use the ``recover => 1``
option to tell the parser to try to recover from parse errors and carry on to
produce a DOM.

.. literalinclude:: /code/500-html-tidy.pl
    :language: perl

When the DOM is serialised with ``toStringHTML()``, some rudimentary formatting
is applied automatically.  Unfortunately there is no option to add indenting
to the HTML output:

.. literalinclude:: /_output/500-html-tidy.pl-out
    :language: none

While the document is being parsed, you'll see messages like this on STDERR:

.. literalinclude:: /_output/500-html-tidy.pl-err
    :language: none

You can turn off the error output with the ``suppress_errors`` option:

.. literalinclude:: /code/501-html-tidy-no-err.pl
    :language: perl
    :lines: 11-15

That option doesn't seem to work with all versions of ``XML::LibXML`` so you
may want to use a routine like this that sends STDERR to ``/dev/null`` during
parsing, but still allows other output to STDERR when the parse function
returns:

.. literalinclude:: /code/510-html-no-stderr.pl
    :language: perl
    :lines: 7,17-28

Querying HTML with XPath
------------------------

The main tool you'll use for extracting data from HTML is the ``findnodes()``
method that was introduced in :doc:`basics` and :doc:`xpath`.  For these
examples, the source HTML comes from the `CSS Zen Garden Project
<http://csszengarden.com/>`_ and is in the file :download:`css-zen-garden.html
</code/css-zen-garden.html>`.

This script locates every ``<h3>`` element inside the ``<div>`` with an ``id``
attribute value of ``"zen-supporting"``:

.. literalinclude:: /code/520-html-xpath-simple.pl
    :language: perl
    :lines: 9-18

Output:

.. literalinclude:: /_output/520-html-xpath-simple.pl-out
    :language: none

For a more complex example, the next script iterates through each ``<li>`` in
the "Select a Design" section and extracts three items of information for each:
the name of the design, the name of the designer, and a link to view the
design.  Once the information has been collected, it is dumped out in JSON
format:

.. literalinclude:: /code/530-html-xpath-complex.pl
    :language: perl
    :lines: 7-33

Output:

.. literalinclude:: /_output/530-html-xpath-complex.pl-out
    :language: json

In both these examples we were fortunate to be dealing with 'semantic markup'
-- where sections of the document could be readily identified using ``id``
attributes.  If there were no ``id`` attributes, we could change the XPath
expression to select using element text content instead:

.. literalinclude:: /code/531-html-xpath-no-semantic.pl
    :language: perl
    :lines: 21

This XPath expression first looks for an ``<h3>`` element that contains the
text ``'Select a Design'``.  It then uses ``/..`` to find that element's
parent (a ``<div>`` in the example document) and then uses ``//li`` to find
all ``<li>`` elements contained within the parent.

Another common problem is finding that although your XPath expressions do match
the content you want, they also match content you don't want -- for example
from a block of navigation links.  In these cases you might identify a block of
uninteresting content using ``findnodes()`` and then use ``removeChild()`` to
remove that whole section from the :doc:`DOM <dom>` before running your main
XPath query.  Because you're only removing the nodes from the in-memory copy
of the document, the original source remains unchanged.  This technique is
used in the :download:`spell-check script </code/590-spell-check.pl>` used
to find typos in this document.

Matching class names
--------------------

An HTML element can have multiple classes applied to it by using a
space-separated list in the ``class`` attribute.  Some care is needed to ensure
your XPath expressions always match one whole class name from the list.  For
example, if you were trying to match ``<li>`` elements with the class
``member``, you might try something like:

.. literalinclude:: /code/540-html-xpath-classes.pl
    :language: perl
    :lines: 18

which will match an element like this:

.. literalinclude:: /code/people.html
    :language: html
    :lines: 9

but it will also match an element like this:

.. literalinclude:: /code/people.html
    :language: html
    :lines: 10

The most common way to solve the problem is to add an extra space to the
beginning and the end of the ``class`` attribute value like this:  ``concat("
", @class, " ")`` and then add spaces around the classname we're looking for:
``' member '``.  Giving a expression like this:

.. literalinclude:: /code/540-html-xpath-classes.pl
    :language: perl
    :lines: 25

Using CSS-style selectors
-------------------------

The XPath expression in the last example is an effective way to select elements
by class name, but the syntax is very unwieldy compared to CSS selectors.  For
example, the CSS selector to match elements with the class name ``member``
would simply be: ``.member``

Wouldn't it be great if there was a way to provide a CSS selector and have it
converted into an XPath expression that you could pass to ``findnodes()``?
Well it turns out that's exactly what the `HTML::Selector::XPath
<https://metacpan.org/pod/HTML::Selector::XPath>`_ module does:

.. literalinclude:: /code/580-html-css-selectors.pl
    :language: perl
    :lines: 8-9,37-41

Some example inputs ("Selector") and outputs ("XPath"):

.. literalinclude:: /_output/580-html-css-selectors.pl-out
    :language: none


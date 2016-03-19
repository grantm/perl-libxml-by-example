.. highlight:: none
    :linenothreshold: 1

The Document Object Model
=========================

The :doc:`basic examples <basics>` section introduced the ``findnodes()`` method
and XPath expressions for extracting parts of an XML document.  For most
applications, that's pretty much all you need, but sometimes it's necessary to
use lower-level methods and to understand the relationships between different
parts of the document.

The XML::LibXML module implements Perl bindings for the `W3C Document Object
Model <https://www.w3.org/TR/DOM-Level-3-Core/core.html>`_.  The W3C DOM
defines object classes, properties and methods for querying and manipulating
the different parts of an XML (or HTML) document.  In the Perl implementation,
object properties are exposed via accessor methods.

Let's start our exploration of the DOM with a simple XML document which
describes `a book <http://www.bookdepository.com/isbn/9780764142239>`_ -
:download:`book.xml </code/book.xml>`

.. literalinclude:: /code/book.xml
    :language: xml
    :linenos:

When you ask XML::LibXML to parse the document, it creates an object to
represent each part of the document and assembles those objects into a
hierarchy as shown here:

.. figure:: ../images/dom.png
   :class: illustration
   :alt: An XML document represented as a Document Object Model

   A simplified representation of the Document Object Model.

The source XML document has a ``<book>`` element which contains four other
elements: ``<title>``, ``<authors>``, ``<isbn>`` and ``<dimensions>``.  The
``<authors>`` element in turn contains two ``<author>`` elements.

The hierarchy in the picture shows us that ``<book>`` has four "child"
elements.  Similarly, ``<authors>`` has two child elements and one "parent"
element (``<book>``).  Five of the elements have no child elements but four of
them do contain text content and one has some attributes.

The 'Document' object
---------------------

When you parse a document with XML::LibXML the parser returns a 'Document'
object - represented in yellow in the picture above.  The reference
documentation for the `XML::LibXML::Document
<https://metacpan.org/pod/XML::LibXML::Document>`_ class lists methods you can
use to interact with the document.  The 'Document' class inherits from the
'Node' class so you'll also need to refer to the docs for `XML::LibXML::Node
<https://metacpan.org/pod/XML::LibXML::Node>`_ as well.

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 10-13

Output:

.. literalinclude:: /_output/200-dom-document.pl-out
    :language: none
    :lines: 1-2

The document object also provides methods you can use to extract information
from the XML declaration section - the very first line of the source XML,
which precedes the ``<book>`` element:

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 14-17

Output:

.. literalinclude:: /_output/200-dom-document.pl-out
    :language: none
    :lines: 3-5

You can serialise a whole DOM back out to XML by calling the ``toString()``
method on the document object:

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 19

The document class also overrides the stringification operator, so if you
simply treat the object as a string and print it out you'll also get the
serialised XML:

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 21


'Element' objects
-----------------

The blue boxes in the picture represent 'Element' nodes.  The reference
documentation for the `XML::LibXML::Element
<https://metacpan.org/pod/XML::LibXML::Element>`__ class lists a number of
methods, but like the 'Document' class, many more methods are inherited from
`XML::LibXML::Node <https://metacpan.org/pod/XML::LibXML::Node>`_.

Every XML document has one single top-level element known as the "document
element" that encloses all the other elements - in our example it's the
``<book>`` element.  You can retrieve this element by calling the
``documentElement()`` method on the document object and you can determine
what type of element it is by calling ``nodeName()``:

.. literalinclude:: /code/210-dom-elements.pl
    :language: perl
    :lines: 11-14

Output:

.. literalinclude:: /_output/210-dom-elements.pl-out
    :language: none
    :lines: 1-2

The ``<book>`` element has four child elements.  You can use
``getChildrenByTagName()`` to get a list of all the child elements with a
specific element name (this is not a recursive search, it only looks through
elements which are direct children):

.. literalinclude:: /code/210-dom-elements.pl
    :language: perl
    :lines: 15-19

Output:

.. literalinclude:: /_output/210-dom-elements.pl-out
    :language: none
    :lines: 3-6

If you're not looking for one specific type of element, you can get all the
children with ``childNodes()``:

.. literalinclude:: /code/210-dom-elements.pl
    :language: perl
    :lines: 21-27

We already know that ``<book>`` contains four child elements, so you may be
a little surprised to see ``childNodes()`` returns a list of nine nodes:

.. literalinclude:: /_output/210-dom-elements.pl-out
    :language: none
    :lines: 7-16

If you refer back to the source XML document, you can see that after the
``<book>`` tag and before the ``<title>`` tag there is some whitespace: a
line-feed character followed by two spaces at the start of the next line:

.. literalinclude:: /code/book.xml
    :language: xml
    :linenos:
    :lines: 2-3

These strings of whitespace are represented in the DOM by 'Text' nodes, which
are children of the parent element.  So a more accurate DOM diagram would
look like this:

.. figure:: ../images/dom-full.png
   :class: illustration
   :alt: Document Object Model including whitespace-only text nodes

   Document Object Model including whitespace-only text nodes

If you want to filter child nodes by type, XML::LibXML provides a number of
constants which you can import when you load the module:

.. literalinclude:: /code/210-dom-elements.pl
    :language: perl
    :lines: 7

And then you can compare ``$node->nodeType`` to these constants:

.. literalinclude:: /code/210-dom-elements.pl
    :language: perl
    :lines: 29-35

Output:

.. literalinclude:: /_output/210-dom-elements.pl-out
    :language: none
    :lines: 17-21

But you'll generally find that it's much easier to just use ``findnodes()``
and :doc:`xpath` to select exactly the elements or other nodes you want.

... *<to be continued>* ...



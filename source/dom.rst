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
    :lines: 9-12

Output:

.. literalinclude:: /_output/200-dom-document.pl-out
    :language: none
    :lines: 1-2

The document object also provides methods you can use to extract information
from the XML declaration section - the very first line of the source XML,
which precedes the ``<book>`` element:

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 13-16

Output:

.. literalinclude:: /_output/200-dom-document.pl-out
    :language: none
    :lines: 3-5

You can serialise a whole DOM back out to XML by calling the ``toString()``
method on the document object:

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 18

The document class also overrides the stringification operator, so if you
simply treat the object as a string and print it out you'll also get the
serialised XML:

.. literalinclude:: /code/200-dom-document.pl
    :language: perl
    :lines: 20


'Element' objects
-----------------

The blue boxes in the picture represent 'Element' nodes.  The reference
documentation for the `XML::LibXML::Element
<https://metacpan.org/pod/XML::LibXML::Element>`_ class lists a number of
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

'Text' objects
--------------

The green boxes in the picture represent 'Text' nodes.  The reference
documentation for the `XML::LibXML::Text
<https://metacpan.org/pod/XML::LibXML::Text>`_ class lists a small number of
methods and many more are inherited from the Node class.

There are numerous ways to get the text string out of a Text object but it's
important to be clear on whether you want the text as it appears in the XML
(including any entity escaping) or whether you want the plain text that the
source represents.  Consider this tiny source document:

.. literalinclude:: /code/fish-and-chips.xml
    :language: xml
    :linenos:
    :lines: 1

And these different methods for accessing the text:

.. literalinclude:: /code/220-dom-text-nodes.pl
    :language: perl
    :lines: 11-19

Producing this output:

.. literalinclude:: /_output/220-dom-text-nodes.pl-out
    :language: none
    :lines: 1-6

The ``data()`` and ``nodeValue()`` methods are essentially aliases.  The
``to_literal()`` method produces the same output via a more complex route, but
has the advantage that you can call it on any object in the DOM.

The ``toString()`` method is really only useful for serialising a whole DOM or
a DOM fragment out to XML.  Stringification is particularly handy when you just
want to print an object out for debugging purposes.

'Attr' objects
--------------

The red boxes in the picture represent attributes.  You're unlikely to ever
need to deal with attribute **objects** since it's easier to get and set
attribute values by calling methods on an Element object and passing in plain
string values.  An even easier approach is to use the tied hash interface that
allows you to treat each element as if it were a hashref and access attribute
values via hash keys:

.. literalinclude:: /code/230-dom-attributes.pl
    :language: perl
    :lines: 11-15

Output:

.. literalinclude:: /_output/230-dom-attributes.pl-out
    :language: none
    :lines: 1-2

The class name for the attribute objects is 'Attr' - the unfortunate truncation
of the class name derives from the `W3C DOM spec
<https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-637646024>`_.  The
reference documentation is at: `XML::LibXML::Attr
<https://metacpan.org/pod/XML::LibXML::Attr>`_.  Some additional methods are
inherited from the Node class but not all the Node methods work with Attr
objects (once again due to behaviour specified by the W3C DOM).

.. literalinclude:: /code/240-dom-attr.pl
    :language: perl
    :lines: 11-22

Output:

.. literalinclude:: /_output/240-dom-attr.pl-out
    :language: none
    :lines: 1-4

'NodeList' objects
------------------

The 'NodeList' object is a part of the DOM that makes sense in DOM
implementations for other languages (e.g.: Java) but doesn't make much sense in
Perl.  Methods such as ``childNodes()`` or ``findnodes()`` that may need to
return multiple nodes, return a 'NodeList' object which contains the matching
nodes and allows the caller to iterate through the result set:

.. literalinclude:: /code/250-dom-nodelist.pl
    :language: perl
    :lines: 13-19

Output:

.. literalinclude:: /_output/250-dom-nodelist.pl-out
    :language: none
    :lines: 1-5

But things don't need to be that complicated in Perl - if a method needs to
return a list of values then it can just return a list of values.  So the Perl
bindings for DOM methods that would return a NodeList check the calling
context.  If called in a scalar context, they return a NodeList object (as
above) but in a list context they just return the list of values - much
simpler:

.. literalinclude:: /code/250-dom-nodelist.pl
    :language: perl
    :lines: 23-25

When you execute a search that you expect should match exactly one node, take
care to still use list context:

.. literalinclude:: /code/250-dom-nodelist.pl
    :language: perl
    :lines: 29-31

Output:

.. literalinclude:: /_output/250-dom-nodelist.pl-out
    :language: none
    :lines: 12-13

In this example, the assignment ``my($dim) = ...`` uses parentheses to force
list context, so ``findnodes()`` will return a list of Element nodes and the
first will be assigned to ``$dim``.  Without the parentheses, a NodeList would
be assigned to ``$dim``.

If for some reason you find yourself with a NodeList object you can extract
the contents as a simple list with ``$result->get_nodelist``.

The NodeList object does implement the ``to_literal()`` method, which returns
the text content of all the nodes, concatenated together as a single string.
If you need a list of individual string values, you can use
``$result->to_literal_list()``:

.. literalinclude:: /code/250-dom-nodelist.pl
    :language: perl
    :lines: 35

Output:

.. literalinclude:: /_output/250-dom-nodelist.pl-out
    :language: none
    :lines: 15

Modifying the DOM
-----------------

If you wish to modify the DOM, you can create new nodes and add them into the
node hierarchy in the appropriate place.  You can also modify, move and delete
existing nodes.  Let's start with a simple XML document:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 9-14

Navigate to the ``<event>`` element; change its text content; add an attribute
and print out the resulting XML:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 16-21

Output:

.. literalinclude:: /_output/260-dom-modification.pl-out
    :language: none
    :lines: 1-4

You can use ``$dom->createElement`` to create a new element and then add it to
an existing node's list of child nodes.  You can append it to the end of the
list of children or insert it before/after a specific existing child:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 25-33

Output:

.. literalinclude:: /_output/260-dom-modification.pl-out
    :language: none
    :lines: 7-10

Unfortunately that output is probably messier than you were expecting.  To get
nicely indented XML output, you'd need to create text nodes containing a
newline and the appropriate number of spaces for indentation; and then add
those text nodes in before each new element.  Or, an easier way would be to
pass the numeric value ``1`` to the ``toString()`` method as a flag indicating
that you'd like the output auto-indented:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 35

Output:

.. literalinclude:: /_output/260-dom-modification.pl-out
    :language: none
    :lines: 12-15

But sadly that didn't seem to work.  The ``libxml`` library won't add
indentation to *'mixed content'* - an element whose list of child nodes
contains a mixture of both Element nodes and Text nodes.  In this case the
``<record>`` element contains mixed content (there's a whitespace text node
before the ``<event>`` and another after it) so ``libxml`` does not try to
indent its contents.

If we strip out those extra text nodes then libxml will add indenting:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 39-42

Output:

.. literalinclude:: /_output/260-dom-modification.pl-out
    :language: none
    :lines: 17-22

While that did work, it required some rather specific knowledge of the document
structure.  We were relying on knowing that all the text children of the
``<record>`` element were whitespace-only and could be discarded.  Here's a
more generic approach which searches recursively through the document and
deletes every text node that contains only whitespace:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 48-50

That code is a little tricky so some explanation is probably in order:

* The loop does not declare a loop variable, so ``$_`` is used implicitly.
* The trailing ``unless`` clause runs a regex comparison against ``$_``
  which implicitly calls ``toString()`` on the Text node.
* ``unless /\S/`` is a double negative which means *"unless the text contains
  a non-whitespace character"*.
* the ``removeChild()`` method needs to be called on the *parent* of the node
  we're removing, so if the Text node is whitespace-only then we need to
  use ``parentNode()``.

Another handy method for adding to the DOM is ``appendWellBalancedChunk()``.
This method takes a string containing a fragment of XML.  It must be well
balanced - each opening tag must have a matching closing tag and elements must
be properly nested.  The XML fragment is parsed to create a
`XML::LibXML::DocumentFragment
<https://metacpan.org/pod/XML::LibXML::DocumentFragment>`_ which is then
appended to the target element:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 54-57

Output:

.. literalinclude:: /_output/260-dom-modification.pl-out
    :language: none
    :lines: 31-39

One 'gotcha' with the ``appendWellBalancedChunk()`` method is that the XML
parsing phase expects a string of bytes.  So if you have a Perl string that
might contain non-ASCII characters, you first need to encode the character
string to a byte string in UTF-8 and then pass the byte string to
``appendWellBalancedChunk()``:

.. literalinclude:: /code/260-dom-modification.pl
    :language: perl
    :lines: 62-63

Creating a new Document
-----------------------

You can create a document from scratch by calling
``XML::LibXML::Document->new()`` rather than parsing from an existing document.
Then use the methods discussed above to add elements and text content:

.. literalinclude:: /code/270-dom-from-scratch.pl
    :language: perl
    :lines: 1-16

In this example, the document encoding was declared as UTF-8 when the Document
object was created.  Text content was added by calling ``appendText()`` and
passing it a normal Perl character string - which happened to contain some
non-ASCII characters.  When opening the file for output it is not necessary to
use an encoding layer since the output from ``libxml`` will already be encoded
as utf-8 bytes.

The file contents look like this:

.. literalinclude:: /_output/270-dom-from-scratch.pl-out
    :language: none
    :lines: 1-2

If we hex-dump the file we can see the `e-acute character
<http://www.mclean.net.nz/ucf/?c=U+00E9>`_ was written out as the 2-byte UTF-8
sequence ``C3 A9`` and the `euro symbol
<http://www.mclean.net.nz/ucf/?c=U+20AC>`_ was written as a 3-byte UTF-8
sequence: ``E2 82 AC``:

.. literalinclude:: /_output/270-dom-from-scratch.pl-out
    :language: none
    :lines: 4-8

To output the document in a different encoding all you need to do is change the
second parameter passed to ``new()`` when creating the Document object.  No
other code changes are required:

.. literalinclude:: /code/270-dom-from-scratch.pl
    :language: perl
    :lines: 28

This time when hex-dumping the file we can see the e-acute character was
written out as the single byte ``E9`` and the euro symbol which cannot be
represented directly in Latin-1 was written in numeric character entity form
``&#8364;``:

.. literalinclude:: /_output/270-dom-from-scratch.pl-out
    :language: none
    :lines: 10-15

If you're generating XML from scratch then creating and assembling DOM nodes is
very fiddly and ``XML::LibXML`` might not be the best tool for the job.
`XML::Generator <https://metacpan.org/pod/XML::Generator>`_ is an excellent
module for generating XML - especially if you need to deal with namespaces.


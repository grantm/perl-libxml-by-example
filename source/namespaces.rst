.. highlight:: none
    :linenothreshold: 1

Working with XML Namespaces
===========================

Using the ``findnodes()`` method as described in the
:doc:`basic examples <basics>` section doesn't work when the XML document
uses 'namespaces'.  This section describes the extra steps you need to take
to work with namespaces in XML.

XML 'namespaces' allow you to build documents using elements from more than one
vocabulary.  For example one XML document might include both SVG elements to
describe a drawing, as well as Dublin Core elements to define metadata *about*
the drawing.  The two different vocabularies are defined by separate bodies -
the `W3C <https://www.w3.org/TR/SVG/>`_ and the `DCMI
<http://dublincore.org/specifications/>`_ respectively.  Associating each
element in your document with a namespace allows a processor to distinguish
elements that use the same element names.

The scripts in this section will use the SVG document:
:download:`xml-libxml.svg </code/xml-libxml.svg>`.  Which starts like this:

.. literalinclude:: /code/xml-libxml.svg
    :language: xml
    :lines: 1-21

Because the top-level ``<svg>`` element uses
``xmlns="http://www.w3.org/2000/svg"`` to declare a **default namespace** ,
every other element will be in that namespace unless the element name includes
a prefix for a different namespace.

The first child element in the document is a ``<title>`` element with no
namespace prefix, so it is associated with the default namespace URI:
``http://www.w3.org/2000/svg``.

.. literalinclude:: /code/xml-libxml.svg
    :language: xml
    :lines: 22

A later section of the document includes a ``<title>`` element with the `dc:`
namespace prefix, so it is associated with the URI:
``http://purl.org/dc/elements/1.1/``.

.. literalinclude:: /code/xml-libxml.svg
    :language: xml
    :lines: 127

Using ``findnodes()`` to match nodes against the XPath expression ``//title``
returns no matches:

.. literalinclude:: /code/600-ns-no-context.pl
    :language: perl
    :lines: 13-14

Output:

.. literalinclude:: /_output/600-ns-no-context.pl-out
    :language: none
    :lines: 1

When an element in a document is associated with a namespace URI it will only
match an XPath expression that is also associated with the same namespace URI.
XPath expressions also use namespace prefixes to associate a namespace URI with
an element.  However it's important to stress that it's not the prefix that is
being matched, but the URI associated with the prefix.

In order to associate namespace prefixes in XPath expressions with namespace
URIs, we need to use an `XML::LibXML::XPathContext
<https://metacpan.org/pod/XML::LibXML::XPathContext>`_ object.  This is a
multi-step process:

#. create an XPathContext object associated with the document you want to search

#. register a prefix and associated URI for each namespace you want to include
   in your query

#. call the ``findnodes()`` method on the XPathContext object rather than
   directly on the DOM object

.. literalinclude:: /code/610-ns-xpc.pl
    :language: perl
    :lines: 7-21

Output:

.. literalinclude:: /_output/610-ns-xpc.pl-out
    :language: none

You'll recall from earlier examples that you can search within a node by
calling ``findnodes()`` on the element node (rather than the document) and
using an XPath expression like ``./child`` where the dot refers to the
*context* node.  However when you're dealing with namespaces that won't work,
because you need to call ``findnodes()`` on the XPathContext object.  The
solution is to pass ``findnodes()`` a second argument, after the XPath
expression.  The additional argument is the element to use as a context node:

.. literalinclude:: /code/620-ns-child-nodes.pl
    :language: perl
    :lines: 7-23

Output:

.. literalinclude:: /_output/620-ns-child-nodes.pl-out
    :language: none

One small feature of that script which is worth noting is the use of
``$el->localname`` to get the name of the element *without* the namespace
prefix.  The more commonly used ``$el->nodeName`` method does include the
namespace prefix as it appears in the document.


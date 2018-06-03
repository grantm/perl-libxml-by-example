.. highlight:: none
    :linenothreshold: 1

XPath Expressions
=================

As you saw in the :doc:`basic examples <basics>` section, the ``findnodes()``
method takes an XPath expression and finds nodes in the :doc:`DOM <dom>` that
match the expression.  There are two ways to call calling the ``findnodes()``
method:

* on the object representing the whole document, or

* on an element from the DOM - the element on which you call the method is
  called the context element

If your XPath expression starts with a '/' then the search will start at
top-most element in the document - even if you call ``findnodes()`` on a
different context element.

Start your XPath expression with '.' to search down through the children of the
context element.

The remainder of this section simply includes examples of XPath expressions and
descriptions of what they match.

.. note::

    You can try out different XPath expressions in the `XPath sandbox
    <_static/xpath-sandbox/xpath-sandbox.html>`_.  The sandbox doesn't actually
    use Perl or libxml, it simply uses Javascript to access the XPath engine
    built into your browser.  However, the expression matching should work just
    as it would in your Perl scripts.

.. role:: xpath(code)

.. role:: xpath_try(code)

:xpath_try:`/playlist`

Match the top-most element of the document if (and *only if*) it is a
``<playlist>`` element.

:xpath_try:`//title`

Match every ``<title>`` element in the document.

:xpath_try:`//movie/title`

Match every ``<title>`` element that is the direct child of a ``<movie>``
element.

:xpath:`./title`

Match every ``<title>`` element that is the direct child of the context
element, e.g.:

.. literalinclude:: /code/100-xpath-examples
    :language: perl
    :lines: 13-15

:xpath_try:`//title/..`

Match any element which is the parent of a ``<title>`` element.

:xpath_try:`/*`

Match the top-most element of the document regardless of the element name.

:xpath_try:`//person/@role`

Match the attribute named ``role`` on every ``<person>`` element.

:xpath_try:`//person/@*`

Match every attribute on every ``<person>`` element.

:xpath_try:`//person[@role]`

Match every ``<person>`` element *that has an attribute* named ``role``.

:xpath_try:`//*[@url]`

Match every element that has an attribute named ``url``.

:xpath_try:`//*[@*]`

Match every element that has an attribute of any name.

:xpath_try:`/playlist//*[not(@*)]`

Match every element that is a descendant of the top-level ``<playlist>``
element and which does not have any attributes.

:xpath_try:`//movie[@id="tt0307479"]`

Match every ``<movie>`` element that has an attribute named ``id`` with the
value ``tt0307479``.

:xpath_try:`//movie[not(@id="tt0307479")]`

Match every ``<movie>`` element that does not have an attribute named
``id`` with the value ``tt0307479`` (including elements that do not have
an ``id`` attribute at all).

:xpath_try:`//*[@id="tt0307479"]`

Match every element that has an attribute named ``id`` with the value
``tt0307479``.

:xpath_try:`//movie[@id="tt0307479"]//synopsis`

Match every ``synopsis`` element within every ``<movie>`` element that has
an attribute named ``id`` with the value ``tt0307479``.

:xpath_try:`//person[position()=2]`

Match the second ``<person>`` element in each sequence of adjacent
``<person>`` elements.  Note that the first element in a sequence is at
position 1 not 0.

:xpath_try:`//person[2]`

This is simply a shorthand form of the ``position()=2`` expression above.

:xpath_try:`//person[position()<3]`

Match the first two ``<person>`` elements in each sequence of adjacent
``<person>`` elements.

:xpath_try:`//person[last()]`

Match the last ``<person>`` element in each sequence of adjacent
``<person>`` elements.

:xpath_try:`//cast[count(person)=3]`

Match every ``<cast>`` element which contains exactly 3 ``<person>``
elements.

:xpath_try:`//*[name()='genre']`

Match every element with the name ``genre`` - exactly equivalent to
``//genre``.

:xpath_try:`//*[starts-with(name(), 'running')]`

Match every element with a name starting with the word ``running``.

:xpath_try:`//person[contains(@name, 'Matt')]`

Match every ``<person>`` element that has an attribute named ``name``
which contains the text ``Matt`` anywhere in the attribute value.

:xpath_try:`//person[contains(@name, 'matt')]`

Same as above except for the casing of the text to match.  Matching is
case-sensitive.

:xpath_try:`//person[not(contains(@name, 'e'))]`

Match every ``<person>`` element that has an attribute named ``name``
which does not contain the letter ``e`` anywhere in the attribute value.

:xpath_try:`//person[starts-with(@name, 'K')]`

Match every ``<person>`` element that has an attribute named ``name`` with
a value that starts with the letter ``K``.

:xpath_try:`//director/text()`

Match every text node which is a direct child of a ``<director>`` element.

:xpath_try:`//cast/text()`

Match every text node which is a direct child of a ``<cast>`` element.
You might imagine that this would not match anything, since in the sample
document the ``<cast>`` elements contain only ``<person>`` elements.  But
if you look carefully, you'll see that in between each ``<person>`` element
there is some whitespace - a newline after the preceding element and then
some spaces at the start of the next line.  This whitespace is text and is
therefore matched.

:xpath_try:`//person[contains(@name,'Matt')]/parent::*`

Match the parent of every ``<person>`` element which contains ``Matt`` in
the ``name`` attribute.  (You could also use ``/..`` for the parent).  The
syntax ``parent::*`` means any element on the parent axis.

:xpath_try:`//person[contains(@name,'Matt')]/ancestor::movie`

Match every ``<movie>`` element which is an ancestor of a ``<person>``
element which contains ``Matt`` in the ``name`` attribute.  The syntax
``ancestor::*`` means any element on the ancestor axis.

:xpath_try:`//genre[text()='drama']/following-sibling::*`

Match every element of any name, which is a sibling of a ``<genre>``
element whose complete text content is ``drama`` and which follows that
element in document order.

:xpath_try:`//genre[text()='drama']/following-sibling::genre`

Match every ``<genre>`` element, which is a sibling of a ``<genre>``
element whose complete text content is ``drama`` and which follows that
element in document order.

:xpath_try:`//genre[text()='drama']/preceding-sibling::genre`

Match every ``<genre>`` element, which is a sibling of a ``<genre>``
element whose complete text content is ``drama`` and which comes before
that element in document order.

:xpath_try:`//movie[@id="tt0112384"]/following::title`

Match every ``<title>`` element, which comes after a ``<movie>`` element
with ``tt0112384`` as the value of the ``id`` attribute.  Note that 'after'
means after the closing tag so a ``<title>`` element *inside* the matching
``<movie>`` would not be included.

:xpath_try:`//movie[.//score/text() < 7.5]`

Match every ``<movie>`` element which contains a ``<score>`` element with
text content numerically less than 7.5.

:xpath_try:`//movie[.//score/text() > 8.0]//synopsis`

Match every ``<synopsis>`` element in every ``<movie>`` element which
contains a ``<score>`` element with text content numerically greater than
8.0.

:xpath_try:`//director or //genre`

Match every element which is a ``<director>`` or a ``<genre>``.

:xpath_try:`//person[contains(@name, 'Bill') and contains(@role, 'Fred')]`

Match every ``<person>`` element which contains ``Bill`` in the ``name``
attribute **and** contains ``Fred`` in the role attribute.

:xpath_try:`//person[@name='Kevin Bacon']/../person[@name!='Kevin Bacon']`

Find every person who has played alongside Kevin Bacon.  First find every
``<person>`` element with a name attribute equal to ``Kevin Bacon``. Then
find the parent of each matching element and look for its child
``<person>`` elements with a name attribute which is not equal to ``Kevin
Bacon``.

XPath Functions
---------------

Some of the examples above used `XPath functions
<https://developer.mozilla.org/en-US/docs/Web/XPath/Functions>`_. It's worth
noting that the underlying libxml2 library only supports XPath version 1.0 and
there are `no plans to support 2.0
<http://www.mail-archive.com/xml@gnome.org/msg04082.html>`_.

XPath 1.0 does not include the ``lower-case()`` or ``upper-case()`` functions,
so nasty workarounds like this are required if you need case-insensitive
matching:

.. literalinclude:: /code/110-case-insensitive-xpath-1
    :language: perl
    :lines: 13-28

Alternatively, you can use the Perl API to `register custom XPath functions
<https://metacpan.org/pod/distribution/XML-LibXML/lib/XML/LibXML/XPathContext.pod#Custom-XPath-functions>`_.


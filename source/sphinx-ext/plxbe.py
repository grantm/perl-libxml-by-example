from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.util.compat import Directive
from urllib import quote

def setup(app):
    """
    Add an 'xpath-try' custom directive.  For HTML output, this will render the
    XPath expression as a code block but with the addition of a link try the
    expression in the XPath Sandbox.  For non-HTML output, a standard code
    block is emitted with no link.
    """
    app.add_node(xpath_try,
                 html=(visit_xpath_try_node_html, depart_xpath_try_node),
                 latex=(visit_xpath_try_node, depart_xpath_try_node),
                 text=(visit_xpath_try_node, depart_xpath_try_node))

    app.add_directive('xpath-try', XPathTryDirective)

    return {'version': '1.0'}   # version of this extension


class xpath_try(nodes.General, nodes.FixedTextElement):
    pass

def visit_xpath_try_node(self, node):
    self.visit_literal_block(node)

def visit_xpath_try_node_html(self, node):
    self.body.append(
        '<p><code class="code xpath-try docutils literal"><span class="pre">'
        + self.encode(node.rawsource)
        + '</span><a class="xpath-try-it" href="' + node['url']
        + '">Try it!</a></code></p>'
    )
    raise nodes.SkipNode

def depart_xpath_try_node(self, node):
    self.depart_literal_block(node)

def unescape_arg(s):
    """
    This function is used to undo backslash-escaping.  While it's not clear that
    arguments to a directive ought to be escaped, vim syntax highlighting seems
    to get confused by '*' in arguments. For this reason, '\*' has been used in
    the rst source and this function turns '\_' into '_' for any value of '_'.
    The standard docutils.utils.unescape seems to do something else entirely.
    """
    a = [ '\\' if part == '' else part for part in s.split('\\') ]
    return ''.join(a)

class XPathTryDirective(Directive):
    has_content = False
    required_arguments = 1
    optional_arguments = 0
    final_argument_whitespace = True
    option_spec = {
        'filename': directives.unchanged,
        'ns_args': directives.unchanged,
    }

    def run(self):
        xpath_expr = unescape_arg(self.arguments[0])
        node = xpath_try(xpath_expr, xpath_expr)
        node['language'] = 'none'
        node['highlight_args'] = {}
        node['linenos'] = False
        url = '_static/xpath-sandbox/xpath-sandbox.html?q='
        url += quote(xpath_expr, safe='/')
        if 'filename' in self.options:
            url += ';filename=' + self.options.get('filename')
        if 'ns_args' in self.options:
            url += ';' + self.options.get('ns_args')
        node['url'] = url
        return [node]


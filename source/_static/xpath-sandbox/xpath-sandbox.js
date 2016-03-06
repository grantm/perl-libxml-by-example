/*
 * xpath-sandbox.js - an interactive test tool for practising XPath expressions
 *
 * Copyright (c) 2015 Grant McLean <grant@mclean.net.nz>
 *
 */

(function (hdoc) {

    "use strict";

    var app = {

        ui_element_ids: [
                            'message-box',
                            'query-form',
                            'query-xpath',
                            'reset-btn',
                            'doc-tree'
                        ],

        set_default_xml_source: function () {
            var el = hdoc.getElementById('sample-xml');
            this.xml_source = el ? el.innerHTML : '';
        },

        get_ui_elements: function () {
            this.ui_element_ids.forEach(function (id) {
                var el = hdoc.getElementById(id);
                if(el) {
                    var key = id.replace(/\W+/g, '_');
                    this[key] = el;
                }
                else {
                    throw "Unable to find element with id: " + id;
                }
            }.bind(this));
        },

        process_query_string: function () {
            this.url_param = {};
            var qs = window.location.search.substring(1);
            var parse = /([^;=]+)=([^;]*)/g;
            var match;
            while (match = parse.exec(qs)) {
                this.url_param[match[1]] = decodeURIComponent(match[2]);
            }
        },

        text_node: function (content) {
            return hdoc.createTextNode(content);
        },

        element_node: function (name, class_name) {
            var el = hdoc.createElement(name);
            if(class_name) {
                el.className = class_name;
            }
            return el;
        },

        set_message: function (msg, class_name) {
            var text = this.text_node(msg);
            var el = this.empty(this.message_box)
            el.className = '';
            if(class_name) {
                el.className = class_name;
            }
            el.appendChild(text);
        },

        empty: function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            return el;
        },

        parse_xml: function () {
            var parser = new DOMParser();
            return parser.parseFromString(this.xml_source , "text/xml");
        },

        render_xml: function (xml_dom) {
            this.render_children(this.empty(this.doc_tree), xml_dom.childNodes)
        },

        render_children: function (out, nodes) {
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var node_out = this.element_node('span');
                if(node.nodeType === node.ELEMENT_NODE) {
                    node_out.classList.add('element');
                    node_out.appendChild(this.text_node('<'));
                    var ts_out = this.element_node('span', 'tag-name');
                    ts_out.appendChild(this.text_node(node.nodeName));
                    node_out.appendChild(ts_out);
                    this.render_attributes(node_out, node);
                    node_out.appendChild(this.text_node('>'));
                    var ch_out = this.element_node('span', 'children');
                    this.render_children(ch_out, node.childNodes)
                    node_out.appendChild(ch_out);
                    node_out.appendChild(this.text_node('</'));
                    var te_out = this.element_node('span', 'tag-name');
                    te_out.appendChild(this.text_node(node.nodeName));
                    node_out.appendChild(te_out);
                    node_out.appendChild(this.text_node('>'));
                }
                else if(node.nodeType === node.TEXT_NODE || node.nodeType === node.CDATA_SECTION_NODE) {
                    node_out.classList.add('text');
                    node_out.appendChild(this.text_node(node.textContent));
                }
                else if(node.nodeType === node.COMMENT_NODE) {
                    node_out.classList.add('comment');
                    node_out.appendChild(this.text_node('<!-- '));
                    node_out.appendChild(this.text_node(node.textContent));
                    node_out.appendChild(this.text_node(' -->'));
                }
                else {
                    node_out.classList.add('not-implemented');
                    node_out.appendChild(this.text_node("[Unimplemented nodeType:" + node.nodeType + "]\n"));
                }
                if(node._xpsb_match_) {
                    var el_wrap = this.element_node('span', 'xp-match');
                    el_wrap.appendChild(node_out);
                    out.appendChild(el_wrap);
                }
                else {
                    out.appendChild(node_out);
                }
            }
        },

        render_attributes: function (out, el) {
            if(!el.hasAttributes) return;
            var attr = el.attributes;
            for(var i = 0; i < attr.length; i++) {
                out.appendChild(this.text_node(' '));
                var a_out = this.element_node('span', 'attr');
                var an_out = this.element_node('span', 'attr-name');
                an_out.appendChild(this.text_node(attr[i].name));
                a_out.appendChild(an_out);
                a_out.appendChild(this.text_node('="'));
                var av_out = this.element_node('span', 'attr-value');
                av_out.appendChild(this.text_node(attr[i].value));
                a_out.appendChild(av_out);
                a_out.appendChild(this.text_node('"'));
                if(attr[i]._xpsb_match_) {
                    var a_wrap = this.element_node('span', 'xp-match');
                    a_wrap.appendChild(a_out);
                    out.appendChild(a_wrap);
                }
                else {
                    out.appendChild(a_out);
                }
            }
        },

        show_matches: function (xp) {
            var count = 0;
            this.set_message('');
            var xml_dom = this.parse_xml();
            if(xp && xp.match(/\S/)) {
                var ns_resolver = null;
                try {
                    var result = xml_dom.evaluate(
                        xp, xml_dom.documentElement, ns_resolver,
                        XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null
                    );
                    var match = result.iterateNext();
                    while(match) {
                        count++;
                        match._xpsb_match_ = true;
                        match = result.iterateNext();
                    }
                    var s = count === 1 ? '' : 'es';
                    count = count === 0 ? 'No' : count;
                    this.set_message('Query returned ' + count + ' match' + s, 'success');
                }
                catch (e) {
                    this.set_message(e, 'error');
                }
            }
            this.render_xml(xml_dom);
        },

        add_listener: function (el, ev_name, method) {
            var listener = this[method].bind(this);
            this[el].addEventListener(ev_name, listener, false);
        },

        init_event_handlers: function () {
            this.add_listener('query_form', 'submit', 'submit_form');
            this.add_listener('reset_btn',  'click', 'reset_form');
        },

        submit_form: function (e) {
            e.preventDefault();
            this.show_matches(this.query_xpath.value);
        },

        reset_form: function (e) {
            this.query_xpath.value = '';
            this.show_matches('');
        },

        init: function () {
            this.get_ui_elements();
            this.process_query_string();
            this.query_xpath.value = this.url_param.q || '';
            this.init_event_handlers();
            this.set_default_xml_source();
            this.show_matches(this.query_xpath.value);
            this.query_xpath.focus();
        }

    };

    app.init();

})(document);


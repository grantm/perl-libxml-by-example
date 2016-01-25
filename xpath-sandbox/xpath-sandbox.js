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

        set_message: function (msg) {
            var text = this.text_node(msg);
            this.empty(this.message_box).appendChild(text);
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

        render_children: function (out, elems) {
            for(var i = 0; i < elems.length; i++) {
                var el = elems[i];
                if(el.nodeType === el.ELEMENT_NODE) {
                    var el_out = this.element_node('span', 'element');
                    if(el._xpsb_match_) {
                        el_out.classList.add("xp-match");
                    }
                    el_out.appendChild(this.text_node('<'));
                    var ts_out = this.element_node('span', 'tag-name');
                    ts_out.appendChild(this.text_node(el.nodeName));
                    el_out.appendChild(ts_out);
                    this.render_attributes(el_out, el);
                    el_out.appendChild(this.text_node('>'));
                    var ch_out = this.element_node('span', 'children');
                    this.render_children(ch_out, el.childNodes)
                    el_out.appendChild(ch_out);
                    el_out.appendChild(this.text_node('</'));
                    var te_out = this.element_node('span', 'tag-name');
                    te_out.appendChild(this.text_node(el.nodeName));
                    el_out.appendChild(te_out);
                    el_out.appendChild(this.text_node('>'));
                    out.appendChild(el_out);
                }
                else if(el.nodeType === el.TEXT_NODE) {
                    var text_out = this.element_node('span', 'text');
                    if(el._xpsb_match_) {
                        text_out.classList.add("xp-match");
                    }
                    text_out.appendChild(this.text_node(el.textContent));
                    out.appendChild(text_out);
                }
                else {
                    out.appendChild(this.text_node("[Unimplemented nodeType:" + el.nodeType + "]\n"));
                }
            }
        },

        render_attributes: function (out, el) {
            if(!el.hasAttributes) return;
            var attr = el.attributes;
            for(var i = 0; i < attr.length; i++) {
                out.appendChild(this.text_node(' '));
                var a_out = this.element_node('span', 'attr');
                if(attr[i]._xpsb_match_) {
                    a_out.classList.add("xp-match");
                }
                var an_out = this.element_node('span', 'attr-name');
                an_out.appendChild(this.text_node(attr[i].name));
                a_out.appendChild(an_out);
                a_out.appendChild(this.text_node('="'));
                var av_out = this.element_node('span', 'attr-value');
                av_out.appendChild(this.text_node(attr[i].value));
                a_out.appendChild(av_out);
                a_out.appendChild(this.text_node('"'));
                out.appendChild(a_out);
            }
        },

        show_matches: function (xp) {
            var count = 0;
            this.empty(this.message_box);
            var xml_dom = this.parse_xml();
            if(xp && xp.match(/\S/)) {
                var ns_resolver = null;
                var result = xml_dom.evaluate(xp, xml_dom.documentElement, ns_resolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                var match = result.iterateNext();
                while(match) {
                    count++;
                    match._xpsb_match_ = true;
                    match = result.iterateNext();
                }
                var s = count === 1 ? '' : 'es';
                count = count === 0 ? 'No' : count;
                this.set_message('Query returned ' + count + ' match' + s);
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
            this.init_event_handlers();
            this.set_default_xml_source();
            this.show_matches('');
            this.query_xpath.focus();
        }

    };

    app.init();

})(document);


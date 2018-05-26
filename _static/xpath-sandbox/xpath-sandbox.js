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
            'change-file-btn',
            'doc-tree',
            'file-dialog',
            'file-dialog-form',
            'file-selector-input',
            'file-selector-proxy',
            'file-parser-error',
            'file-dialog-save',
            'file-dialog-cancel'
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

        set_parser_error_ns: function () {
            var parser = new DOMParser();
            // This always spews an error into the console :-(
            var dom = parser.parseFromString('NOT-XML', 'text/xml')
            this.parser_error_ns = dom.getElementsByTagName("parsererror")[0].namespaceURI;
        },

        parse_xml: function (source) {
            var parser = new DOMParser();
            var dom = parser.parseFromString(source , "text/xml");
            var err_el = dom.getElementsByTagNameNS(this.parser_error_ns, 'parsererror');
            if(err_el.length > 0) {
                var err = new XMLSerializer().serializeToString(
                    err_el[0]
                ).replace(/\nLocation: [^\n]+/, '');
                throw new Error(err);
            }
            return dom;
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
            var xml_dom = this.parse_xml(this.xml_source);
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
                    count = count === 0 ? 'no' : count;
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
            if(this[el]) {
                this[el].addEventListener(ev_name, listener, false);
            }
            else {
                console.log("no bound element: this." + el);
            }
        },

        init_event_handlers: function () {
            this.add_listener('query_form', 'submit', 'submit_form');
            this.add_listener('reset_btn',  'click', 'reset_form');
            this.add_listener('change_file_btn',  'click', 'show_file_dialog');
            this.add_listener('file_selector_input',  'change', 'file_selected');
            this.add_listener('file_selector_proxy',  'click', 'trigger_file_selection');
            this.add_listener('file_dialog_save',  'click', 'save_file_selection');
            this.add_listener('file_dialog_cancel',  'click', 'cancel_file_selection');
        },

        show: function (el) {
            if(this[el]) {
                this[el].classList.remove('hidden');
            }
        },

        hide: function (el) {
            if(this[el]) {
                this[el].classList.add('hidden');
            }
        },

        submit_form: function (e) {
            e.preventDefault();
            this.show_matches(this.query_xpath.value);
        },

        reset_form: function (e) {
            this.query_xpath.value = '';
            this.show_matches('');
        },

        show_file_dialog: function () {
            this.new_xml_source = null;
            this.hide('file_parser_error');
            this.file_dialog_save.disabled = true;
            this.show('file_dialog');
        },

        trigger_file_selection: function (e) {
            this.file_selector_input.click();
        },

        file_selected: function (e) {
            var files = e.target.files;
            if(files.length > 0) {
                this.try_file(files[0]);
            }
        },

        try_file: function (file) {
            var reader = new FileReader();
            reader.onload = function () {
                try {
                    var xml_source = reader.result;
                    var dom = app.parse_xml(xml_source);
                    app.new_xml_source = xml_source;
                    app.hide('file_parser_error');
                    app.file_dialog_save.disabled = false;
                }
                catch(e) {
                    app.file_parser_error.innerText = e.message;
                    app.show('file_parser_error');
                }
            }
            reader.readAsText(file);
        },

        save_file_selection: function (e) {
            e.preventDefault();
            if(this.new_xml_source) {
                this.xml_source = this.new_xml_source;
                this.show_matches(this.query_xpath.value);
            }
            this.hide('file_dialog');
        },

        cancel_file_selection: function (e) {
            this.hide('file_dialog');
        },

        init: function () {
            this.get_ui_elements();
            this.process_query_string();
            this.query_xpath.value = this.url_param.q || '';
            this.init_event_handlers();
            this.set_parser_error_ns();
            this.set_default_xml_source();
            this.show_matches(this.query_xpath.value);
            this.query_xpath.focus();
        }

    };

    app.init();

})(document);


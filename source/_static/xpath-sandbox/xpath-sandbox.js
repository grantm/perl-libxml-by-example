/*
 * xpath-sandbox.js - an interactive test tool for practising XPath expressions
 *
 * Copyright (c) 2015 Grant McLean <grant@mclean.net.nz>
 *
 */

(function (hdoc) {

    "use strict";

    var xmlns_uri = "http://www.w3.org/2000/xmlns/";

    var app = {

        ui_element_ids: [
            'registered-namespaces',
            'message-box',
            'query-form',
            'query-xpath',
            'reset-btn',
            'change-file-btn',
            'doc-tree',
            'file-dialog',
            'file-dialog-content',
            'file-dialog-form',
            'file-selector-input',
            'sample-file-inputs',
            'file-custom',
            'file-selector-proxy',
            'file-selector-filename',
            'file-parser-error',
            'file-namespaces',
            'file-dialog-save',
            'file-dialog-cancel'
        ],

        load_sample_sources: function () {
            this.sample_files = [];
            var scripts = hdoc.getElementsByTagName('script');
            for(var i = 0; i < scripts.length; i++) {
                if(scripts[i].type === 'text/xml-sample') {
                    var filename = scripts[i].dataset.filename;
                    var xml_source = scripts[i].innerHTML.trim();
                    this.sample_files.push({
                        filename: filename,
                        sample: true,
                        xml_source: xml_source
                    });
                }
            }
            this.add_samples_to_file_dialog();
        },

        add_samples_to_file_dialog: function () {
            var container = this.sample_file_inputs
            this.sample_files.forEach(function(file, i) {
                var label = this.element_node('label');
                var input = this.element_node('input');
                input.type = "radio";
                input.name = "file";
                input.value = file.filename;
                label.appendChild(input);
                var text = this.text_node(' ' + file.filename);
                label.appendChild(text);
                container.appendChild(label);
                file.el = input;
            }.bind(this));
        },

        set_default_source: function () {
            this.source = null;
            this.namespaces = [];
            var filename = this.url_param.filename;
            var file = this.select_sample_file(filename);
            if(file) {
                this.source = file;
                var dom = this.parse_xml(file.xml_source);
                this.namespaces = this.find_namespaces(dom);
            }
        },

        select_sample_file: function (filename) {
            var file = filename
                ? this.sample_files.find(function(f) { return f.filename === filename})
                : this.sample_files[0];
            return file;
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
            this.preferred_prefix = {};
            var qs = window.location.search.substring(1);
            var parse = /([^;=]+)=([^;]*)/g;
            var match;
            while (match = parse.exec(qs)) {
                var name = match[1];
                var value = decodeURIComponent(match[2]);
                this.url_param[name] = value;
                if(name.substr(0, 6) === 'xmlns:') {
                    this.preferred_prefix[value] = name.substr(6);
                }
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
            var el = this.empty(this.message_box);
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
            var dom = parser.parseFromString('NOT-XML', 'text/xml');
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
            this.render_children(this.empty(this.doc_tree), xml_dom.childNodes);
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
                    this.render_children(ch_out, node.childNodes);
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

        make_resolver: function () {
            var map = {};
            this.resolver_error = null;
            this.namespaces.forEach(function(ns) {
                map[ns.prefix] = ns.uri;
            });
            return function (prefix) {
                if(map[prefix]) {
                    return map[prefix];
                }
                var err = 'Query uses namespace prefix "' + prefix + ':" ';
                if(this.namespaces.length === 0) {
                    err = err + 'but this document does not contain any namespace declarations.';
                }
                else {
                    err = err + 'which is not listed in the table of registered prefixes.';
                }
                this.resolver_error = err;
                return null;
            }.bind(this);
        },

        show_matches: function (xp) {
            var count = 0;
            this.set_message('');
            var el = this.empty(this.registered_namespaces);
            el.appendChild(this.make_namespace_table(this.namespaces, false));
            if(!this.source) {
                var err = this.element_node('p');
                err.classList.add('no-source');
                err.innerText = 'No XML document loaded';
                this.empty(this.doc_tree).appendChild(err);
                return;
            }
            var xml_dom = this.parse_xml(this.source.xml_source);
            if(xp && xp.match(/\S/)) {
                try {
                    var result = xml_dom.evaluate(
                        xp, xml_dom.documentElement, this.make_resolver(),
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
                    this.set_message(this.resolver_error || e, 'error');
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
            if(this.source) {
                if(this.source.sample) {
                    this.source.el.checked = true;
                    this.file_selector_filename.innerText = '';
                }
                else {
                    this.file_custom.checked = true;
                    this.file_selector_filename.innerText = this.source.filename;
                }
                this.make_namespace_form(this.namespaces);
            }
            else {
                this.file_selector_filename.innerText = '';
                this.empty(this.file_namespaces);
                this.file_dialog_save.disabled = true;
            }
            this.hide('file_parser_error');
            this.show('file_dialog');
            this.file_dialog_content.scrollTop = 0;
            document.documentElement.classList.add('no-scroll');
        },

        hide_file_dialog: function () {
            this.hide('file_dialog');
            document.documentElement.classList.remove('no-scroll');
        },

        file_radio_change: function (e) {
            var el = e.target;
            if(el.type === 'radio') {
                var filename = el.value;
                if(filename) {
                    var file = this.select_sample_file(filename);
                    if(file) {
                        this.try_file_parse(file);
                    }
                }
            }
            else if(el.type === 'file') {
                this.file_selected(e);
            }
        },

        trigger_file_selection: function (e) {
            this.file_selector_input.click();
        },

        file_selected: function (e) {
            var files = e.target.files;
            if(files.length > 0) {
                this.try_file_upload(files[0]);
            }
        },

        try_file_upload: function (file) {
            this.new_source = null;
            this.file_dialog_save.disabled = true;
            var reader = new FileReader();
            reader.onload = function () {
                this.file_selector_filename.innerText = file.name;
                this.try_file_parse({
                    filename: file.name,
                    xml_source: reader.result
                });
            }.bind(this);
            reader.readAsText(file);
        },

        try_file_parse: function (source) {
            try {
                var dom = this.parse_xml(source.xml_source);
                var ns_list = this.find_namespaces(dom);
                this.new_source = source;
                this.hide('file_parser_error');
                this.make_namespace_form(ns_list);
                this.file_dialog_save.disabled = false;
            }
            catch(e) {
                this.file_parser_error.innerText = e.message;
                this.show('file_parser_error');
            }
        },

        find_namespaces: function (dom) {
            var ns_list = [];
            var seen = {};
            this.dom_ns_search(ns_list, seen, dom.childNodes);
            return ns_list;
        },

        dom_ns_search: function (ns_list, seen, nodes) {
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if(node.nodeType === node.ELEMENT_NODE) {
                    if(node.hasAttributes) {
                        for(var j = 0; j < node.attributes.length; j++) {
                            var attr = node.attributes[j];
                            if(attr.namespaceURI === xmlns_uri) {
                                this.dom_ns_add(ns_list, seen, attr);
                            }
                        }
                    }
                    this.dom_ns_search(ns_list, seen, node.childNodes);
                }
            }
        },

        dom_ns_add: function (ns_list, seen, attr) {
            var uri = attr.nodeValue;
            if(seen[uri]) return;
            var prefix = this.preferred_prefix[uri];
            if(!prefix) {
                prefix = attr.nodeName === 'xmlns'
                    ? attr.nodeValue.replace(/^.*\b(\w+)(?:\W+)?$/, '$1')
                    : attr.localName;
            }
            if(seen['prefix-' + prefix]) {
                var i = 2;
                while(seen['prefix-' + prefix + i]) {
                    i++;
                }
                prefix = prefix + i;
            }
            ns_list.push({
                prefix: prefix,
                uri: uri
            });
            seen[uri] = true;
            seen['prefix-' + prefix] = true;
        },

        make_namespace_form: function (ns_list) {
            var el = this.empty(this.file_namespaces);
            el.appendChild(this.make_namespace_table(ns_list, true));
        },

        make_namespace_table: function (ns_list, form_mode) {
            if(ns_list.length === 0) {
                var p = this.element_node('p');
                p.classList.add('no-ns');
                if(form_mode) {
                    p.innerText = 'Document contains no namespace declarations';
                }
                return p;
            }
            var table = this.element_node('table');
            table.classList.add('ns-table');
            var thead = this.element_node('thead');
            var tbody = this.element_node('tbody');
            table.appendChild(thead);
            table.appendChild(tbody);
            var hrow = this.element_node('tr');
            var thp = this.element_node('th');
            thp.innerText = 'NS Prefix';
            hrow.appendChild(thp);
            var thu = this.element_node('th');
            thu.innerText = 'Namespace URI';
            hrow.appendChild(thu);
            thead.appendChild(hrow);
            ns_list.forEach(function(ns) {
                var row = this.element_node('tr');
                var tdp = this.element_node('td');
                if(form_mode) {
                    var inp = this.element_node('input');
                    inp.setAttribute('type', 'text');
                    inp.setAttribute('value', ns.prefix);
                    inp.setAttribute('data-uri', ns.uri);
                    tdp.appendChild(inp);
                }
                else {
                    tdp.innerText = ns.prefix;
                }
                row.appendChild(tdp);
                var tdu = this.element_node('td');
                tdu.innerText = ns.uri;
                row.appendChild(tdu);
                tbody.appendChild(row);
            }.bind(this));
            return table;
        },

        save_file_selection: function (e) {
            e.preventDefault();
            if(this.new_source) {
                this.source = this.new_source;
                this.namespaces = this.namespaces_from_form(e.target);
                this.show_matches(this.query_xpath.value);
            }
            this.hide_file_dialog();
        },

        namespaces_from_form: function (form) {
            var ns_list = [];
            for(var i = 0; i < form.elements.length; i++) {
                var inp = form.elements[i];
                if(inp.type === 'text') {
                    ns_list.push({
                        prefix: inp.value,
                        uri: inp.dataset.uri,
                    });
                }
            }
            return ns_list;
        },

        init_event_handlers: function () {
            this.add_listener('query_form',          'submit', 'submit_form');
            this.add_listener('reset_btn',           'click',  'reset_form');
            this.add_listener('change_file_btn',     'click',  'show_file_dialog');
            this.add_listener('file_dialog_form',    'change', 'file_radio_change');
            this.add_listener('file_selector_proxy', 'click',  'trigger_file_selection');
            this.add_listener('file_dialog_form',    'submit', 'save_file_selection');
            this.add_listener('file_dialog_cancel',  'click',  'hide_file_dialog');
        },

        init: function () {
            this.get_ui_elements();
            this.process_query_string();
            this.query_xpath.value = this.url_param.q || '';
            this.init_event_handlers();
            this.set_parser_error_ns();
            this.load_sample_sources();
            this.set_default_source();
            this.show_matches(this.query_xpath.value);
            this.query_xpath.focus();
        }

    };

    app.init();

})(document);


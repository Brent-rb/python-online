import React from 'react';
import './Editor.css';
import * as codemirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
require("codemirror/mode/python/python")

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.editor = null;
	}

	render() {
		return (
			<div id="editor-container" className="Editor">
				<textarea id="editor"></textarea>
			</div>
		);
	}

	componentDidMount() {
		this.editor = codemirror.fromTextArea(document.getElementById("editor"), {
			lineNumbers: true,
			theme: "monokai",
			mode: 'python',
			indentWithTabs: true
		});
	}

	getCode() {
		return this.editor.getValue();
	}
}

export default Editor;

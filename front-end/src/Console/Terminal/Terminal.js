import React from 'react';
import './Terminal.css';

import * as codemirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
require("codemirror/mode/shell/shell")

class Terminal extends React.Component {
	constructor(props) {
		super(props);
        this.editor = null;
        
		this.lines = ["Terminal Ready\n"];
		this.stdout = [];
		this.maxLines = 1000;
		this.buffer = "";
	}

	render() {
		return (
			<div id="terminal-container" className="Terminal">
				<textarea id="console"></textarea>
			</div>
		);
	}

	componentDidMount() {
        this.editor = codemirror.fromTextArea(document.getElementById("console"), {
			lineNumbers: false,
			theme: "monokai",
			mode: 'shell',
			indentWithTabs: true
		});

		this.editor.on("beforeChange", (instance, changeObj) => {
			var stdLength = this.stdout.length - 1;
			var lastLineLength = 0;
			if(stdLength > 0) {
				lastLineLength = this.stdout[stdLength].length
			}

			var cancelled = false;

			if(changeObj.from.line < stdLength && changeObj.origin !== "setValue") {
				cancelled = true;
				changeObj.cancel();
			}
			else if(changeObj.from.line === stdLength && changeObj.origin !== "setValue") {
				if(changeObj.from.ch < lastLineLength) {
					cancelled = true;
					changeObj.cancel();
				}
			}
			
			if(!cancelled && changeObj.origin !== "setValue") {
				this.updateBuffer(changeObj.from, changeObj.to, changeObj.text)
				changeObj.cancel();
			}
		});

		this.write(this.lines.join("\n"));
	}

	updateBuffer(from, to, textArray) {
		var stdLength = this.stdout.length - 1;
		var lastLineLength = this.stdout[stdLength].length;
		var newFrom, newTo;

		if(from.line === stdLength) {
			newFrom = from.ch - lastLineLength;
			newTo = to.ch - lastLineLength;
		}

		var prefix = this.buffer.substring(0, newFrom);
		var postfix = this.buffer.substring(newTo);

		var first = true;
		var buffer = prefix;
		var linecounter = 0;
		textArray.forEach(element => {
			if(!first) {
				this.onNewline(buffer);
				buffer = "";
				linecounter++;
			}

			buffer += element;
			first = false;
		});

		this.buffer = buffer + postfix;
		this.updateTerminal();
		
		var line = from.line + linecounter;
		var ch = this.buffer.length - postfix.length;

		if(line < this.stdout.length) {
			ch += this.stdout[line].length;
		}

		var cursor = {
			line: line,
			ch: ch,
		}
		this.editor.setCursor(cursor);
	}

	onNewline(line) {
		var stdoutLength = this.stdout.length
		this.stdout[stdoutLength - 1] += line;

		if(stdoutLength >= this.maxLines) {
			this.stdout.shift();
		}

		this.stdout.push("");
		this.updateTerminal();
		
		if(this.props.onNewline) {
			this.props.onNewline(line + "\n");
		}
	}
	
	write(text) {
		console.log(text);
		var lines = text.split('\n');
		var first = true;
		
		lines.forEach(element => {
			var stdLen = this.stdout.length;

			if(!first) {
				this.stdout.push("");

				if(stdLen + 1 > this.maxLines) {
					this.stdout.shift();
				}
				else {
					stdLen += 1;
				}
			}
			
			if(stdLen > 0)
				this.stdout[stdLen - 1] += element;
			else {
				this.stdout.push(element);
			}

			first = false;
		});

		this.updateTerminal();
	}

	updateTerminal() {
		this.editor.setValue(this.stdout.join('\n') + this.buffer);

		this.editor.scrollTo(0, this.editor.getScrollInfo().height);
	}
}

export default Terminal;

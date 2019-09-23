import React from 'react';
import './Console.css';

import ProcessBar from './ProcessBar/ProcessBar';
import Terminal from './Terminal/Terminal';

class Console extends React.Component {
	constructor(props) {
		super(props);
        this.editor = null;

        this.processbar = React.createRef();
        this.terminal = React.createRef();
	}

	render() {
		return (
			<div id="console-container" className="Console">
                <ProcessBar ref={this.processbar} onRun={this.props.onRun} onStop={this.props.onStop} />
				<Terminal ref={this.terminal} onNewline={this.props.onNewline} />
			</div>
		);
	}

	componentDidMount() {

    }

    setStartEnabled(state) {
        this.processbar.current.setStartEnabled(state);
    }

    setStopEnabled(state) {
        this.processbar.current.setStopEnabled(state);
    }

    writeToTerminal(text) {
        this.terminal.current.write(text);
    }
}

export default Console;

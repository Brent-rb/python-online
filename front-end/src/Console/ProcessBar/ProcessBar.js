import React from 'react';
import './ProcessBar.css';
import ProcessButton from './ProcessButton/ProcessButton';

class ProcessBar extends React.Component {
	constructor(props) {
		super(props);
        this.editor = null;
        
        this.run = this.run.bind(this);
        this.stop = this.stop.bind(this);

        this.startButton = React.createRef();
        this.stopButton = React.createRef();
	}

	render() {
		return (
            <div className="ProcessBar">
                <ProcessButton ref={this.startButton} onClick={this.run} icon="play_arrow" color="green" />
                <ProcessButton ref={this.stopButton} onClick={this.stop} icon="stop" color="red" />
            </div>
		);
	}

	componentDidMount() {
        
    }
    
    run() {
        if(this.props.onRun) {
            this.props.onRun();
        }
    }

    stop() {
        if(this.props.onStop) {
            this.props.onStop();
        }
    }

    setStartEnabled(state) {
        this.startButton.current.setEnabled(state);
    }

    setStopEnabled(state) {
        this.stopButton.current.setEnabled(state);
    }
}

export default ProcessBar;

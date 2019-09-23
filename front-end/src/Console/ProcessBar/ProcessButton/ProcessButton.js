import React from 'react';
import './ProcessButton.css';
import * as classNames from 'classnames';

class ProcessButton extends React.Component {
	constructor(props) {
		super(props);
        this.editor = null;
        
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            disabled: true,
        }
    }
    
    generateClassName() {
        return classNames(
            "ProcessButton",
            "material-icons",
            this.props.color,
            this.state.disabled ? "disabled" : ""
        )
    }

	render() {
		return (
            <i onClick={this.handleClick} className={ this.generateClassName() }>{this.props.icon}</i>
		);
	}

	componentDidMount() {
        
    }
    
    handleClick() {
        if(this.props.onClick && !this.state.disabled) {
            this.props.onClick()
        }
    }

    setEnabled(state) {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.disabled = !state;

        this.setState(stateCopy);
        this.forceUpdate();
    }
}

export default ProcessButton;

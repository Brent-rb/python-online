import React from 'react';
import Editor from './Editor/Editor';
import Console from './Console/Console';
import WebSocketWrapper from "./WebsocketWrapper";
import Login from "./Login/Login"

import firebase from "firebase";
import "firebase/auth"

import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props)


		this.console = React.createRef();
		this.editor = React.createRef();

		this.onRun = this.onRun.bind(this);
		this.onStop = this.onStop.bind(this);
		this.onNewline = this.onNewline.bind(this);	

		this.state = {
			loggedIn: false
		}

		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				this.onLogin();
			}
			else {
				this.setState({
					loggedIn: false
				})
			}
		})
	}
	
	render() {
		let editor = ""
		let console = ""
		let login = ""

		if(this.state.loggedIn) {
			editor = <Editor ref={this.editor} />;
			console = <Console ref={this.console} onRun={this.onRun} onStop={this.onStop} onNewline={this.onNewline} />;
		}
		else {
			login = <Login />
		}

		return (
			<div className="App">
				{login}
				{editor}
				{console}
			</div>
		);
	}

	onLogin() {
		this.socket = new WebSocketWrapper();

		this.setState({
			loggedIn: true
		})

		firebase.auth().currentUser.getIdToken(true).then((idToken) => {
			this.idToken = idToken
		})


		this.addSocketListeners();
	}

	componentDidMount() {
	}

	addSocketListeners() {
		this.socket.on("connect", () => {
			this.console.current.setStartEnabled(true);
			this.console.current.setStopEnabled(false);
		});

		this.socket.on("disconnect", () => {
			this.console.current.setStartEnabled(false);
			this.console.current.setStopEnabled(false);
		});

		this.socket.on("stdout", (stdout) => {
			console.log(stdout);
			this.console.current.writeToTerminal(stdout);
		});

		this.socket.on("stderr", (stderr) => {
			this.console.current.writeToTerminal(stderr);
		});

		this.socket.on("process-start", (start) => {
			console.log("Process Start");
			this.console.current.setStartEnabled(false);
			this.console.current.setStopEnabled(true);
		});

		this.socket.on("process-end", (end) => {
			console.log("Process End");

			this.console.current.setStartEnabled(true);
			this.console.current.setStopEnabled(false);
		});
	}

	onRun() {
		this.socket.runCode(this.idToken, this.editor.current.getCode());
	}

	onStop() {
		this.socket.stop(this.idToken, );
	}

	onNewline(line) {
		this.socket.sendStdIn(this.idToken, line);
	}
}

export default App;

import { EventEmitter } from "events";
import io from 'socket.io-client';

class WebsocketWrapper extends EventEmitter {
    constructor() {
        super();

        this.socket = io();

        this.socket.on("connect", (connected) => {
            this.emit("connect");
        });

        this.socket.on("disconnect", (disconnect) => {
            this.emit("disconnect");
        });

        this.socket.on("stdout", (stdout) => {
            this.emit("stdout", stdout)
        });

        this.socket.on("stderr", (stderr) => {
            this.emit("stderr", stderr);
        })

        this.socket.on("process-start", (start) => {
            this.emit("process-start", start);
        });

        this.socket.on("process-end", (end) => {
            this.emit("process-end", end);
        });
    }

    runCode(token, code) {
        this.socket.emit("run-code", token, code);
    }

    stop(token) {
        this.socket.emit("stop-process", token);
    }

    sendStdIn(token, input) {
        this.socket.emit("stdin", token, input);
    }
}

export default WebsocketWrapper;
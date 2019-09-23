const fs = require("fs")
const certPath = "../certs/";

const certInfo = {
    key: fs.readFileSync(certPath + "privkey.pem"),
    cert: fs.readFileSync(certPath + "cert.pem")
}

const express = require('express')
const app = express()
const https = require("https").createServer(certInfo, app)
const io = require("socket.io")(https);
const md5 = require("md5");
const cp = require("child_process")
const admin = require("firebase-admin")

const port = 80

var serviceAccount = require(/* Path to service account.json*/);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: /* Fill this */
});

/* Build the front end and copy the build to public directory */
app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("connection from: " + socket.handshake.address);

    addSocketListeners(socket);
});

function verifyToken(token, callback) {
    // idToken comes from the client app
    admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
        if(userAllowed(decodedToken)) {
            callback();
        }
    }).catch(function(error) {
        // Handle error
    });
}

function userAllowed(decodedToken) {
    /*
    User checking goes here, return true if user allowed, return false if not allowed. 
    */
    /*
    if(decodedToken.email == "example@gmail.com" && decodedToken.email_verified) {
        return true;
    }
    */
    return false
}

function addSocketListeners(socket) {
    socket.on("disconnect", () => {
        if(socket.pythonProcess && socket.pythonProcess != null) 
            socket.pythonProcess.kill("SIGTERM");
    });

    socket.on("run-code", (token, code) => {
        verifyToken(token, () => {
            onRunCode(socket, code);
        })
    });
}

function onRunCode(socket, code) {
    var filename = "/tmp/" + md5(Date.now()) + ".py";
    fs.writeFile(filename, code, (err) => {
        if(err) {
            console.log(err);
        }
        else {
            var stdInListener = (token, message) => {
                verifyToken(token, () => {
                    socket.pythonProcess.stdin.write(message);
                })
            }

            var stopProcessListener = (token) => {
                verifyToken(token, () => {
                    if(socket.pythonProcess && socket.pythonProcess != null) 
                        socket.pythonProcess.kill("SIGTERM");
                    socket.pythonProcess = null;
                })
            }

            var stdOutListener = (data) => {
                var stdout = String.fromCharCode.apply(null, data);
                socket.emit("stdout", stdout);
            }

            var stdErrListener = (data) => {
                var stderr = String.fromCharCode.apply(null, data);
                socket.emit("stderr", stderr);
            }

            var exitListener = () => {
                console.log("Exit")
                socket.emit("process-end");

                socket.removeListener("stdin", stdInListener);
                socket.removeListener("stop-process", stopProcessListener);
            }

            socket.emit("process-start");
            socket.pythonProcess = cp.spawn("python3", ["-u", filename]);

            socket.pythonProcess.on("exit", exitListener);
            socket.pythonProcess.stdout.on("data", stdOutListener);
            socket.pythonProcess.stderr.on("data", stdErrListener);

            socket.on("stdin", stdInListener);
            socket.on("stop-process", stopProcessListener);
        }
    });
}

https.listen(443, () => console.log(`python-online app listening on port ${443}!`))
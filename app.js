const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

//===============================================================================================
// Express
//===============================================================================================

/**
 * Root shows which routes are available on the API.
 */
app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/views/index.html")));

/**
 * This route displays all events. Events can be filtered by machine ID or status using
 * request query parameters.
 */
app.get("/api/events", (req, res) => {
  Event.find((err, events) => {
    if (err) return console.error(err);
    const machineId = req.query.machineId;
    const status = req.query.status;
    res.send(
      events.filter(event => {
        var valid = true;
        if (typeof machineId !== "undefined") {
          if (machineId !== event.machine_id) valid = false;
        }
        if (typeof status !== "undefined") {
          if (status !== event.status) valid = false;
        }
        return valid;
      })
    );
  });
});

/**
 * This route displays all machines and their current status.
 */
app.get("/api/machines", (req, res) => {
  Machine.find((err, machines) => {
    if (err) return console.error(err);
    res.send(machines);
  });
});

// Start express server
app.listen(port, () => console.log(`Listening on port ${port}`));

//===============================================================================================
// MongoDB
//===============================================================================================

var mongoose = require("mongoose");

/**
 * Connect to the the MongoDB database. We use this address to connect to the
 * database running in the other docker container.
 */
mongoose
  .connect("mongodb://mongo:27017/docker-node-mongo", { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const Event = require("./models/Event");
const Machine = require("./models/Machine");

//===============================================================================================
// WebSocket
//===============================================================================================

const WebSocket = require("ws");

/**
 * This function creates a web socket which will connect to the machines. Since the web socket
 * times out every minute, when the connection closes, a new web socket is created.
 */
function startWebSocket() {
  var ws = new WebSocket("ws://machinestream.herokuapp.com/ws", {
    perMessageDeflate: false
  });

  ws.on("open", function open() {
    console.log("WebSocket connected");
  });

  // Parses JSON from the machines and then saves into the database
  ws.on("message", function incoming(data) {
    console.log("Received data");

    const parsedData = JSON.parse(data);

    const newEvent = new Event({
      machine_id: parsedData.payload.machine_id,
      id: parsedData.payload.id,
      timestamp: parsedData.payload.timestamp,
      status: parsedData.payload.status
    });

    // Event is saved
    newEvent.save(function(err, _) {
      if (err) return console.error(err);
      console.log("Saved data");
    });

    // Current status of machine is updated
    Machine.findOneAndUpdate(
      { machine_id: parsedData.payload.machine_id },
      { status: parsedData.payload.status },
      { upsert: true },
      (err, _) => {
        if (err) return console.error(err);
      }
    );
  });

  ws.on("close", function close(code, reason) {
    console.log(code + ": connection closed");
    ws = null;
    setTimeout(startWebSocket, 5000);
  });
}

startWebSocket();

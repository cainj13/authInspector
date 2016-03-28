var self = require('sdk/self');
var data = require("sdk/self").data;

var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "authInspector",
  label: "Auth Inspector",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  }
})

// This is the listener stuff!

var events = require("sdk/system/events");
var { Ci } = require("chrome");

function listener(event) {
  var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
  channel.setRequestHeader("User-Agent", "MyBrowser/1.0", false);
  console.log("Setting userAgent to MyBrowser");
  console.log(event);
  console.log("requestMethod: " + event.subject.getRequestMethod);
  console.log("URI.asciiSpec: " + event.subject.URI.asciiSpec);
  console.log("host: " + event.subject.URI.host);
  console.log("hostPot: " + event.subject.URI.hostPort);
  console.log("path: " + event.subject.URIpath);
  console.log("prePath: " + event.subject.URI.prePath);
  console.log("spec: " + event.subject.URI.spec);
  console.log(event.subject);
  console.log(event.data);
}

events.on("http-on-modify-request", listener);

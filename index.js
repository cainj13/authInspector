var self = require('sdk/self');
var data = require("sdk/self").data;

var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');

// replace page content with content script
function setText(state) {
  tabs.activeTab.attach({
  contentScript: 'document.body.innerHTML = "<h1>this page has been eaten</h1>";'
  });
}

// Create a panel for displaying text
var text_entry = require("sdk/panel").Panel({
  contentURL: data.url("text-entry.html"),
  contentScriptFile: data.url("get-text.js")
});

var button = buttons.ActionButton({
  id: "authInspector",
  label: "Auth Inspector",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  //onClick: openGithubTab
  //onClick: showText
  onClick: setText 
})

// demonstrates how to open a link
function openGithubTab(state) {
    tabs.open("https://github.com/cainj13/authInspector");
}

function openHttpEventsTab(state) {
    tabs.open("chrome://authinspector/content/httpEvents.html");
}

// Show the panel when the user clicks the button.
function showText(state) {
  text_entry.show();
}

// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  text_entry.port.emit("show");
});

// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  text_entry.hide();
});

// This is the listener stuff!

var events = require("sdk/system/events");
var { Ci } = require("chrome");

function listener(event) {
  var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
  channel.setRequestHeader("User-Agent", "MyBrowser/1.0", false);
  console.log("Setting userAgent to MyBrowser");
}

events.on("http-on-modify-request", listener);

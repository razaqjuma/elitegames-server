// Backup the original WebSocket send function
const originalWebSocketSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (data) {
    console.log("Sending WebSocket Data: ", data);
    // Forward the data to your server
    fetch("http://localhost:3000/collect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });
    
    // Call the original send method
    originalWebSocketSend.apply(this, arguments);
};

// Capture WebSocket messages received
const originalWebSocketOnMessage = WebSocket.prototype.onmessage;
WebSocket.prototype.onmessage = function (event) {
    console.log("Received WebSocket Data: ", event.data);

    // Forward the data to your server
    fetch("http://localhost:3000/collect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: event.data }),
    });

    // Call the original onmessage handler
    originalWebSocketOnMessage.apply(this, arguments);
};


(function() {
    // Store the original WebSocket constructor
    const originalWebSocket = window.WebSocket;
    
    // Create a new WebSocket constructor to intercept instances
    window.WebSocket = function(...args) {
        const wsInstance = new originalWebSocket(...args);

        // Intercept the onmessage handler for incoming messages
        wsInstance.addEventListener('message', function(event) {
            console.log("Received WebSocket message: ", event.data);
            
            // Forward the message to your server for analysis
            fetch("http://localhost:3000/collect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: event.data }),
            });
        });

        return wsInstance;
    };

    // Keep the WebSocket prototype chain intact
    window.WebSocket.prototype = originalWebSocket.prototype;
})();


(function() {
    // Store the original WebSocket constructor
    const originalWebSocket = window.WebSocket;
    
    // Create a new WebSocket constructor to intercept instances
    window.WebSocket = function(...args) {
        console.log("WebSocket instance created with arguments: ", args);
        const wsInstance = new originalWebSocket(...args);

        // Intercept the onmessage handler for incoming messages
        wsInstance.addEventListener('message', function(event) {
            console.log("Received WebSocket message: ", event.data);
            
            // Forward the message to your server for analysis
            fetch("http://localhost:3000/collect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: event.data }),
            }).then(response => {
                console.log('Message forwarded to server: ', response);
            }).catch(error => {
                console.error('Error sending message to server: ', error);
            });
        });

        return wsInstance;
    };

    // Keep the WebSocket prototype chain intact
    window.WebSocket.prototype = originalWebSocket.prototype;
})();



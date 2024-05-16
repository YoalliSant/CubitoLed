var resultado = document.getElementById("resultado");
var servidor = document.getElementById("servidor");

var clientId = 'client_id_' + Math.floor((Math.random() + 1000000) + 1);
client = new Paho.MQTT.Client("broker.emqx.io", 8084, clientId);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: "",
    password: "",
    onSuccess: onConnect,
    onFailure: doFail
}

client.connect(options);

            function onConnect() {
                servidor.innerHTML = "Conexión exitosa!";
                client.subscribe("salidaCubito");
            }

            function onMessageArrived(message) {
                resultado.innerHTML = "Un mensaje recibido" + message.payloadString;
            }

            function doFail(e) {
                resultado.innerHTML = e;
            }

            function onConnectionLost(responseObject) {
                if (responseObject.errorCode !== 0) {
                    resultado.innerHTML = "onConnectionLost: " + responseObject.errorMessage;
                }
            }
            
            function command(value) {
                console.log(value);
                message = new Paho.MQTT.Message(value + "");
                message.destinationName = "entradaCubito";
                client.send(message);
            
                // Enciende el LED correspondiente
                let leds = document.querySelectorAll(".ledBlue");
                leds.forEach((led, index) => {
                    if (index === value) {
                        toggle(led, "on"); // Enciende el LED clicado
                    } else {
                        led.classList.remove("on"); // Apaga los demás LEDs
                    }
                });
            }
            
            


//Pal led de la página
function toggle(element, className) {
    let classes = element.classList;
    classes.contains(className)
    ? classes.remove(className)
    : classes.add(className);
}

let leds = document.querySelectorAll(".ledBlue");

leds.forEach( (led) => {
    led.addEventListener("click", (event) =>  {
        let element = event.target;
        toggle(element, "on");
    });
});
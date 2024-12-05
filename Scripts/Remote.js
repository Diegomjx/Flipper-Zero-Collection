let dialog = require("dialog");
let keyboard = require("keyboard");
let storage = require("storage");


let path = "/ext/infrared/";

function arraybuf_to_string(arraybuf) {
    let string = "";
    let data_view = Uint8Array(arraybuf);
    for (let i = 0; i < data_view.length; i++) {
        string += chr(data_view[i]);
    }
    return string;
}


function addRemote(Name, text) {
    let n = 1;
    let newRemote = path + Name;

    while (storage.exists(newRemote + to_string(n) + ".ir")) {
        n++;
    }

    storage.write(newRemote +  to_string(n) + ".ir","Filetype: IR signals file\nVersion: 1\n")

    for (let index = 0; index < 16; index++) {
        storage.append(newRemote +  to_string(n) + ".ir","#\n");
        storage.append(newRemote +  to_string(n) + ".ir","name: 0" + to_hex_string(index));
        storage.append(newRemote +  to_string(n) + ".ir","\n"+text);
        storage.append(newRemote +  to_string(n) + ".ir","command: 0" + to_hex_string(index) + " 00 00 00\n");
    }    
    
    for (let index = 16; index < 256; index++) {
            storage.append(newRemote +  to_string(n) + ".ir","#\n");
            storage.append(newRemote +  to_string(n) + ".ir","name: " + to_hex_string(index));
            storage.append(newRemote +  to_string(n) + ".ir","\n"+text);
            storage.append(newRemote +  to_string(n) + ".ir","command: " + to_hex_string(index) + " 00 00 00\n");
        }

}

function ReadRemote(Name) {
    if (storage.exists(path + Name + ".ir")) {
        print("File exists:");
        let file = storage.read(path + Name + ".ir");
        let startIndex = -1;
        let EndIndex = -1;

        file =    arraybuf_to_string(file);
        file = file.slice(36);
        EndIndex = file.indexOf("command:");
        startIndex = file.indexOf("type:");


        if (startIndex !== -1 && EndIndex !==-1) {
            file = file.slice(startIndex,EndIndex);
            print(file);
            addRemote(Name, file);
        } else {
            print("Content format unexpected, skipping.");
        }
    } else {
        print("File doesn't exist:");
    }
}

function getRemote(){

    let result = "Press OK to start";
    while (dialog.message("Interactive Console", result)) {
        keyboard.setHeader("Remote name without . ir:");
        let input = keyboard.text(256, "Remote", true);
        if (!input) break;
    
        ReadRemote(input);

    }



}

getRemote();



//Firmware: Rogue master
let subghz = require("subghz");
//let infrared = require("infrared"); Need a plugin for this
let storage = require("storage");
let dialog = require("dialog");

let path = "/ext/payloads";

if (storage.exists(path)) {
    while(true){
        let result = dialog.pickFile(path, "*"); // Use "*" for second parameter to allow all files.
        if (storage.exists(result)) {
            if(result.indexOf(".js") > -1) {
                print("Is a JS file");
            }else if(result.indexOf(".sub") > -1) {
                subghz.setup();
                print("Sending: ", result);
                let resultsubghz = subghz.transmitFile(result);
                subghz.end()
                if (resultsubghz) { print("sent"); } else { print("failed to send"); }
            } else if(result.indexOf(".ir") > -1) {
              /*
                infrared.setup();
                let resultinfrared = infrared.transmitFile(result);
                infrared.end()
                if (resultinfrared) { print("sent"); } else { print("failed to send"); }
                */
            } else {
                print("File exists: is unknown");
            }
        } else {
            print("No file selected");
        }
    }

} else {
    print("File not found");
}



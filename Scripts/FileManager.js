//Firmware: Rogue master
//Not Aproved

let storage = require("storage");
let submenu = require("submenu");
let dialog = require("dialog");
let infrared = require("infrared");
let subghz = require("subghz");


let path = "/ext/payloads";

if (storage.exists(path)) {
    while(true){
        let result = dialog.pickFile(path, "*"); // Use "*" for second parameter to allow all files.
        if (storage.exists(result)) {
            if(result.indexOf(".js") > -1) {
                print("Is a JS file");
            }else if(result.indexOf(".sub") > -1) {
                let resultsubghz = subghz.transmitFile(result);
                if (resultsubghz) { print("sent"); } else { print("failed to send"); }
            } else if(result.indexOf(".ir") > -1) {
                let resultinfrared = infrared.transmitFile(result);
                if (resultinfrared) { print("sent"); } else { print("failed to send"); }
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

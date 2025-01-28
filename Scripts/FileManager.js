let storage = require("storage");
let submenu = require("submenu");
let dialog = require("dialog");
//let infrared = require("infrared");
//let subghz = require("subghz");


let path = "/ext/payloads";

if (storage.exists(path)) {
    while(true){
        let result = dialog.pickFile(path, "*"); // Use "*" for second parameter to allow all files.
        if (storage.exists(result)) {
            if(result.indexOf(".js") > -1) {
                print("File exists: is javascript");
            }else if(result.indexOf(".sub") > -1) {
                print("File exists: is subghz");
            } else if(result.indexOf(".ir") > -1) {
                print("File exists: is infrared");
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
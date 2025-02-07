/* js
   Flipper Zero File & Folder Auto-Organizer Script
   - Moves files based on their type.
   - Keeps folder structures intact within each category.
   - Deletes empty folders after processing.

   Version: 1.4
   Author: Diegomjx
*/

let storage = require("Storage");

let path = "/ext/Flipper-Zero";

let path_infrared = "/ext/infrared/payloads";
let path_subGHz  = "/ext/subghz/payloads";
let path_bad_usb = "/ext/badusb/payloads";
let path_scripts = "/ext/apps/Scripts/payloads";
let path_NFC = "/ext/nfc/payloads";

function Order(Initial_path, final_path, extensions) {
    let files = storage.list(Initial_path);

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let full_path = Initial_path + "/" + file;
        let destination_folder = final_path + "/" + file;

        if (storage.isDir(full_path)) {
            // If it's a folder, move it directly to the destination
            if (!storage.exists(destination_folder)) {
                storage.mkdir(destination_folder);
            }
            Order(full_path, destination_folder, extensions); // Recursively process folder contents

            // Delete the original folder if empty
            if (storage.list(full_path).length === 0) {
                storage.rmdir(full_path);
            }
        } else {
            // Check if the file has a valid extension
            let point = file.lastIndexOf(".");
            let ext = point !== -1 ? file.slice(point) : "";

            if (extensions.includes(ext)) {
                let content = storage.read(full_path);

                // Prevent overwriting duplicate files
                let new_file = file;
                let n = 1;
                while (storage.exists(destination_folder)) {
                    new_file = file.slice(0, point) + "_" + n + ext;
                    destination_folder = final_path + "/" + new_file;
                    n++;
                }

                storage.write(destination_folder, content);
                storage.remove(full_path);
            }
        }
    }
}

function exists(path) {
    if (!storage.exists(path)) {
        storage.mkdir(path);
    }
}

// Ensure destination folders exist
exists(path_infrared);
exists(path_subGHz);
exists(path_bad_usb);
exists(path_scripts);
exists(path_NFC);

// Organize files and folders within Flipper-Zero
Order(path, path_infrared, [".ir"]);
Order(path, path_subGHz, [".sub"]);   
Order(path, path_bad_usb, [".txt", ".json", ".bin"]); 
Order(path, path_scripts, [".py", ".js",".fap", ".lua"]);
Order(path, path_NFC, [".nfc"]);

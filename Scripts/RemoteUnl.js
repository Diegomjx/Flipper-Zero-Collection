let eventLoop = require("event_loop");
let gui = require("gui");
let dialog = require("gui/dialog");
let textInput = require("gui/text_input");
let loading = require("gui/loading");
let storage = require("storage");


let path = "/ext/infrared/";

let views = {
    dialog: dialog.makeWith({
        header: "Interactive Console",
        text: "Press OK to Start",
        center: "Run"
    }),
    textInput: textInput.makeWith({
        header: "Type remote name without . ir:",
        minLength: 0,
        maxLength: 256,
        defaultText: "Remote",
        defaultTextClear: true,
    }),
    Exit: dialog.makeWith({
        header: "Making Remote complete",
        text: "Press OK to Exit",
        center: "Exit"
    }),
    loading: loading.make(),
};


function toHexString(number) {
    let hexString = number.toString(16).toUpperCase();
    return hexString;
}


function addRemote(Name, text) {
    let n = 1;
    let newRemote = path + Name+n.toString()+".ir";
    while ( storage.fileExists(newRemote))  {
        n++;
        newRemote = path + Name+n.toString()+".ir";
    }
    let file = storage.openFile(newRemote, "w", "create_always");
    file.write("Filetype: IR signals file\nVersion: 1\n");

    for (let index = 0; index < 16; index++) {
        file.write("#\n");
        file.write("name: 0" + toHexString(index));
        file.write("\n"+text);
        file.write("command: 0" + toHexString(index) + " 00 00 00\n");
    }    

    for (let index = 16; index < 256; index++) {
            file.write("#\n");
            file.write("name: " + toHexString(index));
            file.write("\n"+text);
            file.write("command: " + toHexString(index) + " 00 00 00\n");
        }
    file.close();

}

function ReadRemote( Name) {

    let file = storage.openFile(path+Name+".ir", "r", "open_existing");
    let text = file.read("ascii", 128);
    file.close();
    text = text.slice(25)
    
    
    let startIndex = -1;
    let EndIndex = -1;

        EndIndex = text.indexOf("command:");
        startIndex = text.indexOf("type:");


        if (startIndex !== -1 && EndIndex !==-1) {
            text = text.slice(startIndex,EndIndex);
            print(text);

            addRemote(Name, text);
        } else {
            print("Content format unexpected, skipping.");
        }
}

eventLoop.subscribe(views.dialog.input, function (_sub, button, gui, views) {
    if (button === "center") {
        gui.viewDispatcher.switchTo(views.textInput);
    }
}, gui, views);

eventLoop.subscribe(views.Exit.input, function (_sub, button, gui, views) {
    if (button === "center") {
        eventLoop.stop();
    }
}, gui, views);


eventLoop.subscribe(views.textInput.input, function (_sub, text, gui, views) {
    gui.viewDispatcher.switchTo(views.loading);
    
    if ( storage.fileExists(path+text+".ir") ){
            ReadRemote(text);
            gui.viewDispatcher.switchTo(views.Exit);
    } else {
            gui.viewDispatcher.sendTo("front");
            views.dialog.set("header", "don´t Exist");
            gui.viewDispatcher.switchTo(views.dialog);
    }

}, gui, views);

eventLoop.subscribe(gui.viewDispatcher.navigation, function (_sub, _, eventLoop) {
    eventLoop.stop();
}, eventLoop);




gui.viewDispatcher.switchTo(views.dialog);

// Message behind GUI if something breaks
print("If you're stuck here, something went wrong, re-run the script")
eventLoop.run();
print("\n\nFinished correctly :)")

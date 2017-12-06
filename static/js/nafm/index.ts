import Client from "./Client.js";

function setupStyles(): void {
    const height = $(window).height();
    $("#chat-output,#canvas").css({
        "height": height * 0.4,
        "max-height": height * 0.4
    });
    // $("#stats").css({
    //     "height": $("#chat-input").height(),
    //     "max-height": $("#chat-input").height()
    // });
}

$(document).ready(() => {
    setupStyles();
    const client = new Client();
    client.start();
});

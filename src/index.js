import App from "./game/App";
import Service from "./game/Service";

const app = new App(new Service());

window.addEventListener("load", () => {

    app.stateChange(({ status }) => {
        if (status === "ready") {
            document.body.addEventListener("keypress", function() {
                app.start();
            });
        } else if (status === "awaiting-continuation") {
            // TODO: ....
        }
    });
});

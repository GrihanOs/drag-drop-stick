import express from "express";

try {

    const app = express();

    app.use("/mover", express.static("./"));

    app.listen("18080", () => {
        console.log("Div mover is ready on port 18080");
    });

} catch (e) {
    console.log(e);
}

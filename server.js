const  { selectData } = require("./sql/db")
const express = require("express");
const app = express();
// const sweets = [
//     { id: 1, name: "juan", otra: "rel" },
//     { id: 2, name: "pam", otra: "tel" },
//     { id: 3, name: "an", otra: "cel" },
// ];

console.log(selectData);

app.use(express.static("./public"));

app.use(express.json());

app.get("/images.json", (req, res) => {
    selectData().then((results)=>{
        res.json(results);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));

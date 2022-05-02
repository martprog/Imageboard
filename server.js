const { selectData, uploadImg, getImageById } = require("./sql/db");
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");
const s3 = require("./s3");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads")); //null for error. REMEMBER: Node Land!
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
            callback(null, `${randomId}${path.extname(file.originalname)}`);
        });
    },
});
const uploader = multer({
    storage: storage,
    // dest: "uploads",
});

// app.use(express.urlencoded({extended: false}));
app.use(express.static("./public"));

app.use(express.json());

app.post("/images.json", uploader.single("image"), s3.upload, (req, res) => {
    const { title, description, username } = req.body;
    const { filename } = req.file;
    let url = `https://s3.amazonaws.com/spicedling/${filename}`;

    if (req.file) {
        uploadImg(url, username, title, description)
            .then((results) => {
                res.json(results);
            })
            .catch((e) => console.log("error uploading: ", e));
    } else {
        res.json({
            succes: false,
        });
    }
});

app.get("/images.json", (req, res) => {
    selectData().then((results) => {
        res.json(results);
    });
});

app.get('/image/:image_id', (req, res) => {
    const { image_id } = req.params;
    getImageById(image_id).then((image) => {
        if (!image) {
            res.status(404).json({
                message: "Image not found",
            });
            return;
        }
        res.json(image);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));

const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file received");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("image is in the cloud!");
            next();
            fs.unlink(path, () => {});
        })
        .catch((e) => console.log("unable to delete file: ", e));
};

module.exports.delete = (req, res, next) => {
    const { id } = req.body;
    const deletePromise = s3
        .deleteObject({
            Bucket: "spicedling",
            Key: filename,
        })
        .promise();

    deletePromise
        .then(() => {
            console.log("image deleted!");
            next();
        })
        .catch((e) => console.log("unable to delete file: ", e));
};

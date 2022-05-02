const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

const selectData = () => {
    const query = `
        SELECT * FROM images
        ORDER BY created_at
        DESC
    `;

    return db.query(query).then((results) => {
        // console.log(results.rows);
        return results.rows;
    });
};

const uploadImg = (url, username, title, description) => {
    const query = `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const params = [url, username, title, description];

    return db.query(query, params).then((results) => {
        return results.rows;
    });
};

const getImageById = (image_id) => {
    const query = `
            SELECT * FROM images
            WHERE id=$1
        `;

    return db.query(query, [image_id]).then((results) => {
        return results.rows[0];
    });
};

module.exports = { selectData, uploadImg, getImageById };

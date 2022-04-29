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

module.exports = { selectData, uploadImg };

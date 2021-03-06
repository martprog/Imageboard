const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

const selectData = () => {
    const query = `
        SELECT * FROM images
        ORDER BY created_at
        DESC
        LIMIT 3
    `;

    return db.query(query).then((results) => {
        
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

// SELECT * FROM images
const getImageById = (image_id) => {
    const query = `
            
              SELECT id, url, username, title, description, created_at,
            (SELECT id FROM images WHERE id<$1 ORDER BY id DESC LIMIT 1) AS "next",
            (SELECT id FROM images WHERE id>$1 ORDER BY id ASC LIMIT 1) AS "previous"
                FROM images
            WHERE id=$1
        `;

    return db.query(query, [image_id]).then((results) => {
        return results.rows[0];
    });
};

const getMoreResults = (smallest_id) => {
    const query = `
        SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3;
    `;

    return db.query(query, [smallest_id]).then((results) => {
        
        return results.rows;
    });
};

const addNewComment = (text, username, image_id) => {
    const query = `
        INSERT INTO comments (text, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const params = [text, username, image_id];
    return db.query(query, params).then((results) => {
        return results.rows[0];
    });
};

const getAllComments = (id) => {
    const query = `
        SELECT * FROM comments
        where image_id=$1
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows;
    });
};

const deleteImg = (id) => {
    const query = `
        DELETE FROM images where id=$1;
        DELETE FROM comments where id=$1
        RETURNING *
    `;

    return db.query(query, [id]).then((results) => {
        return results.rows[0];
    });
};

module.exports = {
    selectData,
    uploadImg,
    getImageById,
    getMoreResults,
    addNewComment,
    getAllComments,
    deleteImg
};

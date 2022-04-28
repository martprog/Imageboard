const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");


const selectData = ()=>{
    const query = `
        SELECT * FROM images
        ORDER BY created_at
        DESC
    `;

    return db.query(query).then((results)=>{
        // console.log(results.rows);
        return results.rows;
    });
};

// console.log(selectData());

module.exports = { selectData }
const pool = require('../utils/db');

async function findAll() {

    const con = await pool.getConnection();

    const sql = `SELECT * FROM users`

    const [rows, meta] = await con.query(sql);

    return rows;
}

async function findById(id) {

    const con = await pool.getConnection();

    const sql = `SELECT * FROM users WHERE id = ?`

    const [rows, meta] = await con.query(sql, id);

    console.log("ROWS", rows)

    return rows;
}

async function create(user) {

    const con = await pool.getConnection();

    let sql = `INSERT INTO users (\`name\`, \`email\`) VALUES (?, ?)`

    const [rows, meta] = await con.query(sql, [user.name, user.email]);

    return rows
}

async function put(user, delta) {
    const con = await pool.getConnection();

    let sql = `UPDATE users SET \`name\` = ?, \`email\` = ? WHERE id = ?`

    await con.query(sql, [delta.name, delta.email, user.id]);
}

async function patch(user, delta) {
    const con = await pool.getConnection();

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(delta)) {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
    }

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(user.id)

    await con.query(sql, values)
}

async function del (id) {
    const con = await pool.getConnection();

    let sql = `DELETE FROM users WHERE id = ?`

    const [rows, meta] = await con.query(sql, [id]);
    return rows;
}

module.exports = { findAll, findById, create, put, patch, del }
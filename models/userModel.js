import db from '../utils/db.js'


export default {
    async findByEmail(email) {
        const list = await db('user').where('email', email);

        if (list.length === 0)
            return null;

        return list[0];
    },

    async findById(id) {
        const list = await db('user').where('UserID', id);

        if (list.length === 0)
            return null;

        return list[0];
    },

    addAccount(user) {
        return db('user').insert(user);
    },

    updateInfoAccount(info) {
        const email = info.email;
        delete info.email;
        return db('user').where('email', email).update(info);
    },

  


}
import db from '../utils/db.js'
import classifyTypeSort from "../utils/classifyTypeSort.js";

export default {
    async findAll() {
        const list = await db.select().table('product');
        return list;
    },


    async findRelatedProducts(ProID,CatIDChild){
        let list = await db.select()
            .table('product')
            .where('CatIDChild',CatIDChild)
            .andWhereNot('ProID',ProID)
            .orderByRaw('RAND()')
            .limit(5);
        return list
    },

    async findByCatIDNext(CatIDChild){
        let list = await db.select().table('product').where('CatIDChild',CatIDChild);
        return list
    },

    async countByCatIDNext(CatIDChild){
        const list = await db('product').where('CatIDChild',CatIDChild).count({amount:'ProID'});
        return list[0].amount;
    },
    async findPageByCatIDNext(CatIDChild,limit,offset){
        let list = await db.select().table('product')
            .where('CatIDChild',CatIDChild)
            .limit(limit)
            .offset(offset);
        return list
    },

    async findByProID(ProID){
        const list = await db.select().table('product').where('ProID',ProID);
        if (list.length === 0) return null;
           return list[0];
      
    },


    async findByID(ProID){
        const list = await db.select().table('product').where('ProID',ProID);
           return list;
      
    },
    

    async addProduct(entity){
        return db('product').insert(entity);
    },

    async searchProduct(word){
        const sql = `SELECT *
                     FROM product
                     WHERE MATCH (ProName) AGAINST ('${word}')`
                    

        const list = await db.raw(sql);
        return list[0];
    },
    async searchProductBySearching(word){
        const sql = `SELECT *
                     FROM product
                     WHERE MATCH (ProName) AGAINST ('${word}')`

        const list = await db.raw(sql);
        return list[0];
    },
    async searchProductByTypeAndCatAndName(CatID,word,t,limit,offset){
        const type = classifyTypeSort(t);

        const sql = `SELECT *
                     FROM product
                     WHERE CatIDChild= (${CatID}) 
                     AND MATCH (ProName) AGAINST ('${word}')
                     ORDER BY ${type}
                     LIMIT ${limit}
                     OFFSET ${offset}`

        const list = await db.raw(sql);
        return list[0];
    },

    async sortProductByType(CatID,t,limit,offset){
        const type = classifyTypeSort(t);

        const sql = `SELECT *
                     FROM product
                     WHERE CatIDChild= (${CatID}) 
                     ORDER BY ${type}
                     LIMIT ${limit}
                     OFFSET ${offset}`

        const list = await db.raw(sql);
        return list[0];
    },

    async findAll(){
        const list = await db('product').select();
        return list;
    },


   async getItemByCart(id) {
        const list = await db('cartdetail').join('product','cartdetail.ProID','=','product.ProID').where('CartID',id).select();
        return list || null;
    },

    async getProductByCartID(cartId) {
        const result = await db('cart')
            .join('cartdetail', 'cart.CartID', 'cartdetail.CartID')
            .join('product', 'cartdetail.ProID', 'product.ProID')
            .where({
                "cart.CartID": cartId,
            })
            .select(
                "product.ProID",
                "product.ProName",
                "product.Price",
                "product.image",
                "cartdetail.quantity",

            )
        return result || null;
    },

}
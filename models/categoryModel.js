import db from '../utils/db.js';


export default {
   async findAll() {
    const result = await db('category')
    return result || null;
    },

    async findAllCat() {
        const list = await db.select().table('category');
    
        for (let i = 0; i < list.length; i++) {
            const listsub = await db.select().table('category').where({'parentId': list[i].CatID});
            list[i].listsub = listsub;
        }
    
        return list;
    },

   async findCategory() {
       const list = await db('category').select();
        return list;
    },

   async findCategoryNext() {
     const list = await db('categorychild').select();

     for (const cat of list) {
      cat.amount = await productModel.countByCatIDNext(cat.CatIDChild);
      const Cat = await db('category').where({CatID: cat.CatID});
      cat.NameParent = Cat[0].CatName;
  }
      return list;
},
   async findByCatIDNext(CatIDNext) {

  if (CatIDNext === null)
      return null;

  const Cat = await db('categoriesnext').where({CatIDNext: CatIDNext})
  return Cat[0].CatNextName;
},
   async findCategoryNextID() {
       const id = await db('categoriesnext').count('CatIDNext as amount');
       return id[0].amount + 1;
},
   async findCatIDByCatIDNext(CatIDNext) {
       const catID = await db('categoriesnext').where({CatIDNext: CatIDNext}).select('CatID');
       return catID[0].CatID;
},



}
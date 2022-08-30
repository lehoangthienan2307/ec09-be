import productModel from "../models/productModel.js";



export const productCtrl = {

    getProducts: async(req, res) =>{
        try {
            const CatIDNext = req.query.CatID || 0;
            const type = req.query.sort;
            const word = req.query.word;
            const limit = 3;
            const page = req.query.page || 1;
            const offset = (page - 1) * limit;

            let type_1 = false,type_2=false,type_3=false,type_4=false;
            let type_price = false,type_time = false

            if(+type === 1){
                type_1 = true;
                type_price = true;
            }
            else if(+type === 2){
                type_2 = true;
                type_price = true;
            }
            else if(+type === 3){
                type_3 = true;
                type_time = true;
            }
            else if(+type === 4){
                type_4 = true;
                type_time = true;
            }

            let products;
            if(typeof (type) === 'undefined' &&  typeof (word) === 'undefined'){
                products = await productModel.getProductByCat(CatIDNext,limit,offset);
            }

            else{
                products = await productModel.sortProductByType(CatIDNext,type,limit,offset);
            }
        
            const list = await productModel.findByCatIDNext(CatIDNext)
            const count = list.length;
            let nPages = Math.floor(count/limit);
            if(count%limit >0) nPages++;
        
            const pageNumbers = [];
            for(let i=1;i<=nPages;i++){
                pageNumbers.push({
                    value: i,
                    isCurrent: +page === i,
                    type:type,
                });
            }
        
            
            res.json({
                status: 'success',
                list,
                products,
                count,
                type,
                type_1,type_2,type_3,type_4,
                type_price, type_time,
                pageNumbers,
                pageNext: {
                    page: +page + 1,
                    isVisible: (+page === 1 && nPages === 1) ? false : (+page === nPages ? false : true),
                },
                pagePrev: {
                    page: +page - 1,
                    isVisible: (+page === 1) ? false : true,
                },
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getProduct: async(req, res) => {
        try {
          const product = await productModel.findByProID(req.params.id)
    
          if(!product) 
            return res.status(404).json({msg: 'This product does not exist.'})
    
          return res.status(200).json(product)
        } catch (err) {
          return res.status(500).json({msg: err.message})
        }
      },
      searchProduct: async(req, res) => {
        try {
        const word = req.params.word; 
          const product = await productModel.searchProduct(word)
          if(!product) 
            return res.status(404).json({msg: 'This product does not exist.'})
    
          return res.status(200).json(product)
        } catch (err) {
          return res.status(500).json({msg: err.message})
        }
      },

      getTopSale: async(req, res) => {
        try {
          const list= await productModel.findTopSale()
          const items=[]
          for (const item of list) {
            items.push({
              ProID: item.ProID,
              ProName: item.ProName,
              image: item.image,
              Price: item.Price
          })
        }
          return res.status(200).send({
            result:items
          })
    
        } catch (err) {
          return res.status(500).json({msg: err.message})
        }
      },
  
}



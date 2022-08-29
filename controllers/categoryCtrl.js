import categoryModel from '../models/categoryModel.js'

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
      category = categories.filter((cat) => cat.parentId == undefined);
    } else {
      category = categories.filter((cat) => cat.parentId == parentId);
    }
  
    for (let cate of category) {
      categoryList.push({
        CatID: cate.CatID,
        CatName: cate.CatName,
        categoryImg: cate.categoryImg,
        parentId: cate.parentId,
        listsub: createCategories(categories, cate.CatID),
      });
    }
  
    return categoryList;
  }
export const categoryCtrl = {
//   getCategory: async(req, res) =>{
//       try {
//           const categoriesList = await categoryModel.findAllCat()
  
//           res.json({
//               status: 'success',
//               categoriesList
//           })
          
//       } catch (err) {
//           return res.status(500).json({msg: err.message})
//       }
//   },

  getCategory: async(req, res) => {
    try{
        const category = await categoryModel.findAll() 
        if (category) {
          const categoriesList = createCategories(category);
          res.status(200).json({ categoriesList });
        }
    }
    catch (err) {
        return res.status(500).json({msg: err.message})
    }


    },

}





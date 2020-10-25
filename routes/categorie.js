const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
let lungs;
router.get('/', function (req, res) {       // Sending Page Query Parameter is mandatory http://localhost:3636/api/products?page=1
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;     // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }
    database.table('categorie as c')

        .withFields([
            'c.name as name',
            'c.id as id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                lungs=prods.length+1;
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: "No products found"});
            }
        })
        .catch(err => console.log(err));
});

router.post('/list',  (req, res) => { 
    console.log(req.body);
   let nume=req.body.name;
     
        database.table('categorie')
            .insert({
            	id: lungs,
                name: nume,
            }).catch(err => console.log(err));
    
});

router.get('/:prodId', function (req, res){
    let produseid=req.params.prodId;
    console.log(produseid);

    database.table('categorie as c')

        .withFields([
            'c.name as name',
            'c.id as id'
        ]).filter({'c.id' : produseid})
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({message: "No product found with id ${produseid} "});
            }
        })
        .catch(err => console.log(err));

});

router.delete('/sterge/:id',(req, res) =>
    {
        console.log("Stergere efectuata in back");
      let idc=req.params.id;
      console.log("cu elementul "+ idc);

      database.table('categorie')
          .filter({'categorie.id' : idc})
          .remove()
          .then(successNUM =>{
                console.log("Merge in back");
              console.log(successNUM);
          })
    });
router.put('/editare/nume',(req,res) =>{
    let id =req.body.id;
    let nume=req.body.name;
    console.log(id);
    	console.log(" " +nume);
    console.log("Am editat");

    database.table('categorie')
        .filter({id : id })
        .update({
            name: nume
        })
        .then(successNUM => {
            console.log(successNUM)
        })
} 
);
module.exports = router;

const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
let ids;
/* GET ALL PRODUCTS */
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
    database.table('produse as p')

        .withFields([
            'p.name as name',
            'p.pret as pret',
            'p.descriere as descriere',
            'p.datalansarii as data',
            'p.picture as img',
            'p.categorie as categorie',
            'p.id as id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
            	ids=prods.length;
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

router.get('/:prodId', function (req, res){
    let produseid=req.params.prodId;
    console.log(produseid);

    database.table('produse as p')

        .withFields([
            'p.name as name',
            'p.pret as pret',
            'p.descriere as descriere',
            'p.datalansarii as data',
            'p.picture as img',
            'p.categorie as categorie',
            'p.id as id'
        ]).filter({'p.id' : produseid})
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
router.get('/name/:nume', function (req, res){
    let nume=req.params.nume;
    console.log(nume);

    database.table('produse as p')

        .withFields([
            'p.name as name',
            'p.pret as pret',
            'p.descriere as descriere',
            'p.datalansarii as data',
            'p.picture as img',
            'p.categorie as categorie',
            'p.id as id'
        ]).filter({'p.name' : nume})
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({message: "No product found with numele ${nume} "});
            }
        })
        .catch(err => console.log(err));

});

router.get('/categorie/:nume',function (req,res){
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
    const cat_title=req.params.nume;
    console.log(cat_title);
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;     // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }
    database.table('produse as p')
        .withFields([
            'p.name as name',
            'p.pret as pret',
            'p.descriere as descriere',
            'p.datalansarii as data',
            'p.picture as img',
            'p.categorie as categorie',
            'p.id as id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .filter({'categorie' : cat_title})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: "No products found from ${cat_title} category"});
            }
        })
        .catch(err => console.log(err));
});

router.post('/list',  (req, res) => {
	ids=ids+1;
    console.log(req.body);
    console.log(req.body.id);
    let id=ids;

    let nume=req.body.name;
    let descriere=req.body.descriere;
    let data=req.body.datalansarii;
    let categorie=req.body.categorie;
    let pret=req.body.pret;
    let poza=req.body.picture;
    var sql="SET @id = ?;SET @name = ?; SET @descriere = ?; SET @data = ?; SET @categorie = ?; SET @pret = ?; SET @picture = ?";
    if (id !== null && id > 0) {
        database.table('produse')
            .insert({
                id: id,
                name: nume,
                descriere: descriere,
                datalansarii: data,
                categorie: categorie,
                pret: pret,
                picture: poza
            }).catch(err => console.log(err));
    }
});

module.exports = router;

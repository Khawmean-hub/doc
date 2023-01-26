var express = require("express");
const db = require("../config/db");
const Paging = require("../utils/Paging");
var homeRoute = express.Router();
const BaseRes = require("../utils/Response");
const { defaulEmpty, isNull, defaultPageInput } = require("../utils/strUtils");






// Home
homeRoute.post('/doc_menu_home_r01', async (req, res, next) => {
    defaultPageInput(req);
    var count = await db.one(`select count(*) from doc_tags  where   status = 1  and (dep_id = $1 or coalesce($1,'')='')`, [defaulEmpty(req.body.DEP_ID)])
    var page = new Paging(req.body.OFFSET, req.body.LIMIT, count.count);

    var r = await db.any(`SELECT a.id, a.tag_id, a.title FROM doc_articles a right join doc_tags t on a.tag_id = t.id  where a.status=1 and t.status = 1  order by a.title;`);

    var rr = await db.any(`select  id, title, dep_id  from doc_tags 
    where status = 1  and (dep_id = $1 or coalesce($1,'')='') order by title limit $2 offset $3;`, [defaulEmpty(req.body.DEP_ID), page.limit, page.getOffset()]);

    if (r == null || rr == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { ARTICLES: r, TAGS: rr, PAGE: page.getPage() }))
    }

})


homeRoute.post('/doc_department_r001', async (req, res, next) => {
    defaultPageInput(req);


    var count = await db.one('select count(*) from doc_department where dep_status = 1');
    var page = new Paging(req.body.OFFSET, req.body.LIMIT, count.count);


    var resp = await db.any(`select dep_id, dep_name from doc_department where dep_status = 1 order by dep_id
    LIMIT ${page.limit} OFFSET ${page.getOffset()};`);

    if (resp == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { REC: resp, PAGE: page.getPage() }))
    }
})

homeRoute.get('/doc_menu_r01', async (req, res, next) => {
    var acticle = await db.any(`SELECT a.id, a.tag_id, a.title
    FROM doc_articles a right join doc_tags t on a.tag_id = t.id  where a.status=1 and t.status = 1
    order by a.title;`);

    var tags = await db.any(`SELECT id, title, dep_id  FROM doc_tags where status=1  ORDER BY title`);

    if (acticle == null || tags == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { ARTICLES: acticle, TAGS: tags }))
    }
})


homeRoute.post('/doc_article_r01', async (req, res, next) => {
    var acticle = await db.any(`SELECT a.id, a.tag_id, a.file_article_id, t.title as tag_title,a.title, a.content_body, 
    a.modified_date , a.status,b.username,a.user_id,
    f.file_id,f.file_idnt_id,f.file_nm,f.file_size,f.thum_img_path,f.img_path
    FROM doc_articles a 
    inner join doc_users b on a.user_id = b.id 
    left join doc_tags t on t.id = a.tag_id  
    left join doc_file as f on f.file_article_id = a.file_article_id
    where a.id=cast($1 as INTEGER) and a.status = 1 and t.status = 1`, [req.body.ID]);
    if (acticle == null ) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        var ress = [];
        if(acticle.length>0){
            ress=acticle[0];
        }
        res.send(new BaseRes(true, "Success", ress))
    }
})


homeRoute.post('/doc_file_r01', async (req, res, next) => {
    var acticle = await db.any(`select f.file_id,f.file_idnt_id,f.file_nm,f.file_size,f.thum_img_path,f.img_path 
    from doc_file as f 
    inner join doc_articles as a on f.file_article_id = a.file_article_id
    where a.id=cast($1 as INTEGER) and a.status = 1 and f.status = 1`, [req.body.ID]);
    if (acticle == null ) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        var ress = [];
        if(acticle.length>0){
            ress=acticle[0];
        }
        res.send(new BaseRes(true, "Success", ress))
    }
})



// testing
homeRoute.post('/doc_menu_r02', async (req, res, next) => { //http://localhost:3000/doc_menu_r02?id=222

    var acticle = await db.any(`SELECT a.id, a.tag_id, a.file_article_id, t.title as tag_title,a.title, a.content_body, 
    a.modified_date , a.status,b.username,a.user_id,
    f.file_id,f.file_idnt_id,f.file_nm,f.file_size,f.thum_img_path,f.img_path
    FROM stdy.doc_articles a 
    inner join doc_users b on a.user_id = b.id 
    left join doc_tags t on t.id = a.tag_id  
    left join doc_file as f on f.file_article_id = a.file_article_id
    where a.id=cast($1 as INTEGER) and a.status = 1 and t.status = 1`, [req.body.ID]);
    if (acticle == null ) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        var ress = [];
        if(acticle.length>0){
            ress=acticle[0];
        }
        res.send(new BaseRes(true, "Success", ress))
    }


    
})

module.exports = homeRoute;
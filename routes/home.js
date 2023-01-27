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
    if (acticle == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        var ress = [];
        if (acticle.length > 0) {
            ress = acticle[0];
        }
        res.send(new BaseRes(true, "Success", ress))
    }
})


homeRoute.post('/doc_file_r01', async (req, res, next) => {
    var acticle = await db.any(`select f.file_id,f.file_idnt_id,f.file_nm,f.file_size,f.thum_img_path,f.img_path 
    from doc_file as f 
    inner join doc_articles as a on f.file_article_id = a.file_article_id
    where a.id=cast($1 as INTEGER) and a.status = 1 and f.status = 1`, [req.body.ID]);
    if (acticle == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        var ress = [];
        if (acticle.length > 0) {
            ress = acticle[0];
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
    if (acticle == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        var ress = [];
        if (acticle.length > 0) {
            ress = acticle[0];
        }
        res.send(new BaseRes(true, "Success", ress))
    }

})








homeRoute.post('/doc_tags_r02', async (req, res, next) => { //http://localhost:3000/doc_tags_r02
    var tags = await db.any(`select t.id,t.title,t.modified_date,t.user_id,u.username from doc_tags t left join doc_users u on t.user_id = u.id where t.status = 2;`);
    if (tags == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { TAGS: tags }))
    }
})






homeRoute.post('/api_0001_c001', async (req, res, next) => { //http://localhost:3000/api_0001_c001


    /**
           request
           {
            "API_ID" : "1",
            "PRJ_ID" : "1",
            "REQ_METHOD" : "post",
            "REQ_DATA" : "1",
            "API_NM" : "2",
            "CONTENT_TYPE" : "1" ,
            "DESCRIPTION" : "1",
            "REG_USER_ID" : "1",
            "MOD_USER_ID" : "1"
            }
         * 
         * 
         */


    var b2bApiInfo = await db.any(`INSERT INTO b2b_api_info
    (api_id, prj_id,req_method, req_data, api_nm, content_type, description, reg_user_id, mod_user_id, reg_dt, mod_dt)
    VALUES('${req.body.API_ID}', CAST('${req.body.PRJ_ID}' AS int), '${req.body.REQ_METHOD}', '${req.body.REQ_DATA}', '${req.body.API_NM}', '${req.body.CONTENT_TYPE}', '${req.body.DESCRIPTION}', '${req.body.REG_USER_ID}', '${req.body.MOD_USER_ID}',to_char(now(),'YYYY-MM-DD HH24:mi:SS'),to_char(now(),'YYYY-MM-DD HH24:mi:SS'))`);
    if (b2bApiInfo == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { B2B_API_INFO: b2bApiInfo }))

    }

})









homeRoute.post('/api_0002_r001', async (req, res, next) => { //http://localhost:3000/api_0002_r001


    /**
      
      request
        {
            "MD_TYPE" : 2,
            "SRCH_WORD" : "hello",
            "PRJ_ID" : "122",
            "REQ_METHOD" : "POST"
        }

     */

    var count = await db.one(`SELECT COUNT(API.API_ID) AS CNT
                              FROM
                              	B2B_API_INFO API
                              LEFT JOIN B2B_API_PRJ_INFO PR ON PR.PRJ_ID = API.PRJ_ID
                              WHERE  1=1
                              AND (  
                                   API.API_ID      ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                                OR PR.PRJ_NM       ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                                OR API.API_NM      ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                                OR API.REQ_DATA    ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                                OR API.DESCRIPTION ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                                )
                              AND (    COALESCE('${req.body.PRJ_ID}','')  = '' 
                                   OR( COALESCE('${req.body.PRJ_ID}','')  <> '' AND cast(API.PRJ_ID as varchar)= '${req.body.PRJ_ID}' )  
                                 )  
                              AND (   COALESCE('${req.body.REQ_METHOD}','')  = '' 
                                   or (COALESCE('${req.body.REQ_METHOD}','')  <> '' AND API.REQ_METHOD = '${req.body.REQ_METHOD}')  --P : POST, G: GET
                                 )`)



    var page = new Paging(req.body.OFFSET, req.body.LIMIT, count.count);

    var api = await db.any(`SELECT /* MAP_ID(API_0002_R001) */
                               API.API_ID,
                               PR.PRJ_NM,
                               ( SELECT URL FROM B2B_API_MODE WHERE API_ID = API.API_ID AND   MD_TYPE = '${req.body.MD_TYPE}' ) AS URL,--1:DEV, 2:REAL
                               API.REQ_METHOD,
                               API.REQ_DATA,
                               API.CONTENT_TYPE,
                               API.DESCRIPTION,
                               API.REG_USER_ID,
                               API.MOD_USER_ID,
                               API.REG_DT,
                               API.MOD_DT,
                               API.API_NM,
                               API.PRJ_ID
                           FROM  B2B_API_INFO API
                           LEFT JOIN B2B_API_PRJ_INFO PR ON PR.PRJ_ID = API.PRJ_ID
                           WHERE  1=1
                           AND (  
                               API.API_ID         ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                               OR PR.PRJ_NM       ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                               OR API.API_NM      ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                               OR API.REQ_DATA    ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                               OR API.DESCRIPTION ILIKE '%' || '${req.body.SRCH_WORD}' || '%'
                           )
                           AND (    COALESCE('${req.body.PRJ_ID}','')  = '' 
                               OR( COALESCE('${req.body.PRJ_ID}','')  <> '' AND cast(API.PRJ_ID as varchar)= '${req.body.PRJ_ID}' )  
                           )  
                           AND (   COALESCE('${req.body.REQ_METHOD}','')  = '' 
                            or (COALESCE('${req.body.REQ_METHOD}','')  <> '' AND API.REQ_METHOD = '${req.body.REQ_METHOD}')  --P : POST, G: GET
                           ) 
                           ORDER BY  API.API_ID, API.PRJ_ID ASC
                           LIMIT ${page.limit} OFFSET ${page.getOffset()}`);
                            

    if (api == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { API: api }))
    }
})
















homeRoute.post('/api_0002_d002', async (req, res, next) => { //http://localhost:3000/api_0002_d002
    /**
     * reqeust
     * {
            "API_ID" : "ass"
        }
     */
    var api = await db.any(`DELETE FROM b2b_api_info WHERE api_id= '${req.body.API_ID}'`);
    if (api == null) {
        return res.send(new BaseRes(false, "Error", null))
    } else {
        res.send(new BaseRes(true, "Success", { API: api }))
    }
})




















module.exports = homeRoute;
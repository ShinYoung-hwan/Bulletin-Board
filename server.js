import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { createComment, createPost, deleteComment, deletePost, getComments, getPost, getindex, modifyComment, modifyPost } from "./services/db.service.js";
import { helpers } from "./configs/handlebar.helper.js";
import { checkDatabase } from "./configs/db.config.js";

// 상수 설정
const __dirname = path.resolve();

// express server 설정
var app = express();

// express가 post 요청으로 넘어오는 정보를 해석하기 위함
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express가 static 파일을 읽을 수 있도록 설정
app.use(express.static("public"));

// express-handlebars 설정
app.engine("handlebars", handlebars.create({
    helpers: helpers,
}).engine, );
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

// 루트 경로
app.get('/', (req, res) => {
    res.redirect("index");
    // res.render("root", { path: "root" });
})

// 게시판 전체보기
app.get('/index', (req, res) => {
    //  게시판 리스트
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1; // 현재 페이지 데이터, 기본값 1
    const [ posts, paginator ] = getindex(search, page);
    res.render("index", { 
        posts,
        paginator
    });
})
// 게시글 생성
app.post('/index', (req, res) => {
    const post = req.body;
    createPost(post);
    res.redirect("index");
})
// 게시판 및 댓글 조회
app.get('/detail/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = getPost(id);
    const comments = getComments(id);

    // 게시물이 없는 경우
    if (post === undefined) {
        res.statusCode = 404;
        throw new Error(`${res.statusCode} 게시물이 없습니다.`);
    }

    res.render("detail", {
        post,
        comments
    });
})
// 게시글 수정
app.put('/detail/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        modifyPost(id, req.body);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }
})
// 게시글 삭제
app.delete('/detail/:id', (req, res) => {
    try {
        deletePost(req.body.id);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }
})
// 댓글 생성
app.post('/detail/:id', (req, res) => {
    const post_id = parseInt(req.params.id);
    createComment(post_id, {
        "content": req.body["comment"]
    });

    res.redirect(`/detail/${post_id}`);
})
// 댓글 수정
app.put('/modify_comment', (req, res) => {
    try {
        const post_id = parseInt(req.body.post_id);
        const id = parseInt(req.body.id);
        const commentContent = req.body.commentContent;
        modifyComment(post_id, id, commentContent);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }

})
// 댓글 삭제
app.delete('/delete_comment', (req, res) => {
    try {
        const post_id = parseInt(req.body.post_id);
        const id = parseInt(req.body.id);
        deleteComment(post_id, id);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }

})

app.listen(3000, () => { 
    checkDatabase();
    console.log('server starts'); 
});
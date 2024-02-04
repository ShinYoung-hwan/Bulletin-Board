import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { createComment, createPost, deleteComment, deletePost, getComments, getPost, getPosts } from "./services/db.service.js";
import { helpers } from "./configs/handlebar.helper.js";

// 상수 설정
const __dirname = path.resolve();

// express server 설정
var app = express();

// express가 post 요청으로 넘어오는 정보를 해석하기 위함
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const search = req.query.search
    const posts = getPosts(search)
    res.render("index", { 
        posts,
    });
})
// 게시글 생성
app.post('/index', (req, res) => {
    createPost(req.body);
    res.redirect("index");
})

// 게시판 디테일
app.get('/detail/:id', (req, res) => {
    const post = getPost(Number(req.params.id));
    const comments = getComments(Number(req.params.id));

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
// 게시글 디테일 수정
app.put('/detail/:id', (req, res) => {

})
// 게시글 삭제
app.delete('/detail/:id', (req, res) => {
    deletePost(req.body.id);
    return res.json({ isSuccess: true });
})
// 게시글 디테일에서 댓글 생성
app.post('/detail/:id', (req, res) => {
    const post_id = Number(req.params.id);
    createComment(post_id, {
        "content": req.body["comment"]
    });

    res.redirect(`/detail/${post_id}`);
})

app.put('/update_comment', (req, res) => {
    
})
app.delete('/delete_comment', (req, res) => {
    const post_id = Number(req.body.post_id);
    const id = Number(req.body.id);
    deleteComment(post_id, id);
    return res.json({ isSuccess: true });
})


app.listen(3000, () => { 
    console.log('server starts'); 
});
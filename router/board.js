import { Router } from "express";

import dbService from "../services/board.service.js";

const router = Router();

// 게시판 전체보기
router.get('/index', (req, res) => {
    //  게시판 리스트
    // 로그인 되어 있다면
    if(!req.session.user) res.redirect("/auth/login");
    else {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1; // 현재 페이지 데이터, 기본값 1
        const [ posts, paginator ] = dbService.getindex(search, page);
        res.render("board/index", { 
            posts,
            paginator
        });
    }

})
// 게시글 생성
router.post('/index', (req, res) => {
    const post = req.body;
    dbService.createPost(post);
    res.redirect("/board/index");
})
// 게시판 및 댓글 조회
router.get('/detail/:id', (req, res) => {
    // 로그인 안되어 있는 경우
    if (!req.session.user) res.redirect("/auth/login");
    else {
        const id = parseInt(req.params.id);
        const post = dbService.getPost(id);
        const comments = dbService.getComments(id);
    
        // 게시물이 없는 경우
        if (post === undefined) {
            res.statusCode = 404;
            throw new Error(`${res.statusCode} 게시물이 없습니다.`);
        }
    
        res.render("board/detail", {
            post,
            comments
        });
    }

})
// 게시글 수정
router.put('/detail/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        dbService.modifyPost(id, req.body);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }
})
// 게시글 삭제
router.delete('/detail/:id', (req, res) => {
    try {
        dbService.deletePost(req.body.id);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }
})
// 댓글 생성
router.post('/detail/:id', (req, res) => {
    const post_id = parseInt(req.params.id);
    dbService.createComment(post_id, {
        "content": req.body["comment"]
    });

    res.redirect(`/board/detail/${post_id}`);
})
// 댓글 수정
router.put('/modify_comment', (req, res) => {
    try {
        const post_id = parseInt(req.body.post_id);
        const id = parseInt(req.body.id);
        const commentContent = req.body.commentContent;
        dbService.modifyComment(post_id, id, commentContent);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }

})
// 댓글 삭제
router.delete('/delete_comment', (req, res) => {
    try {
        const post_id = parseInt(req.body.post_id);
        const id = parseInt(req.body.id);
        dbService.deleteComment(post_id, id);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }

})

export default router;
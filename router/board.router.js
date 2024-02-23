import { Router } from "express";

import postService from "../services/post.service.js";
import commentService from "../services/comment.service.js";

const router = Router();

// 게시판 전체보기
router.get('/index', async (req, res) => {
    //  게시판 리스트
    // 로그인 되어 있다면
    if(!req.session.user) res.redirect("/auth/login");
    else {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1; // 현재 페이지 데이터, 기본값 1
        const [ posts, paginator ] = await postService.getindex(search, page);
        res.render("board/index", { 
            posts,
            paginator
        });
    }

})
// 게시글 생성
router.post('/index', async (req, res) => {
    const post = req.body;
    const writer_id = parseInt(req.session.user.id);
    await postService.createPost(post, writer_id);
    res.redirect("/board/index");
})
// 게시판 및 댓글 조회
router.get('/detail/:id', async (req, res) => {
    // 로그인 안되어 있는 경우
    if (!req.session.user) res.redirect("/auth/login");
    else {
        const id = parseInt(req.params.id);
        const post = await postService.getPost(id);
        const comments = await commentService.getComments(id);
    
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
router.put('/detail/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await postService.modifyPost(id, req.body);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }
})
// 게시글 삭제
router.delete('/detail/:id', async (req, res) => {
    try {
        await postService.deletePost(req.body.id);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }
})
// 댓글 생성
router.post('/detail/:id', async (req, res) => {
    const post_id = parseInt(req.params.id);
    const writer_id = parseInt(req.session.user.id);
    await commentService.createComment(post_id, {
        "content": req.body["comment"]
    }, writer_id
    );

    res.redirect(`/board/detail/${post_id}`);
})
// 댓글 수정
router.put('/modify_comment', async (req, res) => {
    try {
        const post_id = parseInt(req.body.post_id);
        const id = parseInt(req.body.id);
        const commentContent = req.body.commentContent;
        await commentService.modifyComment(post_id, id, commentContent);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }

})
// 댓글 삭제
router.delete('/delete_comment', async (req, res) => {
    try {
        const post_id = parseInt(req.body.post_id);
        const id = parseInt(req.body.id);
        await commentService.deleteComment(post_id, id);
        return res.json({ isSuccess: true });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ isSuccess: false });
    }

})

export default router;
import { Router } from "express";

import authService, { deleteUser } from "../services/auth.service.js";

const router = Router();

// 로그인 페이지
router.get("/login", (req, res) => {
    // 이미 로그인 되어 있다면
    if (req.session.user) res.redirect("/board/index");
    else {
        res.render("auth/login");
    }
})
// 회원가입 확인
router.post("/signup", (req, res) => {
    const isSuccess = authService.createUser(req.body);
    return res.json({ isSuccess })
})
// 로그인 확인
router.post("/login", (req, res) => {
    const { isSuccess, user } = authService.loginUser(req.body);
    if (isSuccess){
        req.session.user = {
            name: user.username,
            email: user.email,
            authorized: true,
        }
    }

    return res.json({ isSuccess });
})
// 로그아웃 페이지
router.get("/logout", (req, res) => {
    // 로그인 되어 있는 경우
    if (req.session.user) {
        req.session.destroy((error) => {
            console.error(error);
            return;
        })
    } 
    res.redirect("/auth/login");
})
// 회원가입 페이지
router.get("/signup", (req, res) => {
    res.render("auth/signup", { "mode": "signup" });
})

// 프로필 상세 페이지
router.get("/profile", (req, res) => {
    // 로그인되어 있지 않다면
    if (!req.session.user) res.redirect("/auth/login");
    else {
        const auth = authService.getUserInfo(req.session.user.email);
        res.render("auth/profile", { auth });
    }
})
// 사용자 삭제
router.delete("/profile", (req, res) => {
    const isSuccess = deleteUser(req.session.user.email);
    res.json({ isSuccess });
})
// 프로필 변경 페이지
router.get("/modify_profile", (req, res) => {
    if (!req.session.user) res.redirect("/auth/login");
    else {
        const auth = authService.getUserInfo(req.session.user.email);
        res.render("auth/signup", { "mode": "modify", auth });
    }
})
// 프로필 변경 
router.put("/modify_profile", (req, res) => {
    const userInfo = req.body;
    const isSuccess = authService.modifyUserInfo(userInfo);

    res.json({ isSuccess });
})

export default router;
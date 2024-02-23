import { Router } from "express";

import authService from "../services/auth.service.js";

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
router.post("/signup", async (req, res) => {
    const isSuccess = await authService.createUser(req.body);
    return res.json({ isSuccess })
})
// 로그인 확인
router.post("/login", async (req, res) => {
    const { isSuccess, user } = await authService.loginUser(req.body);
    if (isSuccess){
        req.session.user = {
            name: user.username,
            email: user.email,
            id: user.id,
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
router.get("/profile", async (req, res) => {
    // 로그인되어 있지 않다면
    if (!req.session.user) res.redirect("/auth/login");
    else {
        const auth = await authService.getUserInfo(req.session.user.email);
        res.render("auth/profile", { auth });
    }
})
// 사용자 삭제
router.delete("/profile", async (req, res) => {
    const isSuccess = await authService.deleteUser(req.session.user.email);
    if (req.session.user) {
        req.session.destroy((error) => {
            console.log(error);
            return;
        })
    }
    res.json({ isSuccess });
})
// 프로필 변경 페이지
router.get("/modify_profile", async (req, res) => {
    if (!req.session.user) res.redirect("/auth/login");
    else {
        const auth = await authService.getUserInfo(req.session.user.email);
        res.render("auth/signup", { "mode": "modify", auth });
    }
})
// 프로필 변경 
router.put("/modify_profile", async (req, res) => {
    const userInfo = req.body;
    const isSuccess = await authService.modifyUserInfo(userInfo);

    res.json({ isSuccess });
})

export default router;
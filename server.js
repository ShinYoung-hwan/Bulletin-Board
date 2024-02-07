import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import path from "path";

import dbConfig from "./configs/db.config.js";
import { helpers } from "./configs/handlebar.helper.js";
import auth_router from "./router/auth.js";
import board_router from "./router/board.js";

// 상수 설정
const __dirname = path.resolve();
const PORT = 3000;

// express server 설정
var app = express();

// express-session 사용
app.use(session({
    secret: "mySecretKey",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))
// 핸들바에서도 세션 유저 접근하도록 설정
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

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

// 라우터 설정
app.use("/auth", auth_router);
app.use("/board", board_router);

// 루트 경로
app.get('/', (req, res) => {
    res.redirect("/board/index");
    // res.render("root", { path: "root" });
})

app.listen(PORT, () => { 
    dbConfig.checkDatabase();
    console.log(`server starts at http://localhost:${PORT}`); 
});
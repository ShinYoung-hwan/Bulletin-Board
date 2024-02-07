import fs from "fs";
import { DATABASE } from "../configs/db.config.js";

// 사용자를 생성해서 db에 저장
export function createUser(signature) {
    const db = fs.readFileSync(DATABASE);
    const data = JSON.parse(db.toString())
    const auths = data["auths"];

    const filteredAuth = auths.filter((auth) => auth.email === signature.email)
    // 이미 해당 이메일로 사용자가 생성된 경우
    if (filteredAuth.length !== 0) {
        return false;
    } 

    auths.push(signature);
    data["auths"] = auths;
    fs.writeFileSync(DATABASE, JSON.stringify(data));
    return true
}

// db에 사용자가 있는지 확인
export function loginUser(signature) {
    const db = fs.readFileSync(DATABASE);
    const auths = JSON.parse(db.toString())["auths"];

    const filteredAuth = auths.filter((auth) => auth.id === signature.id);

    // 가입된 사용자가 없을경우
    if (filteredAuth.length === 0) {
        return { isSuccess: false, filteredAuth };
    } 
    // 비밀번호가 다른 경우
    else if (signature.password !== filteredAuth[0].password) {
        return { isSuccess: false, filteredAuth };
    }

    return { "isSuccess": true, "user": filteredAuth[0] };
}

export function getUserInfo(email) {
    const db = fs.readFileSync(DATABASE);
    const auths = JSON.parse(db.toString())["auths"];
    const filteredAuth = auths.filter((auth) => auth.email === email);
    return filteredAuth[0];
}



const authService = {
    createUser,
    loginUser,
    getUserInfo,
}

export default authService;
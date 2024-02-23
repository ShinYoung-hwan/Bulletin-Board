import { dbConnection } from "../configs/db.config.js";
import { getSqlDate } from "../utils/date.utils.js";

// 사용자를 생성해서 db에 저장
export async function createUser(signature) {
    await dbConnection.query(
        `INSERT INTO auths \
        (pw, username, email, birthdate) \
        VALUES ('${signature.password}', '${signature.username}', '${signature.email}', '${getSqlDate(new Date(signature.birthdate))}')`
    )
    return true;
}

// db에 사용자가 있는지 확인
export async function loginUser(signature) {
    const [ user, fields ] = await dbConnection.query(
        `SELECT * FROM auths \
        WHERE email = '${signature.email}'`
    )
    // 가입된 사용자가 없을경우
    if (user.length === 0) {
        return { isSuccess: false, user };
    } 
    // 비밀번호가 다른 경우
    else if (signature.password !== user[0].pw) {
        return { isSuccess: false, user };
    }

    return { "isSuccess": true, "user": user[0] };
}

// 유저 정보 받기
export async function getUserInfo(email) {
    const [ user, fields ] = await dbConnection.query(
        `SELECT * FROM auths \
        WHERE email = '${email}'`
    )
    user[0].birthdate = user[0].birthdate.toISOString();
    return user[0];
}
// 유저 정보 변경
export async function modifyUserInfo(userInfo) {

    await dbConnection.query(
        `UPDATE auths \
        SET \
             pw = '${userInfo.password}', \
             username = '${userInfo.username}', \
             birthdate = '${getSqlDate(new Date(userInfo.birthdate))}' \
        WHERE email = '${userInfo.email}'`
    )
    return true;
}
// 유저 정보 삭제
export async function deleteUser(email) {
    await dbConnection.query(
        `DELETE FROM auths
        WHERE email = '${email}'`
    );
    return true
}

const authService = {
    createUser,
    loginUser,
    getUserInfo,
    modifyUserInfo,
    deleteUser,
}

export default authService;
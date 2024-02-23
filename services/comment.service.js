import { dbConnection } from '../configs/db.config.js';
import { getSqlDate } from '../utils/date.utils.js';

// 게시물에 딸린 답변 반환
export async function getComments(post_id) {
    const [ comment, fields ] = await dbConnection.query(
        `SELECT C.*, IFNULL(A.username, "Unknown") AS writer FROM comments C \
        LEFT JOIN auths A ON C.writer_id = A.id \
        WHERE C.post_id = ${post_id}` 
    );
    return comment;
}

// 답변 생성
export async function createComment(post_id, comment, writer_id) {

    await dbConnection.query(
        `INSERT INTO comments \
        (content, writer_id, createdDt, modifiedDt, post_id) \
        VALUES ('${comment.content}', ${writer_id}, '${getSqlDate(new Date())}', NULL, ${post_id})`
    )
}

// 답변 수정
export async function modifyComment(post_id, id, commentContent) {
    await dbConnection.query(
        `UPDATE comments \
        SET \
            content = '${commentContent}', \
            modifiedDt = '${getSqlDate(new Date())}' \
        WHERE id = ${id}`
    )
}

// 답변 삭제
export async function deleteComment(post_id, id) {
    await dbConnection.query(
        `DELETE FROM comments
        WHERE id = ${id}`
    )
}

const commentService = {
    createComment, 
    deleteComment, 
    getComments, 
    modifyComment, 
}

export default commentService;
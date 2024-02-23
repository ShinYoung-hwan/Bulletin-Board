import { paginator } from '../utils/paginator.utils.js';
import { dbConnection } from '../configs/db.config.js';
import { getSqlDate } from '../utils/date.utils.js';

// 게시판 내용 불러오기
export async function getindex(search="", page=1) {
    const perPage = 10; // 한 번에 가져올 게시물 수
    const skips = (page-1) * perPage;
    var posts, fields;

    if (search !== "") {
        [ posts, fields ] =  await dbConnection.query(
            `SELECT P.*, IFNULL(A.username, "Unknown") AS writer FROM posts P \
            WHERE title LIKE '%${search}%' || content LIKE %'${search}'% \
            LEFT JOIN auths A ON P.writer_id = A.id \
            ORDER BY id DESC \
            LIMITS ${skips}, ${perPage}`
            );
    } else {
        [ posts, fields ] = await dbConnection.query(
            `SELECT P.*, IFNULL(A.username, "Unknown") AS writer FROM posts P \
            LEFT JOIN auths A ON P.writer_id = A.id \
            ORDER BY id DESC \
            LIMIT ${skips}, ${perPage}`
        );
    }

    const totalCount = posts.length;
    const paginatorObj = paginator(totalCount, page, perPage);
    return [ posts, paginatorObj ];
}

// 게시물 1개 정보 불러오기
export async function getPost(id) {
    const [ post, fields ] = await dbConnection.query(
        `SELECT P.*, A.username AS writer FROM posts P\
        JOIN auths A \
        ON P.writer_id = A.id \
        WHERE P.id = ${id}`
    );
    return post[0];
}

// 게시물 추가
export async function createPost(post, writer_id) {
    await dbConnection.query(
        `INSERT INTO posts\
        (title, content, writer_id, createdDt, modifiedDt)\
        VALUES ('${post.title}', '${post.content}', ${writer_id}, '${getSqlDate(new Date())}', NULL)`
    );

}

// 게시물 수정
export async function modifyPost(id, modifiedPost) {
    await dbConnection.query(
        `UPDATE posts \
        SET \
            title = '${modifiedPost.title}', \
            content = '${modifiedPost.content}', \
            modifiedDt = '${getSqlDate(new Date())}' \
        WHERE id = ${id}`
    );
}

// 게시물 삭제
export async function deletePost(id) {
    // 게시물 삭제전 답변부터 삭제
    await dbConnection.query(
        `DELETE FROM comments
        WHERE post_id = ${id}`
    );
    await dbConnection.query(
        `DELETE FROM posts
        WHERE id = ${id}`
    );
}

const postService = {
    createPost, 
    deletePost, 
    getPost, 
    getindex, 
    modifyPost
};

export default postService;
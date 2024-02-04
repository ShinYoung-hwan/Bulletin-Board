import fs from 'fs';

const DATABASE = 'db.json';

function getNextPostId (posts) {
    if (posts.length === 0) return 1;
    else return posts[posts.length-1].id + 1;
}
function getNextCommentId (comments) {
    if (comments.length === 0) return 1;
    else return comments[comments.length-1].id + 1;
}

export function getPosts(search=null) {
    const db = fs.readFileSync(DATABASE);
    let posts = JSON.parse(db.toString())['posts'];

    if (search !== null) {
        posts = posts.filter((post) => post.title.indexOf(search) !== -1 || post.content.indexOf(search) !== -1)
    }

    return posts;
}

export function getPost(id) {
    const post = getPosts().filter((post) => post.id === id)[0];
    return post;
}

export function createPost(post) {
    const db = fs.readFileSync(DATABASE);
    const data = JSON.parse(db.toString());
    post = {
        id: getNextPostId(data["posts"]),
        ...post,
        createdDt: new Date().toISOString(),
        modifiedDt: new Date().toISOString(),
    };
    data["posts"].push(post);
    fs.writeFileSync(DATABASE, JSON.stringify(data));
}

export function updatePost(id, post) {
    const db = fs.readFileSync(DATABASE);
}

export function deletePost(id) {
    const db = fs.readFileSync(DATABASE);
    const data = JSON.parse(db.toString());
    const filterdPosts = data["posts"].filter((post) => post.id !== Number(id));
    data["posts"] = filterdPosts;
    fs.writeFileSync(DATABASE, JSON.stringify(data));
}

export function getComments(post_id) {
    // const comments = database.filter((post) => post.id == id);
    const db = fs.readFileSync(DATABASE);
    const comments = JSON.parse(db.toString())['comments'].filter((comment) => comment.post_id === post_id);
    return comments;
}

export function createComment(post_id, comment) {
    const db = fs.readFileSync(DATABASE);
    const data = JSON.parse(db.toString());
    const comments = data["comments"].filter((comment) => comment.post_id === post_id);
    comment = {
        id: getNextCommentId(comments),
        post_id,
        ...comment,
        createdDt: new Date().toISOString(),
        modifiedDt: new Date().toISOString() 
    }
    data["comments"].push(comment)
    fs.writeFileSync(DATABASE, JSON.stringify(data));
}

export function updateComment(post_id, id, comment) {

}

export function deleteComment(post_id, id) {
    const db = fs.readFileSync(DATABASE);
    const data = JSON.parse(db.toString());
    const filteredComments = data["comments"].filter((comment) => comment.post_id !== post_id || comment.id !== id);
    data["comments"] = filteredComments;
    fs.writeFileSync(DATABASE, JSON.stringify(data));
}
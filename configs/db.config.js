import fs from "fs";
export const DATABASE = 'db.json';

export function checkDatabase() {
    // 데이터베이스가 생성되어 있지 않다면 생성한다.
    if(!fs.existsSync(DATABASE)){ 
        fs.writeFileSync(DATABASE, JSON.stringify({
            "posts": [],
            "comments": [],
            "auths": []
        }));
        console.log(`Database ${DATABASE} is created`)
    }
}

const dbConfig = {
    checkDatabase,
}

export default dbConfig;
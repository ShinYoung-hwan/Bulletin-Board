# Bulletin Board

# 다운로드

```bash
> git clone https://github.com/ShinYoung-hwan/Bulletin-Board.git
> cd board
> yarn install
```

# 사용법

- 서버 실행

```bash
> node server.js
```

- 서버 접속 [http://localhost:3000/]

# 데이터베이스
```sql
-- posts 테이블 생성
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    writer_id INT, 
    createdDt DATETIME NOT NULL,
    modifiedDt DATETIME
);
-- comments 테이블 생성
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    writer_id INT,
    createdDt DATETIME NOT NULL,
    modifiedDt DATETIME,
    post_id INT NOT NULL
);
-- auths 테이블 생성
CREATE TABLE auths (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pw TEXT NOT NULL,
    username VARCHAR(10) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    birthdate DATE NOT NULL
);
```

# 추가 업데이트 목표

- jest & supertest를 이용한 테스팅 기능 추가
- post 및 comment 작성자 확인 기능
- 게시글에 댓글 수 미리보기

# 사용 기술

- Frontend: express-handlebars, bootstrap
- backend: express
- database: mysql

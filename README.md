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

- POSTS
  - id
  - title
  - content
  - writer
  - createdDt
  - modifiedDt
  - comment foreignkey
- COMMENTS
  - id
  - content
  - writer
  - createdDt
  - modifiedDt
  - post_foreignkey
- AUTHS
  - id
  - password
  - username
  - email
  - birthdate

# 추가 업데이트 목표

- jest & supertest를 이용한 테스팅 기능 추가
- post 및 comment 작성자 확인 기능
- 게시글에 댓글 수 미리보기
- database json에서 MySQL로 변경

# 사용 기술

- Frontend: express-handlebars, bootstrap
- backend: express
- database: json

import lodash from "lodash";
const PAGE_LIST_SIZE = 10; // 리스트 페이지에서 최대 몇 개의 페이지를 보여줄지 정하는 변수

/**
 * @param {Number} totalCount 게시물의 총 개수
 * @param {Number} page 현재 페이지
 * @param {Number} perPage 한 페이지당 표시하는 게시물 개수
 * @returns paginator
 */
export function paginator (totalCount, page, perPage = 10) {
    const PER_PAGE = perPage;
    const totalPage = Math.ceil(totalCount / PER_PAGE); // 나와야하는 총 페이지 수 계산

    // 시작 페이지 : 목 * PAGE_LIST_SIZE + 1
    let quotient = parseInt(page / PAGE_LIST_SIZE);
    if(page % PAGE_LIST_SIZE === 0){
        quotient -= 1;
    }
    const startPage = quotient * PAGE_LIST_SIZE + 1;

    // 끝 페이지 : startPage + PAGE_LIST_SIZE - 1
    const endPage = startPage + PAGE_LIST_SIZE - 1 < totalPage ? startPage + PAGE_LIST_SIZE - 1 : totalPage;
    const isFirstPage = page === 1;
    const isLastPage = page === totalPage;
    const hasPrev = page > 1;
    const hasNext = page < totalPage;
    
    const paginator = {
        pageList: lodash.range(startPage, endPage + 1),
        page,
        prevPage: page - 1,
        nextPage: page + 1,
        startPage,
        lastPage: totalPage,
        hasPrev,
        hasNext,
        isFirstPAge: isFirstPage,
        isLastPage,
    }
    return paginator;
}
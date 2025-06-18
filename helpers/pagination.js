// Chuyển trang
module.exports = (paginationObject, query, countProducts) => {
    if (query.page) {
        paginationObject.currentPage = parseInt(query.page);
    }
    paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limitItem;
    paginationObject.totalPage = Math.ceil(countProducts/paginationObject.limitItem);
    return paginationObject;
}
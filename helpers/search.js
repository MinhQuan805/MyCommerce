module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;

        // Dùng regex
        objectSearch.regex = new RegExp(query.keyword, "i");
    }
    return objectSearch;
}
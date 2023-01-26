 class Paging {

    constructor(page=1, limit=10,totalCount=17){
        this.page= page;
        this.limit= limit;
        this.totalCount = totalCount;
    }
   
    getTotalPages() {
        return Math.ceil(this.totalCount/this.limit);
    }

    getOffset() {
        return (this.page-1)*this.limit;
    }

    getPage(){
        this.getTotalPages = this.getTotalPages()
        return {
            currentPage: this.page,
            limit: this.limit,
            totalElement: this.totalCount,
            totalPage: this.getTotalPages
        }
    }
}

module.exports = Paging
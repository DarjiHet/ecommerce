
class ApiFeatures{
    constructor(query,queryStr){
        // query is product.find() in productcontroller
        // queryStr is keyword and value of searched product
        this.query = query;
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            //what is going to find
            name:{
                //regex regular expression
                $regex:this.queryStr.keyword,
                //for casesensitive
                $options: "i",
            },
        }:{};

        
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}
        
        // Removing some fileds for category
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key=>delete queryCopy[key]);

        // Fillter For Price and Rating

        
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        
        return this;
    }

    // for pagination
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}


module.exports = ApiFeatures;
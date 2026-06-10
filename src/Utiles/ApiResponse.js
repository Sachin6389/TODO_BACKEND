class Apiresponse{
    constructor(statusCode,massage="success",data,){
        this.statusCode=statusCode
        this.data=data
        this.massage=massage
        this.success=statusCode<400
    }
}
export{Apiresponse}
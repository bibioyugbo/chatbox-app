
const menu = require('../constants/menu')

exports.getMenu =  (_req,res)=>{
    try{
        return res.status(200).json({
            responseCode:"00",
            responseMessage:"Menu fetched successfully",
            responseData: menu

        })
    }catch (e) {
        console.log("Error fetching data", e)
    }

}


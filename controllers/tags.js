const Tag = require("../models/Category");

// create tag handler function
exports.createCategory = async(req, res) => {
    try {
        const {name, description} = req.body;

        // validation
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // create entry in db
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails)

        // return response
        return res.status(201).json({
            success: true,
            message: "Tag Created Successfully"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// getAlllCategory handler function
exports.getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, {name: true, description: true});
        return res.status(200).json({
            success: true,
            message: "All tags returned successfully",
            allCategories,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

// TODO: categoryPageDetails remaining
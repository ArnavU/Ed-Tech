const Tag = require("../models/Tag");

// create tag handler function
exports.createTag = async(req, res) => {
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
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        })

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

// getAllTags handler function
exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, {name: true, description: true});
        return res.status(200).json({
            success: true,
            message: "All tags returned successfully",
            allTags,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}
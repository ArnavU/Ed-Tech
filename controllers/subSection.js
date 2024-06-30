const SubSection = require("../models/SubSection");
const Section = require("../models/Section");

// create SubSection
exports.SubSection = async (req, res) => {
    try {
        // fetch data from req body
        // extract file/video
        // validation
        // upload video on cloudinary
        // create a sub section
        // update section with this subSection ObjectId
        // return res
        
        // fetch data from req body
        const {sectionId, title, timeDuration, description} = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All field are required",
            })
        }

        // upload video on cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create a sub section
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            videoUrl: uploadDetails.secure_url,
        })

        // update section with this subSection ObjectId
        const updatedSection = await Section.findByIdAndUpdate(sectionId, 
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            {new: true},
        )
        .populate("SubSection");

        // return res
        return res.status(200).json({
            success: true,
            message: "Sub Section Created Successfully",
            updatedSection
        })


    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error", 
            error: error.message,
        })
    }
}

// TODO: updateSubSection
exports.updateSubSection = async (req, res) => {
    try {
        // fetch data from req body
        const {subSectionId, title, timeDuration, description} = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if(!subSectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All field are required",
            })
        }

        // upload video on cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // update sub section
        const updatedSubSection = await findByIdAndUpdate(subSectionId, {
            title, 
            timeDuration,
            videoUrl: uploadDetails.secure_url,
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "Sub Section Updated Successfully",
            updatedSubSection
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating sub section",
            reason: error.message,
        })
    }
}

// TODO: deleteSubSection
exports.deleteSubSection = async (req, res) => {
    try {
        // fetch data from req body
        const {subSectionId} = req.body;

        // validation
        if(!subSectionId ) {
            return res.status(400).json({
                success: false,
                message: "subSectionId required",
            })
        }

        // delete sub section
        const deletedSubSection = await findByIdAndDelete(subSectionId)

        // return res
        return res.status(200).json({
            success: true,
            message: "Sub Section Deleted Successfully",
            deletedSubSection
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting sub section",
            reason: error.message,
        })
    }
}
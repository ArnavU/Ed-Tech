const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        // data fetch
        const {sectionName, courseId} = req.body;

        // data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }

        // create section
        const newSection = await Section.create({sectionName});

        // update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId, 
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            {new: true},
        )
        .populate({
            path: "Section",
            pouplate: {path: "SubSection"}
        })
        .exec();

        // TODO: use populate to replace sections/sub-sections both in the updatedCourseDetails

        // return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: error.message,
        })
    }
}

// updateSection
exports.updateSection = async (req, res) => {
    try {
        // data input
        // data validation
        // update data
        // return res

        // data input 
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, 
            {sectionName}, 
            {new: true},
        )

        // return res
        return res.status(200).json({
            success: true, 
            message: "Section updated successfully",
        })
         
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update Section, please try again",
            error: error.message,
        })
    }
}

// deleteSection
exports.deleteSection = async (req, res) => {
    try {
        // get id
        // use findByIdAndDelete
        // return response

        //get id
        const {sectionId} = req.params; 

        // use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId)

        // delete sectionId from course schema
        await Course.findOneAndDelete({courseContent: sectionId});

        // return res
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        })
    }
}
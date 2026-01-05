const db = require("../config/db")
const { v4: uuidv4 } = require("uuid")
const upload = require("../config/multer")

class eventController {

    //get events by ID
    async getEventById(req, res) {
        const { id } = req.query;
        try {
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid ID"
                })
            }

            //Get the Db from Db config
            const database = db.getDb();

            //FInd the Evnet with Id
            const event = await database.collection("events").findOne({
                _id: db.getObjectId(id)
            })

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Event found",
                event
            })


        }
        catch (error) {
            console.log("Error in fecthing the Event By ID", error.message)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            })
        }

    }

    //Get events by pagination
    async getLatestEvents(req, res) {
        const { type, limit = 5, page = 1 } = req.query;
        try {
            // The route already checks if type === 'latest', but we can double check or remove this.
            // keeping it safe:
            if (type !== "latest") {
                return res.status(400).json({
                    success: false, // fixed typo 'sucess'
                    message: "Invalid Query Parameters"
                })
            }

            //convert the mint and page into int
            const limitNum = parseInt(limit)
            const pageNum = parseInt(page)

            if (isNaN(limitNum) && limit < 1 || isNaN(pageNum) && page < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Query Parameters"
                })
            }

            const database = db.getDb();
            const skip = limitNum * (pageNum - 1)

            const events = await database.collection("events").
                find({}).sort({ _id: -1 }).skip(skip).limit(limitNum).toArray()

            //To get total count od pagination
            const totalCount = await database.collection("events").countDocuments()
            const totalPages = Math.ceil(totalCount / limitNum)

            return res.status(200).json({
                success: true,
                data: {
                    events,
                    pagination: {
                        currentPage: pageNum,
                        totalPages,
                        totalCount,
                        limit: limitNum
                    }
                }
            })



        } catch (error) {
            console.log("Error in fecthing the Event By ID", error.message)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            })
        }



    }

    //create an Event 
    async createEvent(req, res) {
        try {
            const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;

            // Basic validation for required fields
            if (!name || !schedule || !description || !category || !rigor_rank) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                });
            }

            const event = {
                type: "event",
                uid: uuidv4(),
                name,
                tagline,
                schedule: new Date(schedule),
                description,
                image: req.file ? `/uploads/${req.file.filename}` : null, // Store file path or url
                moderator,
                category,
                sub_category,
                rigor_rank: parseInt(rigor_rank),
                attendees: [],
                created_at: new Date(),
                updated_at: new Date()
            };

            const database = db.getDb();
            const result = await database.collection("events").insertOne(event);

            return res.status(201).json({
                success: true,
                message: "Event created successfully",
                eventId: result.insertedId
            });

        } catch (error) {
            console.log("Error creating Event", error.message)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
    //asunc update an Event

    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;

            let objectId;
            //validate the incoming id to Mongodb ObjectId
            try {
                objectId = db.getObjectId(id)
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid ID"
                })
            }

            //Building the update object 
            let updatedData = {}
            const allowedFields = ["name", "tagline", "schedule", "description", "moderator", "category", "sub_category", "rigor_rank"];
            allowedFields.forEach(field => {
                if (req.body[field]) {
                    updatedData[field] = req.body[field]
                }
            })

            if (schedule) {
                updatedData.schedule = new Date(schedule)
            }

            if (rigor_rank) {
                const rigorRank = parseInt(rigor_rank)
                if (isNaN(rigorRank) || rigorRank < 1 || rigorRank > 10) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid rigor rank"
                    })
                }
                updatedData.rigor_rank = rigorRank
            }

            //handlw image update
            if (req.file) {
                updatedData.image = `/uploads/${req.file.filename}`;
            }

            //updating the sate of the evnet i.e when its updated
            updatedData.updated_at = new Date();

            const database = db.getDb();
            const result = await database.collection("events").updateOne({ _id: objectId }, { $set: updatedData })

            if (result.matchedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            const updatedEvent = await database.collection('events').findOne({ _id: objectId })





            return res.status(200).json({
                success: true,
                message: "Event updated successfully",
                data: updatedEvent
            })

        } catch (error) {
            console.log("Error Updating the Event ", error.message)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    //delte an event
    async deleteEvent(req, res) {
        try {
            const { id } = req.params

            let objectId;
            //validate the incoming id to Mongodb ObjectId
            try {
                objectId = db.getObjectId(id)
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid ID"
                })
            }

            const database = db.getDb()
            const result = await database.collection("events").deleteOne({ _id: objectId })

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Event deleted successfully"
            })

        } catch (error) {
            console.log("Error deleting Event", error.message)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}

module.exports = new eventController();
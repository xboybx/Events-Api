const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const eventController = require("../controllers/eventcontrollers");

//Get an Event by Id or all with pagination
router.get("/events", (req, res) => {
    if (req.query.id) {
        return eventController.getEventById(req, res);
    } else if (req.query.type === "latest") {
        return eventController.getLatestEvents(req, res);
    } else {
        return res.status(400).json({
            sucess: false,
            message: "Invalid Query Parameters"
        })
    }
})

//create a new post
router.post("/events", upload.single("files[image]"), eventController.createEvent)

//update an existing post
router.put("/events/:id", upload.single("files[image]"), eventController.updateEvent);

//delete an existing post
router.delete("/events/:id", eventController.deleteEvent);

module.exports = router;
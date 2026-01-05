const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000
const path = require("path")
const db = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

app.use(cors());

//Reads Json Data From the Client and Converts it into JavaScript Object
app.use(express.json());

//Reads Form Data From the Client and Converts it into JavaScript Object
app.use(express.urlencoded({ extended: true }));

//with this middleware every one can see the uploaded files, when naigater to the corresponding url
// Makes files accessible via URLs
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use('/api/v3/app', eventRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Server Running",
        port: PORT,
        timestamp: new Date().toISOString()

    })
})


async function StartServer() {
    try {
        await db.connect();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })

    } catch (error) {

        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}
StartServer();








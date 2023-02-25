// import dependencies 
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// welcome message
console.log("REST API for Social Gamer app running!!");

// connection to DB
connection();

// building node server
const app = express();
const PORT = 3900;

// setup cors
app.use(cors());

// converting body data into JSON object
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

// configuration of the routes
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

// test route
app.get("/ruta-prueba", (req, res) => {
    
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Erick",
            "web": "erickdallas30@gmail.com"
        }
    );

})

// server  listening HTTP requests
app.listen(PORT, () => {
    console.log("Server running on PORT: ", PORT);
});
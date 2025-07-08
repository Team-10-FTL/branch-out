import app from "../models/app"
const cors = require("cors")
require("dotenv").config();

const authRoutes = require("../routes/authRoute");
const protectedRoutes = require("../routes/protected");

app.use("/auth", authRoutes); 
app.use("/api", protectedRoutes);  


app.use(cors())
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  try {
    res.send("Hello World");
  } catch (error) {
    console.log(error.message);
  }
});



app.listen(PORT, () => {
  try {
    console.log(`Server succesfully running on ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});

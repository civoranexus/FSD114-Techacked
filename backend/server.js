const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = 5000;

// connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});

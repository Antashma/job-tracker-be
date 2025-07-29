const express = require("express");
require("express-async-errors");
const dotenv = require('dotenv');
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./db/connect");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");


const app = express();

dotenv.config();
require("./config/passport")(passport);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));



//session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
     mongoUrl: process.env.MONGODB_URI
  })
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// STATIC FOLDER
app.use(express.static("./public"));

//ROUTES
const userRouter = require('./api/routes/user-routes');
const jobsRouter = require("./api/routes/jobs-routes");
const googAuthRouter = require("./api/routes/googAuth-routes");
const geminiRouter = require("./api/routes/gemini-route");

//MIDDLEWARE
const authenticateUser = require("./api/middleware/authentication");
const errorHandlerMiddleware = require("./api/middleware/error-handler");
const notFoundMiddleware = require("./api/middleware/not-found");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100
}))


app.get("/", (req, res) => {
    res.send("Job Tracker App");
})

app.use('/api/v1/user', userRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/gauth', googAuthRouter);
app.use("/api/v1/gemini", geminiRouter);

//ERROR HANDLER
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware)

async function start(){
  const port = process.env.PORT || 9000;

  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    });
  } catch (error) {
    console.log(error)
  }
}

start();
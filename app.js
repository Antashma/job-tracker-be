const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const dotenv = require('dotenv');
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");


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
const userRouter = require('./routes/user-routes');
const jobsRouter = require("./routes/jobs-routes");
const googAuthRouter = require("./routes/googAuth-routes");

const errorHandlerMiddleware = require("./middleware/error-handler")

// app.options('*',function(req,res,next){
//     res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", ['X-Requested-With','content-type','credentials']);
//     res.header('Access-Control-Allow-Methods', 'GET,POST');
//     res.status(200);
//     next()
//   })

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Job Tracker App");
})

app.use('/api/v1/user', userRouter);
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/gauth', googAuthRouter);

app.use(errorHandlerMiddleware);


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
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express         = require("express");
const session         = require("express-session");
const api             = require("axios");
const flash           = require("connect-flash"); // Error response
const ejsMate         = require("ejs-mate");
const passport        = require("passport");
const LocalStrategy   = require("passport-local");
const helmet          = require("helmet");
const ValidationError = require("./utilities/ValidationError");
const moment          = require("moment");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const homedir         = require("os").homedir();
// Middleware
const csrf            = require("csurf"); // Request spoofing protection
const bodyParser      = require("body-parser");
const cookieParser    = require("cookie-parser");
//
const path            = require("path");
const PGStore         = require("pg");
const methodOverride  = require("method-override"); // HTTP style requests
var momentRange       = require('moment-range');


const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
momentRange.extendMoment(moment);



//############################################### Database Connection ###############################################//
// PostgreSQL
const dev_dbConfig = {
	host    : "db",
	port    : 5432,
	database: process.env.POSTGRES_DB,
	user    : process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
};
const isProduction = process.env.NODE_ENV === "production";
const dbConfig     = isProduction ? process.env.DATABASE_URL : dev_dbConfig;
if (isProduction) {
	PGStore.defaults.ssl = {rejectUnauthorized: false};
}



//############################################### Middlewares ###############################################//
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // Requests automatically parsed as JSON
app.use(methodOverride("_method"));
// app.use(cookieParser());
// app.use(csrf({ cookie: true })); // Set and automatically check csrf cookies
app.use(flash());
app.use(helmet());

// Main routes and schemes
//const User           = require('./models/user');
const {AthleteList, numCheckinsToday, filteredAthletes} = require("./routes/athleteRoutes");
const {AuthRouter}                                      = require("./routes/authRoutes");
const {getNotes, postNote, postNotes}                   = require("./routes/noteRoutes");
const {checkInReport}                                   = require("./control/analyticControl");
//const userRouter      = require('./routes/users');
//const messagingRouter = require('./routes/messaging');
//const dashboardRouter = require('./routes/dashboard');
//const menuRouter      = require('./routes/menu');
//const analyticsRouter = require('./routes/analytics');

// Grant each visitor a unique session
const sessionConfiguration = {
	secret           : "BigOlSecretSession",
	resave           : true,
	saveUninitialized: true,
	cookie           : {
		expires  : Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge   : 1000 * 60 * 60 * 24 * 7,
		httpsOnly: true,
	},
};
app.use(session(sessionConfiguration));
app.use(flash()); // Special area of the session used for storing messages. Used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.


app.use((req, res, next) => {
	res.locals.error   = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use((req, res, next) => {
	if (req.session.user) {
		app.locals.logged = true;
		app.locals.roles  = req.session.user.roles;
	}
	else {
		app.locals.logged = false;
		app.locals.roles  = null;
	}
	next();
});

// Apply randomly generated secure token to every request
// Verifying request is authentic

// app.all("*", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next(); // Continue path to login
// });



//############################################### Error Response ###############################################//
//Apply 404 response for nonexistent page request
//app.all("*", (req, res, next) => {
//    next(new ValidationError("Page not found.", 404));
//});

// Apply 500 response code (Internal Server Error)
//app.use((err, res) => {
//    const {stat = 500} = err;
//    if (err.message != null) {
//        err.message = "Oops! Something went wrong!";
//    }
//    res.status((stat).render("Error:", {err}));
//});



//############################################### GET Routes ###############################################//

let filteredAthletesArr = [];
let selectedTeam        = "";


app.get("/login", (req, res) => {
	console.log("signin() called, login loading...");
	res.render("pages/login");
});


app.get("/profile", (req, res) => {
	console.log("getProfile() called, profile loading...");
	res.render("user/profile");
});


app.get("/notes", (req, res) => {
	let team = req.query.sport;
	console.log(team);
	if (team) {
		selectedTeam = team;
		getNotes(team).then(function (notes) {
			let teamNotes = notes.val().teamNotes; //.split('\n');
			//console.log(teamNotes);
			res.render("pages/notes", {teamList: teamNotes});
		});
	}
	else {
		res.render("pages/notes", {teamList: null});
	}
});


app.get("/", (req, res) => {
	res.render("pages/splash");
	console.log("Current Path: splash screen");
});


app.get("/dashboard", (req, res) => {
	console.log("Dashboard called, dashboard loading...");
	console.log("AthleteRoute() called, dashboard loading...");

	AthleteList().then(async function (snapshot) {
		console.log("AthleteList() called, gathering athlete lists...");
		const date  = new Date;
		const start = moment();
		const end   = moment().subtract(7, 'days');
		const range = moment().range(start, end);
		console.log(range);
		let time     = date.toLocaleTimeString('en-US');
		let athletes = snapshot.val();
		let total    = 0;
		// let report      = checkInReport();
		let athleteList = [];
		let count       = 10;
		for (const property in athletes) {
			console.log(`Range: ${range}`);
			if (moment(athletes[property].date).isBetween(start, end)) {
				if (count > 0) {
					athletes[property].date = moment(athletes[property].date).format(
						"MM/DD/YYYY"
					);
					athleteList.push(athletes[property]);
					count--;
				}

				total++;
			}
			/*else {
				break;
			}*/
		}
		res.render("pages/dashboard", {
			items     : athleteList,
			totalCount: total,
			timeUpdate: time
		});
	});
	//res.render("pages/dashboard", {items: ""});
});


app.get("/dashboard/:id", (req, res) => {
	console.log("Dashboard called, dashboard loading...");
	AthleteList().then(function (snapshot) {
		console.log("AthleteList() called, gathering athlete lists...");
		let athletes        = snapshot.val();
		let athleteListByID = [];
		for (const property in athletes) {
			if (athletes[property].identikey === id) {
				athletes[property].date = moment(athletes[property].date).format("MM/DD/YYYY");
				athleteListByID.push(athletes[property]);
			}
		}
		res.render("pages/dashboard", {items: athleteListByID});
	});
});


app.get("/about", (req, res) => {
	res.render("pages/about");
});


app.get("/downloader", (req, res) => {
	res.render("pages/downloader", {items: ""});
});


app.get("/downloader/filter", async (req, res) => {
	filteredAthletesArr = [];
	let team            = req.query.sport;
	let startDate       = req.query.startDate;
	let endDate         = req.query.endDate;

	filteredAthletesArr = await filteredAthletes(team, startDate, endDate);

	res.render("pages/downloader", {items: filteredAthletesArr});
});


app.get("/downloader/download", (req, res) => {
	const csvWriter = createCsvWriter({
		path  : `${homedir}/Downloads/athletes.csv`,
		header: [
			{id: "appVersion", title: "App Version"},
			{id: "date", title: "Date"},
			{id: "id", title: "Document ID"},
			{id: "identikey", title: "IdentiKey"},
			{id: "name", title: "Athlete Name"},
			{id: "pickupNames", title: "Pickup Names"},
			{id: "smartCheckIn", title: "Smart Check-In"},
			{id: "sport", title: "Sport"},
			{id: "userID", title: "User ID"},
		],
	});

	csvWriter.writeRecords(filteredAthletesArr).then(() => {
		console.log("...Done");
		res.render("pages/downloader", {
			items: filteredAthletesArr,
		});
	});
});



//############################################### POST Routes ###############################################//
// Search Route
app.post("/search", function (req, res) {});


app.post("/notes", (req, res) => {
	console.log(req);
	//   console.log(req.query.notesText);
	let mes = req.body.notesText;
	postNotes(selectedTeam, mes).then(function () {
		res.render("pages/notes", {teamList: null});
	});
});


// Login
//app.post("/login", passport.authenticate("local", {
//    successRedirect: "/profile",
//    failureRedirect: "user/login"
//}), function (req, res) {
//
//});


// User registration
//app.post("/register", (req, res) => {
//    User.register(new User({
//        username: req.body.username,
//    }), req.body.password, function (err, user) {
//        if (err) {
//            console.log(err);
//            res.render('user/register.ejs');
//        }
//        passport.authenticate("local")(req, res, function () {
//            console.log("Following User has been registerd");
//            console.log(user)
//            res.redirect("/");
//        })
//    })
//});


//app.use('/user', userRoutes);
//app.use('athletes', athleteRoutes);
//app.use('/', authRoutes);



// Run on port 3080
const port = process.env.PORT || 3080;
app.listen(port, (err) => {
	// Under error circumstances log error.
	if (err) {
		console.log(err);
		/*setTimeout(() => {
		 console.log(`App refreshed due to crash: http://localhost:${port}`);
		 app.refresh("/");
		 }, 100);*/
	}
	console.log(`http://localhost:${port}`);
});

// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

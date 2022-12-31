import moment from "moment";



const express     = require("express");
const router      = express.Router();
const {catchSync} = require("../utilities/catchAsync");
const {fireDB}    = require("../../db/initFirebase");


//
let athleteRef        = fireDB.ref("checkins");
let athleteRef_name   = fireDB.ref("checkins/name");
const validateAthlete = (req, res, next) => {};

//
//const AthleteRoute = async () => {
//    let checkedArray = [];
//    //fireDB.ref('checkins').on("value", (sanpshot) => {
//    fireDB.ref('checkins').once("value").then(function (snapshot) {
//        snapshot.forEach(function (childSnapshot) {
//            // key will be the first time
//            var key       = childSnapshot.key;
//            // childData will be the actual contents of the child
//            var childData = childSnapshot.val();
//            console.log(childData);
//            checkedArray.push(childData);
//        });
//    });
//    return checkedArray;
//
//}

export const AthleteList = () => {
	return fireDB.ref("checkins").once("value"); // returns a promise to be used in app.js so we dont have to send
};

export const filteredAthletes = (sport, startDate, endDate) => {
	let data  = [];
	let start = new Date(startDate);
	// set start time to 00:00:00 in local time
	start.setHours(0, 0, 0, 0);
	let end = new Date(endDate);
	//set time of end to 23:59:59
	end.setHours(23, 59, 59, 999);
	// console.log(start.getTime());
	console.log(start);
	console.log(end);

	return fireDB
		.ref("checkins")
		.once("value")
		.then((snap) => {
			snap.forEach((childSnap) => {
				var childData = childSnap.val();

				if (
					childData.sport === sport &&
					childData.date * 1000 >= start.getTime() &&
					childData.date * 1000 <= end.getTime()
				) {
					childData.date = moment(childData.date * 1000).format("MM/DD/YYYY");
					data.push(childData);
				}
			});
			return data;
		});
};

export const numCheckinsToday = () => {
	//get the number of checkins that occured today
	let numCheckins = 0;

	fireDB
		.ref("checkins")
		.once("value", snapshot => {
			snapshot.forEach((childSnapshot) => {
				numCheckins = numCheckins + 1;
			});
		});
	return numCheckins;
};

//router.get("/", catchSync(async (req, res) => {
//    //const cuAthletes = await
//}))

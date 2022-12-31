const express  = require("express");
const router   = express.Router();
const {fireDB} = require('../../db/initFirebase');



class Athlete {
	constructor(identikey, appID, name, timestamp, sport, pickupNames, checkIn) {
		this.identikey   = identikey;
		this.appID       = appID;
		this.athleteName = name;
		this.checkinTime = timestamp;
		this.sport       = sport;
		this.checkedIn   = checkIn;
	}


	static getAthleteByID(id) {
		return fireDB.collections("checkins").where("identikey", "==", id).get();
	}


	static getAthleteByName(str) {
		return fireDB.collections("checkins").where("name", "==", str).get();
	}


	convertTime() {
		// if (this.checkinTime)
	}


}


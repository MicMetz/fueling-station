const express     = require("express");
const router      = express.Router();
const {catchSync} = require("../utilities/catchAsync");
const {fireDB}    = require("../../db/initFirebase");



//
export const getNotes = (team) => {
	if (team) {
		return fireDB.ref("nutritionLink/teams/" + team).once("value"); //return promise to work with in app.js.
	}
	else {
		return null;
	}
};


//
export const postNotes = async (team, text) => {
	let ref = fireDB.ref("nutritionLink/teams/" + team);
	await ref.set({
		teamNotes: text,
	});
};

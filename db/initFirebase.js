const admin = require("firebase-admin");
import {initializeApp} from 'firebase/app';
import {getAnalytics}  from "firebase/analytics";
import "firebase/analytics";
import 'firebase/database';
import 'firebase/auth';
// const {BetaAnalyticsDataClient} = require('@google-analytics/data');




const serviceAccount = require("../env/fuelingstationtestproject.json");
let fireDB;
let auth;
let fireApp;
let analyticsDataClient;


const initFirebase = async () => {
	if (!admin.apps.length) {
		console.log("Starting Firebase connection...");
		admin.initializeApp({
			credential : admin.credential.cert(serviceAccount),
			databaseURL: "https://fuelingstationtestproject-default-rtdb.firebaseio.com"
		});
		if (admin.apps.length) {
			console.log("Firebase connection made...");
		}
	}
	fireDB              = admin.database();
	auth                = admin.auth();
	fireApp             = admin.app;
	// analyticsDataClient = getAnalytics(fireApp);

	// const fApp               = initializeApp(serviceAccount)
	// fireApp               = admin.app;
	// const analyticsDataClient = getAnalytics(admin.app);

	if (analyticsDataClient) {
		console.log("Analytics Client: running...");
	}
	else {
		console.log("Analytics Client: down...");
	}
};
initFirebase();




export const signIn = async (email, password) => {
	await initFirebase();
	return auth().signInWithEmailAndPassword(email, password);
};


export const signOut = async () => {
	await initFirebase();
	return auth().signOut();
};


export const onAuthStateChanged = async (callback) => {
	await initFirebase();
	return auth().onAuthStateChanged((user) => callback(user));
};


export const updatePost = async (post) => {
	await initFirebase();
	return fireDB.ref('/posts/${post}').set(post);
};


export const deletePost = async (slug) => {
	await initFirebase();
	return fireDB.ref('/posts/${slug}').set(null);
};



export {initFirebase, fireDB};



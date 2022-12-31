const {fireDB}    = require('../../db/initFirebase');



/*
* https://soshace.com/implementing-role-based-access-control-in-a-node-js-application/
*/

class UserModal {
	constructor(idKey, email, name, roles) {
		this.idKey = idKey;
		this.email = email;
		this.name = name;
		this.roles = roles;
	}

	static authVerifyToken() {

	}

	static getRoles(roles) {
		// return
	}

	static getDatabaseRecords(info) {
		// return
	}

	static getAthleteRecords(athleteID) {
		return fireDB.collections("athletes").doc(athleteID).get();
	}
}


module.exports = UserModal;
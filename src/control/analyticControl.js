// import {analyticsDataClient} from "../../db/initFirebase";



//
export const checkInReport = async (id) => {
	const [response] = await analyticsDataClient.runReport({
		property  : `properties/${id}`,
		dateRanges: [{startDate: "7daysAgo", endDate: "today"}],
		dimensions: [{name: "date"}],
		metrics   : [{name: "activeUsers"}],
		orderBys  : [{dimension: {orderType: "ALPHANUMERIC", dimensionName: "date"}}]
	});

	return response;
};


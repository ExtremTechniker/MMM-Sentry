const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
module.exports = NodeHelper.create({
	start: function() {

		console.log(this.name + " Started Node_Helper");
	},
	
	
	socketNotificationReceived: async function(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + JSON.stringify(payload));
		switch(notification) {
			case 'LOAD_ISSUES':
				let issueData = await (await this.createRequest(payload.sentry_base_url, payload.token, payload.organisation_slug, payload.project_slug, 'issues/')).json();
				this.sendSocketNotification("LOADED_ISSUES", {project_slug: payload.project_slug, data: issueData});
			break;
		}
	},
	createRequest: async function(sentry_base_url, token,  organisation_slug, project_slug, path) {
  	const url = `${sentry_base_url}/api/0/projects/${organisation_slug}/${project_slug}/${path === undefined ? '' : path}`;
    const options = {
    	method: "GET",
      headers: {
				Authorization: 'Bearer ' + token,
			},
    };
		const data = await fetch(url, options);
		//console.log(data);
    return data
   },
});

/* Magic Mirror
 * Module: Sentry
 *
 * By ExtremTechniker
 */
Module.register("MMM-Sentry", {
    defaults: {
        sentry_base_url: "https://sentry.io",
        updateInterval: 30,
        token: "",
        projects: []
    },
    getTranslations: () => false,

    start: function () {
        Log.info("Starting module: " + this.name);

        this.loaded = false;
        this.sentryData = {};
        this.scheduleUpdate();
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            return wrapper;
        }

        const flex = document.createElement("div");
        flex.style.display = "flex";
        flex.style.flexDirection = "row";
        flex.style.columnGap = "20px";
        for ([project_slug, data] of Object.entries(this.sentryData)) {
            let displayName = this.config.projects.filter((x) => x.project_slug == project_slug)[0].displayName;

						if(displayName === undefined || displayName === '') {
							displayName = project_slug;
						}

            const elem = document.createElement("div");

            const name = document.createElement("p");
            name.innerText = displayName;
            name.style.fontWeight = "bold";

            elem.append(name);

            const issues = document.createElement("p");
            issues.innerText = "Unresolved";
            const issueCount = document.createElement("span");
            issueCount.style.display = "block";
            issueCount.style.fontSize = "24pt";
            issueCount.innerText = data.length;
            issues.append(issueCount);

            elem.append(issues);

            flex.append(elem);
        }
        wrapper.append(flex);

        return wrapper;
    },

    updateUI: function () {
        var self = this;
        try {
            self.fetchSentryRequest();
        } catch (exception) {
            Log.error(self.name + ":" + exception.toString());
        }
    },

    fetchSentryRequest: function () {
        for (project of this.config.projects) {
            this.sendSocketNotification("LOAD_ISSUES", {
                sentry_base_url: this.config.sentry_base_url,
                token: this.config.token,
                organization_slug: project.organization_slug,
                project_slug: project.project_slug
            });
        }
    },

    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case "LOADED_ISSUES":
                let obj = payload;

                this.sentryData[obj.project_slug] = obj.data;
                break;
        }

        if (Object.entries(this.sentryData).length !== 0) {
            this.loaded = true;
        }
        this.updateDom();
    },

    scheduleUpdate: function (delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay != "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(() => {
            self.updateUI();
        }, this.config.updateInterval * 1000);
        self.updateUI();
    }
});

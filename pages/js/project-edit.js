var datepicker;
var projectID = -1;
var projectdata = {};

function projectEditInit() {

    if (idc("projid")) {
        projectID = idc("projid").innerHTML;
    }

    //load timeline
    loadElement("timeline", function () {
        var tmLoaded = setInterval(function () {
            if (idc("timeline").getAttribute("loaded")) {

                clearInterval(tmLoaded)
                var projSelect = idc("projectListSelect");
                for (i = 0; i < projSelect.children.length; i++) {
                    if (projSelect.children[i].getAttribute("value") == projectID) {
                        projSelect.selectedIndex = i;
                        projectSelected = projSelect.value;
                        loadTimeline();
                    }
                }
                if (projectID == "-1") {
                    var tl = new TimelineMax();
                    tl
                        .fromTo(idc("timeline"), 0.6, {
                            opacity: 1
                        }, {
                            opacity: 0.2,
                            ease: Circ.easeOut
                        })
                        .fromTo(idc("projectSettings"), 0.6, {
                            opacity: 1
                        }, {
                            opacity: 0.2,
                            ease: Circ.easeOut
                        }, "-=0.4");
                    idc("projectDeats").setAttribute("create", "true");
                }
            }
        }, 400);
    });
    //correct and setup project page
    datepicker = new Datepickk();
    datepicker.title = 'Select a completion date for your project';

    var dateP = idc("datepicker");
    if (dateP.value != "Invalid date" && dateP.value != "") {
        var selectedDate = new Date(dateP.value);
        datepicker.selectDate(selectedDate);
        dateP.value = moment(selectedDate).format("DD/MM/YYYY");
        datepicker.setDate = selectedDate;
    }
    if (idc("projectdata"))
        projectdata = JSON.parse(idc("projectdata").innerHTML);

    datepicker.onSelect = function (checked) {
        var state = (checked) ? 'selected' : 'unselected';
        dateP.setAttribute("dbdate", moment(new Date(this.toLocaleDateString())).format("YYYY-MM-DD"));
        dateP.value = moment(new Date(this.toLocaleDateString())).format("DD/MM/YYYY");
        projectdata.date = dateP.getAttribute("dbdate");
        idc("projectdata").innerHTML = JSON.stringify(projectdata);
        updateProjectToServer();
        datepicker.hide();
    };


    if (projectID != -1) {
        var fixActiveE = setInterval(function () {
            if (tData) {
                for (i = 0; i < tData["events"].length; i++)(function (i) {
                    if (tData["events"][i].projectlist == projectID) {
                        console.log("is true");
                        for (a = 0; a < idc("eventOptions").children.length; a++) {

                            if (tData["events"][i].type == idc("eventOptions").children[a].getElementsByTagName("span")[0].innerHTML + " - timeline") {
                                idc("eventOptions").children[a].setAttribute("active", "true");
                            }
                        }
                    }
                })(i);
                clearInterval(fixActiveE);
            }
        }, 500);
    }
}
// project updates
function projectTitleChange() {

    var saveTimeout = null;
    idc("projectDeats").children[0].oninput = function () {
        projectdata.title = idc("projectDeats").children[0].value;
        idc("projectdata").innerHTML = JSON.stringify(projectdata);

        clearTimeout(saveTimeout);
        if (idc("projectDeats").hasAttribute("create")) {
            idc("projectDeats").removeAttribute("create");
        }
        // Make a new timeout set to go off in 800ms
        saveTimeout = setTimeout(function () {
            updateProjectToServer();
            idc("projectDeats").setAttribute("hideafter", "true");
        }, 300);
    }
}

projectEditInit();

function editDate() {
    datepicker.show();
}
var retryAttempts = 0;

function updateProjectToServer() {
    retryAttempts++;
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/project",
        function (response) {
            console.log(response);
            var jsRes = JSON.parse(response);
            if (jsRes.response === "success") {
                retryAttempts = 0;
                if (jsRes.projid) {
                    timelineDataGet();
                    successMessage("Project created");
                    projectID = jsRes.projid;

                    var createOption = document.createElement("option");
                    createOption.value = projectID;
                    createOption.innerHTML = idc("projectDeats").children[0].value + " " + idc("datepicker").value;
                    idc("projectListSelect").appendChild(createOption);

                } else
                    successMessage("Project saved");

                for (i = 0; i < idc("projectListSelect").children.length; i++) {
                    if (projectID == idc("projectListSelect").children[i].value) {
                        idc("projectListSelect").children[i].innerHTML = idc("projectDeats").children[0].value;
                    }
                }

                var tl = new TimelineMax();
                tl.to(idc("timeline"), 0.6, {
                        opacity: 1
                    })
                    .to(idc("projectSettings"), 0.6, {
                        opacity: 1
                    }, "-=0.4");
            } else {
                errorMessage("Could not update project - please check your internet connection");
            }
        }, {
            id: projectID,
            type: "project",
            valjs: JSON.stringify(projectdata)
        });
}

function toggleEventSettings(el) {
    var evOpts = idc("eventOptions");
    if (el.hasAttribute("open")) {
        el.removeAttribute("open");
        evOpts.style.display = "none";
    } else {
        el.setAttribute("open", "true");
        var tl = new TimelineMax();
        tl.set(evOpts, {
                x: -(elDimensions(idc("projectDate"), "All").x + 12),
                display: "block"
            })
            .staggerFromTo(evOpts.children, 0.2, {
                transformOrigin: "100% 0%",
                opacity: 0,
                x: 30,
                scale: 0
            }, {
                scale: 1,
                opacity: 1,
                x: 0,
                ease: Circ.easeOut
            }, 0.05);
    }
}

// Module 
function activateTimelineComp(el, eventType) {
    if (tData) {

        for (i = 0; i < tData["events"].length; i++)(function (i) {
            if (tData["events"][i].projectlist == projectID && tData["events"][i].type == eventType + " - timeline") {
                if (tData["events"][i].details.hasOwnProperty("active"))
                    tData["events"][i].details.active = !tData["events"][i].details.active;
                else
                    tData["events"][i].details.active = true;

                el.setAttribute("active", tData["events"][i].details.active);
            }
        })(i);
        loadTimeline();
        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/project-events",
            function (response) {
                var jsRes = JSON.parse(response);
                if (jsRes.response === "success") {
                    retryAttempts = 0;
                    if (jsRes.projid)
                        projectID = jsRes.projid;
                } else {
                    errorMessage("Could not edit event");

                    for (i = 0; i < tData["events"].length; i++)(function (i) {
                        if (tData["events"][i].projectlist == projectID && tData["events"][i].type == eventType + " - timeline")
                            tData["events"][i].details.active = (tData["events"][i].details.active == 'true');
                    })(i);
                    loadTimeline();
                }
            }, {
                projid: projectID,
                type: eventType
            });
    }
}

function projectSettingsLoad() {
    idc("projectSettingsOverlay").appendChild(idc("projectDate"));
    idc("projectSettingsOverlay").appendChild(idc("eventSettings"));
    idc("projectSettingsOverlay").appendChild(idc("eventOptions"));
    idc("eventSettings").onclick = function () {

    }
    idc("eventOptions").style.display = "block";
}

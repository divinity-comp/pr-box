function addContactListMenu() {
    openOverlay(idc("listInitial"));
    idc("listInitial").getElementsByTagName("h2")[0].innerHTML = "Add Contacts";
    idc("mediaaddtwo").getElementsByTagName("h3")[0].style.display = "none";
    idc("mediaaddone").style.display = "none";
    idc("mediaaddtwo").style.display = "block";
}

function toggleEvent(ele, num) {
    if (num == 0) {
        shiftPages('listInitial', 'wooPitch')
    } else if (num == 1) {
        shiftPages('listInitial', 'generalList');
        openOverlay("csvImport");
    } else if (num == 2) {
        shiftPages('listInitial', 'generalList');
        openOverlay("manualAdd");
    }
}

function initialMediaList() {
    var ifacebookSearch = document.getElementsByTagName("i");

    for (i = 0; i < ifacebookSearch.length; i++) {
        if (ifacebookSearch[i].className.includes("facebook")) {
            ifacebookSearch[i].className = "fa fa-facebook";
        }
    }
}
initialMediaList();



var skipSearch = 0;

function wooSearchInit() {
    shiftPages('wooPitchSearchForm', 'wooSearchResults');
    skipSearch = 0;
    wooPitchSearch();
}

function wooPitchSearch(num) {
    if (num)
        skipSearch += num;
    var wooPitchSearchForm = idc("wooPitchSearchForm").getElementsByTagName("input");
    var wooJs = {
        skip: skipSearch,
        addurl: "/SearchProfiles/ExternalSearchProfiles"
    };
    var woopitchGenString = "";
    for (i = 0; i < wooPitchSearchForm.length; i++) {
        if (wooPitchSearchForm[i].value)
            woopitchGenString += "/$" + wooPitchSearchForm[i].name + "=" + wooPitchSearchForm[i].value.toLowerCase();
    }

    loading(1);
    wooJs.vars = woopitchGenString;
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/woopitch/woo-pitch-data-get",
        function (response) {

            console.log(response);
            var responseJson = JSON.parse(response);

            responseJson = responseJson["details"];
            console.log(responseJson);
            if (responseJson.items.length == 0) {
                loading(0);
                idc("wooPitch").getElementsByClassName("more")[0].innerHTML = "No more contacts";
            } else {
                loading(0);
                for (i = 0; i < responseJson.items.length; i++)(function (i) {
                    var clondSI = idc("sample-woo-item-search").cloneNode(true);
                    clondSI.id = responseJson.items[i].id;
                    clondSI.className = "checkedBox";
                    clondSI.setAttribute("findid", responseJson.items[i].id);
                    clondSI.children[1].children[0].href = responseJson.items[i].linkedInUrl;
                    clondSI.children[1].children[0].innerHTML = responseJson.items[i].name;
                    clondSI.children[1].innerHTML += "<br>" + responseJson.items[i].description;
                    clondSI.children[2].children[0].href = responseJson.items[i].googleSearchLink;
                    if (responseJson.items[i].imageUrl != null)
                        clondSI.getElementsByTagName("img")[0].src = responseJson.items[i].imageUrl;
                    idc("listToAddWoo").appendChild(clondSI);
                })(i);
            }

        }, wooJs);
}


function reloadcontacts() {
    idc("wooPitch").getElementsByClassName("more")[0].innerHTML = "More";
}

function fulltoggleActive(ele) {
    var icheckboxsquare = document.getElementsByClassName(ele.className);
    for (i = 0; i < icheckboxsquare.length; i++) {
        icheckboxsquare[i].setAttribute("active", ele.getAttribute("active"));
    }
}

function toggleActive(ele) {
    if (ele.getAttribute("active") == "true") {
        ele.setAttribute("active", "false");
    } else {
        ele.setAttribute("active", "true");
    }
}


var currentListJson;

function genList() {
    var icheckboxS = document.getElementsByClassName("icheckbox");
    var hasSelected = false;
    for (i = 0; i < icheckboxS.length; i++) {
        if (icheckboxS[i].getAttribute("active") == "true") {
            hasSelected = true;
        }
    }
    if (!hasSelected) {
        errorMessage("No items to add to the list");
    } else {

        var listMade = {
            "mailing": []
        }
        var fullML = idc("listToAddWoo").getElementsByTagName("tr");
        for (i = 1; i < fullML.length; i++) {

            var activeSet = fullML[i].getElementsByClassName("icheckbox")[0].getAttribute("active");
            if (activeSet == "true") {

                var jsonMl = {};
                for (a = 1; a < fullML[i].children.length; a++) {
                    if (a == 2) {
                        jsonMl[a] = replaceAll(fullML[i].children[a].children[0].innerHTML, '&', 'and');
                    } else if (a == 1) {
                        jsonMl[a] = replaceAll(fullML[i].children[a].children[0].src, '&', 'and');
                    } else if (a == 3) {
                        jsonMl[a] = replaceAll(fullML[i].children[a].children[0].href, '&', 'and');
                    } else
                        jsonMl[a] = replaceAll(fullML[i].children[a].innerHTML, '&', 'and');
                }
                jsonMl["wooid"] = fullML[i].getAttribute("findid");
                listMade.mailing.push(jsonMl);

                var csvEle = document.createElement("tr");
                csvEle.setAttribute("wooid", fullML[i].getAttribute("findid"));
                csvEle.setAttribute("stage", "initial");
                document.getElementById("full-media-list").appendChild(csvEle);

                for (b = 0; b < 11; b++) {

                    var csvEleP3 = document.createElement("td");
                    csvEleP3.setAttribute("contenteditable", "true");
                    csvEleP3.innerHTML = "";
                    if (b == 0) {
                        csvEleP3.innerHTML = fullML[i].children[b + 1].innerHTML;
                    }
                    if (b == 1) {
                        var firstName = fullML[i].children[b + 1].children[0].innerHTML.split(' ').slice(0, -1).join(' ');
                        csvEleP3.innerHTML = firstName;
                    }
                    if (b == 2) {
                        var lastName = fullML[i].children[b].children[0].innerHTML.split(' ').slice(-1).join(' ');
                        csvEleP3.innerHTML = lastName;
                    }
                    csvEle.appendChild(csvEleP3);
                }
                var csvEleB = document.createElement("td");
                csvEleB.innerHTML = "Remove";
                csvEle.appendChild(csvEleB);
                csvEleB.onclick = function () {
                    document.getElementById("full-media-list").removeChild(csvEle);
                }
            }
        }
        var listMadeSt = JSON.stringify(listMade);
        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/media-list/add-media-contacts",
            function (response) {
                console.log(response);
                if (response.indexOf('success') > -1) {
                    lastSearchId = JSON.parse(response)["listid"];
                    saveList("Remind Later");
                } else {
                    errorMessage("adding to list failed");
                }

            }, {
                listname: idc("woopitchTitle").innerHTML,
                userstoadd: listMadeSt
            });
    }
}


function saveList(subtle) {

    var pressReleaseForm = idc("projectDeats").children;

    if (pressReleaseForm[0].value != "") {
        var validJsonSend = "{";
        for (i = 0; i < pressReleaseForm.length; i++) {
            if (i != 0) {
                validJsonSend += ",";
            }
            validJsonSend += '"' + pressReleaseForm[i].getAttribute("name") + '":"' + String(pressReleaseForm[i].value).replaceAll("&", "*/").replaceAll('"', "''").replaceAll('\\', "/") + '"';
        }
        validJsonSend += "}";
        var projectDeats = "{";
        projectDeats += '"' + pressReleaseForm[0].getAttribute("name") + '":"' + String(pressReleaseForm[0].value).replaceAll("&", "*/").replaceAll('"', "''").replaceAll('\\', "/") + '",';
        projectDeats += '"listurl":"' + String(pressReleaseForm[0].value).replaceAll("&", "*/").replaceAll('"', "''") + '"}';
        var listMade = {
            "mailing": []
        }
        var fullML = idc("full-media-list").getElementsByTagName("tr");
        for (i = 1; i < fullML.length; i++) {
            var jsonMl = {};
            for (a = 0; a < fullML[i].children.length - 1; a++) {


                jsonMl[a] = replaceAll(fullML[i].children[a].innerHTML, '&', 'and');
            }
            if (fullML[i].getAttribute("wooid"))
                jsonMl["wooid"] = fullML[i].getAttribute("wooid");
            if (fullML[i].getAttribute("stage"))
                jsonMl["stage"] = fullML[i].getAttribute("stage");
            listMade.mailing.push(jsonMl);
        }
        var listiMainId = idc("listiMainId");
        var mediaJSend = {
            pd: projectDeats,
            vj: validJsonSend,
            list: listMadeSt,
            name: pressReleaseForm[0].value
        };

        if (listiMainId.innerHTML != "-2") {
            mediaJSend.id = listiMainId.innerHTML;
        }
        var listMadeSt = JSON.stringify(listMade);
        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/media-list/save-media-list.php",
            function (response) {
                console.log(response);
                if (response.indexOf('success') > -1) {
                    var newID = JSON.parse(response)["mediaid"];
                    if (lastSearchId != "") {
                        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/add-general-meta.php",
                            function (responsea) {
                                console.log("add general meta" + responsea);
                                switch (subtle) {
                                    case "no message":
                                        console.log("media list saved");
                                        break;
                                    case "Remind Later":
                                        successMessage("Media list saved");
                                        successMessage("Finding contacts");
                                        loadMainDashboard();
                                        break;
                                    default:
                                        successMessage("Media List Saved");
                                        break;
                                }
                            }, {
                                metatype: lastSearchId,
                                metavalue: newID
                            });
                    } else {
                        switch (subtle) {
                            case "no message":
                                console.log("media list saved");
                                break;
                            case "Remind Later":
                                successMessage("Media list saved");
                                successMessage("Finding contacts");
                                loadMainDashboard();
                                break;
                            default:
                                successMessage("Media List Saved");
                                break;
                        }
                    }

                    if (idc("listiMainId").innerHTML == "" || idc("listiMainId").innerHTML == "-2") {

                        idc("listiMainId").innerHTML = newID;
                    }
                } else {
                    errorMessage("Media List not saved please try again - if failure repeats please contact support " + response);
                }
            }, mediaJSend);
    } else {
        if (myVar === false)
            errorMessage("Please enter a title for the media list");
        else {
            clearInterval(myVar);
            myVar = false;
        }
    }
}

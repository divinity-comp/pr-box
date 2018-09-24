function mediaCentreInit() {
    var menuMedia = idc("menuMedia");
}
mediaCentreInit();

function openSubMed(num) {
    var selectedNum = ["../page/press_release", "image-list", "video-list", "document-list", "coverage-list", "company-info"];
    var menuMedia = document.getElementById("menuMedia");

    for (i = 0; i < menuMedia.children.length; i++) {
        if (i == num) {
            menuMedia.children[i].setAttribute("active", "true");
        } else {
            menuMedia.children[i].setAttribute("active", "false");
        }
    }
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/element/" + selectedNum[num],
        function (response) {
            if (response != "failed") {
                idc("itemsList").innerHTML = response;
                if (num == 0) {}
                if (num == 1) {} else if (num == 2) {
                    videoInitial();
                } else if (num == 3) {} else if (num == 4) {
                    coverageInitial();
                }
            } else {
                errorMessage("Could note be loaded");
            }
        }, "");
}
openSubMed(0);

function removeFile(ele) {
    var eleFind = ele.parentNode.parentNode.parentNode.parentNode;
    var nameFind = eleFind.getElementsByClassName("dz-filename")[0].children[0].innerHTML;
    findAndRemove(filesToAdd["doc"], "filename", nameFind);
    eleFind.parentNode.removeChild(eleFind);
}

function removeVideo(ele) {
    var eleFind = ele.parentNode.parentNode.parentNode.parentNode;
    var fnNAme = eleFind.getElementsByTagName("span")[0]
    findAndRemove(filesToAdd["videos"], "filename", fnNAme.innerHTML);
    eleFind.parentNode.removeChild(eleFind);
}


// VIDEO
function viewVideo(ele) {
    var iframeMarkup;
    if (ele.getAttribute("videotype") == "y") {

        iframeMarkup = '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
            ele.getAttribute("videourl") + '" frameborder="0" allowfullscreen></iframe>';
    } else if (ele.getAttribute("videotype") == "v") {

        iframeMarkup = '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
            ele.getAttribute("videourl") + '" frameborder="0" allowfullscreen></iframe>';
    } else {

        iframeMarkup = '<iframe width="560" height="315" src="' +
            ele.getAttribute("videourl") + '" frameborder="0" allowfullscreen></iframe>';
    }
    idc("videoOver").children[0].innerHTML = iframeMarkup;
    openOverlay("videoOver");
}

function newVideo() {
    openOverlay(idc("videoAddov"));
    idc("videoAddov").getElementsByTagName("input")[0].value = "";
    idc("videoAddov").getElementsByTagName("input")[1].value = "";
}

function editVideo(ele) {
    idc("videoAddov").getElementsByTagName("input")[0].value = ele.parentNode.parentNode.getElementsByClassName("title")[0].innerHTML;
    idc("videoAddov").getElementsByTagName("input")[1].value = ele.parentNode.parentNode.parentNode.parentNode.getAttribute("videourl");
    previousVideo = ele.parentNode.parentNode.parentNode.parentNode;
    openOverlay(idc("videoAddov"));

}
var videoJSON;

function videoInitial() {
    if (idc("videolinks")) {
        var videolinks = JSON.parse(idc("videolinks").innerHTML);
        videoJSON = videolinks;
        var itemsList = idc("itemsList");
        for (i = 0; i < videolinks["videos"].length; i++) {

            idc("videoSample").getElementsByTagName("figure")[0].innerHTML = '<iframe src="' + rendervideoURL(videolinks["videos"][i]["src"].replaceAll("/$", "&")) + '"><?/iframe>';
            idc("videoSample").setAttribute("videourl", videolinks["videos"][i]["src"].replaceAll("/$", "&"));
            idc("videoSample").getElementsByClassName("title")[0].innerHTML = videolinks["videos"][i]["title"].replaceAll("/$", "&");

            var videoClone = idc("videoSample").cloneNode(true);

            videoClone.id = "";
            videoClone.style.display = "block";
            idc("videoSample").parentNode.appendChild(videoClone);

        }

    }

}

function updateiframe(ele) {
    var videoLink = rendervideoURL(ele.value);

    idc("videoAddov").getElementsByTagName("iframe")[0].src = videoLink;
}

function rendervideoURL(vstr) {
    var videoLink = vstr;

    if (videoLink.includes("youtube") || videoLink.includes("youtu.be") && !videoLink.includes("youtube.com/embed")) {
        if (videoLink.includes("watch")) {
            videoLink = "https://www.youtube.com/embed/" + videoLink.split('=').pop().trim();
        } else {
            videoLink = "https://www.youtube.com/embed/" + videoLink.split('/').pop().trim();
        }
    } else if (videoLink.includes("vimeo") && !videoLink.includes("player.vimeo")) {
        videoLink = "https://player.vimeo.com/video/" + videoLink.split('/').pop().trim();
    }
    return videoLink;
}
var previousVideo = null;

function saveVideo() {
    var iframeUrl = idc("videoAddov").getElementsByTagName("iframe")[0].src;
    var inputone = idc("videoAddov").getElementsByClassName("details")[0].children[1].value;
    var inputtwo = idc("videoAddov").getElementsByClassName("details")[0].children[2].value;
    console.log(inputone + " " + inputtwo)
    if (inputone == "" && inputtwo == "") {
        alert("Please enter a video url");
    } else {
        if (previousVideo == null) {
            idc("videoSample").getElementsByTagName("figure")[0].innerHTML = '<iframe src="' + iframeUrl + '"><?/iframe>';
            idc("videoSample").setAttribute("videourl", inputtwo);
            idc("videoSample").getElementsByClassName("title")[0].innerHTML = inputone;

            var videoClone = idc("videoSample").cloneNode(true);

            videoClone.id = "";
            videoClone.style.display = "block";
            idc("videoSample").parentNode.appendChild(videoClone);
        } else {
            previousVideo.getElementsByTagName("figure").innerHTML = '<iframe src="' + iframeUrl + '"><?/iframe>';
            previousVideo.setAttribute("videourl", inputtwo);
            previousVideo.getElementsByClassName("title")[0].innerHTML = inputone;
        }
        idc("videoAddov").getElementsByTagName("iframe")[0].src = "";
        idc("videoAddov").getElementsByTagName("input")[0].value = "";
        idc("videoAddov").getElementsByTagName("input")[1].value = "";
        idc("videoAddov").getElementsByClassName("closeButton")[0].click();
        previousVideo = null;
        uploadVideosToServer();
    }
}

function deleteVideo(ele) {
    ele.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(ele.parentNode.parentNode.parentNode.parentNode);
    uploadVideosToServer();
}

function addVideo(ele) {
    var videoInputs = ele.parentNode.parentNode.parentNode.getElementsByTagName("input");
    var jsonToAdd = {
        "title": "",
        "src": "",
        "type": ""
    };
    if (videoJSON) {

        jsonToAdd["title"] = videoInputs[0].value;

        if (videoInputs[1].value.includes("youtube") || videoInputs[1].value.includes("youtu.be")) {
            if (videoInputs[1].value.includes("watch")) {
                jsonToAdd.src = videoInputs[1].value.split('=').pop().trim();
            } else {
                jsonToAdd.src = videoInputs[1].value.split('/').pop().trim();
            }
            jsonToAdd.type = "y";
        } else if (videoInputs[1].value.includes("vimeo")) {
            jsonToAdd.src = videoInputs[1].value.split('/').pop().trim();
            jsonToAdd.type = "v";
        } else {
            jsonToAdd.src = videoInputs[1].value;
            jsonToAdd.type = "0";
        }
        console.log(jsonToAdd);
    } else {
        videoJSON = {
            "videos": []
        }

        jsonToAdd["title"] = videoInputs[0].value;

        if (videoInputs[1].value.includes("youtube") || videoInputs[1].value.includes("youtu.be")) {
            if (videoInputs[1].value.includes("watch")) {
                jsonToAdd.src = videoInputs[1].value.lastIndexOf('=');
            } else {
                jsonToAdd.src = videoInputs[1].value.lastIndexOf('/');
            }
            jsonToAdd.type = "y";
        } else if (videoInputs[1].value.includes("vimeo")) {
            jsonToAdd.src = videoInputs[1].value.lastIndexOf('/');
            jsonToAdd.type = "v";
        } else {
            jsonToAdd.src = videoInputs[1].value;
            jsonToAdd.type = "0";
        }
        console.log(jsonToAdd);
    }
    videoJSON["videos"].push(jsonToAdd);
    uploadVideosToServer();
}

function uploadVideosToServer() {
    var videoJSONV = {
        "videos": []
    };

    var projectsV = idc("projects").getElementsByClassName("project");

    for (i = 0; i < projectsV.length; i++) {
        if (projectsV[i].id != "videoSample" && projectsV[i].id != "videoAdd") {
            var jsonToAdd = {
                "title": "",
                "src": "",
                "type": ""
            };
            if (projectsV[i].getElementsByClassName("title")[0]) {

                jsonToAdd.title = projectsV[i].getElementsByClassName("title")[0].innerHTML.replaceAll("&", "/$");
            }
            jsonToAdd.src = projectsV[i].getAttribute("videourl").replaceAll("&", "/$");
            if (jsonToAdd.src.includes("youtube") || jsonToAdd.src.includes("youtu.be") && !jsonToAdd.src.includes("youtube.com/embed")) {
                jsonToAdd.type = "y";
            } else if (jsonToAdd.src.includes("vimeo") && !jsonToAdd.src.includes("player.vimeo")) {
                jsonToAdd.type = "v";
            }
            videoJSONV["videos"].push(jsonToAdd);
        }
    }
    idc("videolinks").innerHTML = JSON.stringify(videoJSONV);
    var videoJSONVString = JSON.stringify(videoJSONV).replaceAll("&", "/$");
    console.log(videoJSONVString);
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/project",
        function (response) {
            console.log(response);
            if (response.indexOf('success') > -1) {
                successMessage("Video Saved");
            } else {
                errorMessage("Could not be saved");
            }
        }, {
            valjs: videoJSONVString,
            type: "video list"
        });
}

// COVERAGE 
function viewCoverage(ele) {
    window.open(ele.getAttribute("coverageurl"), "_blank");
}
var coverageJSON;

function coverageInitial() {
    if (idc("coverageEle")) {
        var coveragelinks = JSON.parse(idc("coverageEle").innerHTML);
        coverageJSON = coveragelinks;
        var itemsList = idc("itemsList");

        for (i = 0; i < coveragelinks["coverage"].length; i++) {

            idc("coverageSample").setAttribute("coverlink", coveragelinks["coverage"][i]["src"].replaceAll("/$", "&"));
            idc("coverageSample").getElementsByClassName("title")[0].innerHTML = coveragelinks["coverage"][i]["title"].replaceAll("/$", "&");

            var coverageSample = idc("coverageSample").cloneNode(true);

            coverageSample.id = "";
            coverageSample.style.display = "block";
            idc("coverageSample").parentNode.appendChild(coverageSample);

        }

    }
}

function openLink(ele) {
    window.open(ele.parentNode.parentNode.getAttribute("coverlink"), '_blank');
}
var previousCov = null;

function saveCoverage() {
    var inputone = idc("coverageAddov").getElementsByTagName("input")[0].value;
    var inputtwo = idc("coverageAddov").getElementsByTagName("input")[1].value;
    if (previousCov == null) {
        idc("coverageSample").setAttribute("coverlink", inputtwo);
        idc("coverageSample").getElementsByClassName("title")[0].innerHTML = inputone;

        var videoClone = idc("coverageSample").cloneNode(true);

        videoClone.id = "";
        videoClone.style.display = "block";
        idc("coverageSample").parentNode.appendChild(videoClone);
    } else {
        previousCov.setAttribute("coverlink", inputtwo);
        previousCov.getElementsByClassName("title")[0].innerHTML = inputone;
    }
    idc("coverageAddov").getElementsByClassName("closeButton")[0].click();
    previousCov = null;
    uploadcoverageToServer();
}

function editcoverage(ele) {
    idc("coverageAddov").getElementsByTagName("input")[0].value = ele.parentNode.parentNode.getElementsByClassName("title")[0].innerHTML;
    idc("coverageAddov").getElementsByTagName("input")[1].value = ele.parentNode.parentNode.parentNode.parentNode.getAttribute("coverlink");
    previousCov = ele.parentNode.parentNode.parentNode.parentNode;
    openOverlay("coverageAddov");
}

function deletecoverage(ele) {
    ele.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(ele.parentNode.parentNode.parentNode.parentNode);
    uploadcoverageToServer();
}

function addcoverage(ele) {
    openOverlay(idc("coverageAddov"));
    idc("coverageAddov").getElementsByTagName("input")[0].value = "";
    idc("coverageAddov").getElementsByTagName("input")[1].value = "";
}

function getUrlImage(ele) {
    getScreenFromUrl(ele.value, idc("coverageAddov").children[0].children[0]);
}

function uploadcoverageToServer() {
    var stJS = JSON.stringify(coverageJSON);

    var coverageJSONV = {
        "coverage": []
    };

    var projectsV = idc("projects").getElementsByClassName("project");

    for (i = 0; i < projectsV.length; i++) {
        if (projectsV[i].id != "coverageSample" && projectsV[i].id != "coverageAdd") {
            var jsonToAdd = {
                "title": "",
                "src": "",
                "type": ""
            };
            if (projectsV[i].getElementsByClassName("title")[0]) {

                jsonToAdd.title = projectsV[i].getElementsByClassName("title")[0].innerHTML.replaceAll("&", "/$");
            }
            jsonToAdd.src = projectsV[i].getAttribute("coverlink").replaceAll("&", "/$");

            coverageJSONV["coverage"].push(jsonToAdd);
        }
    }
    idc("coverageEle").innerHTML = JSON.stringify(coverageJSONV);
    var coverageJSONVString = JSON.stringify(coverageJSONV).replace("&", "/$");


    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/project",
        function (response) {
            console.log(response);
            if (response.indexOf('success') > -1) {
                successMessage("Coverage Saved");
            } else {
                errorMessage("Could not be saved");
            }
        }, {
            valjs: coverageJSONVString,
            type: "coverage list"
        });
}

function getScreenFromUrl(url, ele) {

}

function previewDoc(el) {
    window.open(el.parentNode.getElementsByClassName("dz-filename")[0].children[0].getAttribute("originalvar"), '_system');;
}

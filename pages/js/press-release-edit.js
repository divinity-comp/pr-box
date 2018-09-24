var releaseid = "";
var pressReleaseDetails = "";
var pressReleaseData = "";
var projrevision = 0;
var projectData = "";
var projectId = "";

function pressreleaseInit() {
    var prRelease = idc("pressRelease");
    reCalcOnclicks();
    if (idc("projid"))
        releaseid = idc("projid").innerHTML;
    if (idc("pressReleaseDetails"))
        pressReleaseDetails = JSON.parse(idc("pressReleaseDetails").innerHTML);
    if (idc("pressReleaseData"))
        pressReleaseData = JSON.parse(idc("pressReleaseData").innerHTML);
    if (idc("projrevision"))
        projrevision = idc("projrevision").innerHTML;
    if (idc("projectData"))
        projectData = JSON.parse(idc("projectData").innerHTML);
    if (idc("projectListSelect"))
        projectId = idc("projectListSelect").value;

    idc("projectListSelect").onchange = function () {
        projectId = idc("projectListSelect").value;
    }
    dragControls();
}
pressreleaseInit();
/*
    Controls
*/
var selectedElement = null;

function reCalcOnclicks() {
    var prRelease = idc("pressRelease");

    for (i = 0; i < prRelease.children.length; i++)(function (i) {
        prRelease.children[i].onclick = function () {
            if (prRelease.children[i].hasAttribute("selected")) {
                prRelease.children[i].removeAttribute("selected");
                selectedElement = null;
                idc("editControls").style.display = "none";
            } else {
                for (a = 0; a < prRelease.children.length; a++) {
                    prRelease.children[a].removeAttribute("selected");
                }
                prRelease.children[i].setAttribute("selected", "true");
                selectedElement = prRelease.children[i];
                idc("editControls").style.display = "block";

                if (prRelease.children[i].hasAttribute("width"))
                    idc("editControls").getElementsByClassName("width")[0].getElementsByTagName("input")[0].value = parseInt(prRelease.children[i].getAttribute("width"));
                else
                    idc("editControls").getElementsByClassName("width")[0].getElementsByTagName("input")[0].value = "";
                selectControls(prRelease.children[i].getAttribute("eGroup"));

                rePositionEditControls();
            }
        }
    })(i);
}

function rePositionEditControls() {
    var editControls = idc("editControls");

    TweenMax.set(editControls, {
        bottom: getHeight() - findPos(selectedElement).y - selectedElement.offsetHeight - editControls.offsetHeight
    });
}

function changePRView(viewT, el) {

    if (viewT == 1 && el.parentNode.children[0].className != "active") {
        idc("pressRelease").setAttribute("mode", "edit");
        el.parentNode.children[0].className = "active";
        el.parentNode.children[1].className = "";
        selectControls();
    } else if (viewT == 2 && el.parentNode.children[1].className != "active") {
        idc("pressRelease").setAttribute("mode", "element");
        el.parentNode.children[0].className = "";
        el.parentNode.children[1].className = "active";
        selectControls("element");
    } else {
        el.parentNode.children[0].className = "";
        el.parentNode.children[1].className = "";
        selectControls("none");
    }
}

function openElement() {
    selectControls("element");
}

function selectControls(control) {
    var targetedControls = document.getElementsByClassName("targetedControls");
    for (a = 0; a < targetedControls.length; a++) {
        if (targetedControls[a].hasAttribute("vis"))
            targetedControls[a].removeAttribute("vis");
        targetedControls[a].style.display = "none";
    }
    if (selectedElement) {

        if (!control && selectedElement)
            control = selectedElement.getAttribute("egroup");

        switch (control) {
            case "image":
                idc("imageControls").setAttribute("vis", "true");
                idc("imageControls").style.display = "";
                idc("editControls").style.display = "block";
                break;
            case "text":
                idc("textControls").setAttribute("vis", "true");
                idc("textControls").style.display = "";
                idc("editControls").style.display = "block";
                break;
            case "edit":
                idc("editControls").style.display = "block";
                break;
            case "element":
                idc("elementControls").style.display = "block";
                break;
        }
    } else if (control == "element")
        idc("elementControls").style.display = "block";
    else {
        idc("elementControls").style.display = "none";
        idc("editControls").style.display = "none";
    }
}
/* Element view */
function removeElement() {
    if (selectedElement) {
        selectedElement.parentNode.removeChild(selectedElement);
    }
}
/* Geneal Controls */
function setWidth(widthEl) {
    var prRelease = idc("pressRelease");

    for (i = 0; i < prRelease.children.length; i++)(function (i) {
        if (prRelease.children[i].getAttribute("selected")) {
            prRelease.children[i].style.width = widthEl.value + "%";
        }
    })(i);
}

function moveElement(eNum) {
    var prRelease = idc("pressRelease");
    var selected;

    var selNum = 0;
    for (i = 0; i < prRelease.children.length; i++)(function (i) {
        if (prRelease.children[i].getAttribute("selected")) {
            selected = prRelease.children[i];
            selNum = i;
        }
    })(i);
    if (selected) {
        if (eNum == -1) {
            if (selNum != 0) {
                prRelease.insertBefore(prRelease.children[selNum], prRelease.children[selNum - 1]);
            }
        } else {
            if (selNum != prRelease.children.length - 1) {
                prRelease.insertBefore(prRelease.children[selNum], prRelease.children[selNum].nextElementSibling.nextElementSibling);
            }
        }
    }
    reCalcOnclicks();
    rePositionEditControls();
}
/* Text Controls */
function textEdit(typeE) {
    switch (typeE) {
        case 1:
            document.execCommand('bold', false, null);
            break;
        case 2:
            document.execCommand('italic', false, null);
            break;
        case 3:
            document.execCommand('underline', false, null);
            break;
    }
}

function textAlign(aType) {
    if (selectedElement) {
        switch (aType) {
            case 1:
                selectedElement.style.textAlign = "justify";
                break;
            case 2:
                selectedElement.style.textAlign = "left";
                break;
            case 3:
                selectedElement.style.textAlign = "center";
                break;
            case 4:
                selectedElement.style.textAlign = "right";
                break;
        }
    }
}
/* Image Controls */

function updateImage() {
    if (!idc("scrollImage")) {

        ajaxRequestGet(urlInit + "/app/" + appVersion + "/element/scrolling-image-list",
            function (response) {

                idc("main").innerHTML += response;
                openOverlay(idc("scrollImage"));
            });
    } else {
        openOverlay(idc("scrollImage"));
    }
}

function selectImage(figureS) {
    selectedElement.innerHTML = '<img src="' + figureS.getElementsByTagName("img")[0].src + '"/>';
    console.log(selectedElement);
    idc("scrollImage").style.display = "none";
}

function findImages() {
    navigator.camera.getPicture(uploadImageNow, failedUpload, {
        quality: 50,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

// Change image source
function uploadImageNow(imageData) {
    var image = document.getElementById('img');
    image.src = imageData + '?' + Math.random();;
}

function failedUpload(message) {
    addError("Image upload cancelled");
}
// drop controls
function dragControls() {
    var elementControls = idc("elementControls");

    for (i = 0; i < elementControls.children.length; i++)(function (i) {
        var delX = 0;
        var delY = 0;
        var mouseAllow = false;
        elementControls.children[i].onmousedown = function (e) {
            delX = e.clientX;
            delY = e.clientY;
            mouseAllow = true;
        }
        elementControls.children[i].ontouchstart = function (e) {
            delX = e.changedTouches[0].clientX;
            delY = e.changedTouches[0].clientY;

        }
        elementControls.children[i].onmousemove = function (e) {
            if (mouseAllow) {

                console.log("mouse");
                var deltaX = e.clientX - delX;
                var deltaY = e.clientY - delY;
                TweenMax.set(elementControls.children[i], {
                    y: deltaY,
                    x: deltaX
                });
                mouseAllow = false;

            }
        }
        elementControls.children[i].ontouchmove = function (e) {
            console.log("touch");
            var deltaX = e.changedTouches[0].clientX - delX;
            var deltaY = e.changedTouches[0].clientY - delY;
            TweenMax.set(elementControls.children[i], {
                y: deltaY,
                x: deltaX
            });
        }
        elementControls.children[i].onmouseup = function (e) {
            if (mouseAllow) {
                var deltaX = e.changedTouches[0].clientX - delX;
                var deltaY = e.changedTouches[0].clientY - delY;
                if (insideOtherArea(elementControls.children[i], idc("pressContainer"))) {
                    addPressElement(elementControls.children[i].children[0]);

                }
                console.log(findPos(elementControls.children[i]).x + deltaX);
                TweenMax.set(elementControls.children[i], {
                    y: 0,
                    x: 0
                });
            }
            mouseAllow = false;
        }
        elementControls.children[i].ontouchend = function (e) {
            var deltaX = e.changedTouches[0].clientX - delX;
            var deltaY = e.changedTouches[0].clientY - delY;
            if (insideOtherArea(elementControls.children[i], idc("pressContainer"))) {
                addPressElement(elementControls.children[i].children[0]);
            }
            TweenMax.set(elementControls.children[i], {
                y: 0,
                x: 0
            });
        }
    })(i);
}

function addPressElement(pressAdd) {
    var pressEl = document.createElement("div");

    switch (pressAdd.innerHTML) {
        case "Title":
            pressEl.className = "title-field";
            pressEl.setAttribute("elementname", "Title");
            pressEl.setAttribute("contenteditable", "true");
            pressEl.setAttribute("name", "title" + idc("pressRelease").getElementsByClassName("title-field").length);
            pressEl.setAttribute("egroup", "text");
            idc("pressRelease").appendChild(pressEl);
            break;
        case "Text":
            pressEl.className = "text-field";
            pressEl.setAttribute("elementname", "Text field");
            pressEl.setAttribute("name", "Text" + idc("pressRelease").getElementsByClassName("text-field").length);
            pressEl.setAttribute("contenteditable", "true");
            pressEl.setAttribute("egroup", "text");
            idc("pressRelease").appendChild(pressEl);
            break;
        case "Image":
            pressEl.className = "image-field";
            pressEl.setAttribute("elementname", "Image field");
            pressEl.setAttribute("name", "Image" + idc("pressRelease").getElementsByClassName("image-field").length);
            pressEl.setAttribute("egroup", "image");
            pressEl.innerHTML = '<img src="https://dash.prinabox.com/assets/logo-black.svg" />';
            idc("pressRelease").appendChild(pressEl);
            break;
        case "Video":
            break;
    }
    reCalcOnclicks();
}
/*
    Release general
*/
function saveRelease() {
    var pressReleaseForm = idc("pressRelease").children;
    if (pressReleaseForm[0].innerHTML != "") {
        var saveJson = {
            "releaseid": releaseid,
            "projectid": projectId,
            "revision": projrevision
        };


        var projectDeats = "{";
        projectDeats += '"name":"' + pressReleaseForm[0].innerHTML + '"';
        if (idc("pressPDF")) {
            projectDeats += ',"pdffile":"' + idc("pressPDF").children[0].src + '"';
        }
        projectDeats += '}';

        saveJson["detail"] = projectDeats;

        var dataValue = [];
        for (i = 0; i < pressReleaseForm.length; i++) {
            var prElName = pressReleaseForm[i].getAttribute("name");
            var addDV = {
                "etype": pressReleaseForm[i].className,
                "name": prElName
            };
            dataValue.push(addDV);
            if (pressReleaseForm[i].hasAttribute("style")) {
                addDV.style = pressReleaseForm[i].getAttribute("style");
                addDV.width = pressReleaseForm[i].style.width;
            }
            saveJson[prElName] = pressReleaseForm[i].innerHTML;
        }

        saveJson["dataval"] = JSON.stringify(dataValue);

        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/release",
            function (response) {
                var jsRes = JSON.parse(response);
                if (jsRes.response === "success") {
                    releaseid = jsRes.releaseid;
                    projrevision = jsRes.revision;
                    successMessage("Press release has been saved");
                } else {
                    errorMessage("Error whilst saving, try again - Check your internet connection");
                }

            }, saveJson);
    } else {

    }
}

function sendtoPRTeam() {
    errorMessage("Function disabled for demo");
}

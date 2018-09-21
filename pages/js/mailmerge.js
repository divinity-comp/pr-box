function mailingDetails() {
    var mailShow = idc("mailShow");
    if(mailShow.style.display == "block") {
        mailShow.style.display = "none";
    }
    else {
        mailShow.style.display = "block";
    }
}
function openCampaign() {
    
}
function loadMailing(ele) {
    var jsonVer = JSON.parse(ele.children[0].innerHTML);
        var emailToSend = idc("emailToSend");
        var setupMail = idc("setupMail");
            idc("setupMail").setAttribute("pos", 1);
            idc("setupMail").setAttribute("projid", ele.children[0].id);
    if(jsonVer["mailing"]) {
        loadSingleModule("user-mail-list","mailingid=" +jsonVer["mailing"]);
    }
    else {
        if(jsonVer["campaign"])
            idc("campaignName").children[0].value = jsonVer["campaign"];
        emailToSend.children[0].value = jsonVer["subject"].replaceAll("*/", "&").replaceAll( "/6",";");
        emailToSend.children[1].value = jsonVer["message"].replaceAll("*/", "&").replaceAll( "/6",";");
        idc("releaseSelect").children[0].setAttribute("value", jsonVer["release"]);
        idc("mailings").style.display = "none";
        idc("campaignName").style.display = "block";
        TweenMax.fromTo(setupMail, 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut});
        shiftPages('mailings','mainMailing');
        activeMailTracker(0);
    }
}

function mailInit() {
    console.log("list");
    getMailData();
    var projectsList = idc("projects").getElementsByClassName("mailer");
    for(i = 0; i < projectsList.length;i++) {
        var jsonVer = JSON.parse(projectsList[i].children[0].innerHTML);
        console.log(jsonVer);
        if(jsonVer["campaign"]) 
            projectsList[i].getElementsByClassName("title")[0].innerHTML = jsonVer["campaign"];
        else
            projectsList[i].getElementsByClassName("title")[0].innerHTML = jsonVer["subject"];
    }
    activateDocs();
}
mailInit();
function pageSelectMailing(num) {
    var elements = ["campaignName","pressReleases","setupMail","list-finder","sendMailExample"];
    
    for(i = 0; i < elements.length;i++) (function(i){ 
        if(i == num) {
            console.log(idc(elements[i]));
    TweenMax.fromTo(idc(elements[i]), 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut,onComplete:function() {
                idc(elements[i]).style.display = "block";

    }});
        }
        else {
           
                idc(elements[i]).style.display = "none";
    TweenMax.to(idc(elements[i]), 0.5,{x:"-100%",opacity:1, ease: Circ.easeOut,onComplete:function() {

    }}); 
        }
})(i);
}
addLoadEvent(mailInit);

function selectCampaign(ele) {
    pageSelectMailing(0);
   activeMailTracker(0);
    
    TweenMax.fromTo(idc("mailings"), 0.5,{x:"0%",opacity:1},{x:"-100%",opacity:0, ease: Circ.easeOut,onComplete:function() {
                idc("mailings").style.display = "none";
    idc("mainMailing").style.display = "block";
    TweenMax.fromTo(idc("mainMailing"), 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut,onComplete:function() {

    }}); 

    }});
}
function selectRelease(ele) {
    pageSelectMailing(1);
   activeMailTracker(1);
   
}
function addTag(ele) {
    idc("emailToSend").children[1].value += ele.innerHTML;
}
function checkTags(ele) {
    console.log(ele.value);
    var taglist = idc("tags").getElementsByTagName("span");
    for(i = 0; i < taglist.length;i++) {
        if(ele.value.includes(taglist[i].innerHTML)) {
            taglist[i].setAttribute("active","true");
        }
        else {
            taglist[i].setAttribute("active","false");
        }
    }
}
var ranSuccessfullTest = false;
function findMediaList(ev,ele) {
    ev.preventDefault();
    if(ranSuccessfullTest) {
        
        var eleF = idc(ele);
        TweenMax.fromTo(eleF, 0.5,{x:"0%",opacity:1},{x:"-100%",opacity:0, ease: Circ.easeOut,onComplete:function() {
            eleF.style.display = "none";
            idc("list-finder").style.display = "block";
            mediaAllNames();
        TweenMax.fromTo(idc("list-finder"), 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut});
        }});
        saveMailing();
       activeMailTracker(3);
    }
    else {
        idc("tutorial").style.display = "block";
        idc("tutorial").style.background = "transparent";
        idc("testEmailMailMerge").className += " gradient-border";
        centerFocusOnElement("testEmailMailMerge");
        var rectForm = idc("testEmailMailMerge").getBoundingClientRect();
        var button2 = createElementGeneral("p", "Are you sure you want to continue without a test?", "generalTut  ", idc("tutorial"));
       
        TweenMax.set(button2, {
                x: rectForm.left,
                y: rectForm.top - 30,
            color:"#2d2d2d",
            fontSize:"1.2em"
            });
        TweenMax.fromTo(button2, 0.5,{opacity:0},{opacity:1, ease: Circ.easeOut});
    }
}
function activeMailTracker(num) {
    var mailingCenter = idc("mailingCenter");
    
    for(i = 0; i < mailingCenter.children.length;i++) {
        if(num == i) {
            mailingCenter.children[i].setAttribute("active","true");
        }  
        else if(num > i) {
           
            mailingCenter.children[i].setAttribute("arrow","true"); mailingCenter.children[i].setAttribute("active","middle");
        }
        else {
            mailingCenter.children[i].setAttribute("active","false");
        }
    }
}
var selectMailingList;
var mediaListSave;
var mediaListSaveName;
function selectMediaList(ele) {
    selectMailingList = ele.children[0].id;
    var parentMail = ele.parentNode.children;
   for(i = 0; i < parentMail.length;i++) {
        parentMail[i].setAttribute("active","false");
        if(parentMail[i] == ele) {
            parentMail[i].setAttribute("active","true");
        }
   }
    setupPreviewMail();
    var jsonList = JSON.parse(ele.children[0].innerHTML);
    mediaListSaveName = jsonList["listurl"];
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/mail-merge/find-media-list.php",
            function(response) {
        mediaListSave = JSON.parse(response);
        idc("countNum").innerHTML += mediaListSave["mailing"].length;
        
        for(i = 0; i < mediaListSave["mailing"].length;i++) (function(i){  
        })(i);
    }, "id=" + selectMailingList + "&name=" + jsonList["listurl"]);
}
function setupPreviewMail() {
    
    var eleF = idc("list-finder");
    TweenMax.fromTo(eleF, 0.5,{x:"0%",opacity:1},{x:"-100%",opacity:0, ease: Circ.easeOut,onComplete:function() {
        eleF.style.display = "none";
        idc("sendMailExample").style.display = "block";
    TweenMax.fromTo(idc("sendMailExample"), 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut});
    }});
    
    
   activeMailTracker(4);
    idc("exmapleSub").innerHTML = idc("emailToSend").children[0].value;
    idc("exmapleBody").innerHTML = idc("emailToSend").children[1].value;
}
function previewRelease(idVal) {
    if(idc("releaseSelect").children[0].getAttribute("value") != "" || idVal) {
        if(idVal) {
            window.open("https://dash.prinabox.com/view/view-release?press=" + idVal,"_blank");
        }
        else {
            window.open("https://dash.prinabox.com/view/view-release?press=" + idc("releaseSelect").children[0].getAttribute("value"),"_blank");
        }
    }
    else {
        errorMessage("Please select a press release");
    }
}
var currentMailAmount = 0;
function processList() {
    currentMailAmount = 0;
    var listp = idc("list-processor");
    TweenMax.fromTo(idc("sendMailExample"), 0.5,{x:"0%",opacity:1},{x:"-100%",opacity:0, ease: Circ.easeOut,onComplete:function() {
        idc("sendMailExample").style.display = "none";
        idc("list-processor").style.display = "block";
        TweenMax.fromTo(idc("list-processor"), 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut});
    }});
    activeMailTracker(5);
    sendMailFinal();
}
var selectedPressEle;
function addFilesMailing() {
    if(idc("docsDrop"))
    idc("docsDrop").innerHTML = "";
    if(idc("videosDrop"))
    idc("videosDrop").innerHTML = "";
    if(idc("imagesDrop"))
    idc("imagesDrop").innerHTML = "";
    addfilesCheck();
    var dropzone = idc("dropZone");
    var pressReleases = idc("pressReleases").children[0];
    
    filesAdded = "";
    if(docsfileAdd != "" && imagefileAdd != "") {
        filesAdded = docsfileAdd + "," + imagefileAdd;
    }
    else {
        
        filesAdded = docsfileAdd +  imagefileAdd;
    }
    console.log(filesAdded);
    if(pressReleases.getElementsByClassName("release")[0])
        pressReleases.removeChild(pressReleases.getElementsByClassName("release")[0]);
    
    var pressList = idc("pressList").children[0];
    for(i = 0; i < pressList.children.length;i++) {
        if(pressList.children[i].getAttribute("active") == "true") {
            var childClone = pressList.children[i].cloneNode("true");
            pressReleases.appendChild(childClone);
            selectedPressEle = childClone;
        }
    }
    closeOverlay("selectFilesOver");
}
function cancelList() {
    successMessage("Cancled mailing");
    currentMailAmount = 10000000;
}
var filesAdded;
function saveMailing(ev, exitYes) {
    if(ev)
    ev.preventDefault();
    var emailToSend = idc("emailToSend");
    
    
    var projectDeats = {"campaign":"","subject":"","message":"","release":"","files":""};
    if(filesAdded)
    projectDeats.files = filesAdded.replaceAll("&", "*/").replaceAll(";", "/6");
    if(sendMailDataString)
    projectDeats.mailing = sendMailDataString;
    projectDeats.subject = emailToSend.children[0].value.replaceAll("&", "*/").replaceAll(";", "/6");
    projectDeats.campaign = idc("campaignName").children[0].value.replaceAll("&", "*/").replaceAll(";", "/6");
    projectDeats.message = emailToSend.children[1].value.replaceAll("&", "*/").replaceAll(";", "/6");
    console.log(projectDeats.message);
    projectDeats.release = idc("releaseSelect").children[0].getAttribute("value");
    var projString = JSON.stringify(projectDeats);
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/mail-merge/add-mailing.php",
        function(response) {
        console.log(response);
        if(response.indexOf('success') > -1 || response.indexOf('update') > -1) {
            successMessage("Mailing Saved");
            if(idc("setupMail").getAttribute("projid") == "-1") {
                var newID = parseInt(response);
                idc("setupMail").setAttribute("projid", newID);
                idc("projid").innerHTML = newID;
                console.log(newID);
            }
            idc("setupMail").setAttribute("pos", 1);
            
    if(exitYes) {
        idc("mailingCenter").children[0].click();
    }
        }
        else {
            errorMessage("Mailing couldn't be saved " + response);
        }
    }, "pd=" + projString + "&pos=" + idc("setupMail").getAttribute("pos") + "&projid=" + idc("setupMail").getAttribute("projid") );
}
function editEmailStep() {
    var parentEle = selectedPressEle;
    TweenMax.fromTo(idc("pressReleases"), 0.5,{x:"0%",opacity:1},{x:"-100%",opacity:0, ease: Circ.easeOut,onComplete:function() {
        idc("pressReleases").style.display = "none";
        idc("setupMail").style.display = "block";
    TweenMax.fromTo(idc("setupMail"), 0.5,{x:"100%",opacity:0},{x:"0%",opacity:1, ease: Circ.easeOut});
    }}); 
   activeMailTracker(2);
    if(idc("releaseSelect").children[0] && parentEle)
    idc("releaseSelect").children[0].setAttribute("value",parentEle.children[0].getAttribute("id"));
}
function testMail(ev) {
    if(idc("tutorial").style.display == "block") {
        idc("tutorial").style.display = "none";
            idc("testEmailMailMerge").className = "lightBlue ";
            document.getElementsByClassName("wrapper")[0].removeChild(document.getElementsByClassName("wbCenter")[0]);
        
    }
    if(idc("MailingDetails").getElementsByTagName("input")[1].value != "") {
    saveMailing();
        var MailingDetails = idc("MailingDetails").getElementsByTagName("input");
        var jsonString = "";
        for(i = 0; i < MailingDetails.length;i++) {
            jsonString += "&";
            jsonString +=  MailingDetails[i].name + '=' + MailingDetails[i].value; 
        }
        ev.preventDefault();
        var emailToSend = idc("emailToSend");
        var text = "";

        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 25; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/mail-merge/setup-mail.php",
            function(response) {
            if(response.indexOf('success') > -1) {
                var waitingID = addWaitingMessage("<span>Email added to queue - waiting to send</span>");
                waitingForTestResponse(waitingID,text);
            }
            else {
                errorMessage("Email couldn't be added to queue");
            }
        }, "mailingid=" + text + "&messageid=" + idc("setupMail").getAttribute("projid") + jsonString);
    } 
    else {
        openOverlay("MailingDetails");
    }
}
function waitingForTestResponse(waitingID, listID) {
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/mail-merge/setup-mail-find.php",
        function(response) {
        if(response.indexOf('finished') > -1) {
            removeWaiting(waitingID);
            successMessage("Email Sent");
            ranSuccessfullTest = true;
        }
        else if(response.indexOf('rror') > -1) {
            removeWaiting(waitingID);
            errorMessage("Your email settings are incorrect");
            console.log("something");
            openOverlay("MailingDetails");
            console.log("something 2" );
        }
        else if(response.indexOf('processing') > -1) {
            idc(waitingID).children[1].innerHTML = " sending now";
            setTimeout(function(){ waitingForTestResponse(waitingID,listID); }, 1000);
            console.log(response);
        }
        else {
            setTimeout(function(){ waitingForTestResponse(waitingID,listID); }, 1000);
            console.log(response);
        }
    }, "listid=" + listID);
}
var sendMailDataString;
function sendMailFinal() {
    var MailingDetails = idc("MailingDetails").getElementsByTagName("input");
    var jsonString = "";
    for(i = 0; i < MailingDetails.length;i++) {
        jsonString += "&";
        jsonString +=  MailingDetails[i].name + '=' + MailingDetails[i].value; 
    }
    var emailToSend = idc("emailToSend");
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < 25; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/mail-merge/setup-mail-list-final.php",
        function(response) {
            console.log(response);
        if(response.indexOf('success') > -1) {
            successMessage("Sending mail");
        sendMailDataString = text;
            saveMailing();
        }
        else {
            errorMessage("Email couldn't be added to queue");
        }
    }, "mailingid=" + text + "&listname=" + mediaListSaveName  +"&listid=" + selectMailingList  + "&messageid=" + idc("setupMail").getAttribute("projid") + jsonString);
}
function waitingForFinalResponse(waitingID, listID) {
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/mail-merge/setup-mail-find-final.php",
        function(response) {
        if(response.indexOf('failed finding mail') > -1) {
            errorMessage("Please check your connection - your list is still processing");
        }
        else {
            var resWa = JSON.parse(response);
            var failCount = 0;
            var successCount = 0;
            var processingCount = 0;
            var waitingCount = 0;
            for(i = 0;i < resWa["mailings"].length;i++) {
                if(resWa["mailings"][i]["stage"].indexOf('wait') > -1) {
                    waitingCount++;
                }
                else if(resWa["mailings"][i]["stage"].indexOf('processing') > -1) {
                    processingCount++;
                }
                else if(resWa["mailings"][i]["stage"].indexOf('finish') > -1) {
                    successCount++;
                }
                else {
                    failCount++;
                }
            }
            var listPP = idc("list-processor").children[1];
            if(processingCount == 0 && waitingCount == 0) {
                removeWaiting(waitingID);
                successMessage("Emails Sent");
                idc("list-processor").children[0].innerHTML = "Complete";
            }
            else {
                idc(waitingID).children[1].innerHTML = " sending now";
                setTimeout(function(){ waitingForFinalResponse(waitingID,listID); }, 2000);
            }
            listPP.innerHTML =  "Total: " +(successCount + failCount) + "/" + (resWa["mailings"].length);
            listPP.innerHTML +=  "<br>Successful Sent: "+(successCount) + "/" + (resWa["mailings"].length);
            listPP.innerHTML +=  "<br>Failed Sent: "+(failCount) + "/" + (resWa["mailings"].length);
            listPP.innerHTML +=  "<br>Waiting: "+(waitingCount) + "/" + (resWa["mailings"].length);
            listPP.innerHTML +=  "<br>Proccessing: "+(processingCount) + "/" + (resWa["mailings"].length);
            
        }
    }, {listid:listID});
}
function openMiniMedia(num) {
      errorMessage("not supported");
}

function selectPressRelease(ele) { 
    if(ele.parentNode.parentNode.getAttribute("active") == "true") {
        ele.parentNode.parentNode.setAttribute("active","false");
    }
    else {
        var pressList = idc("pressList").getElementsByClassName("release");
        for(i = 0; i < pressList.length;i++) {
            pressList[i].setAttribute("active", "false");
        }
        if(ele.parentNode.parentNode.className == "project release quarter") {
            ele.parentNode.parentNode.setAttribute("active","true");
        }
        else{
            ele.parentNode.parentNode.parentNode.setAttribute("active","true"); 
        }
    }
}
var docsfileAdd =  "";
var imagefileAdd =  "";
function addfilesCheck() {
    var dropzone = idc("dropZone");
    
    var mailfilesToAdd = "";
    if(idc("menuMedia").children[1].getAttribute("active") == "true") {
            var pressReleases = idc("pressReleases").children[0];
            for(b =0; b < pressReleases.children.length;b++) {
                if(pressReleases.children[b].className.includes("image")) {
                    pressReleases.removeChild(pressReleases.children[b]);
                    b--;
                }
            }

        } else {
            var pressReleases = idc("pressReleases").children[0];
            for(b = 0; b < pressReleases.children.length;b++) {
                if(pressReleases.children[b].className.includes("docs")) {
                    pressReleases.removeChild(pressReleases.children[b]);
                    b--;
                }
            }

        }
        for(a = 0; a < dropzone.children.length;a++) {
            if(dropzone.children[a].getAttribute("active") == "true") {
                if(mailfilesToAdd != "") {
                    mailfilesToAdd += ",";
                }
            if(!dropzone.children[a].getElementsByTagName("img")[0].hasAttribute("fullsrc")) {
                    mailfilesToAdd += dropzone.children[a].getElementsByTagName("img")[0].getAttribute("src");
                }
                else 
                    mailfilesToAdd += dropzone.children[a].getElementsByTagName("img")[0].getAttribute("fullsrc");

                var childClone = dropzone.children[a].cloneNode("true");
                if(idc("menuMedia").children[1].getAttribute("active") == "true") {
                    childClone.className += " image";
                } 
                else {
                    childClone.className += " docs";
                }
                pressReleases.appendChild(childClone);
            }
        }
    if(idc("menuMedia").children[1].getAttribute("active") == "true") {
        imagefileAdd = mailfilesToAdd;
    }
    else {
        docsfileAdd = mailfilesToAdd;
    }
}
function activateDocs() {
    console.log("active Docs");
     var dzImage = document.getElementsByClassName("dz-image");
    for(i = 0; i < dzImage.length;i++)  (function(i){ 
        dzImage[i].onclick = function() {
            if(dzImage[i].parentNode.getAttribute("active") == "true") {
                dzImage[i].parentNode.setAttribute("active","false");
            }
            else {  
                dzImage[i].parentNode.setAttribute("active","true");
            }
                
        }
    })(i);
}
loadMailingSettings();
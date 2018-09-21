

function openMedia() {
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
function toggleSocialActive(ele) {
    if(ele.getAttribute("active") == "true") {
        ele.setAttribute("active","false");
    }
    else {
        ele.setAttribute("active","true");
    }
}

    var datepicker = new Datepickk();
    datepicker.title = 'Select a day to send';

    datepicker.onSelect = function(checked) {
        var state = (checked)?'selected':'unselected';
        idc("sendDate").setAttribute("dbdate",moment(new Date(this.toLocaleDateString())).format("YYYY-MM-DD"));
        idc("sendDate").value = moment(new Date(this.toLocaleDateString())).format("YYYY-MM-DD");
        
        openOverlay(idc("socialSchedule"));
        datepicker.hide();
    };
function editSocial() {
    datepicker.show();
}

function checkCharLimit(el) {
    var txtData = el.value;
    var matches = txtData.match(/\bhttps?:\/\/\S+/gi);
    var lengthTxt = 280;
    if(Array.isArray(matches)) {
        lengthTxt = 280 - (matches.length * 22);
        for(i = 0;i<matches.length;i++) {
            lengthTxt += matches[i].length;
        }
    }
    idc("characterLimit").getElementsByTagName("span")[0].innerHTML = lengthTxt - el.value.length;
}
function ScheduleNow() {
    var timeSet;
        var dateSelected = new Date(idc("sendDate").value);
        var timeframe = idc("timeframe");
        var dateList = [dateSelected.getFullYear(), dateSelected.getMonth(),datepicker.getDate()];
        timeSet = new Date(dateList[0], parseInt(dateList[1]) , dateList[2], parseInt(timeframe.children[0].children[0].value), timeframe.children[1].children[0].value, 0);
        timeSet = timeSet / 1000;
    var socialdata = {"message":"","imageurl":"","videourl":"","fb":"false","twitter":"false","google":"false","insta":"false","pin":"false","linked":"false"};
    var characterLimit = idc("characterLimit");
    socialdata.message = characterLimit.children[0].value.replace("&", "%26");
    if(idc("uploadSection").children[0].children.length == 1)
    socialdata.imageurl = idc("uploadSection").getElementsByTagName("img")[0].src;
    var buttonSocial = idc("createPosts").getElementsByTagName("button");
    socialdata.fb = buttonSocial[0].getAttribute("active");
    socialdata.twitter = buttonSocial[1].getAttribute("active");
    socialdata.linked = buttonSocial[2].getAttribute("active");
    socialdata.google = buttonSocial[3].getAttribute("active");
    socialdata.insta = buttonSocial[4].getAttribute("active");
    
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/user-upload-social.php",function(response) {
        console.log(response);
        if(response.includes("success")) {
            successMessage("Added social post to queue"); 
        }
        else {
            errorMessage("Social Post could not be added");
        }
    },{socialdata:JSON.stringify(socialdata),time:timeSet});
}
function shareNow() {
    var timeSet;
        var dateSelected = new Date(idc("sendDate").value);
        var timeframe = idc("timeframe");
        var dateList = [dateSelected.getFullYear(), dateSelected.getMonth(),datepicker.getDate()];
        timeSet = new Date();
    var socialdata = {"message":"","imageurl":"","videourl":"","fb":"false","twitter":"false","google":"false","insta":"false","pin":"false","linked":"false"};
    var characterLimit = idc("characterLimit");
    socialdata.message = characterLimit.children[0].value.replace("&", "%26");
    if(idc("uploadSection").children[0].children.length == 1)
    socialdata.imageurl = idc("uploadSection").getElementsByTagName("img")[0].src;
    var buttonSocial = idc("createPosts").getElementsByTagName("button");
    socialdata.fb = buttonSocial[0].getAttribute("active");
    socialdata.twitter = buttonSocial[1].getAttribute("active");
    socialdata.linked = buttonSocial[2].getAttribute("active");
    socialdata.google = buttonSocial[3].getAttribute("active");
    socialdata.insta = buttonSocial[4].getAttribute("active");
    
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/user-upload-social.php",function(response) {
        console.log(response);
        if(response.includes("success")) {
            successMessage("Added social post to queue"); 
        }
        else {
            errorMessage("Social Post could not be added");
        }
    },{socialdata:JSON.stringify(socialdata),time:timeSet});
}
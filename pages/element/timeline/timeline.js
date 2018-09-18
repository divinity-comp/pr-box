var timeData = {timeframe:0};

var selectionCount = 5;
// Initial timeline load
 function toggleSettings(idE) {
     var timelineSettings = idE;
     if(!timelineSettings.hasAttribute("active")) {
         timelineSettings.setAttribute("active","true");
     }
     else {
         timelineSettings.removeAttribute("active");
     }
 }
function toggleTitles(ele) {
    var overview = gbc("overview");
    
    if(ele.hasAttribute("active"))
        overview.setAttribute("titles","true");
    else 
        overview.removeAttribute("titles");
}
function timeselectionDrag() {
    var currentSelection = idc("currentSelection").children[0];
    var clientX;
    var rememberX = 0;
    
    var counter = 0;
    currentSelection.ontouchstart = function(e) {
        clientX = e.touches[0].clientX;
    };
    currentSelection.ontouchmove = function(e) {
        var deltaX;
            deltaX = e.changedTouches[0].clientX - clientX;
        var childWidth = elDimensions(currentSelection, "Padding").x / selectionCount;
        var countWidth = (childWidth * counter);
        if(deltaX > (childWidth * -counter) + (childWidth * 0.7)) {
            timeData.time.subtract(1, timeData.timeframename);
            timelineType(timeData.timeframe);
            counter--;
        }
        else if(deltaX < (-childWidth * counter) + (-childWidth * 0.7)) {
            timeData.time.add(1, timeData.timeframename);
            timelineType(timeData.timeframe);
            counter++;
        }
        TweenMax.set(currentSelection.children, {
            x: deltaX + (childWidth * counter)
        }); 
        rememberX = deltaX + (childWidth * counter);
    };
    currentSelection.ontouchend = function(e) {
        TweenMax.set(currentSelection.children, {
            x: rememberX
        }); 
        TweenMax.to(currentSelection.children, 0.4, {
            x: 0
        }); 
        counter = 0;
        rememberX = 0;
    };
}
function timelineType(timeSet) {
    idc("activeInformation").style.display = "none";
    timeData.timeframe = timeSet;
    
    var timeframes = idc("timelineType").children;
    
    for(i = 0; i < timeframes.length;i++) {
        if(i == timeSet)
            timeframes[i].setAttribute("active","true");
        else
            timeframes[i].setAttribute("active","false");
    }
    
    var eleAmount = 25;
    
    var currentSelection = idc("currentSelection").children[0];
    currentSelection.innerHTML = "";
    if(timeSet == 0) {
        var year = new moment(timeData.time);
        currentSelection.parentElement.removeAttribute("extra");
        year.subtract((eleAmount -1) / 2, 'year');
        for(i = 0; i < eleAmount;i++) {
            var addEl = document.createElement("div");
            addEl.innerHTML = year.year ();
            currentSelection.appendChild(addEl);
            year = year.add(1, 'year');
            if(parseInt(eleAmount / 2) == i) 
                addEl.style.fontWeight = "400";
        }
        timeData.timeframename = "year";
        
    }
    else if(timeSet == 1) {
        var month = new moment(timeData.time);
        currentSelection.parentElement.setAttribute("extra", month.year ());
        month.subtract((eleAmount -1) / 2, 'months');
        for(i = 0; i < eleAmount;i++) {
            var addEl = document.createElement("div");
            addEl.innerHTML = month.format("MMMM");
            currentSelection.appendChild(addEl);
            month = month.add(1, 'months');
            if(parseInt(eleAmount / 2) == i) 
                addEl.style.fontWeight = "400";
        }
        timeData.timeframename = "months";
    }
    else {
        var month = new moment(timeData.time);
        currentSelection.parentElement.setAttribute("extra", month.year ());
        
        month.subtract((eleAmount -1) / 2, 'weeks');
        for(i = 0; i < eleAmount;i++) {
            var addEl = document.createElement("div");
            addEl.innerHTML = month.format("D-MMM");
            currentSelection.appendChild(addEl);
            month = month.add(1, 'weeks');
            if(parseInt(eleAmount / 2) == i) 
                addEl.style.fontWeight = "400";
                
        }
        timeData.timeframename = "weeks";
    }
    
    if(getWidth() < 400)
        selectionCount = 3;
    else if(getWidth() < 600)
        selectionCount = 5;
    else {
        selectionCount = 7;
    }
    var childWidth = elDimensions(currentSelection, "Padding").x / selectionCount;
    for(i = 0;i < currentSelection.children.length;i++) {
        currentSelection.children[i].style.width = childWidth + "px";
        currentSelection.children[i].style.left = (
        -(childWidth / 2) + 
        -(childWidth  * (eleAmount -1) / 2) + (childWidth * i) + 
        ((elDimensions(currentSelection, "Padding").x) / 2)) + "px"; 
    }
    xAxisSet();
    loadTimeline();
}

// Initial xAxis
function xAxisDrag() {
    var currentSelection = idc("xAxis");
    var clientX;
    var rememberX = 0;
    
    var counter = 0;
    currentSelection.ontouchstart = function(e) {
      clientX = e.touches[0].clientX;
    };
    currentSelection.ontouchmove = function(e) {
        var deltaX;
            deltaX = e.changedTouches[0].clientX - clientX;
        var childWidth = elDimensions(currentSelection.children[0], "Padding").x ;
        if(deltaX > (childWidth * -counter) + (childWidth * 0.7)) {
            if(timeData.timeframe == 0)
                timeData.time.subtract(1, "months");
            else if(timeData.timeframe == 1)
                timeData.time.subtract(1, "days");
            else if(timeData.timeframe == 2)
                timeData.time.subtract(1, "days");
            timelineType(timeData.timeframe);
            counter--;
        }
        else if(deltaX < (-childWidth * counter) + (-childWidth * 0.7)) {
            if(timeData.timeframe == 0)
                timeData.time.add(1, "months");
            else if(timeData.timeframe == 1) {
                timeData.time.add(1, "days");
            }
            else if(timeData.timeframe == 2) {
                timeData.time.add(1, "days");
            }
            timelineType(timeData.timeframe);
            counter++;
        }
        
        TweenMax.set(currentSelection.children, {
            x: deltaX + (childWidth * counter)
        });   
        rememberX = deltaX + (childWidth * counter);
    };
    currentSelection.ontouchend = function(e) {
        TweenMax.set(currentSelection.children, {
            x: rememberX
        }); 
        TweenMax.to(currentSelection.children, 0.4, {
            x: 0
        }); 
        rememberX = 0;
        counter = 0;
    };
}
function xAxisSet() {
    var timeSet = timeData.timeframe;
    var currentSelection = idc("xAxis");
    currentSelection.innerHTML = "";
    var eleAmount = 0;
    var viewableAmount = 0;
    var visibleDays = 0;
    if(timeSet == 0) {
       // timeData.time.date(1);
        var month = new moment(timeData.time);
        month.subtract(12, 'months');
        eleAmount = 24;
        
        if(getWidth() < 400)
            viewableAmount = 3;
        else if(getWidth() < 600)
            viewableAmount = 5;
        else {
            viewableAmount = 8;
        }
        
        for(i = 0; i < eleAmount;i++) {
            if(i > (eleAmount / 2) - 1 && i < (eleAmount / 2) + viewableAmount)
                visibleDays += parseInt(month.daysInMonth());
            currentSelection.innerHTML += '<div data="'+ month.format("YYYY") + '">' + month.format("MMMM") + '</div>';
            month = month.add(1, 'months');
        }
    }
    else if(timeSet == 1) {
        var month = new moment(timeData.time);
        
        month.subtract(timeData.time.daysInMonth(), 'days');
        eleAmount = timeData.time.daysInMonth() * 2;
        viewableAmount = timeData.time.daysInMonth();
        if(getWidth() < 400)
            viewableAmount = timeData.time.daysInMonth()  * 0.3;
        else if(getWidth() < 600)
            viewableAmount = timeData.time.daysInMonth()  * 0.5;
        else 
            viewableAmount = timeData.time.daysInMonth()  * 0.7;
        
            visibleDays = viewableAmount;
        for(i = 0; i < eleAmount;i++) {
            currentSelection.innerHTML += '<div data="'+ month.format("MMM") + '">' + month.dates() + '</div>';
            month = month.add(1, 'days');
        }
    }
    else {
        var month = new moment(timeData.time);
        
        month.subtract(14, 'days');
        eleAmount = 28;
        viewableAmount = 9;
        if(getWidth() < 400)
            viewableAmount = 3;
        else if(getWidth() < 600)
            viewableAmount = 6;
        else 
            viewableAmount = 9 ;
        
        visibleDays = viewableAmount;
        for(i = 0; i < eleAmount;i++) {
            currentSelection.innerHTML += '<div data="'+ month.dates() + '">' + month.format('dddd'); + '</div>';
            month = month.add(1, 'days');
        }
    }
    var childWidth = elDimensions(currentSelection, "Padding").x / viewableAmount;
    timeData.visibleDays = visibleDays;
    timeData.xAxisSegWidth = childWidth;
    var addAmount = 0;
    if(timeSet == 0) 
        addAmount = (timeData.time.date() / timeData.time.daysInMonth()) * childWidth;
    else 
        addAmount = childWidth;
    
    for(i = 0;i < currentSelection.children.length;i++) {
        currentSelection.children[i].style.width = childWidth + "px";
        currentSelection.children[i].style.left = ((
        -(childWidth) + 
        -(childWidth  * ((eleAmount -1) / 2)) + (childWidth * i) + childWidth) - addAmount) + "px"; 
    }
}
var tData;
function timelineDataGet() {
    ajaxRequestToMake(urlInit + "/app/"+ appVersion + "/data/timeline-data",
    function(response) {
        try {
            tData = JSON.parse(response);
            if(tData.response === "success") {
                timelineInit();
                setCookie("timelineData",response);
                idc("timeline").setAttribute("loaded","true");
            }
            else {
                gbc("overview").innerHTML = "Error <br>" + jsRes.response;
            }
        }
        catch(error) {
            gbc("overview").innerHTML = "<div class='openError'>" +error + "<br><br>Error getting your data" + "</div>";
        }
    },{all:'true'});
}

var firstProjectLoad = true;
var projectSelected = 0;
function loadTimeline() {
    setCookie("tasksAmount", "0");
    gbc("overview",idc("timeline")).innerHTML = "";
    for(i = 0; i < tData["events"].length;i++) (function(i){ 
        var loadRow = true;
        if(tData["events"][i].details.hasOwnProperty("active")) {
            if(tData["events"][i].details.active == false)
                loadRow = false;
        }
        
        if(loadRow)
            addTimelineRow(tData["events"][i],i);
    })(i);
    
    if(firstProjectLoad) {
        firstProjectLoad = false;
        var projSelect = idc("projectListSelect");
        projSelect.innerHTML = '<option selected="" value="">All Projects</option>';
        for(i = 0; i < tData["projects"].length;i++) (function(i){ 
            var optionToAdd = document.createElement("option");
            optionToAdd.setAttribute("value",tData["projects"][i]["id"]);
            optionToAdd.innerHTML = tData["projects"][i]["title"] + " " + tData["projects"][i]["date"];
            projSelect.appendChild(optionToAdd);
        })(i);
        projSelect.onchange = function() {
            projectSelected = projSelect.value;
            loadTimeline();
        }
    }
}
function addTimelineRow(rowData) {
    var tRow = document.createElement("div");
    var rowStartD = moment(rowData["details"]["date"]);
    var rowEndD = moment(rowData["details"]["date"]);
    // format .format('YYYY-MM-DD')
    if(rowData["details"]["actions"].length != 0) {
        rowStartD = rowStartD.subtract(parseInt(rowData["details"]["actions"][rowData["details"]["actions"].length - 1]["days"]), "days");
    }
    if(projectSelected != 0 && projectSelected != rowData["projectlist"]) 
        return;
    var viewLast = moment(timeData.time).add(timeData.visibleDays,"days");
    var inRange = rowStartD.isBetween(timeData.time, viewLast, 'days');
    if(!inRange)
        inRange = rowEndD.isBetween(timeData.time, viewLast, 'days');
    if(rowStartD.isBefore(timeData.time) && rowEndD.isAfter(timeData.time))
        inRange = true;
    if(!inRange) 
        return;
    var taskAmount = parseInt(getCookie("tasksAmount")) + 1;
    setCookie("tasksAmount", taskAmount);
    var timelineViewWidth = elDimensions(gbc("timelineContent"),"All").x;
    
    var dayWidth = timelineViewWidth / timeData.visibleDays;
    var rowWidth = parseInt(rowEndD.diff(rowStartD, 'days') * dayWidth);
    var rowPos = (timeData.xAxisSegWidth / 2) + (rowStartD.diff(timeData.time, 'days') * dayWidth);
    
    tRow.style.marginLeft = rowPos + "px";
    tRow.style.width = rowWidth + "px";
    var actions = document.createElement("div");
    actions.className = "actions";
    for(b = 0;b < rowData["details"]["actions"].length;b++) {
        var event = document.createElement("div");
        event.style.marginLeft = ((parseInt(rowData["details"]["actions"][b]["days"]) * dayWidth) + dayWidth / 2) + "px";
        actions.appendChild(event);
    }
    tRow.innerHTML = "<h2>" + rowData.details.name + "</h2>";
    tRow.appendChild(actions);
    tRow.innerHTML += "<div class='data hidden'>" + JSON.stringify(rowData) + "</div>";
    var rType = rowData.type.replace(" - timeline", "");
    switch(rType) {
        case "Social Media":
            tRow.className = "e1 redBg";
        break;
        case "Press Release":
            tRow.className = "e2 blueBg";
        break;
        case "Launch Event":
            tRow.className = "e3 lightBg";
        break;
        case "Press Trips":
            tRow.className = "e4 greenBg";
        break;
        case "Trade fairs":
            tRow.className = "e5 pinkBg";
        break;
        case "Gifting":
            tRow.className = "e5 orangeBg";
        break;
        default:
            tRow.className = "e6 pinkBg";
        break;
    }
    tRow.ontouchstart = function(e) {
        var deltaX;
            deltaX = e.changedTouches[0].clientX;
        var activeI = idc("activeInformation");
        activeI.children[1].onclick = function() {
            editTimeline(e.target);
        }
        var deltaY = findPos(e.target).y - findPos(gbc("overview")).y  - (elDimensions(e.target,"All").y + gbc("overview").scrollTop);
        if(deltaX < (elDimensions(activeI,"All").x / 2) + 30) {
            TweenMax.set(gbc("arrow",idc("activeInformation")), {x:-((elDimensions(activeI,"All").x / 2) - deltaX)- 30});
            deltaX = (elDimensions(activeI,"All").x / 2) + 30;
        }
        else if(deltaX > (elDimensions(gbc("overview"),"All").x) - (elDimensions(activeI,"All").x / 2)) {
            TweenMax.set(gbc("arrow",idc("activeInformation")), {x:-((elDimensions(gbc("overview"),"All").x) - (elDimensions(activeI,"All").x / 2) - deltaX)});
            deltaX = (elDimensions(gbc("overview"),"All").x) - (elDimensions(activeI,"All").x / 2);
        }
        else {
            
            TweenMax.set(gbc("arrow",idc("activeInformation")), {x:0});
        }
        activeI.children[0].innerHTML = e.target.getElementsByTagName("h2")[0].innerHTML;
        activeI.style.display = "block";
        TweenMax.set(activeI, {x:deltaX - (elDimensions(activeI,"All").x / 2) - findPos(gbc("overview")).x,y:deltaY}); 
    }
    gbc("overview",idc("timeline")).appendChild(tRow);
}
function editTimeline(project) {
    var editTimeline = idc("editTimeline");
    
    var projJSON = JSON.parse(gbc("data",project).innerHTML);
    gbc("eventTitle",editTimeline).innerHTML = projJSON["details"]["name"];
    gbc("eventType",editTimeline).children[0].innerHTML = projJSON["type"].replace(" - timeline", "");
    openOverlay(editTimeline);
    gbc("eventActions",editTimeline).style.height = (elDimensions(editTimeline,"Client").y - elDimensions(editTimeline.children[0],"All").y) + "px";
    
    var eActions = gbc("eventActions",editTimeline);
    eActions.innerHTML = "";
    
    var startDate = moment(projJSON["details"]["date"]).subtract(projJSON["details"]["actions"][projJSON["details"]["actions"].length - 1],"days");
    
    for(i = 0; i < projJSON["details"]["actions"].length;i++) {
        var detailEl = document.createElement("div");
        var actionDate = moment(startDate).add(projJSON["details"]["actions"][i]["days"],"days");
        var className = "";
        if(projJSON["details"]["actions"][i]["state"])
            className = projJSON["details"]["actions"][i]["state"];
        detailEl.innerHTML = '<div><button class="remove" onclick="removeEl(this.parentNode.parentNode)">X</button><button onclick="toggleComplete(this)" class="'+ className + '"><i class="fa fa-check" aria-hidden="true"></i></button><span>'+ actionDate.format('DD-MM-YYYY') +'</span></div><div contenteditable="true">' +  projJSON["details"]["actions"][i]["name"] + '</div>';
        eActions.appendChild(detailEl);
    }
    var addButton = document.createElement("button");
    addButton.innerHTML = "+";
    addButton.onclick = function() {
        var detailEl = gbc("eventActions",editTimeline).children[gbc("eventActions",editTimeline).children.length - 2].cloneNode(true);
        gbc("eventActions",editTimeline).appendChild(detailEl);
        gbc("eventActions",editTimeline).appendChild(addButton);
    }
    eActions.appendChild(addButton);
    
    var tl = new TimelineMax();
    tl.staggerFromTo(editTimeline.getElementsByTagName("h2"), 0.35,{opacity:0,y:30},{opacity:1,y:0, ease: Circ.easeOut});
}
function removeEl(el) {
    el.parentNode.removeChild(el);
}
function toggleComplete(el) {
    if(el.className == "complete")
        el.className = "";
    else
        el.className = "complete";
}
function timelineInit() {
    timeData.time = new moment();
    timeData.time.hour(0);timeData.time.minutes(0);timeData.time.seconds(0);timeData.time.milliseconds(0);
    xAxisDrag();
    timeselectionDrag();
    timelineType(0);
    gbc("viewport",idc("timeline")).style.height = "0px";
    var heightSet = 100;
    if(getWidth() < 600) 
     heightSet = elDimensions(idc("dashboard"),"All").y - elDimensions(idc("navigation"),"All").y - elDimensions(idc("timeline"),"Padding").y - 100;
    else 
     heightSet = elDimensions(idc("dashboard"),"All").y - elDimensions(idc("navigation"),"All").y - elDimensions(idc("timeline"),"Padding").y;
    gbc("viewport",idc("timeline")).style.height = (heightSet * 0.90) + "px";
    TweenMax.to(idc("timeline"), 0.4, {opacity: 1}); 
}
timelineDataGet();

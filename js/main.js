// Initial Data
var appVersion = "v1";
var urlInit = "https://dash.prinabox.com";
// Login
var checkLive;

function checkLogin() {
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/login",
        function (response) {
            var jsRes = JSON.parse(response);
            if (jsRes.response === "success") {
                setCookie("stringUserData", response);

                checkLive = setInterval(function () {
                    checkIfLive();
                }, 10000);
                getMainDashboard();
            } else {
                setTimeout(function () {
                    loginInit();
                }, 2000);
            }
        }, {
            email: getCookie("email"),
            pass: getCookie("pass")
        });

}

function loginInit() {
    var loginPage = idc("loginPage").children[0];
    var tl = new TimelineMax();
    tl.fromTo(loginPage, 0.35, {
            opacity: 0
        }, {
            opacity: 1,
            ease: Circ.easeOut
        })
        .fromTo(loginPage.children[0], 0.5, {
            y: 30,
            transformOrigin: "50% 100%",
            scale: 0,
            opacity: 0
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: Circ.easeOut
        })
        .fromTo(loginPage.children[1].children[0], 0.4, {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Circ.easeOut
        }, "-=0.25")
        .fromTo(loginPage.children[1].children[1], 0.4, {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Circ.easeOut
        }, "-=0.25")
        .fromTo(loginPage.children[1].children[2], 0.4, {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Circ.easeOut
        }, "-=0.25")
        .fromTo(loginPage.children[2], 0.4, {
            opacity: 0
        }, {
            opacity: 1,
            ease: Circ.easeOut
        });
}
/* restUserDetails
delete_cookie("email");
delete_cookie("pass"); */

function loginOrPasswordReset(ev) {
    idc("error").className = "";
    ev.preventDefault();

    var buttonE = ev.target;
    if (!buttonE.hasAttribute("clicked")) {
        buttonE.setAttribute("clicked", "true");

        var passwordCheck = gbc("forgotPass");
        var formL = idc("login").getElementsByTagName("input");

        if (passwordCheck.hasAttribute("prevPhrase")) {
            ajaxRequestToMake(urlInit + "/app/" + appVersion + "/fgpw",
                function (response) {
                    buttonE.removeAttribute("clicked");
                    var jsRes = JSON.parse(response);
                    if (jsRes.response === "success") {
                        checkLive = setInterval(function () {
                            checkIfLive();
                        }, 10000);
                        idc("error").innerHTML = "Email sent, use the link provided in the email to reset";
                        idc("error").className = "success";
                        forgotPassword(passwordCheck);
                    } else {
                        idc("error").innerHTML = jsRes.response;
                    }
                }, {
                    email: formL[0].value
                });
        } else {
            setCookie("email", formL[0].value);
            setCookie("pass", formL[1].value);

            ajaxRequestToMake(urlInit + "/app/" + appVersion + "/login",
                function (response) {
                    buttonE.removeAttribute("clicked");
                    var jsRes = JSON.parse(response);
                    if (jsRes.response === "success") {
                        checkLive = setInterval(function () {
                            checkIfLive();
                        }, 10000);
                        getMainDashboard();
                        setCookie("stringUserData", response);
                    } else {
                        idc("error").innerHTML = jsRes.response;
                    }
                }, {
                    email: formL[0].value,
                    pass: formL[1].value
                });
        }
    }
}

function forgotPassword(passwordCheck) {

    var tl = new TimelineMax();
    var login = idc("login");
    var passFieldHide = login.children[1];
    var passFieldDim = elDimensions(passFieldHide);

    if (passwordCheck.hasAttribute("prevPhrase")) {

        var passMB = parseInt(passFieldHide.getAttribute("mb"));

        passFieldHide.style.display = "block";

        tl.to(passFieldHide, 0.35, {
            scale: 1,
            marginBottom: passMB,
            height: login.children[0].offsetHeight
        });
        passwordCheck.innerHTML = passwordCheck.getAttribute("prevPhrase");
        passwordCheck.removeAttribute("prevPhrase");
        login.children[2].innerHTML = "Login";
    } else {
        var passMB = parseInt(window.getComputedStyle(passFieldHide).getPropertyValue('margin-bottom'));
        passFieldHide.setAttribute("mb", passMB);

        tl.fromTo(passFieldHide, 0.35, {
            scale: 1,
            marginBottom: passMB + "px",
            height: passFieldDim.y + "px"
        }, {
            marginBottom: "0px",
            height: "0px",
            scale: 0,
            ease: Circ.easeIn,
            onComplete: function () {
                passFieldHide.style.display = "none";
            }
        });

        passwordCheck.setAttribute("prevPhrase", passwordCheck.innerHTML);
        login.children[2].innerHTML = "Recover Password";
        passwordCheck.innerHTML = "Back to login";
    }
}
// Notifications
function checkIfLive() {
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/data/check-live",
        function (response) {
            try {
                var jsRes = JSON.parse(response);
                if (jsRes.hasOwnProperty("notifications")) {
                    if (jsRes.notifications.length != 0)
                        setCookie("recentNotifications", response);
                    if (jsRes.response === "success") {
                        if (jsRes.notifications) {
                            for (i = 0; i < jsRes.notifications.length; i++) {
                                addNotification(jsRes.notifications[i], "information");
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }

        }, {
            data: []
        });
}

function addNotification(data, nType, viewed) {
    var notif = document.createElement("div");

    if (data.hasOwnProperty("author") && data.author != null)
        var AuthorText = "<figure><img src='" + data.author.image + "'/><figcaption>";
    if (data.hasOwnProperty("updateType")) {
        switch (data.updateType) {
            case "New feature":
                AuthorText += "<section>" + '<i class="far fa-plus-square"></i><span>' + data.updateType + "</span></section>";
                break;
            case "Improvements":
                AuthorText += "<section>" + '<i class="fas fa-chart-line"></i><span>' + data.updateType + "</span></section>";
                break;
            case "News":
                AuthorText += "<section>" + '<i class="far fa-newspaper"></i><span>' + data.updateType + "</span></section>";

                break;
            case "Bug fix":
                AuthorText += "<section>" + '<i class="fas fa-bug"></i><span>' + data.updateType + "</span></section>";

                break;
        }
        notif.setAttribute("uType", replaceAll(data.updateType, " ", "-"));
    }
    AuthorText += "<p>By " + data.author.name + "</p></figcaption></figure>";
    notif.innerHTML += AuthorText;
    if (data.hasOwnProperty("title"))
        notif.innerHTML += "<h3>" + data.title + "</h3>";
    if (data.hasOwnProperty("message"))
        notif.innerHTML += "<p>" + data.message + "</p>";
    if (data.hasOwnProperty("image"))
        notif.innerHTML += "<img src='" + data.image + "'/>";

    switch (nType) {
        case "success":
            notif.className = "success";
            break;
        case "error":
            notif.className = "failed";
            break;
        case "information":
            notif.className = "info";
            break;
    }

    idc("notification").insertBefore(notif, idc("notification").firstChild);
    TweenMax.fromTo(notif, 0.3, {
        y: 30,
        opacity: 0,
        scale: 0,
        transformOrigin: "95% 4%"
    }, {
        y: 0,
        opacity: 1,
        scale: 1
    });
    if (viewed != true)
        notifCount();
}

function notifCount() {
    var notif = idc("notification");
    var alertSystem = idc("alertSystem");

    alertSystem.setAttribute("notifCount", notif.children.length);
    alertSystem.setAttribute("notifViewed", "false");
}

function toggleAlerts() {
    var notif = idc("notification");
    var alertSystem = idc("alertSystem");
    var tl = new TimelineMax();
    if (alertSystem.getAttribute("open") == "true") {
        alertSystem.setAttribute("open", "false");
        tl
            .staggerFromTo(notif.children, 0.15, {
                y: 0,
                opacity: 1,
                scale: 1
            }, {
                y: 30,
                opacity: 0,
                scale: 0
            }, 0.05)
            .set(notif, {
                display: "none"
            });
    } else {
        var yPos = findPos(alertSystem).y + elDimensions(alertSystem).y;
        var xPos = -(getWidth() - findPos(alertSystem).x - elDimensions(alertSystem).x);
        tl.set(notif, {
                x: xPos,
                y: yPos,
                height: (getHeight() - yPos) + "px",
                display: "block",
                maxWidth: xPos + "px"
            })
            .staggerFromTo(notif.children, 0.3, {
                y: 30,
                opacity: 0,
                scale: 0,
                transformOrigin: "95% 4%"
            }, {
                y: 0,
                opacity: 1,
                scale: 1
            }, 0.1);
        alertSystem.setAttribute("notifViewed", "true");
        alertSystem.setAttribute("open", "true");
    }
}

function loadOldNotifs() {
    if (getCookie("recentNotifications")) {
        var jsRes = JSON.parse(getCookie("recentNotifications"));
        if (jsRes.response === "success") {
            if (jsRes.notifications) {
                for (i = 0; i < jsRes.notifications.length; i++) {
                    addNotification(jsRes.notifications[i], "information", true);
                }
            }
        }
    }
}
// User Message
function successMessage(messageSuc) {
    var sucMessage = document.createElement("div");
    sucMessage.className = "success";
    sucMessage.innerHTML = '<span class="fa-stack fa-2x"> <i class="fas fa-circle fa-stack-2x"></i> <i class="fas fa-check fa-stack-1x "></i></span><span>' + messageSuc + "</span>";

    var alertBox = idc("alertBox");
    alertBox.appendChild(sucMessage);

    TweenMax.fromTo(sucMessage, 0.35, {
        x: "-100%",
        opacity: 0
    }, {
        x: "0%",
        opacity: 1,
        ease: Circ.easeOut
    });

    setTimeout(function () {
        var sucWidth = sucMessage.clientWidth;
        var sucHeight = sucMessage.clientHeight;
        console.log(sucWidth);
        TweenMax.fromTo(sucMessage, 0.35, {
            x: "0%",
            opacity: 1,
            width: sucWidth + "px",
            height: sucHeight + "px"
        }, {
            x: "-100%",
            opacity: 0,
            width: "0px",
            ease: Circ.easeOut,
            onComplete: function () {
                sucMessage.style.display = "none";
            }
        });
    }, 2000);
}

function errorMessage(messageSuc) {
    var sucMessage = document.createElement("div");
    sucMessage.className = "error";
    sucMessage.innerHTML = '<span class="fa-stack fa-2x"><i class="fas fa-exclamation-triangle"></i></span><span>' + messageSuc + "</span>";

    var alertBox = idc("alertBox");
    alertBox.appendChild(sucMessage);

    TweenMax.fromTo(sucMessage, 0.35, {
        x: "-100%",
        opacity: 0
    }, {
        x: "0%",
        opacity: 1,
        ease: Circ.easeOut
    });

    setTimeout(function () {
        var sucWidth = sucMessage.clientWidth;
        var sucHeight = sucMessage.clientHeight;
        console.log(sucWidth);
        TweenMax.fromTo(sucMessage, 0.35, {
            x: "0%",
            opacity: 1,
            width: sucWidth + "px",
            height: sucHeight + "px"
        }, {
            x: "-100%",
            opacity: 0,
            width: "0px",
            ease: Circ.easeOut,
            onComplete: function () {
                sucMessage.style.display = "none";
            }
        });
    }, 6000);
}

// User functions 
function getUserDataCookie() {
    if (hasCookie("stringUserData"))
        return JSON.parse(getCookie("stringUserData"))["userdata"];
}
// Dashboard
function toggleMobile(ele) {
    var pLinks = idc("panelLinks");
    var pLinksLi = idc("panelLinks").getElementsByTagName("li");
    var tl = new TimelineMax();
    if (ele.getAttribute("active") == "true") {
        ele.setAttribute("active", "false");
        tl.staggerFromTo(pLinksLi, 0.15, {
                y: 0,
                opacity: 1
            }, {
                y: 30,
                opacity: 0,
                ease: Circ.easeOut
            }, 0.04, "-=0.3")
            .fromTo(pLinks, 0.4, {
                opacity: 1
            }, {
                opacity: 0,
                onComplete: function () {
                    idc("panelLinks").style.display = "none";
                }
            }, 0.25);
    } else {
        ele.setAttribute("active", "true");
        pLinks.style.display = "block";
        tl.fromTo(pLinks, 0.4, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Circ.easeOut
            })
            .staggerFromTo(pLinksLi, 0.2, {
                y: 30,
                opacity: 0,
                scale: 0,
                transformOrigin: "50% 100%"
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: Circ.easeOut
            }, 0.05, "-=0.3");
    }
}

function getMainDashboard() {
    var userData = getUserDataCookie();
    checkIfLive();
    ajaxRequestGet("pages/dashboard.html",
        function (response) {
            idc("app").innerHTML = response;
            idc("clientDeats").children[1].innerHTML = userData["company"];
            idc("clientDeats").children[0].children[0].src = "https://dash.prinabox.com/" + userData["image_url"];

            ajaxRequestGet(urlInit + "/app/" + appVersion + "/element/getNavigation?type=app",
                function (response) {
                    var navMenu = idc("navMenu");
                    navMenu.innerHTML = response;
                    navMenu.children[0].className = "alignFlex";
                    navMenu.getElementsByTagName("li")[0].className = "active";
                    setDashboardDimensions();
                    // test load page
                    loadMainDashboard();
                });
            loadOldNotifs();

            // loadElement("support-time");
            // loadElement("tasks");
            // loadElement("stats");
        }, "");
}

function loadMainDashboard() {
    idc("main").innerHTML = "";
    idc("main").className = "dash";
    loadElement("timeline");
    loadElement("tasks");
    loadElement("stats");
    loadElement("support-time");
    loadElement("tokens");
    var pLinkId = "dash";
    ajaxRequestGet("pages/css/" + pLinkId + ".css",
        function (cssDa) {
            var cssAdd = document.createElement("style");
            cssAdd.innerHTML = cssDa;
            idc("main").appendChild(cssAdd);
            var jsAdd = document.createElement("script");
            jsAdd.src = "pages/js/" + pLinkId + ".js";
            idc("main").appendChild(jsAdd);
        });
    setTimeout(function () {
        idc("main").appendChild(idc("timeline"));
        idc("main").appendChild(idc("tasksLeft"));
        idc("main").appendChild(idc("statsLeft"));
        idc("main").appendChild(idc("supportTime"));
        idc("main").appendChild(idc("tokensLeft"));
        timelineInit();
        loading(0);
        setTimeout(function () {
            loadExternalElement("recent-news");
        }, 1000);
    }, 500);
}

function setDashboardDimensions() {
    var clientDeats = idc("clientDeats");
    var panelLinks = idc("panelLinks");

    panelLinks.style.height = "calc(100% - " + elDimensions(clientDeats, "All").y + "px)";
    idc("main").style.height = "calc(100% - " + elDimensions(clientDeats, "All").y + "px)";
}
addResizeEvent(setDashboardDimensions);

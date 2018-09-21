function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = encodeURIComponent(value) +
        ((exdays == null) ? "" : ("; expires=" + exdate.toUTCString()));
    document.cookie = c_name + "=" + c_value;
}

function hasCookie(c_name) {
    if (document.cookie.indexOf(c_name + "=") >= 0)
        return true;
    else
        return false;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return decodeURIComponent(y);
        }
    }
}
var delete_cookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function idc(id) {
    return document.getElementById(id);
}

function gbc(id, parentEl) {
    if (parentEl)
        return parentEl.getElementsByClassName(id)[0];
    else
        return document.getElementsByClassName(id)[0];
}

function capitalizeTxt(txt) {
    if (txt != "undefined" && txt != null)
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    else return "";
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function ajaxRequestToMake(url, callback, data) {
    var callback = (typeof callback == 'function' ? callback : false),
        xhr = null;
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        try {
            ajxhrax = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;

    // Turn the data object into an array of URL-encoded key/value pairs.
    for (name in data) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }

    // Combine the pairs into a single string and replace all %-encoded spaces to 
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    if (!xhr)
        return null;

    xhr.timeout = 30000;
    if (test && !url.includes("http")) {
        url = "http://192.168.56.1:3000/pages/dashboard.html";
    }
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && callback) {
            if (xhr.responseText == "" || xhr.responseText.includes("connect ETIMEDOUT"))
                callback('{"response":"Connection timed out", "result":"error"}');
            else
                callback(xhr.responseText);
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(urlEncodedData);
    return xhr;
}

function ajaxRequestGet(url, callback, wait) {
    var callback = (typeof callback == 'function' ? callback : false),
        xhr = null;
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        try {
            ajxhrax = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    if (!xhr)
        return null;
    if (wait)
        xhr.open("GET", url, false);
    else {
        xhr.open("GET", url, true);
        xhr.timeout = 30000;
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && callback) {
            if (xhr.responseText == "" || xhr.responseText.includes("connect ETIMEDOUT"))
                callback('{"response":"Connection timed out", "result":"error"}');
            else
                callback(xhr.responseText);
        }
    }
    xhr.send();
    return xhr;
}

function getWidth() {
    var body = document.body,
        html = document.documentElement;
    return Math.max(
        html.clientWidth);
}

function getHeight() {
    var body = document.body,
        html = document.documentElement;

    return Math.max(html.clientHeight);
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function addResizeEvent(func) {
    var oldonresize = window.onresize;
    if (typeof window.onresize != 'function') {
        window.onresize = func;
    } else {
        window.onresize = function () {
            if (oldonresize) {
                oldonresize();
            }
            func();
        }
    }
}

function addScrollEvent(func) {
    var oldonresize = window.onscroll;
    if (typeof window.onscroll != 'function') {
        window.onscroll = func;
    } else {
        window.onscroll = function () {
            if (oldonresize) {
                oldonresize();
            }
            func();
        }
    }
}

function dateFromDay(year, day) {
    var date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function findPos(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            x: curleft,
            y: curtop
        };
    }
    return undefined;
}

function elDimensions(el, dimType) {
    if (!el)
        return undefined;
    switch (dimType) {
        case "Scroll":
            return {
                x: el.scrollWidth,
                y: el.scrollHeight
            };
            break;
        case "All":
            var elHeight = el.offsetHeight;
            elHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top')) + parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'));

            var elWidth = el.offsetWidth;
            elWidth += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top')) + parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'));

            return {
                x: elWidth,
                y: elHeight
            };
            break;
        case "Padding":
            return {
                x: el.offsetWidth,
                y: el.offsetHeight
            };
            break;
        case "Client":
            return {
                x: el.clientWidth,
                y: el.clientHeight
            };
            break;
        default:
            var elHeight = el.offsetHeight;
            elHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top')) + parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'));

            var elWidth = el.offsetWidth;
            elWidth += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top')) + parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'));

            return {
                x: elWidth,
                y: elHeight
            };
            break;
    }
}

function insideOtherArea(overArea, innerArea) {
    var insideTrue = false;

    var overArea = overArea.getBoundingClientRect();
    var innerArea = innerArea.getBoundingClientRect();
    if (overArea.left < innerArea.right && (overArea.bottom > innerArea.top || overArea.top < innerArea.bottom))
        insideTrue = true;
    return insideTrue;
}

function openOverlay(el) {
    var closeButton = el.getElementsByClassName("closeButton");
    el.style.display = "block";
    if (closeButton.length == 0) {
        var closeEl = document.createElement("button");
        closeEl.className = "closeButton";
        closeEl.innerHTML = "Close";
        el.insertBefore(closeEl, el.children[0]);
        closeEl.onclick = function () {
            el.style.display = "none";
        }
    }
}

function loading(active) {
    var tl = new TimelineMax();
    if (active) {
        idc("loader").style.display = "block";
        tl.fromTo(idc("main"), 0.4, {
                opacity: 1
            }, {
                opacity: 0,
                ease: Circ.easeOut
            })
            .fromTo(idc("loader"), 0.4, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Circ.easeOut
            });
    } else {
        tl.fromTo(idc("loader"), 0.4, {
                opacity: 1
            }, {
                opacity: 0,
                ease: Circ.easeOut
            })
            .fromTo(idc("main"), 0.4, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Circ.easeOut,
                onComplete: function () {

                    idc("loader").style.display = "none";
                }
            });
    }
}

function loadPanel(ele) {
    toggleMobile(idc("mobileMenu"));
    loading(1);

    if (ele.getAttribute("linkid") == "dash") {
        loadMainDashboard();
        return;
    }


    ajaxRequestGet(urlInit + "/app/" + appVersion + "/page/" + ele.getAttribute("linkid"),
        function (response) {
            loading(0);
            idc("main").innerHTML = response;
            var pLinkId = replaceAll(ele.getAttribute("linkid"), "_", "");
            idc("main").className = pLinkId;

            var jsAdd = document.createElement("script");
            jsAdd.src = "pages/js/" + pLinkId + ".js";
            ajaxRequestGet("pages/css/" + pLinkId + ".css",
                function (cssDa) {

                    var cssAdd = document.createElement("style");
                    cssAdd.innerHTML = cssDa;
                    idc("main").appendChild(cssAdd);
                    idc("main").appendChild(jsAdd);
                });
        });
}

function loadSingleModule(ele, element) {
    loading(1);

    var addExtra = "";
    if (ele.className.includes("add"))
        addExtra = '?add=add';
    else
        addExtra = '?projid=' + ele.parentNode.children[0].id;
    ajaxRequestGet(urlInit + "/app/" + appVersion + "/element/" + element + addExtra,
        function (response) {
            loading(0);
            idc("main").innerHTML = response;
            idc("main").className = element;

            var jsAdd = document.createElement("script");
            jsAdd.src = "pages/js/" + element + ".js";
            ajaxRequestGet("pages/css/" + element + ".css",
                function (cssDa) {
                    var cssAdd = document.createElement("style");
                    cssAdd.innerHTML = cssDa;
                    idc("main").appendChild(cssAdd);
                    idc("main").appendChild(jsAdd);
                });
        });
}

function loadElement(element, afterload) {

    ajaxRequestGet("pages/element/" + element + "/" + element + ".html",
        function (response) {
            idc("main").innerHTML += response;
            idc("main").className += " " + element;

            var jsAdd = document.createElement("script");
            jsAdd.src = "pages/element/" + element + "/" + element + ".js";
            idc("main").appendChild(jsAdd);
            if (afterload)
                afterload();
        });
}

function loadExternalElement(element) {
    ajaxRequestGet(urlInit + "/app/" + appVersion + "/element/" + element,
        function (response) {
            idc("main").innerHTML += response;
            idc("main").appendChild(idc("lastestNews"));
        });
}

function shiftPages(mainid, newID, funcAll) {

    TweenMax.fromTo(idc(mainid), 0.5, {
        x: "0%",
        opacity: 1
    }, {
        x: "-100%",
        opacity: 0,
        ease: Circ.easeOut,
        onComplete: function () {
            idc(mainid).style.display = "none";
            idc(newID).style.display = "block";
            TweenMax.fromTo(idc(newID), 0.5, {
                x: "100%",
                opacity: 0
            }, {
                x: "0%",
                opacity: 1,
                ease: Circ.easeOut
            });
            if (funcAll) {
                window[funcAll]();
                console.log("func all called");
            }
        }
    });
}

//delete
function deleteModule(el, mType) {
    var eleMade = el.parentNode;
    var molId = eleMade.children[0].id;
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/delete-module",
        function (response) {
            var jsRes = JSON.parse(response);
            if (jsRes.response === "success") {
                eleMade.parentNode.removeChild(eleMade);
            } else {
                //addError("Could not be deleted");
            }
        }, {
            metaid: molId,
            metatype: mType
        });
}

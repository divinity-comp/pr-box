
function toggleSocialActive(ele) {
    if(ele.getAttribute("active") == "true") {
        ele.setAttribute("active","false");
    }
    else {
        ele.setAttribute("active","true");
    }
}
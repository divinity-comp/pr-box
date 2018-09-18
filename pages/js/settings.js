
function arrayUpdategroup(ele) {
    var groupM = document.getElementsByClassName(ele.getAttribute("group"));
    var groupS = document.getElementsByClassName(ele.getAttribute("selectgroup"));

    var buttonArray = ele.parentNode.children;
    for (i = 0; i < buttonArray.length; i++) {
        buttonArray[i].setAttribute("active", "false");
    }
    ele.setAttribute("active", "true");

    TweenMax.fromTo(groupM, 0.5, {
        x: "0%",
        opacity: 1
    }, {
        x: "-100%",
        opacity: 0,
        ease: Circ.easeIn,
        onComplete: function() {
            TweenMax.set(groupM, {
                display: "none"
            });
            TweenMax.set(groupS, {
                display: "block"
            });
            TweenMax.fromTo(groupS, 0.5, {
                x: "100%",
                opacity: 0
            }, {
                x: "0%",
                opacity: 1,
                ease: Circ.easeOut
            });
        }
    });
}
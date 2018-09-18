function supportTimeGet() {
    var supportTime = idc("supportTime");
    supportTime.style.opacity = "0";
    ajaxRequestGet(urlInit + "/app/"+ appVersion + "/data/support-data",
        function(response) {
        if(response.includes("success")) {
            var supportJSON = JSON.parse(response);
            idc("supportTime").getElementsByTagName("h3")[0].innerHTML = supportJSON["supporttime"];
            var tl = new TimelineMax();
            tl.fromTo(supportTime, 0.4, {
            opacity: 0
            }, {
                opacity: 1,
                ease: Circ.easeOut
            })
            .fromTo(supportTime.children[0], 0.4, {
            scale: 0
            }, {
                scale: 1,
                ease: Circ.easeOut
            })
            .fromTo(supportTime.children[0].children[0], 0.4, {
            scale: 0
            }, {
                scale: 1,
                ease: Circ.easeOut
            })
            .fromTo(supportTime.children[0].children[0].children, 0.4, {
            opacity: 0,
                y:20
            }, {
                opacity: 1,
                y:0,
                ease: Circ.easeOut
            });
        }
    });
}
supportTimeGet();
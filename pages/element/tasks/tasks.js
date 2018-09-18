function tasksSet() {
    var tasksSet = idc("tasksLeft");
    tasksSet.style.opacity = "0";
    var taskAmount = parseInt(getCookie("tasksAmount"));
    tasksSet.getElementsByTagName("h2")[0].innerHTML = taskAmount;
    var tl = new TimelineMax();
    tl.fromTo(tasksSet, 0.4, {
    opacity: 0
    }, {
        opacity: 1,
        ease: Circ.easeOut
    })
    .fromTo(tasksSet, 0.4, {
    scale: 0
    }, {
        scale: 1,
        ease: Circ.easeOut
    })
    .fromTo(tasksSet.children[0], 0.4, {
    scale: 0
    }, {
        scale: 1,
        ease: Circ.easeOut
    })
    .fromTo(tasksSet.children[0].children, 0.4, {
    opacity: 0,
        y:20
    }, {
        opacity: 1,
        y:0,
        ease: Circ.easeOut
    });
}
tasksSet();
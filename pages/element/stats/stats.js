function statsSet() {
    var statSet = idc("statsLeft");
    statSet.style.opacity = "0";
    var taskAmount = 114;
    statSet.getElementsByTagName("h2")[0].innerHTML = taskAmount;
    var tl = new TimelineMax();
    tl.fromTo(statSet, 0.4, {
    opacity: 0
    }, {
        opacity: 1,
        ease: Circ.easeOut
    })
    .fromTo(statSet, 0.4, {
    scale: 0
    }, {
        scale: 1,
        ease: Circ.easeOut
    })
    .fromTo(statSet.children[0], 0.4, {
    scale: 0
    }, {
        scale: 1,
        ease: Circ.easeOut
    })
    .fromTo(statSet.children[0].children, 0.4, {
    opacity: 0,
        y:20
    }, {
        opacity: 1,
        y:0,
        ease: Circ.easeOut
    });
}
statsSet();
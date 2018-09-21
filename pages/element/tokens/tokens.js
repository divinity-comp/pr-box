function tokensLSet() {
    var tokensL = idc("tokensLeft");
    tokensL.style.opacity = "0";
    ajaxRequestGet(urlInit + "/app/" + appVersion + "/data/tokens-data",
        function (response) {
            if (response.includes("success")) {
                var tokensLJSON = JSON.parse(response);
                tokensL.getElementsByTagName("h2")[0].innerHTML = tokensLJSON["tokens"];
                var tl = new TimelineMax();
                tl.fromTo(tokensL, 0.4, {
                        opacity: 0
                    }, {
                        opacity: 1,
                        ease: Circ.easeOut
                    })
                    .fromTo(tokensL.children[0], 0.4, {
                        scale: 0
                    }, {
                        scale: 1,
                        ease: Circ.easeOut
                    })
                    .fromTo(tokensL.children[0].children[0], 0.4, {
                        scale: 0
                    }, {
                        scale: 1,
                        ease: Circ.easeOut
                    })
                    .fromTo(tokensL.children[0].children[0].children, 0.4, {
                        opacity: 0,
                        y: 20
                    }, {
                        opacity: 1,
                        y: 0,
                        ease: Circ.easeOut
                    });
            }
        });
}
tokensLSet();

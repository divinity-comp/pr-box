
        var tmLoaded = setInterval(function(){  
            if(idc("timeline").getAttribute("loaded")) {

                clearInterval(tmLoaded)
                    loadTimeline();
            }                      
        }, 400);
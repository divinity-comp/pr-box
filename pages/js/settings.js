function updateUser(ev) {
    ev.preventDefault();
    var updateUserData = document.getElementById("updateUserData").getElementsByTagName("input");
    var validFormData = {};
    for(i = 0; i < updateUserData.length;i++) {
        validFormData[updateUserData[i].getAttribute("name")] =  updateUserData[i].value ;
    }
    
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/settings/update-prof.php",
        function(response) {
        if(response == "success") {
            successMessage("Profile updated");
        }
        else {
            errorMessage("Error updating profile please try again");
        }
    },  validFormData);
}

function getMailData() {
    
    if(idc("mailData")) {
        var jsonMail = JSON.parse(idc("mailData").innerHTML);
        var mailingDetails = idc("MailingDetails").getElementsByTagName("input");
        mailingDetails[0].value = jsonMail["email"];
        mailingDetails[2].value = jsonMail["security"];
        mailingDetails[3].value = jsonMail["outgoing"];
        mailingDetails[4].value = jsonMail["port"];
    }
}
getMailData();

	function forgotPassword(ev) {
        ev.preventDefault();
        var forgetPass = idc("forgotPass");
        forgetPass.style.display = "block";   
        var tl = new TimelineLite();
        tl.fromTo(forgetPass, 0.5,{opacity:0},{opacity:1, ease: Circ.easeOut})
        .fromTo(forgetPass.children, 0.5,{scale:0},{scale:1, ease: Circ.easeOut},"-=0.25");
	}
	function closePassword() {
        var forgetPass = idc("forgotPass");
		
        var tl = new TimelineLite();
		tl
		.fromTo(forgetPass.children, 0.5,{scale:1},{scale:0, ease: Circ.easeOut})
		.fromTo(forgetPass, 0.5,{opacity:1},{opacity:0, ease: Circ.easeOut,onComplete:function() {
			forgetPass.style.display = "none";   
		}},"-=0.25");
	}
	function forgotPassCheck(ev) {
        ev.preventDefault();
        ajaxRequestToMake(urlInit + "/app/" + appVersion + "/fgpw.php",
            function(response) {
                if(response == "success") {
                    document.getElementById("passMessage").className = "success";
                    document.getElementById("passMessage").innerHTML = "Password reset link sent";
                }
            else {
				document.getElementById("passMessage").innerHTML = response;
            }
        }, "email=" + document.getElementById("forgotPassForm").children[0].value);
	}
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
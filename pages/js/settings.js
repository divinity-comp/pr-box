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


var mailingsettingList = [
 {
   "FIELD1": "Googlemail - Gmail",
   "FIELD2": "smtp.gmail.com",
   "FIELD3": "SSL",
   "FIELD4": 465
 },
 {
   "FIELD1": "Google business - Gmail",
   "FIELD2": "smtp.gmail.com",
   "FIELD3": "StartTlS",
   "FIELD4": 587
 },
 {
   "FIELD1": "Outlook.com",
   "FIELD2": "smtp.live.com",
   "FIELD3": "StartTLS",
   "FIELD4": 587
 },
 {
   "FIELD1": "Office365.com",
   "FIELD2": "smtp.office365.com",
   "FIELD3": "StartTLS",
   "FIELD4": 587
 },
 {
   "FIELD1": "Yahoo Mail",
   "FIELD2": "smtp.mail.yahoo.com",
   "FIELD3": "SSL",
   "FIELD4": 465
 },
 {
   "FIELD1": "Yahoo UK Mail",
   "FIELD2": "smtp.mail.yahoo.co.uk",
   "FIELD3": "SSL",
   "FIELD4": 465
 },
 {
   "FIELD1": "Yahoo Mail Plus",
   "FIELD2": "plus.smtp.mail.yahoo.com",
   "FIELD3": "SSL",
   "FIELD4": 465
 },
 {
   "FIELD1": "AOL.com",
   "FIELD2": "smtp.aol.com",
   "FIELD3": "StartTLS",
   "FIELD4": 587
 },
 {
   "FIELD1": "Hotmail",
   "FIELD2": "smtp.live.com",
   "FIELD3": "SSL",
   "FIELD4": 465
 },
 {
   "FIELD1": "1&1 (1and1)",
   "FIELD2": "smtp.1and1.com",
   "FIELD3": "StartTLS",
   "FIELD4": 587
 },
 {
   "FIELD1": "Mail.com",
   "FIELD2": "smtp.mail.com",
   "FIELD3": "StartTLS",
   "FIELD4": 587
 },
 {
   "FIELD1": "fast.co.uk",
   "FIELD2": "smtp.gofast.co.uk",
   "FIELD3": "",
   "FIELD4": 25
 },
 {
   "FIELD1": "123Reg",
   "FIELD2": "smtp.123-reg.co.uk",
   "FIELD3": "SSL",
   "FIELD4": 465
 }
];
function openSettingList(ev,singleSave) {
    ev.preventDefault();
    loadMailingSettings();
    openOverlay(idc("mailsettingsList"));
}
function loadMailingSettings() {
    if(idc("mailSettingcon")) {
        
    idc("mailSettingcon").innerHTML = "";
    var mailSettingcon = idc("mailSettingcon");
    if(mailSettingcon.children.length == 0) {
        for(i =0;i < mailingsettingList.length;i++) (function(i){ 
            var newConButton = document.createElement("button");
            newConButton.innerHTML = mailingsettingList[i]["FIELD1"];
            var mailingDetails = idc("MailingDetails").getElementsByTagName("input");
            newConButton.onclick = function() {
                mailingDetails[2].value = mailingsettingList[i]["FIELD3"];
                mailingDetails[3].value = mailingsettingList[i]["FIELD2"];
                mailingDetails[4].value = mailingsettingList[i]["FIELD4"];
                if(mailingsettingList[i]["FIELD2"] ==  "smtp.gmail.com") {
                    idc("mailSettingcon").innerHTML = '<h2>You selected a google email account</h2><p>Please follow these steps</p><ol><li>Go to the following link - <a href="https://myaccount.google.com/lesssecureapps" target="_blank">https://myaccount.google.com/lesssecureapps</a></li><li>If it requires admin access, go to this link - <a href="https://support.google.com/a/answer/6260879?hl=en" target="_blank">https://support.google.com/a/answer/6260879?hl=en</a> and follow the instructions provided</li><li>Allow less secure apps <br><img src="https://dash.prinabox.com/assets/less-secure-apps.png"/></li></ul>';
                }
                else
                    idc("mailsettingsList").children[0].click();
            }
            mailSettingcon.appendChild(newConButton);
        })(i);

        }
    }
}
var mailerDeat;
function saveMailingDetails(ev) {
    ev.preventDefault();
    var MailingDetails = idc("MailingDetails").getElementsByTagName("input");
    var jsonString = "{";
    var passStore = "";
    for(i = 0; i < MailingDetails.length;i++) {
        if(MailingDetails[i].name !== "password") {
        if(i != 0) {
            jsonString += ",";
        }
        jsonString += '"' + MailingDetails[i].name + '":"' + MailingDetails[i].value + '"'; 
            
        }
        else {
            passStore = MailingDetails[i].value;
        }
    }
    jsonString += "}";
    mailerDeat = JSON.parse(jsonString);
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/store-session.php",
                      function(response) {
        if(response != "failed") {
            successMessage("Stored password - only avaliable for this session");
        }
        else {
            errorMessage("Could not store password");
        }
    },{"value":passStore,"type":"mailpass"});
                      
    ajaxRequestToMake(urlInit + "/app/" + appVersion + "/update/user-meta.php",
        function(response) {
        if(response != "failed") {
            successMessage("Mailing data saved");
        }
        else {
            errorMessage("Could not be saved");
        }
        console.log(response);
    },{"metavalue":jsonString,"metatype":"mailing-user"});
    
}
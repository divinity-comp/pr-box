function adminPageLoad(el,num) {
    var adminNav = gbc("adminNav").children;
    
    for(i = 0; i < adminNav.length;i++) {
        adminNav[i].className = "";
    }
    adminNav[num].className = "active";
}
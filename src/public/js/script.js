//###############################################Navigation###############################################//
//--------------------------------------Sidebar initialization--------------------------------------//
/*var sidebarMenu = new profile.navigations.Sidebar({
 width:      '290px',
 dockSize:   "44px",
 enableDock: true,
 target:     '.main-content',
 mediaQuery: '(min-width: 600px)',
 created:    oncreate,
 close:      onClose
 });
 sidebarMenu.appendTo('#sidebar-treeview');*/
//--------------------------------------end of sidebar initialization--------------------------------------//

var data = [];


/*// Toggle the Sidebar
 document.getElementById('hamburger').addEventListener('click', function () {
 if (sidebarMenu.isOpen) {
 sidebarMenu.hide();
 // TODO: Set up menu tree.
 //menuTreeView.collapseAll();
 }
 else {
 sidebarMenu.show();
 // TODO: Set up menu tree.
 //menuTreeView.expandAll();
 }
 });*/

sidebarButton.onclick = function () {
    console.log("Sidebar opened...");
    document.getElementById("sidebarMenu").classList.toggle("show");
};

window.onclick = function (e) {
    console.log("window clicked...");
    if (!e.target.matches('#sidebarButton')) {
        let sidebarMenu = document.getElementById("sidebarMenu");
        if (sidebarMenu.classList.contains('show')) {
            sidebarMenu.classList.remove('show');
            console.log("Sidebar closed...");
        }
    }
};




function oncreate() {
    this.element.style.visibility = '';
};


function onClose() {
    //menuTreeView.collapseAll();
};


///-------------------------------------------Click Functions-------------------------------------------\\\

/// Search Button Pressed
function SearchDatabase(search_str) {
    search_str.forEach(result => {
        let resultsCanvas = document.getElementById(`search-anchor"`)

        const resultDivider = resultsCanvas.createElement("div");

    })
};



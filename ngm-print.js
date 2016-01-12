
// user, colWidth

var steps=[];
var testindex = 0;
var loadInProgress = false;//This is set to true when a page is still loading
var user = {
    "id": "5671a1be6b54deaf479b6c93",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzaWQiOiI1NjcxYTFiZTZiNTRkZWFmNDc5YjZjOTMiLCJpYXQiOjE0NTA2Njk1MDF9.SaJkLa7c1Zt5i7YS3JstcBiWvCwA2v_as-r7q3ATfng",
    "organization": "immap",
    "username": "pfitzpaddy",
    "email": "pfitzgerald@immap.org",
    "roles": [ "USER" ]
}

/*********SETTINGS*********************/
var webPage = require('webpage');
var page = webPage.create();
page.settings.javascriptEnabled = true;
page.viewportSize = { width: 1024, height: 1448 };
page.settings.loadImages = true; //Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
page.customHeaders = {
  "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzaWQiOiI1NjcxYTFiZTZiNTRkZWFmNDc5YjZjOTMiLCJpYXQiOjE0NTA2Njk1MDF9.SaJkLa7c1Zt5i7YS3JstcBiWvCwA2v_as-r7q3ATfng"
};
/*********SETTINGS END*****************/

console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
/**********DEFINE STEPS THAT FANTOM SHOULD DO***********************/
steps = [

    //Step 1 - Write localstorage
    function(){
        console.log('Step 1 - Write localstorage');
        localStorage.setItem('auth_token', user);
    },
    //Step 2 - Read localstorage
    function(){
        console.log('Step 2 - Read storage');
        console.log(localStorage.getItem('auth_token'));
    },

    //Step 3 - Open ReportHub home page
    function(){
        console.log('Step 3 - Open ReportHub home page');
        page.open("http://192.168.33.10/#/who/dews/afghanistan/all", function(status){
        // page.open("http://192.168.33.10/#/immap/watchkeeper/kenya", function(status){
        // page.open("http://192.168.33.10/#/immap/drr/flood/afghanistan", function(status){
            //
        });
    },
    //Step 4 - Set username (username already focused)
    function(){
        console.log('Step 4 - Set username');
        page.sendEvent("keypress", "pfitzpaddy");

    },
    //Step 5 - Set password
    function(){
        // almost working
        console.log('Step 5 - Set password');
        page.evaluate(function(){
            $("#ngm-password").focus();
        });
        page.sendEvent("keypress", "P@trick7");
    },    
    //Step 6 - Populate and submit the login form
    function(){
        console.log('Step 6 - Submit the login form');
        page.evaluate(function(){
            $("#ngm-login-submit").click();
        });
    }
];
/**********END STEPS THAT FANTOM SHOULD DO***********************/

//Execute steps one by one
interval = setInterval(executeRequestsStepByStep, 50);

function executeRequestsStepByStep(){
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        //console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        print();
        return;
    }
}

function print(){
    window.setTimeout(function () {
        console.log("Step 7 - Update page layout for print");
        page.evaluate(function(){
            
            // hide side nav
            $(".side-nav").css({ 'width': '0px' });
            // hide footer
            $("#ngm-menu-footer-1").css({ 'display': 'none' });
            $("#ngm-menu-footer-2").css({ 'display': 'none' });
            // left/right padding
            $("#ngm-report").css({ 'padding-left': '90px' });
            $("#ngm-report").css({ 'padding-right': '90px' });
            // hide download btn
            $("#ngm-report-download").css({ 'display': 'none' });
            // title size adjustment
            $("#ngm-report-title").css({ 'font-size': '3.1rem' });
            // position date range 
            $("#ngmDateContainer-0").css({ 'margin-top': '-54px', 'margin-left': '74%' });
            $("#ngmDateContainer-1").css({ 'margin-top': '-54px' });

            // include avatar
            // $("#ngm-print-avatar").css({ 'display': 'block' });

            // fix layout issue - for each row
            $('.row.ng-isolate-scope').each(function(i, row){
                // for each widget
                $(row).children().each(function(j, w){
                    // if col is not full length
                    if ($(w).attr('class').search('l12') === -1) {
                        // get width
                        var width = ((parseInt($(w).attr('class').slice(-1)) / 12) * 100).toFixed(2);
                        // update widget width
                        $(w).css({ 'width': width + '%' });
                    }
                });
            });
            // hide map controls
            $(".leaflet-control-container").css({ 'display': 'none' });
            // display download date
            $("#ngm-report-extracted").css({ 'display': 'block' });
        });
        
        // create pdf
        page.render('pdf/report_' + Math.round(new Date() / 1000) + '.pdf');
        phantom.exit();

    }, 7600);
}

/**
 * These listeners are very important in order to phantom work properly. Using these listeners, we control loadInProgress marker which controls, weather a page is fully loaded.
 * Without this, we will get content of the page, even a page is not fully loaded.
 */
page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('Loading started');
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('Loading finished');
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
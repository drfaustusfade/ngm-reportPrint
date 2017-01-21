//
var steps=[];
var testindex = 0;
var loadInProgress = false;

//
var fs = require('fs');
var args = require('system').args;
var report = args[1],
    url = args[2],
    cluster = args[3],
    username = args[4],
    token = args[5],
    adminRpcode = args[6],
    adminRname = args[7],
    admin0pcode = args[8],
    admin0name = args[9],
    pageLoadTime = args[10],
    viewportWidth = args[11] ? args[11] : 1200,
    viewportHeight = args[12] ? args[12] : 1448;
    
// construct
var user = {
    cluster: cluster,
    username: username,
    token: token,
    adminRpcode: adminRpcode,
    adminRname: adminRname,
    admin0pcode: admin0pcode,
    admin0name: admin0name,
    roles: [ "USER", "ADMIN" ]
}

/*********SETTINGS*********************/
var webPage = require('webpage');
var page = webPage.create();
page.settings.javascriptEnabled = true;
page.settings.loadImages = true;
// page.viewportSize = { width: 1024, height: 1448 };
page.viewportSize = { width: viewportWidth, height: viewportHeight };
page.zoomFactor = 1.0199;
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
/*********SETTINGS END*****************/

console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

/**********DEFINE STEPS THAT FANTOM SHOULD DO***********************/

steps = [

    // Step 1 - Set localStorage
    function(){
        //
        console.log('Step 1 - Set localStorage');
        //
        page.open(url, function(status){
            page.evaluate(function(user){
                // localStorage.clear();
                console.log(user.cluster);
                console.log(user.username);
                localStorage.setItem('auth_token', JSON.stringify(user));
            }, user);
        });
    },

    // Step 2 - Open ReportHub home page
    function(){
        //
        console.log('Step 2 - Open ReportHub home page');
        //
        page.open(url, function(status){});
    }

];
/**********END STEPS THAT FANTOM SHOULD DO***********************/

//Execute steps one by one
interval = setInterval(executeRequestsStepByStep, 100);

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
            $(".ngm-menu").css({ 'width': '0px' });
            // left/right padding
            $("#ngm-report").css({ 'padding-left': '90px' });
            $("#ngm-report").css({ 'padding-right': '90px' });
            // hide btns
            $('.btn').css({ 'display': 'none' });
            $("#ngm-report-download").css({ 'display': 'none' });
            $(".ngm-profile-btn").css({ 'display': 'none' });
            $("#dashboard-btn").parent().parent().css({ "display": "none" });
            // navigation breadcrumb
            $("#ngm-breadcrumb").css({ 'display': 'none' });
            // tabs breadcrumb
            $("#ngm-tabs").css({ 'display': 'none' });          
            // menu footer
            $(".ngm-menu-footer").css({ 'display': 'none' });
            // title size adjustment
            $("#ngm-report-title").css({ 'font-size': '3.1rem' });
            // count size
            $('.count').css({ 'font-size': '2rem' });
            $('.count').css({ 'line-height': '2rem' });
            // position date range 
            // $("#ngmDateContainer-0").css({ 'margin-top': '-74px', 'margin-left': '64%' });
            // $("#ngmDateContainer-1").css({ 'margin-top': '-74px' });

            $("#ngmDateContainer-1").css({ 'padding-left': '20px;' });

            // fix layout issue - for each row
            $('.row').each(function(i, row){
                // for each widget
                $(row).children().each(function(j, w){
                    if ( $(w).attr('class') ) {
                        // if col is not full length
                        if ($(w).attr('class').search('l12') === -1) {
                            // get width
                            var width = ((parseInt($(w).attr('class').slice(-1)) / 12) * 100).toFixed(2);
                            // update widget width
                            $(w).css({ 'width': width -1 + '%' });
                        }                        
                    }
                });
            });

            // if textarea
            if ( $('textarea')[0] ) {

                // update text color
                $('input').css({ 'color': '#000000' });
                $('select').css({ 'color': '#000000' });                
                
                // expand
                $('textarea').css({ 'color': '#000000' });
                $('textarea').height($('textarea')[0].scrollHeight);
            }
            
            // health form items to remoce
            // $('.remove').css({ 'display': 'none' });
            $('.remove').remove();

            // update all promo charts
            $(".highchart-promo").css({ 'top': '40px', 'left': '10px' });
            // hide map controls
            $(".leaflet-control-container").css({ 'display': 'none' });
            // hide contact card
            $("#ngm-contact").css({ 'display': 'none' });
            // display download date
            $("#ngm-report-extracted").css({ 'display': 'block' });

        });

        // export path
        var path = '/home/ubuntu/nginx/www/ngm-reportPrint/pdf/' + report + '.pdf';

        // remove existing
        if (fs.exists(path)) { fs.remove(path); }

        // create pdf
        window.setTimeout( function(){
            // render
            page.render('/home/ubuntu/nginx/www/ngm-reportPrint/pdf/' + report + '.pdf');
            // exit
            phantom.exit();
        }, 400 );

    }, pageLoadTime);
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
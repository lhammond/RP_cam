
function signin() {
    jQuery.mobile.changePage("#home");
    /*
    var email = $("#email");
    var pass = $("#password");

    var cb = function (r) {
        if (r.response.responseCode == 0 && r.root.authenticated == 1) {
            $.cookie('email', email.val(), {expires:365});
            $.cookie('sessionId', r.root.sessionid, { expires: 365 });
            $.cookie('customerId', r.root.customer_id, { expires: 365 });
            $.cookie('role', r.root.role, { expires: 365 });
            $.cookie('previousLocation', null, { expires: 365 });
            $.cookie('previousView', null, { expires: 365 });

            if(r.root.resetpass != undefined && r.root.resetpass != null && r.root.resetpass == 1)
            {
                resetPass(pass.val(), r.root.userid);
            } else {
                initApp();
            }
            $("#email,#password").val("");
        } else {
            pass.val("").focus();
            showDialog("",r.exception.errormessage);
            //showDialog("","Login Failed.\n\nPlease try logging in again.");
        }
    };
    if (email.val() == "" || pass.val() == "") {
        showDialog("Credentials Required", "This app requires a valid login.");
        return;
    }
    var parms = {
        email:email.val(),
        password:pass.val()
    };
    api.Session.start(cb, parms);
    */
}

function signout() {
    window.location.replace("index.html");
    /*
    var cb = function (response) {
        window.location.replace("/");
    };
    api.Session.end(cb, {});
    */
}

function detectBrowser() {
    var parser = new UAParser();
    var result = parser.getResult();
    console.log("browser : " + result.browser.name+" v"+result.browser.version);
    console.log("operating system : " + result.os.name+" v"+result.os.version);
    console.log("device : " + result.device);
    console.log("rendering engine : " + result.engine.name);
    console.log("cpu : " + result.cpu);
    console.log("cpu architecture : " + result.cpu.architecture);
}

$.fn.formToJson = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};



function forgotPassword(){
  $("#resetPass,#resetPassConfirmation").hide();
    $("#resetPassForm").show();

    $("#forgotPassDiv").dialog({
        width:"auto",
        autoOpen:true,
        modal:true,
        width:740
    });
    $("#sendPassBtn").button().unbind("click").click(function(){

        $("#resetPassEmail").val("");
        $("#resetPassForm").hide();
        $("#resetPassConfirmation").show();
        /*
        if($("#resetPassEmail").val()=="")
          return false;

       var cb = function(){
           $("#resetPassEmail").val("");
           $("#resetPassForm").hide();
           $("#resetPassConfirmation").show();
       };
       api.User.resetPassword(cb,{email:$("#resetPassEmail").val()});
       */
    });
}

function resetPass(pass,userid) {
    jQuery.mobile.changePage("#resetPass");
    $("#signin").hide();
    $("#resetPassUserId").val(userid);
    var e = $.cookie('email');
    api.Session.end(function(){}, {});

    $("#updatePassBtn").button().click(function(){
       var u = $("#resetPassUserId").val();
       var p = $("#resetPass1").val();
       var p2 = $("#resetPass2").val();
       if(u == "" || u == undefined){showDialog("","A problem has a occurred.  Please contact customer service.")}
       if(p == "" || p == undefined || p2 == "" || p2 == undefined){return false;}
       if(p != p2) {
           showDialog("","your passwords don't match.");
           return false;
       }

       var cb = function(){
           var parms = {
               "userid":u,
               "pass1":p
           };
           api.User.update(function(){
               $("#resetPassUserId,#resetPass1,#resetPass2").val("");
               initApp()
           },parms);

       };
        var parms = {
            email:e,
            password:pass
        };
        api.Session.start(cb, parms);
    });
}

function initApp() {
    $.cookie("locsLoaded",false);
    updateApp();

}



function showLoc(id,view,employee_id) {

    console.log("showLoc("+id+","+view+","+employee_id+")");
    printCookies();
    $.cookie('previousLocation', $.cookie('currentLocation'), { expires: 365 });
    $.cookie('previousView', $.cookie('currentView'), { expires: 365 });
    $.cookie('currentView', view, { expires: 365 });

    if(id == null && $.cookie('currentLocation') == null){

        $.cookie('currentLocation', locations[0].id, { expires: 365 });
    } else if (id == null && $.cookie('currentLocation') != null){

    } else {
        $.cookie('currentLocation', id, { expires: 365 });
    }
    var locId = $.cookie('currentLocation');

    var elId = "#location";
    var viewId = "#"+view+"Tpl";
    var viewTblTpl = "#"+view+"TplTable";

    $(".view").remove();

    if (view == "check_details"){
            for(var i in checks){
              if(checks[i].number == employee_id){
		checks[i].element_id = employee_id;
		$( viewId ).tmpl(checks[i]).appendTo( "#check_details" );
		$( viewTblTpl ).tmpl(checks[i].items).appendTo( "#check_items" );
	     }
             $("#check_details div").show();
             jQuery.mobile.changePage("#check_details");
        }
      }


    for (var idx in locations) {
        // find the location
        var loc = locations[idx];
        //console.log(loc.id + " : " + locId);
        if(loc.id == locId){
          // loop through all of the items in the view
          if(view == "employee_performance_details"){
            view = "employee_performance";
            for(var i in loc[view]["employees"]){
              if(loc[view]["employees"][i].id == employee_id){
                loc[view] = loc[view]["employees"][i]; 
              }
            }
          }
        $("h1#title").children().eq(0).attr("class",viewIcons[view]);
        $("h1#title").children().eq(1).html(view.toProperCase());
            for(var idx2 in loc[view]){
                var obj = loc[view][idx2];
                if(obj.title == null)
                    continue;
                obj.location_id = loc.id;
                obj.name = loc.name;
                obj.element_id = obj.title.replace(" ","_").toLowerCase();

                // nested table Id
                var tblId = "#"+obj.element_id+" table";
                if(employee_id != null && view == "employee_performance"){
                    for(var idx3 in obj.employees){
			if(obj.employees[idx3].id == employee_id){
			  obj.name = obj.employees[idx3].name;
			  obj.hours = obj.employees[idx3].hours;
			  if(obj.employees[idx3].tip.indexOf(".") > -1){
                            obj.employees[idx3].tip = obj.employees[idx3].tip.split(".")[0] + "%";
                          }
                          $( viewId ).tmpl(obj).appendTo( elId );
                          $( viewTblTpl ).tmpl(obj.employees[idx3]).appendTo( tblId );
			}
                    }
                } else if(employee_id != null && view == "check_details"){
    console.log(checks);
                    for(var idx3 in checks){
                        if(obj.checks[idx3].number == employee_id){
                          //obj.name = obj.employees[idx3].name;
                          //obj.hours = obj.employees[idx3].hours;
                          if(checks[idx3].tip.indexOf(".") > -1){
                            checks[idx3].tip = checks[idx3].tip.split(".")[0] + "%";
                          }
                          $( viewId ).tmpl(obj).appendTo( elId );
                          $( viewTblTpl ).tmpl(checks[idx3].items).appendTo( tblId );
                        }
                    }

                } else if(view == "employee_performance"){
                    $( viewId ).tmpl(obj).appendTo( elId );
                    for(var idx3 in obj.employees){
			obj.employees[idx3].location_id = loc.id;
			  if(obj.employees[idx3].tip.indexOf(".") > -1){
                            obj.employees[idx3].tip = obj.employees[idx3].tip.split(".")[0] + "%";
                          }
                        $( viewTblTpl ).tmpl(obj.employees[idx3]).appendTo( tblId );
                    }
                } else if (view == "sales_by_item") {
                    $( viewId ).tmpl(obj).appendTo( elId );
                    for(var idx3 in obj.items){
                        $( viewTblTpl ).tmpl(obj.items[idx3]).appendTo( tblId );
                    }
                } else if (view == "sales_by_category") {
                    $( viewId ).tmpl(obj).appendTo( elId );
                    for(var idx3 in obj.items){
                        $( viewTblTpl ).tmpl(obj.items[idx3]).appendTo( tblId );
                    }
                } else {
                    $( viewId ).tmpl(obj).appendTo( elId );
                }
            }
            if($.cookie("currentTab") == null){
              showTab("today");
            } else {
              showTab($.cookie("currentTab"));
            }
            jQuery.mobile.changePage("#location");
        }
    }
}

function showChecks() {

    var id = $("#checkSearchLocs").val();
    var view = "checks";
    console.log("showChecks("+id+","+view+")");
    $(".view").remove();
    var tblId = "#resultsTbl";
    var obj = {"name":$("#checkSearchLocs option[value='"+id+"']").text()};

    for(var idx in checks){
        var a = checks[idx];
        checks[idx].total = a.total.substring(0, a.length-3);
    }
    $( "#checksTpl" ).tmpl(obj).appendTo( "#results" );
    $( "#checksTplTable" ).tmpl(checks).appendTo( tblId );

    $.cookie('previousLocation', $.cookie('currentLocation'), { expires: 365 });
    $.cookie('previousView', $.cookie('currentView'), { expires: 365 });
    $.cookie('currentView', "results", { expires: 365 });
    //$("#results").trigger('create');
    $(".results").show();
    jQuery.mobile.changePage("#results");
}


function showTab(id) {
    $(".tab").hide();
    $("#"+id).show();
    $.cookie('currentTab', id, { expires: 365 });

}

function searchChecks(){
    console.log("searchChecks()");

    var l = $("#checkSearchLocs").val();
    var cn = $("#checkNum").val();
    var df = $("#from-date").val();
    var tf = $("#from-time").val();
    var dt = $("#to-date").val();
    var tt = $("#to-time").val();
    var af = $("#more-than").val();
    var at = $("#less-than").val();
 
    df = Date.parseExact(df, "MMM d, yyyy").toString("MMyyyy");
    dt = Date.parseExact(dt, "MMM d, yyyy").toString("MMyyyy");
    if(tf == "" || tf == null || tf == undefined){
      tf = "1200";
    } else {
      tf = Date.parseExact(tf, "hh:mm tt").toString("HHmm");
    }
    if(tt == "" || tt == null || tt == undefined){
      tt = "1200";
    } else {
      tt = Date.parseExact(tt, "hh:mm tt").toString("HHmm");
    }

    var cb = function (r) {
        checks = r.root.checks;
        showChecks();
    }
    var parms =
    {
        "location_id":l,
        "check_number":cn,
        "date_from":df+tf,
        "date_to":dt+tt,
        "amount_from":af,
        "amount_to":at
    };
    console.log(parms);
    api.Ticket.checkSearch(cb,parms);
}

function getLocations() {
    console.log("getLocations()");
    $.cookie('previousView', $.cookie('currentView'), { expires: 365 });
    $.cookie('currentView', "locations", { expires: 365 });

    var cb = function (r) {
        if(r.response.responseCode == 0 && ( r.root == "null" || r.root == undefined )){
            r.root = {location:{}};
        } else if(r.response.responseCode != 0) {
            $.cookie('sessionId', "", { expires: 365 });
            window.location.replace("");
        }

        locations = r.root.location;
        var list = $( "ul#locList").empty();

        $( "#locationItem" ).tmpl(locations).appendTo( list);

        for(var i in locations){
            $("#checkSearchLocs").append('<option value="'+locations[i].id+'">'+locations[i].name+'</option>')
        }

        if($.cookie('locsLoaded') == "true"){
            $( "#locList").listview("refresh");
        }
        $.cookie('locsLoaded', "true", { expires: 365 });
        jQuery.mobile.changePage("#locations");
    };
    api.Location.getAll(cb, {});
}



function updateApp(){
    /*
    if($.cookie("role")=="reseller"){
        getCustomers();
    } else {
        getLocations();
    }
    */
    getLocations();
}

function printCookies(){
    console.log("previous : " + $.cookie('previousLocation') + " : " + $.cookie('previousView'));
    console.log("current : " + $.cookie('currentLocation') + " : " + $.cookie('currentView'));
}

function gotoPreviousView(){
    console.log("gotoPrev()");
    printCookies();
    if($.cookie('previousView') == 'locations'){
        jQuery.mobile.changePage("#locations");
    } else if($.cookie('previousView') == 'check_search'){
            jQuery.mobile.changePage("#check_search");
    } else {
        showLoc($.cookie('previousLocation'),$.cookie('previousView'));
    }
}

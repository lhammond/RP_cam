
/*
$.ajaxSetup({
    crossDomain : true,
    typeFoo: "GET",
    contentTypeFoo: "application/json; charset=utf-8",
    dataFoo: "{}"
});
*/
    function BucksBillPay(cfg){
        $.cookie('apiId', cfg.apiId, { expires: 365 });
        //$.cookie('apiUrl', "http://freet.aptidata.com/api/v1/ask.html", { expires: 365 });
        //$.cookie('apiUrl', "http://aptidatadev0.aptidata.com/api/v01/vm.html", { expires: 365 });
        $.cookie('apiUrl', "https://appdev1.aptidata.com/api/v01/api.php", { expires: 365 });
        this.email=cfg.email;
        this.password=cfg.password;
        this.sessionData=undefined;
        this.sessionId=undefined;
        this.http_origin = "http://mobi.aptidata.com";

        var parms = {
            func : "authenticate",
            email : cfg.email,
            password : cfg.password
        };

        this.Session = {
            start:function(cb,parms){
                parms["func"] = "authenticate";
                parms["mobile"] = "true";
                var cb1 = function(r) {
                    $.cookie('sessionId', r.root.sessionid, { expires: 365 });
                    $.cookie('customerId', r.root.customerid, { expires: 365 });
                    cb(r);
                };
                BucksBillPay.send(cb1,parms,"GET")
            },
            end:function(cb,parms){
                parms["func"] = "endSession";
                var cb1 = function(r) {
                    $.cookie('sessionId', "", { expires: 365 });
                    cb(r);
                };
                BucksBillPay.send(cb1,parms)
            },
            isActive:function(){
                if($.cookie('sessionId') == "" || $.cookie('sessionId') == null)
                    return false;
                else
                    return true;
            }
        };

        this.Reseller = {
            getAll:function(cb,parms){
                parms["func"] = "getResellers";
                parms["includelocations"] = 1;
                BucksBillPay.send(cb,parms);
            },
            create:function(cb,parms){
                parms["func"] = "createReseller";
                BucksBillPay.send(cb,parms,"POST");
            },
            createUser:function(cb,parms){
                parms["func"] = "createUser";
                BucksBillPay.send(cb,parms,"POST");
            },
            deleteUser:function(cb,parms){
                parms["func"] = "deleteReseller";
                BucksBillPay.send(cb,parms,"POST");
            }
        };


        this.User = {
            update:function(cb,parms){
                parms["func"] = "updateUser";
                BucksBillPay.send(cb,parms,"POST");
            },
            resetPassword:function(cb,parms){
                parms["func"] = "resetPassword";
                BucksBillPay.send(cb,parms,"POST");
            }
        }

        this.Customer = {
            getAll:function(cb,parms){
              parms["func"] = "getCustomers";
              parms["includelocations"] = 1;
              BucksBillPay.send(cb,parms);
            },
            create:function(cb,parms){
                parms["func"] = "createCustomer";
                BucksBillPay.send(cb,parms,"POST");
            },
            deleteCustomer:function(cb,parms){
                parms["func"] = "deleteCustomer";
                BucksBillPay.send(cb,parms,"POST");
            },
            createLocationGUID:function(cb,parms){
                parms["func"] = "customerLocationGUID";
                parms["action"] = "put";
                parms["customerid"] = $.cookie('customerId');
                BucksBillPay.send(cb,parms,"POST");
            }
        }

        this.Location = {
            getAll:function(cb,parms){
                parms["func"] = "getLocations";
                BucksBillPay.send(cb,parms);
            },
            create:function(cb,parms){
                parms["func"] = "createLocation";
                BucksBillPay.send(cb,parms,"POST");
            },
            deleteLocation:function(cb,parms){
                parms["func"] = "deleteLocation";
                BucksBillPay.send(cb,parms,"POST");
            },
            getConfig:function(cb,parms){
                parms["func"] = "getConfig";
                BucksBillPay.send(cb,parms);
            },
            setConfig:function(cb,parms){
                parms["func"] = "setConfig";
                BucksBillPay.send(cb,parms,"POST");
            },
            getLicense:function(cb,parms){
                parms["func"] = "getLocationLicense";
                BucksBillPay.send(cb,parms);
            }
        }

        this.Ticket = {
            getAll:function(cb,parms){
                parms["func"] = "getTickets";
                BucksBillPay.send(cb,parms);
            },
            checkSearch:function(cb,parms){
            parms["func"] = "check";
            BucksBillPay.send(cb,parms);
            }
         }

        this.Employee = {
            getAll:function(cb,parms){
                parms["func"] = "getEmployees";
                BucksBillPay.send(cb,parms);
            },
            getPerformance:function(cb,parms){
                parms["func"] = "getEmployeePerformance";
                BucksBillPay.send(cb,parms);
            }
        }

        this.POS = {
            get:function(cb,parms){
                parms["func"] = "getPOS";
                BucksBillPay.send(cb,parms);
            },
            create:function(cb,parms){
                parms["func"] = "createPOS";
                BucksBillPay.send(cb,parms,"POST");
            }
        }

        this.Snapshot = {
            getYesterday:function(cb,parms){
                parms["metric"] = "snapshot";
                parms["when[]"] = "yesterday";
                BucksBillPay.send(cb,parms);
            },
            getLastWeek:function(cb,parms){
                parms["metric"] = "snapshot";
                parms["when[]"] = "last week";
                BucksBillPay.send(cb,parms);
            },
            getLastMonth:function(cb,parms){
                parms["metric"] = "snapshot";
                parms["when[]"] = "last month";
                BucksBillPay.send(cb,parms);
            }
        }

        this.Sales = {
            getYesterday:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "yesterday";
                BucksBillPay.send(cb,parms);
            },
            getLastWeek:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last week";
                BucksBillPay.send(cb,parms);
            },
            getLastMonth:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last month";
                BucksBillPay.send(cb,parms);
            }
        }

        this.SalesByCategory = {
            getYesterday:function(cb,parms){
                parms["metric"] = "salesByCategory";
                parms["when[]"] = "yesterday";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            },
            getLastWeek:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last week";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            },
            getLastMonth:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last month";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            }
        }

        this.SalesByItem = {
            getYesterday:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "yesterday";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            },
            getLastWeek:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last week";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            },
            getLastMonth:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last month";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            }
        }

        this.PaymentMethods = {
            getYesterday:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "yesterday";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            },
            getLastWeek:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last week";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            },
            getLastMonth:function(cb,parms){
                parms["metric"] = "sales";
                parms["when[]"] = "last month";
                parms["by[]"] = "category";
                BucksBillPay.send(cb,parms);
            }
        }



        this.Email = {
            send:function(cb,parms){
                parms["func"] = "sendEmail";
                BucksBillPay.send(cb,parms);
            }
        }

        this.Adapter = {
            installProgress:function(cb,parms){
                parms["func"] = "progress";
                parms["action"] = "get";
                BucksBillPay.send(cb,parms);
            }
        }
    };


BucksBillPay.send=function(cb,params,reqType){
    var d = jQuery.param(params)+"&apiid="+$.cookie('apiId')+"&sessionid="+$.cookie('sessionId');
    //var d = "metric=sales&when[]=last week&apiid="+$.cookie('apiId')+"&sessionid="+$.cookie('sessionId');
    var u = $.cookie('apiUrl');

    if(reqType==""||reqType==undefined){
        reqType = "GET";
    }
    $.ajax({
        type:reqType,
        url : u,
        cache: "false",
        data : d,
        dataType : "json",
        contentTypeFoo: "application/json; charset=utf-8",
            error : function(request, status, error) {
              console.log(request.status);
              console.log(request);
              console.log(status);
              console.log(error);
              console.log("ERROR : " + status + " : " + error);
        },
        success : function(data){
            cb(data);
        },
        beforeSend: function (request)
        {

            //request.setRequestHeader("HTTP_ORIGIN", this.http_origin);
            //request.setRequestHeader("Access-Control-Allow-Origin","*");
            //request.setRequestHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
            //request.setRequestHeader("Access-Control-Allow-Headers","Authorization");


        }
    });
}






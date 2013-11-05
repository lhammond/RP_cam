function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

//Will strip out any _ and Proper Case
String.prototype.toProperCase = function () {
    var nStr = this.replace(/_/g, " ");
    return nStr.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

$("#slider").select(function(){
   console.log($(this).val());
});

function setRememberMe(status){
    if(status == 'yes'){
      $.cookie('rememberEmail', true, { expires: 365 });
    } else {
      $.cookie('rememberEmail', true, { expires: 365 });
    }
}

function showDialog(title, msg) {
    alert(msg);
}
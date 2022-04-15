$(document).ready(function() {
    $("th").click(function(event){
        if(event.target.id =="select"){
            $("row1").addClass("highlight");
            alert("hello")
        }

    });

});
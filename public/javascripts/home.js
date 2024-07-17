$(document).ready(function () {
    $.getJSON("/book/displayJSON", { ajax: true }, function (result) {
      if (result.status) {
        var str = ``;
        result.data.forEach((item, index) => {
          var peroff = ((item.price - item.offerprice) * 100) / item.price;
          str += `<div style="padding:30px;width:330px;">
          <img src="/images/${item.picture}" width="300"><br>
          <b>${item.bookname.slice(0, 30)}${
            item.bookname.length > 30 ? "..." : ""
          }</b>
          <p>${item.description.slice(0, 100)}${
            item.description.length > 100 ? "..." : ""
          }</p>
          <p><b>Rs.${item.offerprice}</b> <s>Rs.${
            item.price
          }</s> <font color="#ff905a">(${parseInt(peroff)}% OFF)</font></p>
          </div>`;
        });
        $("#book").html(str);
      }
    });


    $(".publication").click(function () {
        var publicationid = $(this).attr("pid");
        $.getJSON(
            "/bookcategory/displayJSON",
            { ajax: true, pid: publicationid },
            function (result) {
                console.log(result);
                if (result.status) {
                    var str = "<table style='width:20%'><tr>";
                    result.data.forEach((item, index) => {
                        str +=
                            "<td class='bcategory' bid=" +
                            item.bookcategoryid +
                            " style='cursor:pointer;'><img src='/images/" +
                            item.picture +
                            "' width=100><br>" +
                            item.bookcategoryname +
                            "</td>";
                    });
                    str += "</tr></table>";
                    $(".bookcategory").html(str);
                }
            }
        );
    });


    $(document).on("click", ".bcategory", function () {
        var bookcategoryid = $(this).attr("bid");
        $.getJSON(
            "/categorywriter/displayJSON",
            { ajax: true, bid: bookcategoryid },
            function (result) {
                console.log(result);
                if (result.staatus) {
                    var str = "<table style='width:20%'><tr>";
                    result.data.forEach((item, index) => {
                        str +=
                            "<td class='ccategory' wid=" +
                            item.categorywriterid +
                            " style='cursor:pointer;'><img src='/images/" +
                            item.picture +
                            "' width=100><br>" +
                            item.categorywritername +
                            "</td>";
                    });
                    str += "</tr></table>";
                    $("#categorywriter").html(str);
                }
            }
        );
    });

    $(document).on("click", ".ccategory", function () {
        $(window).scrollTop($('#book').offset().top);
        $.getJSON(
            "/book/displayJSONbycategorywriterid",
            { ajax: true, wid: $(this).attr("wid") },
            function (result) {
                if (result.status) {
                    var str = ``;
                    result.data.forEach((item, index) => {
                        var peroff = ((item.price - item.offerprice) * 100) / item.price;

                        str += `<div style="padding:30px;width:330px;">
            <img src="/images/${item.picture}" width="300"><br>
            <b>${item.bookname.slice(0, 30)}${item.bookname.length > 30 ? "..." : ""
                            }</b>
            <p>${item.description.slice(0, 100)}${item.description.length > 100 ? "..." : ""
                            }</p>
            <p><b>Rs.${item.offerprice}</b> <s>Rs.${item.price
                            }</s> <font color="#ff905a">(${parseInt(peroff)}% OFF)</font></p>
            </div>`;
                    });
                    $("#book").html(str);
                }
            }
        );
    });

    $('#search').keyup(function (){
     alert($("#search").val())
     $.getJSON('/book/searchbooks',{ajax:true,search:$("#search").val()},function(result){
        if(result.status)
        alert(result)
        {
            var str = ``;
            result.data.forEach((item, index) => {

                var peroff = ((item.price - item.offerprice) * 100) / item.price;

                str += `<div style="padding:30px;width:230px;height:200px;">
          <img src="/images/${item.picture}" 
          ><br>
          <b>${item.bookname.slice(0, 30)}${item.bookname.length > 30 ? "..." : ""
                    }</b>
          <p>${item.description.slice(0, 100)}${item.description.length > 100 ? "..." : ""
                    }</p>
          <p><b>Rs.${item.offerprice}</b> <s>Rs.${item.price
                    }</s> <font color="#ff905a">(${parseInt(peroff)}% OFF)</font></p>
          </div>`;
            });
            $("#search").html(str);
        }
     })

    })
});

var url = window.location.href;
// Functions
let myAjax = function(url,type,data={},callback){
    $.ajax({url : url,type : type,data : data,headers: {'Content-Type': 'application/x-www-form-urlencoded'},dataType : 'json',success : callback});
}

let showData = function(limit,page=0,cari = ''){
    limit = parseInt(limit);
    page = page < 0? 0 : parseInt(page);
    let dataAjax = (cari !== '')?{'column': $("#cariData").data('field'),'cari':cari}:{};
    myAjax(
        url.replace("#",'')+`backend/action.php?table=survei`,'post',dataAjax,
        function(result){
            let jmlPage = Math.ceil(result.length/limit);
            let teksHtml = '';
            $("#cariData").data('field',Object.keys(result[0]));
            $.each(result, function(i, item){
                if(i >= (limit*page) && i < (limit*(page+1))){
                    teksHtml += `<tr>
                        <td>${(i+1)}</td>
                        <td><a href="${item.url}" target="_blank" class="text-decoration-none">${item.nama_survey}</a></td>
                        <td>
                            <a href="#" class="btn btn-sm btn-outline-warning mb-1" id="ubahButton" data-bs-toggle="modal" data-bs-target="#form" data-id="${item.id}">Ubah</a>
                            <a href="#" class="btn btn-sm btn-outline-danger mb-1" id="hapusData" data-id="${item.id}">Hapus</a>
                        </td>
                    </tr>`;
                }
            });
            $("#table-survey tbody").html(teksHtml);
            let teksPagination = ``;
            teksPagination = `<li class="page-item ${page === 0?'disabled':''}">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;
            for(let j = 0; j < jmlPage;j++){
                teksPagination += `<li class="page-item ${j === page?'active':''}" ${j === page?'aria-current="page"':''} ><a class="page-link" href="#">${j+1}</a></li>`;
            }
            teksPagination += `<li class="page-item ${page === (jmlPage-1)?'disabled':''}">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`;
            $("#dataPagination").html(teksPagination);
            $("#awal").html((limit*page)+1);
            $("#akhir").html((limit*page)+limit);
            $("#totalData").html(result.length);
        }
    );
    setTimeout(function(){$("#bubbleMessage").slideUp();}, 5000);
}

let showBubble = function(dataSubmit, isiMsg, bubbleColor){
    let bubbleMsg = `
    <div class="ballon-msg alert alert-${bubbleColor} alert-dismissible fade show my-3" role="alert">
    data <strong>${isiMsg}</strong> di${dataSubmit}!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `; 
    $("#bubbleMessage").slideDown(800);
    $("#bubbleMessage").html(bubbleMsg);
};

showData($("#limit").val());

$(document).on('click', '#formButton, #ubahButton', function(){
    $("#formLabel").html($(this).html()+' Data');
    $("#formData #submitData").val($(this).html());
    $("#id, #nama_survey, #url").val('');
    $("#formData input[type=text]:first").focus();
    if($(this).html() === 'Ubah'){
        myAjax(
            url.replace("#",'')+`backend/action.php`,
            'get',
            {'table':'survei','id':$(this).data('id')},
            function(result){
                $("#id").val(result.id);
                $("#nama_survey").val(result.nama_survey);
                $("#url").val(result.url);
            }
        );
    }
});

$(document).on('click','#submitData', function(e){
    e.preventDefault();
    let dataSubmit = $(this).val().toLowerCase();
    myAjax(
        url.replace("#",'')+`backend/action.php?table=survei`,
        'post',
        $("#formData").serialize()+`&submit=${$(this).val().toLowerCase()}`,
        function(result){showBubble(dataSubmit, result > 0?"berhasil":"gagal", result > 0?"success":"danger");}
    );
    showData($("#limit").val());
});

$(document).on('click','#hapusData',function(){
    if(confirm('Yakin ingin menghapus data?')){
        let dataSubmit = $(this).html().toLowerCase();
        myAjax(
            url.replace("#",'')+`backend/action.php?table=survei`,
            'post',
            {'submit':'hapus','id': $(this).data('id')},
            function(result){showBubble(dataSubmit, result > 0?"berhasil":"gagal", result > 0?"success":"danger");}
        );
        showData($("#limit").val());
    }
});

$(document).on('click','#buttonCari',function(){
    showData($("#limit").val(),($(".page-item.active .page-link").text()-1),$("#kataKunci").val());
});

$(document).on('keyup','#kataKunci',function(){
    showData($("#limit").val(),($(".page-item.active .page-link").text()-1),$(this).val());
});

$(document).on('keyup','#limit',function(){
    showData($("#limit").val(),($(".page-item.active .page-link").text()-1));
});

$(document).on('change','#limit',function(){
    showData($("#limit").val(),($(".page-item.active .page-link").text()-1));
});

$(document).on('click','.page-item',function(){
    if(!$(this).hasClass('disabled')){
        let page = $.isNumeric($(this).find(".page-link").text())?parseInt($(this).find(".page-link").text())-1:($(this).find(".page-link").attr('aria-label')==="Previous"?(parseInt($(".page-item.active .page-link").text())-2):(parseInt($(".page-item.active .page-link").text())));
        showData($("#limit").val(),page);
    }
});
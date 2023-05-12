var acticle_id;
var tage_id;
var vaTitle;
var Department_ID;
var Get_User_ID;
var Delete_Sub_article;
var Delete_main_article;
var files = [];
$(document).on("click", ".active_title ", function () {
  $(this).addClass("active_link");
  $(".active_title").not(this).removeClass("active_link");
});
$("#btn_add_contents").click(function () {
  $(".coupled.modal").modal({
    allowMultiple: true,
    closable: false,
  });
  $("#modal_add_title").modal(
    "attach events",
    "#modal_add_contents.modal #btnAdd"
  );

  $("#modal_add_contents").modal().modal({ closable: false }).modal("show");
  var dept_id = $("#departmentListId").dropdown("get value");
  buildDepartment("#departmentListId2, #modal_add", dept_id); // B2B Content B2B1

  tinymce.init({
    selector: "#editor1",
    plugins:
      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
    toolbar:
      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
    // tinycomments_mode: "embedded",
    apiKey: "c2aw5c9qvbzg2o36fsuux51pvgwm0g3sctssoto55cd11e0p",
    // tinycomments_author: "Author name",
    // mergetags_list: [
    //   { value: "Khaw", title: "First Name" },
    //   { value: "khawmean8@gmail.com", title: "Email" },
    // ],
  });
  //CKEDITOR.replace('editor1');
  //var content = CKEDITOR.instances.editor1.getData();
});
//tinymce.get("editor1").setContent("<p>Hello world!</p>");

// Clcik choose file
$(".btn_upload_file").click(function () {
  $("#fileUpload").click();
});

// Build file on browser
function buildList() {
  var html = "";
  var imgs = "";
  files.forEach((e) => {
    html +=
      "<p id='content_file'>" +
      '<i class="paperclip icon grey"></i>' +
      '<a href="#" class="blue">' +
      e.name +
      "</a>" +
      ' <a href="#"><i class="trash grey alternate outline icon con-size" id="btn-remove" value="remove"  fname="' +
      e.name +
      '"></i></a></p>';
    if (e.type.includes("image")) {
      imgs +=
        '<img src="' +
        URL.createObjectURL(e) +
        '" alt="" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px; padding-right: 10px">';
    }
  });

  $("#List_file_content, #List_file_content_update").empty().append(html);
  // $("#imgs").empty().append(imgs); // Lish file image
}

// Event select file
var files_c;
$("#fileUpload, #fileUpload02").on("change", function () {
  $.each(this.files, function (k, e) {
    if (files.every((a) => a.name !== e.name)) {
      files.push(e);
    }
  });
  files_c = files;
  console.log("File Image: ", files);

  buildList();
  $(this).val("");
});

// Event remove file
$(document).on("click", "#btn-remove", function () {
  var fname = $(this).attr("fname");
  var ll = files.filter((v) => v.name !== fname);
  files = ll;
  buildList();
});

// click open file for update
$(".btn_upload_file02").click(function () {
  $("#fileUpload02").click();
});

// save text editor when click button save
$(document).on("click", "#editor_save", function () {
  if (isNull($("#sub_title_val").val())) {
    $("#sub_title_val").parent(".field").addClass("error");
  } else {
    $("#sub_title_val").parent(".field").removeClass("error");
    var myContent = tinymce.get("editor1").getContent();
    var file = files_c

    if (!isNull(myContent)) {
      var req = {
        DEP_ID: $("#departmentListId2").dropdown("get value"),
        TAG_ID: $("#menu_com").dropdown("get value"), // DROPDOW MENU
        USER_ID: getToken().id, // User ID
        CONTENT_BODY: myContent,
        TITLE: $("#sub_title_val").val(), // Title
        FILE_ARTICLE_ID: Date.now(), // Create date
      };
      console.log("Get all user input from editor => ", req);

      $(this).addClass("loading");
      saveContents(req, function (resp) {
        if (resp.status) {
          $("#editor_save").removeClass("loading");
          $("#modal_add_contents").modal("hide");
          $("#sub_title_val").val("");
          tinymce.get("editor1").setContent("");
          getRecent();
          buildMenu(true);
        }
      });
    } else {
      alert("No content");
    }
    // Add file
    console.log("File Image for upload: ", files_c);
    for (let i = 0; i < files_c.length; i++) {
      if (!isNull(files_c[i])) {
        uploadFile(files_c[i], $('').val(), function (resp) {
          var data = JSON.parse(resp);
          var get_file_name = data.data.fileName;
          var get_file_url = data.data.url;
          console.log('Get data url => ', get_file_url, get_file_name);

          //
          var opt = {
            FILE_ARTICLE_IDS: req.FILE_ARTICLE_ID,
            FILE_IDNT: files_c[i].lastModified + Date.now(),
            FILE_NM: get_file_name,
            FILE_SIZE: files_c[i].size,
            // FILE_TYPE: files_c[i].type,
            IMG_PATH: get_file_url,
            THUM_IMG_PATH: get_file_url
          }
          console.log("opt => ", opt);
          upload_file(opt, function (resp) {
            alert('ok')
          });
        });
      }
    }
  }
  $;
});

// Clear editor
$(document).on("click", "#close_editor", function () {
  $("#sub_title_val").val("");
  tinymce.get("editor1").setContent("");
  $('#List_file_content').empty();
});

// ADD NEW TITEL TO DEPARTMENT
$(document).on("click", "#add_newTitle", function () {
  var req = {
    TITLE: $("#titleView").val(),
    DEP_ID: $("#modal_add").dropdown("get value"),
    USER_ID: 1,
  };
  $("#modal_add_title").modal("hide");
  saveTage(req, function (resp) {
    if (resp.status) {
      buldHome(true);
      buildMenu(true);
    }
  });
});

// serch bar
$("#btn_search_content").click(function () {
  var srch = $(this).parent().find("input").val();
  if (!isNull(srch)) {
    getBuildSearchContent(srch);
  } else {
    getRecent();
  }
});

// enter to search
$(document).on(
  "keypress",
  $("#btn_search_content").parent().find("input"),
  function (e) {
    if (e.which == 13) {
      var srch = $("#btn_search_content").parent().find("input").val();
      if (!isNull(srch)) {
        getBuildSearchContent(srch);
      } else {
        getRecent();
      }
    }
  }
);
//edit
//var myContent = tinymce.activeEditor.getContent();

//Sementic Evenets
//--------------------------------------------
// using context
function loadSementicFunction() {
  $(".ui.sidebar")
    .sidebar({
      dimPage: false,
      isible: true,
      closable: false,
      context: $(".bottom.segment"),
    })
    .sidebar("attach events", ".menu .menu_btn");

  $(".ui.dropdown").dropdown();

  $(".ui.accordion").accordion();
}

loadSementicFunction();

// Action management user
$("#btn_manage-user").click(function () {
  $("#btn_manage-user-pop").modal({ closable: false }).modal("show");
  buildUserTable();
});

// Action and new user
$("#Create-New-User").click(function () {
  $("#New-User")
    .modal({
      allowMultiple: true,
      closable: false,
    })
    .modal("show");
});

// Action login form
$(document).on("click", ".login_btn", function () {
  $(".tiny.modal").modal("show");
});

// Menu at navabar for hide and show sidebar
$(document).on("click", ".menu_btn", function () {
  $(".sidebar-active").toggle();
});

// Logout
$(".btn_logout").click(function () {
  $("#Logout-modal")
    .modal({ allowMultiple: true, closable: false })
    .modal("show");
  // $('.sign').transition('slide right');
});

$("#Logout-comfim").click(function () {
  window.localStorage.removeItem("b2b_user");
  $(".page-login").show();
  $(".my_body").hide();
  $("#loginForm").show();
});

//  Add
$(document).on("click", ".add", function () {
  $(".fullscreen.modal").modal("show");
});

$(document).on("click", ".btn-checkbox", function () {
  $(this).toggle();
});

$(document).on("click", ".btn_login", function () {
  $(".page-login").show();
});

// SELECT DEPARTMENT ON NARBAR
$(document).on("click", "#departmentListId .item", function () {
  var dep2 = $(this).attr("data-value");
  buildeMenuCobobox((id = "#menu_com"), dep2);
  buildMenu(true);
});

// SELECT DEPARTMENT LIST
$(document).on("click", "#departmentListId2 .item", function () {
  console.log($(this).attr("data-value"));
  var dep2 = $(this).attr("data-value");
  buildeMenuCombobox((id = "#menu_com"), dep2);
  console.log("dep2:", dep2);
});

$(document).on("click", "#departmentListId3 .item", function () {
  console.log($(this).attr("data-value"));
  var dep3 = $(this).attr("data-value");
  console.log("dep3:", dep3);
});

// CLICK HUMBERGER BUTTON
$(".menu_btn").click(function () {
  if ($("#content_body").hasClass("content_full")) {
    $("#content_body").removeClass("content_full");
  } else {
    $("#content_body").addClass("content_full");
  }
});

// Click on acticle
$(document).on("click", ".acticle_con", function () {
  var id = $(this).attr("act_id");
  var tag_title = $(this).attr("tag_title");
  console.log("id", id);
  console.log("tag_title", tag_title);
  
  buildActicle(id); // call buildActicle
  build_real_file(id); // call read file
  ReadFIleContetn(id) // call file contetn
  ReadImage(id) // call read image
  saveRecent(tag_title, id, $(this).text());

  $('.acticle_con a').removeClass('active_link')
  if(!$('#menu_body .acticle_con[act_id="'+id+'"]').parent().parent().parent().parent().find('.title').hasClass('active')){
    $('#menu_body .acticle_con[act_id="'+id+'"]').parent().parent().parent().parent().find('.title').click()
  }
  $('.acticle_con[act_id="'+id+'"] a').addClass('active_link')
  // $("body .my_sidebar").find("li").removeClass("menu_active");
  // $("body .my_sidebar").find(`[act_id='${id}']`).addClass("menu_active");
  // $("body .my_sidebar").find(`[act_id='${id}']`).parent().removeClass("hidden");
  // $("body .my_sidebar").find(`[act_id='${id}']`).parent().addClass("visible");
  // $("body .my_sidebar")
  //   .find(`[act_id='${id}']`)
  //   .parent()
  //   .parent()
  //   .addClass("active");
  // $("body .my_sidebar")
  //   .find(`[act_id='${id}']`)
  //   .parent()
  //   .parent()
  //   .siblings()
  //   .addClass("active");
  //
});
// LOGIN
$("#btn_login").click(function () {
  var username = $("#username_text").val();
  var password = $("#password_text").val();
  console.log("username: ", username);
  console.log("password: ", password);

  // VALIDATION
  if (isNull(username)) $("#username_text").parent().addClass("error");
  else $("#username_text").parent().removeClass("error");
  if (isNull(password)) $("#password_text").parent().addClass("error");
  else $("#password_text").parent().removeClass("error");

  if (!isNull(username) && !isNull(password)) {
    $("#btn_login").addClass("loading");
    var defualt_img = getLogin(username, password, function (resp) {
      if (resp.status) {
        window.localStorage.setItem("b2b_user", JSON.stringify(resp.data));
        console.log("resp.data: ", resp.data);
        $("#username_text").val(""), $("#password_text").val("");
        get_user_image();
        buldHome();
        $(".edit_tag").show(); 
      } else {
        $("#msg_alert p").text(resp.message);
        $("#msg_alert").show();
      }
      $("#btn_login").removeClass("loading");
      // welcome text
      if (localStorage.getItem('act_recent') === null || localStorage.getItem('act_recent') === 'undefined') {
        welcome_pannel();
        
      }
    });
  }
});

// Hover articel side bar
// Hover main article
$(document).on("mouseover", "#menu_body .item", function () {
  $("." + $(this).attr("d_et")).show();
});
$(document).on("mouseout", "#menu_body .item", function () {
  $("." + $(this).attr("d_et")).hide();
});

// Hove sub article
$(document).on("mouseenter", ".sub_t", function () {
  $("." + $(this).attr("d_est")).show();
});
$(document).on("mouseleave", ".sub_t", function () {
  $("." + $(this).attr("d_est")).hide();
});

// Modal update main article Ex: Gradle
var vId, vUserid, vDepid;
$(document).on("click", ".edit_tag", function () {
  $(".tage_editT").modal("show");
  var dept_id = $("#departmentListId").dropdown("get value");
  buildDepartment("#departmentListId3", dept_id); // Call department
  vTitle = $(this).attr("v.title");
  vDepid = $(this).attr("v.dep_id");
  vUserid = getToken().id + "";
  vId = $(this).attr("v.id");
  $(".v-title").val(vTitle);
  $(".v-title").val();
});
// Comfrim to update main article
$(document).on("click", "#update-departmentList", function () {
  var reqTag = {
    DEP_ID: vDepid,
    ID: vId,
    USER_ID: vUserid,
    TITLE: $(".v-title").val(),
  };
  $("#update-departmentList").addClass("loading");
  updateTag(reqTag, function () {
    if (reqTag.status) {
      buildMenu();
    }
  });
  buildMenu(true);
  setTimeout(function () {
    $("#update-departmentList").removeClass("loading");
    $(".tage_editT").modal("hide");
  }, 1500);
});

// Update acticle has have
$(document).on("click", "#modal-edit-sub-article", function () {
  acticle_id = $(this).attr("act_id");
  tage_id = $(this).attr("tag_id");
  vaTitle = $(this).attr("title");
  Department_ID = $(this).attr("dep_id");
  Get_User_ID = getToken().id;
  console.log("Acticle ID :", acticle_id);
  console.log("Tag ID :", tage_id);
  console.log("Title :", vaTitle);
  console.log("Department ID: ", Department_ID);
  console.log("UserID", Get_User_ID);

  // Show content
  $(".coupled.modal").modal({
    allowMultiple: true,
  });
  $("#modal_add_title").modal(
    "attach events",
    "#modal-edit-update-sub-title.modal #btn_add_title"
  );
  $("#modal-edit-update-sub-title")
    .modal({ allowMultiple: true, closable: false })
    .modal("show");
  $(".get-article-title").val(vaTitle);
  buildDepartment("#departmentListId4, #modal_add", Department_ID);
  buildeMenuCombobox("#menu_com4", null, tage_id);

  getActicle1(acticle_id, function (resp) {
    tinymce.remove("#editor2");
    tinymce.init({
      selector: "#editor2",
      plugins:
        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
      toolbar:
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
      apiKey: "c2aw5c9qvbzg2o36fsuux51pvgwm0g3sctssoto55cd11e0p",
      init_instance_callback: function (inst) {
        inst.setContent(resp.data.content_body);
      },
    });
  });

});
build_real_file();

// Update sub article has have
$(document).on("click", "#btn-save-update-sub-article", function () {
  var myContent2 = tinymce.get("editor2").getContent();
  var reqAr = {
    TAG_ID: tage_id,
    TITLE: $(".get-article-title").val(),
    CONTENT_BODY: myContent2,
    USER_ID: Get_User_ID,
    DEP_ID: Department_ID,
    ID: acticle_id,
  };
 deleteFile(dlFile , function(resp){
  if(resp.status){
    alert(resp.message)
  }else{
    alert(resp.message)
  }
 })

  updateArticles(reqAr, function (resp) {
    if (resp.status) {
      tinymce.get("editor2").setContent(""); // Clear
      buldHome(true);
    }
  });
});

// Delete main article Ex: Jex
$(document).on("click", "#delete_thisT", function () {
  $(".delete_tage").modal({ closable: false }).modal("show");
  Delete_main_article = $(this).attr("da-de");
  console.log("Delete main article => ", Delete_main_article);
});
// Comfrim to delete main article
$(document).on("click", ".btn_delete_tage ", function () {
  $(this).addClass("loading");
  deleteTage(Delete_main_article, function (resp_delete) {
    if (resp_delete.status) {
      setTimeout(function () { }, 1500);
      $(".btn_delete_tage").removeClass("loading");
      buldHome(true);
      buildMenu(true);
    } else {
      alert("Error");
    }
  });
});

// DELETE SUB ARTICLE
$(document).on("click", "#modale-delete-sub", function () {
  $(".delete_sub-title").modal({ closable: false }).modal("show");
  Delete_Sub_article = $(this).attr("va-id");
  console.log("delete-sub: => ", Delete_Sub_article);
});
// Comfrim to delete sub article
$(document).on("click", ".btn_delete_sub", function () {
  $(this).addClass("loading");
  deleteArticles(Delete_Sub_article, function (respone_delete_sub_article) {
    if (respone_delete_sub_article.status) {
      setTimeout(function () {
        $(".btn_delete_sub").removeClass("loading");
        buldHome(true);
        buildMenu(true);
      }, 1500);
    }
  });
});

// BUILD PAGE
$(document).ready(function () {
  //getLogin();
});

// USER
let userB2b = [];

// delete user
$(document).on("click", ".delete_user_icon", function () {
  $("#modal-delete-user")
    .modal({ closable: false, allowMultiple: true })
    .modal("show");
  //$("#modal-delete-user").modal("show");
  var id = $(this).attr("userRole");
  $(document).on("click", "#comfim-delete-user", function () {
    delete_User(id, function () {
      if (id.status) {
        buldHome(true);
      }
    });
    $("#btn_manage-user-pop").modal("hide");
  });
});

// add user
$(document).on("click", "#btn_doc_add_users", function () {
  $(this).addClass("loading");
  var req = {
    USER_NAME: $("#username").val(),
    USER_PASSWORD: $("#password").val(),
    USER_ROLE: $("#b2b_role1")
      .siblings(".menu")
      .children(".item.selected")
      .attr("data-value"),
  };
  addB2bUser(req, function (resp) {
    if (resp.status) {
      setTimeout(function () {
        // buldHome();
        $("#btn_doc_add_users").removeClass("loading");
      }, 1000);
      $("#New-User").modal("hide");
      buildUserTable();
      alert("Add successfully");
    } else {
      alert("Error");
    }
  });
});

// UPDATE USER
var updateId;
var updatePwd;
$(document).on("click", ".editUser_icon", function () {
  $("#modal_update_user")
    .modal({ closable: false, allowMultiple: true })
    .modal("show");

  var data = JSON.parse(decodeURIComponent($(this).closest("tr").attr("data")));
  updateId = data.id;
  updatePwd = data.password;
  var id = $(this).attr("userRole");
  console.log("ID ^", id);

  var get_current_user = {
    V_Name: $("#vUserName").val(data.username),
    V_Pass: $("#vUerPassword").val(data.password),
    V_Role: $("#b2b_role").dropdown("set selected", data.role + ""),
    V_Status: $("#b2b_status").dropdown("set selected", data.status + ""),
  };

  console.log("Get curent user data", get_current_user);
});

// Click to confirmation update user
$(document).on("click", "#btn_doc_update_users_icon", function () {
  //updateId    // staic
  var req = {
    // id : updateId,
    MODIFY_USERNAME: $("#vUserName").val(),
    //MODIFY_USERPASS: updatePwd,
    MODIFY_USERPASS: $("#vUerPassword").val(),
    MODIFY_USERROLE: $("#b2b_role").dropdown("get value"),
    MODIFY_USERSTATUS: $("#b2b_status").dropdown("get value"),
  };
  console.log("Update user data *", req);
  updateUser(updateId, req, function (res) {
    buildUserTable();
  });
  $("#modal_update_user").modal("hide");
});

// INSERT-DEPARTMENT
$("#manage-department").click(function () {
  buildManageDepartment();
  $("#pop-up-management-department").modal({ closable: false }).modal("show");
  $(document).on("click", ".btn-add-css", function () {
    var imd = $("#insert-manage-department").val();
    var req = {
      DEP_NAME: imd,
      DEP_STATUS: 1,
    };
    $("#insert-manage-department").val("");
    if (!isNull(imd)) {
      $(".txtIs").removeClass("error");
      $(".btn-add-css").addClass("loading");
      insertDepartment(req, function (resp) {
        $(".btn-add-css").removeClass("loading");
        if (resp.status) {
          buildManageDepartment();
          buildDepartment();
        }
      });
    } else {
      $(".txtIs").addClass("error");
    }
    $("#insert-manage-department").val("");
    console.log("IMD:", imd);
  });
});

var dep_idd;
// DELETE DEPARTMENT
$(document).on("click", ".alert-depart", function () {
  dep_idd = $(this).parent().siblings(".dep-id").attr("dep_id");
  $(".alert-delete")
    .modal({ closable: false, allowMultiple: true })
    .modal("show");
});
$(document).on("click", "#delete-depart", function () {
  console.log("delete id: ", dep_idd);
  deleteDepartment(dep_idd, function (resp) {
    if (resp.status) {
      buildDepartment();
      buildManageDepartment();
    } else {
      alert(data.message);
    }
  });
});

var btnUpdateID;
// EDIT DEPARTMENT
$(document).on("click", "#icon-update-dep", function () {
  $(".txtIs .btn-update-css").remove();
  $(".txtIs").append(
    `<button class="btn-update-css ui primary button">Udpate</button>`
  );
  $(".txtIs .btn-add-css").remove();
  $(".act-u").show();
  var dep_name = $(this).closest("tr").find(".dep-name").text();
  btnUpdateID = $(this).closest("tr").find(".dep-id").attr("dep_id");
  $(".txtIsertD").val(dep_name);
});

// UPDATE DEPARTMENT
$(document).on("click", ".btn-update-css ", function () {
  var update = $(".txtIsertD").val();

  var req = {
    DEP_ID: btnUpdateID,
    DEP_NAME: update,
  };

  $(".btn-update-css").addClass("loading");
  $(".txtIsertD").val("");
  updateDepartment(req, function (resp) {
    $(".txtIs").append(
      `<button class="btn-add-css ui tiny blue button" style="">Add</button>`
    );
    $(".txtIs .btn-update-css").remove();
    if (resp.status) {
      buildManageDepartment();
      buildDepartment();
      buildeMenuCobobox();
    } else {
      alert(data.message);
    }
  });
});

$(document).on("click", ".act-u", function () {
  $(".act-u").hide();
  $(".txtIs").append(
    `<button class="btn-add-css ui tiny blue button" style="">Add</button>`
  );
  $(".txtIs .btn-update-css").remove();
});

var oldScrollTop = $(window).scrollTop();
var oldScrollLeft = $(window).scrollLeft();
$(".table-scroll").scroll(function () {
  if (oldScrollTop == $(".table-scroll").scrollTop()) {
    $(".table-scroll").css("color", "red");
  } else {
    $(".table-scroll").css("color", "blue");
  }
  oldScrollTop = $(".table-scroll").scrollTop();
  oldScrollLeft = $(".table-scroll").scrollLeft();
});

// Name profile who login
$(document).on("click", ".profile", function () {
  var html = "";
  var data = JSON.parse(window.localStorage.getItem("b2b_user"));
  html += `<p class="user-css">${data.name}</p>`;
  if (data.role == 1) {
    html += `<small class="sma">Admin</small>`;
  } else if (data.role == 2) {
    html += `<small class="sma">Viever</small>`;
  } else if (data.role == 0) {
    html += `<small class="sma">User</small>`;
  }
  $("#profile-use").empty().append(html);
});

// $(document).on("click", ".profile-users", function () {
//   buldHome();
//   get_user_information();
//   // $("#information_user").modal({ closable: false }).modal("show");
// });

// Click user profile
$(document).on("click", ".profile-users", function () {


  if (isNull(getToken().img)) {
    $("#upload-img").attr(
      "src",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
    );
  }else{
    $("#upload-img").attr(
      "src",
      getToken().img
    );
  }
  $("#information_user").modal({ closable: false }).modal("show");
});

// Choose image
$(document).on("click", ".edit_profile_user", function () {
  $("#fileuploads_image").click(); // Choose image
});

// Preview image
$("#fileuploads_image").change(function () {
  const file = this.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (event) {
      $("#upload-img").attr("src", event.target.result);
    };
    profileFile = file;
    reader.readAsDataURL(file);
  }
});

// Update image
$(document).on("click", "#user_click_update", function () {
  var id = getToken().id;

  uploadFile(profileFile, $("#fileuploads_image").val(), function (resp) {
    $("#user_click_update").addClass("loading");
    var data = JSON.parse(resp);
    console.log("data :", data);

    if (data.status) {
      var res = {
        ID: id,
        USER_IMAGE: data.data.url,
      };
      update_user_profile(id, res, function (resp) {
        if (resp.status) {
          setTimeout(function () {
            $("#fileuploads_image").removeClass("loading");
            var user_image = localStorage.getItem("b2b_user");
            var obj = JSON.parse(user_image); // Convert to JSON
            obj.img = data.data.url;
            console.log("Obj :", obj);
            if($('#profile_update_image').attr('src')==getToken().img){
              $('#profile_update_image').attr('src', data.data.url)
            }
            localStorage.setItem("b2b_user", JSON.stringify(obj));
            get_user_image();
            $("#user_click_update").removeClass("loading");
            $("#information_user").modal("hide");
          }, 1000);
        }
      });
      // $('#user_click_update').removeClass('loading');
    } else {
      alert(data.message);
    }
  });
});

//POPUP RESET PASSWORD
$(document).on("click", "#reset-password", function () {
  $("#change-password")
    .modal({ closable: false, allowMultiple: true })
    .modal("show");
});
// RESET PASSWORD
$(document).on("click", "#sign_up", function () {
  var curpwd = $(".curpwd").val();
  var newpwd = $(".newpwd").val();
  var conpwd = $(".conpwd").val();
  var id = getToken().id;
  // Validation
  if (isNull(curpwd)) $(".curpwd").parent().addClass("error");
  else $(".curpwd").parent().removeClass("error");
  if (isNull(newpwd)) $(".newpwd").parent().addClass("error");
  else $(".newpwd").parent().removeClass("error");
  if (isNull(conpwd)) $(".conpwd").parent().addClass("error");
  else $(".conpwd").parent().removeClass("error");
  if (!isNull(curpwd) && !isNull(newpwd) && !isNull(conpwd)) {
    $(this).addClass("loading");
    if ($(".conpwd").val() == $(".newpwd").val()) {
      $(".msg_re_pwd").hide();
      var req = {
        currentPassword: $(".curpwd").val(),
        ID: getToken().id,
        newPassword: $(".newpwd").val(),
      };
      reset_password(req, function (resp) {
        if (resp.status) {
          setTimeout(function () {
            $("#change-password").modal("hide");
            $(".msg_re_pwd1").hide();
            $("#sign_up").removeClass("loading");
          }, 1000);
        } else {
          alert(resp.message)
          setTimeout(function () {
            $("#sign_up").removeClass("loading");
            $(".msg_re_pwd1").show();
          }, 1000);
        }
      });
    } else {
      setTimeout(function () {
        $("#sign_up").removeClass("loading");
        $(".msg_re_pwd").show();
        $(".msg_re_pwd1").hide();
      }, 1000);
    }
  }
});
$(document).on("click", ".cancel_re_pwd ", function () {
  $(".msg_re_pwd").hide();
  $(".msg_re_pwd1").hide();
  $("#change-password").modal("hide");
  newpwd = $(".newpwd").val("");
  conpwd = $(".conpwd").val("");
  curpwd = $(".curpwd").val("");
});

// delete file
var dlFile
$(document).on('click', '#deleteFile', function () {
  dlFile = $(this).attr("file_idnt_id")
  console.log("file_idnt_id:", dlFile);
  $('#List_file_content_update').empty()
  // deleteFile(req, function(resp){
  //   if (resp.status) {
  //   build_real_file()
  //   }else{
  //     alert(resp.message)
  //   }
  // })
}) 

$(document).on('click', '.copy_link', function () {
  var actId = $(this).attr('act_id');
  var link = window.location.origin + '?id=' + actId;
  $('#copy_clip').val(link)
  var copyText = document.getElementById("copy_clip");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(copyText.value);
})
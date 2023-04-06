// $(".page-login").hide();
// $(".my_body").hide();
$(document).on('click', '.active_title ', function () {
  $(this).addClass('active_link');
  $('.active_title').not(this).removeClass('active_link');
})
$("#btn_add_contents").click(function () {
  $(".coupled.modal").modal({
    allowMultiple: true, closable: false,

  });
  $("#modal_add_title").modal(
    "attach events",
    "#modal_add_contents.modal #btnAdd"
  );

  $("#modal_add_contents").modal().modal({ closable: false }).modal('show');
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

$(".btn_upload_file").click(function () {
  $("#fileUpload").click();
});
// Upload file 01
$(document).on("click", "#upLoadFile", function () {
  $(this).addClass("loading");
  var file = $("#fileUpload")[0].files[0];
  if (!isNull(file)) {
    uploadFile(file, $("#fileUpload").val(), function (resp) {
      var data = JSON.parse(resp);
      console.log(data);
      if (data.status) {
        setTimeout(function () {
          $(".img_path").text(data.data.url);
          $("#upLoadFile").removeClass("loading");
        }, 1000);
      } else {
        alert(data.message);
      }
    });
  } else {
    alert("Please upload image");
  }
});
// Upload file 02
$(".btn_upload_file02").click(function () {
  $("#fileUpload02").click();
});
$(document).on("click", "#upLoadFile02", function () {
  $(this).addClass("loading");
  var file = $("#fileUpload02")[0].files[0];
  if (!isNull(file)) {
    uploadFile(file, $("#fileUpload02").val(), function (resp) {
      var data = JSON.parse(resp);
      console.log(data);
      if (data.status) {
        setTimeout(function () {
          $(".img_path02").text(data.data.url);
          $("#upLoadFile02").removeClass("loading");
        }, 1000);
      } else {
        alert(data.message);
      }
    });
  } else {
    alert("Please upload image");
  }
});

// save text editor when click button save
$(document).on("click", "#editor_save", function () {
  if (isNull($("#sub_title_val").val())) {
    $("#sub_title_val").parent(".field").addClass("error");
  } else {
    $("#sub_title_val").parent(".field").removeClass("error");
    var myContent = tinymce.get("editor1").getContent();
    if (!isNull(myContent)) {
      var req = {
        DEP_ID: $("#departmentListId2").dropdown("get value"),
        TAG_ID: $("#menu_com").dropdown("get value"), // DROPDOW MENU
        USER_ID: 4,
        CONTENT_BODY: myContent,
        TITLE: $("#sub_title_val").val(),
        FILE_ARTICLE_ID: Date.now(),
      };
      console.log("All", req);

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
  }
  $;

  // $('#departmentListId2 .item').click(function () {
  //   buildMenu()

  // })
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
  $("#New-User").modal({
    allowMultiple: true,
    closable: false
  }).modal('show')
});

// Action delete user
// $('.trash').click(function () {
//   alert('hi')
//   $('#modal-delete-user').modal({
//     allowMultiple: true,
//     closable: false,
//   }).modal('show')
// })



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
  $("#Logout-modal").modal("show");
  // $('.sign').transition('slide right');
  $("#Logout-comfim").click(function () {
    window.localStorage.removeItem("b2b_user");
    $(".page-login").show();
    $(".my_body").hide();
  });
  // window.localStorage.removeItem("b2b_user");
  // $(".page-login").show();
  // $(".my_body").hide();
});

//  Add
$(document).on("click", ".add", function () {
  $(".fullscreen.modal").modal("show");
});

$(document).on("click", ".btn-checkbox", function () {
  $(this).toggle();
});

// Cancel update article button
$(document).on("click", "#btn-cancel-update-article", function () {
  // buldHome();
  // location.href = "index.html";
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

//click on acticle
$(document).on("click", ".acticle_con", function () {
  var id = $(this).attr("act_id");
  var tag_title = $(this).attr("tag_title");
  console.log("id", id);
  console.log("tag_title", tag_title);
  buildActicle(id);
  saveRecent(tag_title, id, $(this).text());
  $("body .my_sidebar").find("li").removeClass("menu_active");
  $("body .my_sidebar").find(`[act_id='${id}']`).addClass("menu_active");
  $("body .my_sidebar").find(`[act_id='${id}']`).parent().removeClass("hidden");
  $("body .my_sidebar").find(`[act_id='${id}']`).parent().addClass("visible");
  $("body .my_sidebar")
    .find(`[act_id='${id}']`)
    .parent()
    .parent()
    .addClass("active");
  $("body .my_sidebar")
    .find(`[act_id='${id}']`)
    .parent()
    .parent()
    .siblings()
    .addClass("active");
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
    getLogin(username, password, function (resp) {
      if (resp.status) {
        window.localStorage.setItem("b2b_user", JSON.stringify(resp.data));
        console.log("resp.data: ", resp.data);
        $("#username_text").val(""), $("#password_text").val("");
        buldHome();
        $(".edit_tag").show();
      } else {
        $("#msg_alert p").text(resp.message);
        $("#msg_alert").show();
      }
      $("#btn_login").removeClass("loading");
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

//MODAL UPDATE TAGE EX: Gradle

// $(document).on("click", ".edit_tag", function () {
//   $(".tage_editT").modal("show");
//   var dept_id = $("#departmentListId").dropdown("get value");
//   buildDepartment("#departmentListId3", dept_id);
//   var vTitle = $(this).attr("v.title"); 
//   var vDepid = $(this).attr("v.dep_id"); 
//   var vUserid = getToken().id + "";
//   var vId = $(this).attr("v.id");
//   $(".v-title").val(vTitle);

//   $(document).on("click", ".alert-edit-department", function () {
//     $(".modal-alert-edit-department").modal("show");
//     $(document).on("click", ".btn-up-tag", function () {
//       var reqTag = {
//         DEP_ID: vDepid,
//         ID: vId,
//         USER_ID: vUserid,
//         TITLE: $(".v-title").val(),
//       };
//       updateTag(reqTag, function () {
//         if (reqTag.status) {
//           buildMenu()
//         }
//       });
//       buildMenu(true);

//     });
//   });

// });


$(document).on("click", ".edit_tag", function () {
  $(".tage_editT").modal("show");
  var dept_id = $("#departmentListId").dropdown("get value");
  buildDepartment("#departmentListId3", dept_id);
  var vTitle = $(this).attr("v.title");
  var vDepid = $(this).attr("v.dep_id");
  var vUserid = getToken().id + "";
  var vId = $(this).attr("v.id");
  $(".v-title").val(vTitle);

  $(document).on("click", "#update-departmentList", function () {
    $('#update-departmentList').addClass("loading");
    var reqTag = {
      DEP_ID: vDepid,
      ID: vId,
      USER_ID: vUserid,
      TITLE: $(".v-title").val(),
    };
    updateTag(reqTag, function () {
      if (reqTag.status) {
        buildMenu();
      }
    });
    buildMenu(true);
    setTimeout(function () {
      $('#update-departmentList').removeClass("loading");
      $(".tage_editT").modal("hide");
    }, 1000);
    
    
    
  });

});


// Update article has have
$(document).on("click", "#modal-edit-sub-article", function () {
  var acticle_id = $(this).attr("act_id");
  var tage_id = $(this).attr("tag_id");
  var vaTitle = $(this).attr("title");
  var dept_id = $(this).attr("dep_id");
  var avUserid = getToken().id + "";
  console.log("Acticle ID :", acticle_id);
  console.log("Tag ID :", tage_id);
  console.log("Title :", vaTitle);
  console.log("Department ID: ", dept_id);
  console.log("UserID", avUserid);

  // Show content
  $(".coupled.modal").modal({
    allowMultiple: true,
  });
  $("#modal_add_title").modal(
    "attach events",
    "#modal-edit-update-sub-title.modal #btn_add_title"
  );
  $("#modal-edit-update-sub-title").modal({ allowMultiple: true, closable: false, }).modal('show');
  $(".get-article-title").val(vaTitle);
  buildDepartment("#departmentListId4, #modal_add", dept_id);
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

  // UPDATE SUB-ARTICLE
  $(document).on("click", "#btn-save-update-sub-article", function () {
    var myContent2 = tinymce.get("editor2").getContent();
    var reqAr = {
      TAG_ID: tage_id,
      TITLE: $(".get-article-title").val(),
      CONTENT_BODY: myContent2,
      USER_ID: avUserid,
      DEP_ID: dept_id,
      ID: acticle_id,
    };
    updateArticles(reqAr);
    buldHome(true);
    //window.location.reload();
  });
});

// DELETE MAIN ARTICLE
$(document).on("click", "#delete_thisT", function () {
  // $(".delete_tage").modal("show");
  $(".delete_tage").modal({ closable: false }).modal("show");
  var id = $(this).attr("da-de");
  $(document).on("click", ".btn_delete_tage ", function () {
    deleteTage(id);
    buldHome(true);
    buildMenu(true);

  });
});

// DELETE SUB ARTICLE
$(document).on("click", "#modale-delete-sub", function () {
  // $(".delete_sub-title").modal("show");
  $(".delete_sub-title").modal({ closable: false }).modal("show");
  var id = $(this).attr("va-id");
  $(document).on("click", ".btn_delete_sub", function () {
    deleteArticles(id);
    buldHome(true);
    buildMenu(true);

  });
  console.log("delete-sub: ", id);
});

// BUILD PAGE
$(document).ready(function () {
  //getLogin();
});

// USER
let userB2b = [];


// delete user
$(document).on("click", ".delete_user_icon", function () {
  $("#modal-delete-user").modal({ closable: false, allowMultiple: true }).modal('show');
  //$("#modal-delete-user").modal("show");
  var id = $(this).attr("userRole");
  $(document).on('click', '#comfim-delete-user', function () {
    delete_User(id, function () {
      if (id.status) {
        buldHome(true);
      }
    });
    $('#btn_manage-user-pop').modal('hide');
  })
});

// add user
$(document).on("click", "#btn_doc_add_users", function () {
  $(this).addClass("loading");
  var req = {
    USER_NAME: $("#username").val(),
    USER_PASSWORD: $("#password").val(),
    USER_ROLE: $("#b2b_role1").siblings(".menu").children(".item.selected").attr("data-value")

  };
  addB2bUser(req, function (resp) {
    if (resp.status) {
      setTimeout(function () {
        // buldHome();
        $('#btn_doc_add_users').removeClass("loading");
      }, 1000);
      $('#New-User').modal('hide');
      buildUserTable();
      alert('Add successfully');

    } else { alert('Error') }
  });
});

// UPDATE USER
var updateId;
var updatePwd;
$(document).on("click", ".editUser_icon", function () {
  $("#modal_update_user").modal({ closable: false, allowMultiple: true }).modal('show');

  var data = JSON.parse(decodeURIComponent($(this).closest("tr").attr('data')));
  updateId = data.id;
  updatePwd = data.password
  var id = $(this).attr("userRole");
  console.log('ID ^', id);

  var get_current_user = {
    V_Name: $("#vUserName").val(data.username),
    V_Role: $("#b2b_role").dropdown('set selected', data.role),
    V_Status: $("#b2b_status").dropdown('set selected', data.status)
  }
  console.log('Get curent user data', get_current_user)


});

// Click to confirmation update user
$(document).on("click", "#btn_doc_update_users_icon", function () {
  //var id = $(this).attr("userRole");
  //console.log('User id', id)
  updateId
  var req = {
    // id : updateId,
    MODIFY_USERNAME: $("#vUserName").val(),
    MODIFY_USERPASS: updatePwd,
    MODIFY_USERROLE: $("#b2b_role").dropdown('get value'),
    MODIFY_USERSTATUS: $("#b2b_status").dropdown('get value')
  };
  console.log('Update user data *', req)
  updateUser(updateId, req, function (ress) {
    buildUserTable();
  });
  $("#modal_update_user").modal('hide');
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
    $("#insert-manage-department").val('');
    if (!isNull(imd)) {
      $(".txtIs").removeClass("error");
      $('.btn-add-css').addClass("loading")
      insertDepartment(req, function (resp) {
        $('.btn-add-css').removeClass("loading")
        if (resp.status) {
          buildManageDepartment();
        }
      });
    } else {
      $(".txtIs").addClass("error");
    }
    $("#insert-manage-department").val("");
    console.log("IMD:", imd);
  });
});

var dep_idd 
// DELETE DEPARTMENT
$(document).on("click", ".alert-depart", function () {
 dep_idd = $(this).parent().siblings(".dep-id").attr("dep_id");
  $(".alert-delete").modal({ closable: false, allowMultiple: true }).modal('show');
 
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
  $(".txtIs .btn-update-css").remove()
  $(".txtIs").append(`<button class="btn-update-css ui primary button">Udpate</button>`);
  $(".txtIs .btn-add-css").remove()
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

  $('.btn-update-css').addClass('loading')
  $(".txtIsertD").val('')
  updateDepartment(req, function (resp) {
    $(".txtIs").append(`<button class="btn-add-css ui tiny blue button" style="">Add</button>`);
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
  $(".txtIs").append(`<button class="btn-add-css ui tiny blue button" style="">Add</button>`);
  $(".txtIs .btn-update-css").remove();
});

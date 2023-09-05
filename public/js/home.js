function buildLogin() {
  $("#loginForm").show();
  $(".page-login").show();
  $(".my_body").hide();
}

function buldHome() {
  $(".page-login").hide();
  $(".my_body").show();
  //buildDepartment("#departmentListId", null, true);
  buildDepartment();
  buildeMenuCobobox();

  if (getToken().role != 1) {
    buildMenu(true, getToken().dept_id);
  } else {
    buildMenu(true, 1);
  }

  get_user_image();
  get_user_information();

  // check role
  if (getToken().role == 0) {
    // user
    $("#btn_add_contents").show();
    $("#btn_manage-user").hide();
    $(".edit_tag2").show();
    $(".btn_logout").show();
    $(".btn_login").hide();
    $("#Create-New-User").hide();
    $("#manage-department").hide();

  } else if (getToken().role == 1) {
    // admin
    $("#btn_manage-user").show();
    $(".btn_login").hide();
    $(".btn_logout").show();
    $("#Create-New-User").show();
    // show button add contents or department
    $("#btn_add_contents").show();
    $("#manage-department").show();
  } else if (getToken().role == 2) {
    // not user read only
    $("#btn_manage-user").hide();
    $(".edit_tag2").hide();
    $("#btn_add_contents").hide();
    $(".btn_logout").show();
    // $('.btn_login').show();
    $("#manage-department").hide();
    $(".btn_login").show();
    // root
  } else if (getToken().role == 3) {
    $("#btn_manage-user").show();
    $(".btn_login").hide();
    $(".btn_logout").show();
    $("#Create-New-User").show();
    $("#btn_add_contents").show();
    $("#manage-department").hide();
  }
  // get_user_information();

  if (!isNull(window.location.search)) {
    var id = window.location.search.split('id=')[1];
    buildActicle(id)
    setTimeout(function () {
      if (!$('#menu_body .acticle_con[act_id="' + id + '"]').parent().parent().parent().parent().find('.title').hasClass('active')) {
        $('#menu_body .acticle_con[act_id="' + id + '"]').parent().parent().parent().parent().find('.title').click()
      }
      $('.acticle_con[act_id="' + id + '"] a').addClass('active_link');
    }, 200)
  } else {
    getRecent();
  }
}

// On change department
var onChangeDepartment = (id, text) => {
  buildeMenuCombobox("#menu_com", id);
};
// test
var onChangeDepartment = (id, text) => {
  buildeMenuCombobox("#menu_com4", id);
};

// Build content loader 
function loader() {
  $("#content_body").append(
    '<div class="ui active inverted dimmer"><div class="ui text loader">Loading</div> </div>'
  );
}
function loaderSide() {
  $(".my_sidebar").append(
    '<div class="ui active inverted dimmer"><div class="ui text loader">Loading</div> </div>'
  );
}

// build department
// function buildDepartment(id = "#departmentListId", defaultSelect, isAll = false) {

//   var dept_id = "";
//   if (getToken().role != 1 && !isAl) { // != 1
//     dept_id = getToken().dept_id;
//   }

//   getDepartment(dept_id, function (resp) {

//     let departmentList = [];
//     if(isAll){
//       departmentList.push({
//         name: "All",
//         value: "", 
//         selected: true
//       });
//     }
//     if (!isNull(resp) && resp.status) {
//       resp.data.forEach((e, i) => {

//         var obj = {
//           name: e.dep_name,
//           value: e.dep_id,
//           selected: isAll? false : !isNull(defaultSelect)
//             ? e.dep_id == defaultSelect
//               ? true
//               : false
//             : i == 0
//               ? true
//               : false,
//         };

//         departmentList.push(obj);
//       });
//     }

//     $(id).dropdown({
//       values: departmentList,
//       showOnFocus: false,
//     });

//     if (id.includes("departmentListId2")) {
//       $("#departmentListId2").dropdown(
//         "setting",
//         "onChange",
//         onChangeDepartment
//       );
//     }

//     if (id.includes("departmentListId3")) {
//       $("#departmentListId3").dropdown(
//         "setting",
//         "onChange",
//         onChangeDepartment
//       );
//     }

//     if (id.includes("user_department")) {
//       $("#user_department").dropdown(
//         "setting",
//         "onChange",
//         onChangeDepartment
//       );
//     }

//     if (id.includes("new_user_dep")) {
//       $("#new_user_dep").dropdown(
//         "setting",
//         "onChange",
//         onChangeDepartment
//       );
//     }

//     $(id).removeClass("loading");
//   });
// }

// Old build department
function buildDepartment(id = "#departmentListId", defaultSelect) {

  var dept_id;
  if (getToken().role != 1) {
    dept_id = getToken().dept_id;
  }

  getDepartment(dept_id, function (resp) {

    let departmentList = [];
    if (!isNull(resp) && resp.status) {
      resp.data.forEach((e, i) => {
        console.log('e= ',e,'i = ',i )
        var obj = {
          name: e.dep_name,
          value: e.dep_id,
          selected: !isNull(defaultSelect)
            ? e.dep_id == defaultSelect
              ? true
              : false
            : i == 0
              ? true
              : false,
        };

        departmentList.push(obj);
      });
    }

    $(id).dropdown({
      values: departmentList,
      showOnFocus: false,
    });

    if (id.includes("departmentListId2")) {
      $("#departmentListId2").dropdown(
        "setting",
        "onChange",
        onChangeDepartment
      );
    }

    if (id.includes("departmentListId3")) {
      $("#departmentListId3").dropdown(
        "setting",
        "onChange",
        onChangeDepartment
      );
    }

    if (id.includes("user_department")) {
      $("#user_department").dropdown(
        "setting",
        "onChange",
        onChangeDepartment
      );
    }

    if (id.includes("new_user_dep")) {
      $("#new_user_dep").dropdown(
        "setting",
        "onChange",
        onChangeDepartment
      );
    }

    $(id).removeClass("loading");
  });
}

function buildManageDepartment() {
  var htmlLoad = `<tr><td colspan="3" style="height: 206px;"><div class="ui active centered inline loader my-loader"></div></td></tr>`;
  $(".listBody").empty().append(htmlLoad);
  var dept_id;
  if (getToken().role != 1) {
    dept_id = getToken().dept_id;
  }
  getDepartment(dept_id, function (resp) {
    var list = "";
    var fakeId = 0;
    if (!isNull(resp) && resp.status) {
      resp.data.forEach((v) => {
        list += `<tr>
                 <td>${(fakeId += 1)}</td>
                 <td class="dep-id hide-thId" dep_id='${v.dep_id}'>${v.dep_id}</td>
                 <td dep-name='${v.dep_name}' class='dep-name'>${v.dep_name}</td>
                 <td style="text-align: right"><a href="#" style ="margin-right: 8px !important;"><i class="edit outline icon con-size" id='icon-update-dep'></i></a><a href="#" class="act-u"><i class="times circle icon"></i>
                 </a><a href="#" class="alert-depart"><i class=" icon-dltDpt trash alternate outline icon"></i></a></td>
               </tr>`;
      });
    }
    $(".listBody").empty().append(list);
  });
}

// build depart on
function buildeMenuCombobox(id = "#menu_com", depId, select_id) {
  console.log('select id', select_id)
  getMenu(depId, function (resp) {
    let departmentList = [];

    if (!isNull(resp) && resp.status) {
      resp.data.TAGS.forEach((e, i) => {
        // console.log('yuth', e ,'yuth1', i)
        var selec = false;
        if (!isNull(depId)) {
          selec = true;
        } else {
          if (select_id == e.id) {
            selec = true;
          } else {
            selec = false;
          }
        }
        var obj = {
          name: e.title,
          value: e.id,
          selected: selec,
        };
        if (!isNull(depId)) { 
          if (depId == e.dep_id) {
            departmentList.push(obj);
          }
        } else departmentList.push(obj);
      });
    }

    $(id).dropdown({
      values: departmentList,
      setting: { onChange: onChangeDepartment },
      showOnFocus: false,
    });
    $(id).removeClass("loading");
  });
}

// build when search
function getBuildSearchContent(srch) {
  $("#btn_search_content").parent().addClass("loading");
  loader();
  getSearch(srch, function (resp) {
    var tags = [];
    $("#content_body").empty().append("<h3>Search result</h3>");
    resp.data.forEach(function (result) {
      if (
        !tags.some(function (tag) {
          return tag.tag_id == result.TAG_ID;
        })
      ) {
        tags.push({
          tag_id: result.tag_id,
          tag_title: result.tag_title,
          article_result: [
            {
              id: result.id,
              r_contents: result.r_contents,
              r_title: result.r_title,
            },
          ],
        });
      } else {
        tags[
          tags.findIndex(function (obj) {
            return obj.tag_id == result.TAG_ID;
          })
        ].article_result.push({
          id: result.id,
          r_contents: result.r_contents,
          r_title: result.r_title,
        });
      }
    });
    tags.forEach(function (item) {
      var element = $('<div class="result-container"></div>').html(
        '<h4 class="pb-4">'.concat(item.tag_title, "</h4>")
      );
      var id;
      item.article_result.forEach(function (r) {
        id = r.id;
        var tag = item.tag_title
          .replace('<span class="h-text">', "")
          .replace("</span>", "");
        element.append(
          "<div class=\"result-item\"><a class='acticle_con' tag_title='" +
          tag +
          "' act_id='" +
          r.id +
          "'>" +
          r.r_title +
          ' </a><div class="_search-contents">' +
          r.r_contents,
          "</div></div>"
        );
      });
      $("#homeContent").css("display", "none");
      $("#content_body").append(element);
      $("#content_body").append('<hr class="hr_search">');
    });

    if (resp.data.length == 0) {
      $("#content_body").append("<h4>No Data</h4>");
    }
    $("#btn_search_content").parent().removeClass("loading");
  });
}

// ON CHANNGE MENU LIST
function buildeMenuCobobox(id = "#menu_com") {
  getMenu($("#departmentListId").dropdown("get value"), function (resp) {
    let departmentList = [];
    if (!isNull(resp) && resp.status) {
      resp.data.TAGS.forEach((e, i) => {
        var obj = {
          name: e.title,
          value: e.id,
          selected: i == 0 ? true : false,
        };

        departmentList.push(obj);
      });
    }

    $(id).dropdown({
      values: departmentList,
      setting: { onChange: onChangeDepartment },
      showOnFocus: false,
    });
    $(id).removeClass("loading");
  });
}
function deleteDocument(id) {
  buildMenu();
}
// Test
function buildeMenuCoboboxs(id = "#menu_com4") {
  getMenu($("#departmentListId").dropdown("get value"), function (resp) {
    let departmentList = [];
    if (!isNull(resp) && resp.status) {
      resp.data.TAGS.forEach((e, i) => {
        var obj = {
          name: e.title,
          value: e.id,
          selected: i == 0 ? true : false,
        };

        departmentList.push(obj);
      });
    }

    $(id).dropdown({
      values: departmentList,
      setting: { onChange: onChangeDepartment },
      showOnFocus: false,
    });
    $(id).removeClass("loading");
  });
}
// End test

function randomNotFound() {
  $("#content_body").append(
    '<div class="ui active inverted dimmer"><div class="ui text"><img class="ui medium image" src="image/noresults_bvatnd.png" alt="not found "></div> </div>'
  );
}

// Build acticle
function buildActicle(id) {
  updateFile(id);
  loader();


  getActicle(id, function (resp) {

    if (resp.data.content_body === undefined) {
      // Check article is null
      $("#content_body").empty().append(resp.data.content_body);
      randomNotFound();
    } else {

      var html = "";
      var file_name = "";

      if (!isNull(resp.data.modified_date)) {
        // Check update acticle
        html += `<h4 class="ui header" style="display: flex; justify-content: space-between;align-items: center;"><div style="display: flex; align-items: center;">  <img class="ui circular image" src="${resp.data.image}" id="profile_update_image"> </i><div class="content" style="margin-left: 10px; font-family: monospace!important;"> ${resp.data.username} <div class="sub header" style="font-family: monospace!important;"> Modify: ${moment(resp.data.modified_date).format("DD MMM YYYY")} </div></div></div> <div><div class="ui icon top left pointing dropdown">
        <i class="share alternate icon blue"></i>
        <div class="menu">
          <div class="item copy_link" act_id="${id}">Copy link</div>
        </div>
      </div></div></h4> <br>`;
      } else {
        // Check create acticle
        html += `<h4 class="ui header" style="display: flex; justify-content: space-between;align-items: center;"><div style="display: flex; align-items: center;"><img class="ui circular image" src="${resp.data.image == null ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg==" : resp.data.image}" id="profile_crate_image"> </i><div class="content" style="margin-left: 10px; font-family: monospace!important;"> ${resp.data.username} <div class="sub header" style="font-family: monospace!important;"> Create: ${moment(resp.data.create_date).format("DD MMM YYYY")} </div></div></div> <div><div class="ui icon top left pointing dropdown">
        <i class="share alternate icon blue"></i>
        <div class="menu">
          <div class="item copy_link" act_id="${id}">Copy link</div>
        </div>
      </div></div></h4> <br>`;
      }
      // Check is file have
      if (resp.data.file_nm) {
        file_name += `<h2 id='Name_file'>File :</h2> <br />`;
        ReadFIleContetn(id) // call file contetn
      }

      // Check dachboard
      if (resp.data.id == 251) {
        ReadDashboard(id);
      }
      else {

      }
      html += resp.data.content_body; // content
      // $("#content_body").empty().append(html, file_name); // Test
      $("#content_body").empty().append(html, file_name);
      $('.ui.icon.top.left.pointing.dropdown').dropdown();
      hidelightCode(); // Call function hidelight code
    }
  });
}

// list old file
function updateFile(id) {
  read_file(id, function (resp) {
    var fileContentUpdate = '';
    if (!isNull(resp) && resp.status) {
      resp.data.forEach((v) => {
        fileContentUpdate += `<p class="rm-file"> <i class="paperclip icon grey" style="margin-right: 15px;"></i><a class='blue'> ${v.file_nm} </a><a href="#"> <i class="trash grey alternate outline icon con-size" value=""  fname="' + e.name + + '" id="deleteFile" file_idnt_id="${v.file_idnt_id}" data-value="old_file"> </i> </a> </P>`
        $("#listOldFile").empty().append(fileContentUpdate);
      })
    }
  })
}

// Get acticle for update
function getActicleForUpdate(id) {
  loader();
  getActicle1(id, function (resp) {
    var currentActicle = $(this).attr("va.id");

  });
}

// load recent
function getRecent(params) {
  $("#content_body").empty();
  $("body").find(".menu_active").removeClass("menu_active");
  var recentLs = window.localStorage.getItem("act_recent");
  if (!isNull(recentLs)) {
    var ls = JSON.parse(recentLs);
    $("#content_body").append("<h3 style='font-family: Gill Sans !important;'>Recents</h3>");
    var html = "";
    ls.forEach((v) => {
      html +=
        '<div class="recentList"><h5>' +
        v.tag_title +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h5><a href="javascript:" class="acticle_con load_recent-has-delete" tag_title="' +
        v.tag_title +
        '"  act_id="' +
        v.acticle_id +
        '">' +
        v.acticle_name +
        "</a></div>";
    });
    $("#content_body").append(html);
  } else {
  }
}

// save recent
function saveRecent(tag_title, acticle_id, acticle_name) {
  var recentList = [
    {
      tag_title,
      acticle_id,
      acticle_name,
    },
  ];
  var recentLs = window.localStorage.getItem("act_recent");
  var saveList = recentList;

  if (!isNull(recentLs)) {
    saveList = [];
    var ls = JSON.parse(recentLs);
    var newLs = [];
    ls.map((v) => {
      if (v.acticle_id != acticle_id) {
        newLs.push(v);
      }
    });
    saveList = [...recentList, ...newLs];
  }

  window.localStorage.setItem("act_recent", JSON.stringify(saveList));
}
// Side bar nenu
function buildMenu(isFalse, dept_id) {
  var depID = isNull(dept_id) ? $("#departmentListId").dropdown("get value") : dept_id;
  getMenu(depID, function (resp) {
    if (resp.status) {
      var html = "";
      // Loop
      resp.data.TAGS.forEach((v) => {
        html += `<div class="item">
                        <a class="title" style="font-size: 15px;font-weight: 500;margin-top: 10px;">
                        <i class=" icon"></i><b>${v.title}</b>
                        </a>
                        <div class="content">
                        <ul class="sub-menu">`;
        resp.data.ARTICLES.forEach((va) => {
          if (va.tag_id == v.id) {
            html += `<li class="sub-title acticle_con" tag_title="${v.title}" act_id="${va.id}"><a href="javascript:">${va.title}</a></li>`;
          }
        });
        html += `</ul> </div></div>`;
      });
    }
    if (isFalse == true) {
      var html = "";

      resp.data.TAGS.forEach((v) => {
        // main articles
        html += `<div class="item" d_et="${v.id}">`;
        html += `<a  href="javascript:"  class=" ${v.id} a_ab h_et" > `;
        if (getToken().role == 1 || getToken().role == 3) {
          //  Icon update, delete main articel
          html += `    <i class="plus circle icon green" id="icon_add_Title" style="margin-right:6px"></i>`
          html += `<i class="edit outline icon con-size  edit_tag" title="Update Title" v.user_id="${v.user_id}" v.dep_id="${v.dep_id}"  v.id="${v.id}" v.title="${v.title}"> </i>`;
          html += `<i class=" trash alternate outline icon con-size data_delete_tage red" id="delete_thisT" da-de='${v.id}' title="Delete Document" get-main-title='${v.title}'></i>`;
        } else if (getToken().role == 0) { // User
          html += `    <i class="plus circle icon green" id="icon_add_Title" style="margin-right:6px"></i>`
          html += `<i class="edit outline icon con-size  edit_tag" title="Update Title" v.user_id="${v.user_id}" v.dep_id="${v.dep_id}"  v.id="${v.id}" v.title="${v.title}"> </i>`;
        }

        html += `</a>`;
        html += `<a class="title cde"  style="font-size: 15px;font-weight: 500;margin-top: 10px;"><i class=" icon"></i><b class="${v.title}">${v.title}</b></a>`;
        html += `<div class="content">`;
        html += `<ul class="sub-menu">`;

        resp.data.ARTICLES.forEach((va) => {
          // sub articles

          if (va.tag_id == v.id) {
            html += `  <div class="sub_t "d_est="${va.id}">`;
            html += `    <li class="sub-title acticle_con" tag_title="${v.title}" act_id="${va.id}">`;
            html += `    <a class="active_title" href="javascript:" data-li="${va.title}">${va.title}`;
            html += `    </a>`;
            html += `    </li>`;
            html += `     <li> <a href="javascript:" class="${va.id} h_st">`;
            if (getToken().role == 1 || getToken().role == 3) {

              //  Icon update, delete sub articel
              html += `    <i class="edit blue outline icon icon-size " id="modal-edit-sub-article" dep_id="${v.dep_id}" tag_id="${va.tag_id}" act_id="${va.id}"  title="${va.title}"></i>`;
              html += `    <i class="trash red alternate outline icon icon-size" id="modale-delete-sub" va-id="${va.id}" title='delete articel' get-name='${va.title}'></i>`;
            } else if (getToken().role == 0) {

              // html += `    <i class="plus circle icon" id="icon_add_content"></i>`
              html += `    <i class="edit outline icon icon-size " id="modal-edit-sub-article" dep_id="${v.dep_id}" tag_id="${va.tag_id}" act_id="${va.id}"  title="${va.title}"></i>`;

            }

            html += `    </a>`;
            html += `    </li> </div>`;
          }
        });

        html += `</ul> </div></div>`;
      });
    }

    if (isNull(html)) {
      // Check it null
      $("#menu_body")
        .empty()
        .append('<p style="text-align:center; margin-top: 20px">No data</p>');
    } else $("#menu_body").empty().append(html);
  });
}

function getTag(isFalse) {
  saveTage(function (resp) {
    if (isFalse == true) {
      var html = "";
      resp.data.forEach((v) => {
        html += `<div class="item">
                <a class="title" style="font-size: 15px;font-weight: 500;margin-top: 10px;">
                <i class=" icon"></i><b>'+ +'</b>
                <i class="plus circle icon con-size" style="margin-left: 10px;"></i>
                <i class="edit outline icon con-size"></i>
                <i class="trash alternate outline icon con-size tage-delete"></i>
                </a>
                <div class="content">
                <ul class="sub-menu">`;
      });
      html += `</ul></div></div>`;
    }
  });
}
// Old
// function buildUserTable() {
//   userTable(function (data) {
//     var tableData = "";
//     data.data.forEach((i, index) => {
//       tableData += `<tr class='allUser list-item ' data="${encodeURIComponent(JSON.stringify(i))}">`;
//       tableData += `<td userRole='${i.id}' class='v-id'>${index + 1}</td>`; // id

//       tableData += `<td><img src="${i.image == null ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : i.image}"   class="ui mini rounded image" style="height: 40px; height: 40px; object-fit: cover;"></td>`; // profile

//       tableData += `<td userName='${i.username}' class='v-username'>${i.username}</td>`; // name

//       tableData += `<td userPass='${i.password}' class='v-password'>${i.password}</td>`; // passwork

//       if (i.role == 1) {
//         // admin
//         tableData += `<td  style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui red label tiny">Manager </a> </td>`;
//       } else if (i.role == 0) {
//         // user
//         tableData += `<td  style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui blue label tiny"> User </a> </td>`;
//       } else if (i.role == 2) {
//         // viewer
//         tableData += `<td style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui yellow label tiny"> Viewer </a> </td>`;
//         // root
//       } else if (i.role == 3) {
//         tableData += `<td style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui green label tiny"> Admin </a> </td>`;
//       }

//       // if (i.status == 1) {
//       //   // status
//       //   tableData += `<td style="" userStatus='${i.status}' class='v-status' > <a class="ui blue  empty circular label tiny" style="margin-right: 5px">  </a> Active </td>`;
//       // } else if (i.status == 0) {
//       //   tableData += `<td style="" userStatus='${i.status}' class='v-status' > <a class="ui red empty circular label tiny" style="margin-right: 5px"></a> Disable </td>`;
//       // }

//       tableData += `<td userName='${i.dep_name}' class='v-username'>${i.dep_name}</td>`; // department

//       tableData += `<td id="all-icon"> <i class="edit blue outlinee icon con-size editUser_icon" userRole='${i.id}' id='' title='Edit' style="margin-right: 20px"> </i>  <i class=" red trash alternate outline icon con-size delete_user_icon" userRole='${i.id}' title='Delete' id='delete_user'> </i> </td>
//     </tr>`;
//     });

//     $("#userData").empty().append(tableData);
//   });
// }

// Test
function buildUserTable() {
  
  userTable(function (data) {

    var tableData = "";
    const isRoot = getToken().role == 1; // if root  // true
    data.data.forEach((i, index) => {
      const checkDep = (getToken().dept_id == i.dept_id) && !isRoot; 
      if (!checkDep && !isRoot) return;

        tableData += `<tr class='allUser list-item ' data="${encodeURIComponent(JSON.stringify(i))}">`;

        tableData += `<td userRole='${i.id}' class='v-id'>${index + 1}</td>`; // id

        tableData += `<td><img src="${i.image == null ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : i.image}"   class="ui mini rounded image" style="height: 40px; height: 40px; object-fit: cover;"></td>`; // profile

        tableData += `<td userName='${i.username}' class='v-username'>${i.username}</td>`; // name

        tableData += `<td userPass='${i.password}' class='v-password'>${i.password}</td>`; // passwork

        if (i.role == 1) {
          
            $(document).ready(function(){
              $('#all-icon').hide()
            })
          
          // admin
          tableData += `<td  style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui red label tiny">Manager </a> </td>`;
          
        } else if (i.role == 0) {
          // user
          tableData += `<td  style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui blue label tiny"> User </a> </td>`;
        } else if (i.role == 2) {
          // viewer
          tableData += `<td style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui yellow label tiny"> Viewer </a> </td>`;
          // root
        } else if (i.role == 3) {
          tableData += `<td style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui green label tiny"> Admin </a> </td>`;
          
        }

        tableData += `<td userName='${i.dep_name}' class='v-username'>${i.dep_name}</td>`; // department

        tableData += `<td id="all-icon"> <i class="edit blue outlinee icon con-size editUser_icon" userRole='${i.id}' id='' title='Edit' style="margin-right: 20px"> </i>  <i class=" red trash alternate outline icon con-size delete_user_icon" userRole='${i.id}' title='Delete' id='delete_user'> </i> </td>
    </tr>`;
    });



    $("#userData").empty().append(tableData);
  });

}
// End test

// Get user name
function get_user_information() {
  var user_name = $("#get_user_name").val(getToken().name);
  $("#get_user_name").empty().append(user_name.val());
}

function get_user_image() {
  $("#User_profile").attr(
    "src",
    isNull(getToken().img)
      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
      : getToken().img
  );
}

// Preview modal image
$(document).on("click", ".img_pathh", function () {
  var oo = $(".img_pathh").attr({ target: "_blank" });
  window.open($(this).attr("src"), oo);
});

// Downlaod file
$(document).ready(function () {
  $("#file-name2 a").click(function (e) {
    e.preventDefault();

    window.location.href = "File/randomfile.docx";
  });
});

// build welcome pannel
function welcome_pannel() {
  $('#content_body').empty().append(`<h2 class='welcome-pannel'>Welcome</h2>`);
}

// build button share
function buttonshare() {
  let buttonshare = '';
  buttonshare += `<button>Share</button>`
  $("#content_body").append(buttonshare);
}

// file content
function ReadFIleContetn(id) {
  FileContent(id, function (resp) {
    var images = '';
    var fileContet1 = '';
    var link;
    var src;

    if (!isNull(resp) && resp.status) {
      resp.data.forEach((v) => {
        link = `_WE_DRIVER.download('${v.file_idnt_id}')`
        // Old
        // fileContet1 += `<p> <span id="file-name3" style="margin-right:30px;"> <a> ${v.file_nm} </a> <a download href="${v.img_path}"  onclick="_WE_DRIVER.download('${v.file_idnt_id}')"> <i class="download icon" > </i> </a> </span> </p>`
        // New test download use we driver
        // fileContet1 += `<p> <span id="file-name3" style="margin-right:30px;"> <a> ${v.file_nm} </a> <a download href="${v.file_idnt_id}" onclick="${link}"> <i class="download icon" > </i> </a> </span> </p>`
        fileContet1 += `<p> <span id="file-name3" style="margin-right:30px;"> <a> ${v.file_nm} </a> <a download href="${v.img_path}"> <i class="download icon" > </i> </a> </span> </p>`
        // Download use href

        var ext = v.file_nm.split(".")[1];
        ext = ext.toLowerCase()
        if (ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif') {
          images += `<span> <img class="img_pathh" id="myImage" src="${v.img_path}" download> </span>`
        }
      });

    }
    $('#content_body').append(fileContet1, images);
  })

}

//
function ReadDashboard(id) {
  dashboard(id, function (resp) {
    var variable = "";
    if (!isNull(resp) && resp.status) {

      variable += `<table class="ui fixed single line celled table">`
      variable += `<thead style="text-align: center;">`
      variable += `<tr> <th colspan='2'  rowspan='2' style='width:30%'>Name</th> <th style='width:15%'>Last update</th> <th>Description</th> <th>Option</th> </tr>`

      variable += `<tbody>`

      resp.data.DASHBOARD.forEach((v) => {
        variable += `<tr style="text-align: center;">`

        variable += `<td style="text-align: center;"><img class="ui tiny circular image" onerror="myErrorImage(this)" src=""></td>`
        variable += `<td style="color: blue; cursor: pointer" class='app_detail'><a href='javascript:' data-id='${v.redmine_id}' id='${v.app_id}'>${v.app_name}</a></td>`


        variable += `<td>${v.uploadeddate.substring(0, 10)}</td>`

        variable += `<td>${v.description}</td>`

        variable += `<td>`
        if (v.subapp_name != null && v.subapp_name != "") {
          var arrSubApp = v.subapp_name.split(',');
          $.each(arrSubApp, function (i, e) {
            variable += `<a href='${v.link_url}'>${e}</a>`
          })

        }
        variable += `</td>`

        // variable += `<td><a style="color: blue; cursor: pointer">${v.subapp_name}</a></td>`


        variable += `</tr>`
      })


      variable += `</tbody>`

      variable += `</thead>`
      variable += ` </table>`


    }
    $('#content_body').append(variable);
  })
}

// Show detail app
$(document).on('click', '.app_detail', function () {
  alert('app_detail');



})

function myErrorImage(image) {
  image.src = 'image/not_found.png';
  return true;
}

// Build dropdow role
function role(id = '#b2b_role1', defaultSelect) {

  var roleList = []
  var dept_id;
  if (getToken().role != 1) {
    dept_id = getToken().dept_id;
  }

  var role = [
    { name: 'user', value: 0 },
    { name: 'viewer', value: 2 },
    { name: 'admin', value: 3 }

  ]

  role.forEach((e, i) => {

    if (getToken().role != 1 && e.name == 'admin') return;
    console.log('role= ', e, 'i = ', i)
    var obj = {
      name: e.name,
      value: e.value,
      selected: e.value === defaultSelect ? true : false
    };
    console.log('obj', obj)
    roleList.push(obj)
    console.log('defult', defaultSelect)
    console.log('e', e.value)
  });

  $(id).dropdown({
    values: roleList,

    showOnFocus: false,
  }, "setting",
    "onChange",
    onChangeDepartment);
  $(id).removeClass("loading");

}
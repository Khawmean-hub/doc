function buildLogin() {
  $("#loginForm").show();
  $(".page-login").show();
  $(".my_body").hide();
}

function buldHome() {
  $(".page-login").hide();
  $(".my_body").show();
  buildDepartment();
  buildeMenuCobobox();
  getRecent();
  buildMenu(true, 1);
  //getMenu(true);
  // var user_profile = $('img').attr('src', getToken().img); // Set user profile
  // $('#User_profile #user_image').empty().append(user_profile);
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

    // hide button add contents or department
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
  }
  // get_user_information();
}

// On change department
var onChangeDepartment = (id, text) => {
  buildeMenuCombobox("#menu_com", id);
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

//build depart on
function buildDepartment(id = "#departmentListId", defaultSelect) {
  getDepartment(function (resp) {
    let departmentList = [];
    if (!isNull(resp) && resp.status) {
      resp.data.forEach((e, i) => {
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
    //
    if (id.includes("departmentListId3")) {
      $("#departmentListId3").dropdown(
        "setting",
        "onChange",
        onChangeDepartment
      );
    }

    $(id).removeClass("loading");
    //$(id).dropdown();
  });
}

function buildManageDepartment() {
  var htmlLoad = `<tr><td colspan="3" style="height: 206px;"><div class="ui active centered inline loader my-loader"></div></td></tr>`;
  $(".listBody").empty().append(htmlLoad);
  getDepartment(function (resp) {
    var list = "";
    var fakeId = 0;
    if (!isNull(resp) && resp.status) {
      resp.data.forEach((v) => {
        list += `<tr>
                 <td>${(fakeId += 1)}</td>
                 <td class="dep-id hide-thId" dep_id='${v.dep_id}'>${
          v.dep_id
        }</td>
                 <td dep-name='${v.dep_name}' class='dep-name'>${
          v.dep_name
        }</td>
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
  getMenu(null, function (resp) {
    let departmentList = [];

    if (!isNull(resp) && resp.status) {
      resp.data.TAGS.forEach((e, i) => {
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

function randomNotFound() {
  $("#content_body").append(
    '<div class="ui active inverted dimmer"><div class="ui text"><img class="ui medium image" src="image/not_found.png" alt="not found "></div> </div>'
  );
}

// Build acticle
function buildActicle(id) {
  loader();
  getActicle(id, function (resp) {
    if (resp.data.content_body === undefined) {
      $("#content_body").empty().append(resp.data.content_body);
      randomNotFound();
    } else {
      var html = "";
      if (!isNull(resp.data.modified_date)) { // Check update acticle
        // html += `<span> <img class="ui avatar image" id='users_photo' src="${resp.data.image}">   ${resp.data.username} <br><span id='test'>Modify on : ${moment(resp.data.modified_date).format("DD MMM YYYY")}</span>   </span>`;
        html += `<h4 class="ui header">  <img class="ui mini circular image" src="${resp.data.image}"> </i><div class="content"> ${resp.data.username} <div class="sub header"> ${moment(resp.data.modified_date).format("DD MMM YYYY")} </div></div></h4>`
        
      } else {

        // html += `<span> <img class="ui avatar image" id='users_photo' src="${resp.data.image}"> Create by ${resp.data.username}  <p id='style_user_create_acticle'> On : ${moment(resp.data.create_date).format("DD MMM YYYY")} </p> </span>`;
        html += `<h4 class="ui header">  <img class="ui mini circular image" src="${resp.data.image}"> </i><div class="content"> Create by: ${resp.data.username} <div class="sub header"> ${moment(resp.data.create_date).format("DD MMM YYYY")} </div></div></h4>`
      }
      
      html += resp.data.content_body;
      $("#content_body").empty().append(html);
      hidelightCode();
    }
  });
}

// Get acticle for update
function getActicleForUpdate(id) {
  loader();
  getActicle1(id, function (resp) {
    var currentActicle = $(this).attr("va.id");
    console.log("Data content body :", currentActicle);

    console.log("acticlce:", resp.data.content_body);
  });
}

// load recent
function getRecent(params) {
  $("#content_body").empty();
  $("body").find(".menu_active").removeClass("menu_active");
  var recentLs = window.localStorage.getItem("act_recent");
  if (!isNull(recentLs)) {
    var ls = JSON.parse(recentLs);
    $("#content_body").append("<h3>Recents</h3>");
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

// check remove from localstorage
function checkAndRemoveFromLocalStorage() {}

//save recent
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
// BUILD SIDE BAR MENU
function buildMenu(isFalse, dept_id) {
  var depID = isNull(dept_id)
    ? $("#departmentListId").dropdown("get value")
    : dept_id;
  getMenu(depID, function (resp) {
    if (resp.status) {
      var html = "";

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
        if (getToken().role == 1) {
          //  Icone update, delete main articel
          html += `<i class="edit outline icon con-size  edit_tag" title="Update Title" v.user_id="${v.user_id}" v.dep_id="${v.dep_id}"  v.id="${v.id}" v.title="${v.title}"> </i>`;
          html += `<i class=" trash alternate outline icon con-size data_delete_tage red" id="delete_thisT" da-de='${v.id}' title="Delete Document" ></i>`;
        } else if (getToken().role == 0) {
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
            if (getToken().role == 1) {
              //  Icon update, delete sub articel
              html += `    <i class="edit blue outline icon icon-size " id="modal-edit-sub-article" dep_id="${v.dep_id}" tag_id="${va.tag_id}" act_id="${va.id}"  title="${va.title}"></i>`;
              html += `    <i class="trash red alternate outline icon icon-size" id="modale-delete-sub" va-id="${va.id}" title='delete articel'></i>`;
            } else if (getToken().role == 0) {
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

function buildUserTable() {
  userTable(function (data) {
    var tableData = "";
    data.data.forEach((i, index) => {
      tableData += `<tr class='allUser' data="${encodeURIComponent(
        JSON.stringify(i)
      )}">`;
      tableData += `<td userRole='${i.id}' class='v-id'>${index + 1}</td>`; // id

      tableData += `<td><img src="${i.image}" class="ui mini rounded image" style="height: 40px; height: 40px; object-fit: cover;"></td>`; // User profile

      tableData += `<td userName='${i.username}' class='v-username'>${i.username}</td>`; // user name

      tableData += `<td userPass='${i.password}' class='v-password'>${i.password}</td>`; // user passwork

      if (i.role == 1) {
        // admin
        tableData += `<td  style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui red label tiny role-use">Admin </a> </td>`;
      } else if (i.role == 0) {
        // user
        tableData += `<td  style="text-align:center;"  userRolee='${i.id}' class='v-role' > <a class="ui blue label tiny"> User </a> </td>`;
      } else if (i.role == 2) {
        // viewer
        tableData += `<td style="text-align:center;" userRolee='${i.id}' class='v-role' > <a class="ui yellow label tiny"> Viewer </a> </td>`;
      }

      if (i.status == 1) {
        // status
        tableData += `<td style="" userStatus='${i.status}' class='v-status' > <a class="ui blue  empty circular label tiny" style="margin-right: 5px">  </a> Active </td>`;
      } else if (i.status == 0) {
        tableData += `<td style="" userStatus='${i.status}' class='v-status' > <a class="ui red empty circular label tiny" style="margin-right: 5px"></a> Disable </td>`;
      }

      tableData += `<td id="all-icon"> <i class="edit blue outlinee icon con-size editUser_icon" userRole='${i.id}' id='' title='Edit' style="margin-right: 20px"> </i>  <i class=" red trash alternate outline icon con-size delete_user_icon" userRole='${i.id}' title='Delete' id='delete_user'> </i> </td>
    </tr>`;
    });
     
    $("#userData").empty().append(tableData);
  });
}

// Get user name
function get_user_information() {
  var user_name = $('#get_user_name').val(getToken().name);
  $('#get_user_name').empty().append(user_name.val());
}

function get_user_image() {
  var user_image;
  var user_profile = $('img').attr('src', getToken().img); // Set user profile
  $('#User_profile #user_image').empty().append(user_profile);
}
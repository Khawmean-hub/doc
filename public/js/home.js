function buildLogin() {
  $(".page-login").show();
  $(".my_body").hide();
}

function buldHome() {
  $(".page-login").hide();
  $(".my_body").show();
  buildDepartment();
  buildeMenuCobobox();
  getRecent();
  buildMenu(true);

  // check role
  if (getToken().role == 0) { // user
    $('#btn_add_contents').show();
    $('#btn_manage-user').hide();
    $('.edit_tag2').show();
    $('.btn_logout').show();
    $('.btn_login').hide();
    $('#Create-New-User').hide();

    // hide button add contents or department
  } else if (getToken().role == 1) { // admin
    $('#btn_manage-user').show();
    $('.btn_login').hide();
    $('.btn_logout').show();
    $('#Create-New-User').show();
    // show button add contents or department
    $('#btn_add_contents').show();

  } else if (getToken().role == 2) { // not user read only
    $('#btn_manage-user').hide();
    $('.edit_tag2').hide();
    $('#btn_add_contents').hide();
    $('.btn_logout').hide();
    $('.btn_login').show();
  }
}

//on change department
var onChangeDepartment = (id, text) => {
  buildeMenuCombobox("#menu_com", id)
};

//build content loader
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
      $("#departmentListId2").dropdown("setting", "onChange", onChangeDepartment)
    }

    $(id).removeClass("loading");
    //$(id).dropdown();
  });
}

function buildManageDepartment() {
  getDepartment(function (resp) {
    var list = "";
    if (!isNull(resp) && resp.status) {
      resp.data.forEach((v) => {
        list += `<tr>
                 <td class="dep-id" dep_id='${v.dep_id}'>${v.dep_id}</td>
                 <td dep-name='${v.dep_name}' class='dep-name'>${v.dep_name}</td>
                 <td><a href="#"><i class="edit outline icon con-size" id='icon-update-dep'></i></a><a href="#" class="delete-department"><i class="trash alternate outline icon"></i></a></td>
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
            selec = true
          } else {
            selec = false
          }
        }
        var obj = {
          name: e.title,
          value: e.id,
          selected: selec
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
  getMenu($('#departmentListId').dropdown('get value'), function (resp) {
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

// Build Acticle
function buildActicle(id) {
  loader();
  getActicle(id, function (resp) {
    $("#content_body").empty().append(resp.data.content_body);
  });
};

// Get acticle for update
function getActicleForUpdate(id) {
  loader();
  getActicle1(id, function (resp) {
    var currentActicle = $(this).attr('va.id');
    console.log("Data content body :", currentActicle)

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
function checkAndRemoveFromLocalStorage() {

}

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
function buildMenu(isFalse) {
  getMenu($('#departmentListId').dropdown('get value'), function (resp) {
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
        html += `<div class="item" d_et="${v.id}">`
        html += `<a  href="javascript:"  class=" ${v.id} a_ab h_et" > `
        if (getToken().role == 1) {
          //  Icone update, delete main articel
          html += `<i class="edit outline icon con-size  edit_tag" title="Update Title" v.user_id="${v.user_id}" v.dep_id="${v.dep_id}"  v.id="${v.id}" v.title="${v.title}"> </i>`
          html += `<i class=" trash alternate outline icon con-size data_delete_tage" id="delete_thisT" da-de='${v.id}' title="Delete Document" ></i>`
        } else if (getToken().role == 0) {
          html += `<i class="edit outline icon con-size  edit_tag" title="Update Title" v.user_id="${v.user_id}" v.dep_id="${v.dep_id}"  v.id="${v.id}" v.title="${v.title}"> </i>`
        }


        html += `</a>`
        html += `<a class="title cde"  style="font-size: 15px;font-weight: 500;margin-top: 10px;"><i class=" icon"></i><b class="${v.title}">${v.title}</b></a>`
        html += `<div class="content">`
        html += `<ul class="sub-menu">`;

        resp.data.ARTICLES.forEach((va) => {

          if (va.tag_id == v.id) {
            html += `  <div class="sub_t "d_est="${va.id}">`
            html += `    <li class="sub-title acticle_con" tag_title="${v.title}" act_id="${va.id}">`
            html += `    <a class="co" href="javascript:" data-li="${va.title}">${va.title}`
            html += `    </a>`
            html += `    </li>`
            html += `     <li> <a href="javascript:" class="${va.id} h_st">`
            if (getToken().role == 1) {
              //  Icon update, delete sub articel
              html += `    <i class="edit outline icon icon-size " id="modal-edit-sub-article" dep_id="${v.dep_id}" tag_id="${va.tag_id}" act_id="${va.id}"  title="${va.title}"></i>`
              html += `    <i class="trash alternate outline icon icon-size" id="modale-delete-sub" va-id="${va.id}" title='delete articel'></i>`
            } else if (getToken().role == 0) {
              html += `    <i class="edit outline icon icon-size " id="modal-edit-sub-article" dep_id="${v.dep_id}" tag_id="${va.tag_id}" act_id="${va.id}"  title="${va.title}"></i>`
            }

            html += `    </a>`
            html += `    </li> </div>`;
          }
        });

        html += `</ul> </div></div>`;
      });
    }
    if (isNull(html)) {
      // CHECK IT NULL
      $("#menu_body").empty().append('<p style="text-align:center; margin-top: 20px">No data</p>');
    } else
      $("#menu_body").empty().append(html);

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

// base URL
//var baseUrl = "http://192.168.178.81:88"; // Dev server 
//var baseUrl = "http://192.168.178.81:81"; // Real server
var baseUrl = "http://localhost:4545"; // Local server

// CALL API
var isAlreadyAlert = false;
function requestApi(settings, callBack) {
  $.ajax(settings)
    .done(function (response) {
      console.log("response from API :", response);
      callBack(response);
    })
    .fail(function (data, textStatus, xhr) {
      if (data.status == 401 || data.status == 403) {
        if (!isAlreadyAlert) {
          isAlreadyAlert = true;
          buildLogin();
          alert("Your token is expired please login again.");
        }

        window.localStorage.removeItem("b2b_user");
        $(".page-login").show();
        $(".my_body").hide();
      }
      
      console.log("error");
      callBack(data);
    });
}

function getToken() {
  var data = window.localStorage.getItem("b2b_user");
  if (isNull(data)) {
    return { token: "" };
    buildLogin();
    //rebuild login page
  } else {
    return JSON.parse(data);
  }
}

function getMenuHome(callBack) {
  var settings = {
    url: baseUrl + "/doc_menu_home_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
  };
  requestApi(settings, (response) => {
    callBack(response);
  });
}

function deleteDepartment(id, callBack) {
  var settings = {
    url: baseUrl + "/doc_department_d001",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ DEP_ID: id }),
  };
  requestApi(settings, callBack);
}
// doc_department_c001
function insertDepartment(req, callBack) {
  var settings = {
    url: baseUrl + "/doc_department_c001",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify(req),
  };
  requestApi(settings, callBack);
}

function updateDepartment(req, callBack) {
  var settings = {
    url: baseUrl + "/doc_department_u001",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify(req),
  };
  requestApi(settings, callBack);
}

// doc department
function getDepartment(dept_id,callBack) {
  var settings = {
    url: baseUrl + "/doc_department_r001",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({DEPT_ID: dept_id})
  };
  requestApi(settings, callBack);
}

// get department menu
function getMenu(deptId, callBack) {
  var settings = {
    url: baseUrl + "/doc_menu_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ DEPT_ID: deptId }),
  };
  requestApi(settings, callBack);
}

// save text editor
function saveContents(req, callBack) {
  var settings = {
    url: baseUrl + "/doc_article_c01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify(req),
  };
  requestApi(settings, callBack);
}

// serch content
function getSearch(srch, callBack) {
  var settings = {
    url: baseUrl + "/doc_search_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ srch }),
  };
  requestApi(settings, callBack);
}

// Get acticle
function getActicle(id, callBack) {
  var settings = {
    url: baseUrl + "/doc_article_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ ID: id }),
  };
  requestApi(settings, callBack);
}
// console.log('getToken: ', getToken);

// Get acticle for update
function getActicle1(id, callBack) {
  var settings = {
    url: baseUrl + "/doc_article_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ ID: id }),
  };
  requestApi(settings, callBack);
}

// Get login
function getLogin(username, password, callBack) {
  var settings = {
    url: baseUrl + "/doc_login_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      USERNAME: username,
      PASSWORD: password,
    }),
  };
  requestApi(settings, callBack);
}

// Add label title
function saveTage(req, callBack) {
  var settings = {
    url: baseUrl + "/doc_tag_c01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify(req),
  };
  requestApi(settings, callBack);
}

// delete doc tag
function deleteTage(id, callBack) {
  var settings = {
    url: baseUrl + "/doc_tags_d01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ ID: id }),
  };
  requestApi(settings, callBack);
}
// delete doc article
function deleteArticles(id, callBack) {
  var settings = {
    url: baseUrl + "/doc_articles_d01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify({ ID: id }),
  };
  requestApi(settings, callBack);
}

// Update article has have
function updateArticles(req, callBack) {
  // doc_articles_u01
  var settings = {
    url: baseUrl + "/doc_article_u01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify(req),
  };
  requestApi(settings, callBack);
}

// doc_tag_u01
function updateTag(reqTag, callBack) {
  var settings = {
    url: baseUrl + "/doc_tag_u01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken().token,
    },
    data: JSON.stringify(reqTag),
  };
  requestApi(settings, callBack);
}

// User
function userTable(callBack) {
  var settings = {
    url: baseUrl + "/doc_users",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    }
  };
  requestApi(settings, callBack);
}

// delete user
function delete_User(id, callBack) {
  var settings = {
    url: baseUrl + "/delete_users/" + id,
    method: "DELETE",
    header: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
  };
  requestApi(settings, callBack);
}

// add user
function addB2bUser(req, callBack) {
  var settings = {
    url: baseUrl + "/add_users",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: JSON.stringify(req),
  };
  requestApi(settings, callBack);
}

// update user
function updateUser(id, req, callBack) {
  var settings = {
    url: baseUrl + "/update_users/" + id,
    method: "POST",
    header: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: req,
  };
  //console.log(settings)
  requestApi(settings, callBack);
}

// Upload single file
function uploadFile(file, path, callBack) {
  let formData = new FormData();
  formData.append("file", file, path);

  var settings = {
    url: baseUrl + "/upload",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: formData,
  };
  requestApi(settings, callBack);
}

// Update user profile
function update_user_profile(id, req, callBack) {
  var settings = {
    url: baseUrl + "/user_update_profile/" + id,
    method: "POST",
    header: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: req,
  };
  requestApi(settings, callBack);
}

// RESET PASSWORD
function reset_password(req, callBack) {
  var settings = {
    url: baseUrl + "/doc_reset_password",
    method: "POST",
    header: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: req,
  };
  requestApi(settings, callBack);
}

// Insert file
function upload_file(req, callBack) {
  var setting = {
    url: baseUrl + "/doc_file_c01",
    method: "POST",
    header: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,

    },
    data: req,
  };
  requestApi(setting, callBack);
}

// Read file
function read_file(id, callBack) {
  var setting = {
    url: baseUrl + "/doc_file_r01",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: JSON.stringify({ ID: id })
  };
  requestApi(setting, callBack);
}

// delete file
function deleteFile(id, callBack) {
  var settings = {
    url: baseUrl + "/doc_file_d01",
    method: "POST",
    header: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: JSON.stringify({ID: id}),
  };
  requestApi(settings, callBack);
}

// read file content
function FileContent(id, callBack) {
  var setting = {
    url: baseUrl + "/doc_file_r02",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + getToken().token,
    },
    data: JSON.stringify({ ID: id })
  };
  requestApi(setting, callBack);
}


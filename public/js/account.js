// edit avatar
$(document).on("change", ".avatarUpload", (e) => {
  const file = e.target.files[0];
  const fileUrl = URL.createObjectURL(file);
  const originFileUrl = $("#currentAvatar").attr("src");
  $("#avatar").attr("disabled", "disabled");
  $(".avatarChange").hide();
  if (file) {
    $("#currentAvatar").attr("src", `${fileUrl}`);
    $(".avatarLabel").after(`
        <div class="changeSettingsBox avatarChange">
        <button class="btn btn-sm btn-outline-secondary" id="avatarSave">SAVE</button>
        <span class="btn btn-sm btn-secondary" id="avatarSelectCancel">CANCEL</span>
        <div>`);
  }
  //avatar change event
  $(document).on("click", "#avatarSave", (e) => {
    let uploadImage = new FormData();
    uploadImage.append("avatar", $(".avatarUpload").prop("files")[0]);

    axios({
      method: "post",
      url: "/account/profile/avatar",
      data: uploadImage,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res => {
      $(".avatarChange").hide();
      $("#avatar").removeAttr("disabled");
      $("#currentAvatar").attr("src", `${res.data.avatarPhoto}`);
      $(".navAvatar").attr("src", `${res.data.avatarPhoto}`);
    })
  })

  // cancel avatar change event
$(document).on("click", "#avatarSelectCancel", (e) => {
    $(".avatarChange").hide();
    $("#avatar").removeAttr("disabled");
    $("#currentAvatar").attr("src", `${originFileUrl}`);
  });
  URL.revokeObjectURL(file);
});

//edit name
$(document).on("click", ".nameEditBtn", (e) => {
  $(".nameEditBtn").hide();
  $(".userName").hide();

  $(".nameEdit").append(`
  <div class="userNameBox">
  <input class="form-control newUserName" name="newUserName" type="text">
  <div class="changeSettingsBox">
        <span class="btn btn-sm btn-outline-secondary userNameSave">SAVE</span>
        <span class="btn btn-sm btn-secondary userNameCancel" >CANCEL</span>
        </div></div>`);

  $(".userNameSave").on("click", (e) => {
    const newUserName = $(".newUserName");
    const csrf = $("#_csrf").val();

    axios({
        method: "patch",
        url: "/account/profile/name",
        headers: {
          "CSRF-Token": csrf
        },
        data: {
          newUserName: newUserName.val()
        }
      })
      .then((res) => {
        if (res.data.editNameStatus) {
          $(".userNameBox").hide();
          $(".userName").val(`${res.data.newUserName}`);
          $(".userName").show();
          $(".nameEditBtn").show();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "The user has already been authorized.",
          })
        }
      })
  });
  $(".userNameCancel").on("click", (e) => {
    $(".userNameBox").hide();
    $(".userName").show();
    $(".nameEditBtn").show();
    e.stopImmediatePropagation();
  });
});

// edit password
$(document).on("click", ".passwordChangeBtn", (e) => {
  const oldPassword = $("#oldPassword");
  const newPassword = $("#newPassword");
  const newPasswordCheck = $("#newPasswordCheck");
  const passwordChangeMessage = $(".passwordChangeMessage");
  const csrf = $("#_csrf").val();
  axios({
      method: "patch",
      url: "/auth/change/password",
      headers: {
        "CSRF-Token": csrf
      },
      data: {
        oldPassword: oldPassword.val(),
        newPassword: newPassword.val(),
        newPasswordCheck: newPasswordCheck.val()
      }
    })
    .then(res => {
      const resultMessage = res.data.resultMessage;
      oldPassword.val("");
      newPassword.val("");
      newPasswordCheck.val("");
      passwordChangeMessage.addClass("authWarning");
      passwordChangeMessage.text(resultMessage);

    })
});
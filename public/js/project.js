//add project
$(document).on("click", ".projectNameBtn", (e) => {
  const projectName = $("#projectName").val();

  axios({
      method: "post",
      url: "/project",
      data: {
        projectName: projectName
      }
    })
    .then(res => {
      res.data.newProject.num ?
        window.location.href = `/list/${res.data.newProject.num}` :
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        })
    })
    .catch(err => {
      console.log(err)
    })
  e.stopImmediatePropagation();
});

//delete project
$(document).on("click", ".deleteProjectBtn", (e) => {
  const projectId = e.target.dataset.projectid;
  const csrf = $("#_csrf").val();

  Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
            method: "delete",
            url: "/project",
            headers: {
              "CSRF-Token": csrf
            },
            data: {
              projectId: projectId
            }
          })
          .then(res => {
            res.data.deleteStatus ?
              Swal.fire({
                title: "Success!",
                text: "The project has been deleted.",
                icon: "success"
              }).then(result => {
                if (result.isConfirmed)
                  window.location.href = "/"
              }) :
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
              })
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
  e.stopImmediatePropagation();
});

//change title
$(document).on("click", ".changeTitleBtn", (e) => {
  const projectNum = window.location.pathname.split("/")[2];
  const newTitle = $(".newTitle").val();
  const csrf = $("#_csrf").val();
  axios({
      method: "patch",
      url: "/project",
      headers: {
        "CSRF-Token": csrf
      },
      data: {
        projectNum: projectNum,
        newTitle: newTitle
      }
    })
    .then(res => {
      if(res.data.projectName === newTitle) {
        $(".projectTitle").text(`${res.data.projectName}`);
        Swal.fire({
          icon: "success",
          title: "The title is changed!"
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }

    })
    .catch(err => {
      console.log(err)
    });
});


//add authorization
$(document).on("click", ".addAuthBtn", (e) => {
  const that = $(e.target);
  const projectAuthInput = that.closest(".projectAuth").find("input");
  const user = projectAuthInput.val();
  const projectid = e.target.dataset.projectid;
  const authList = $(".authList");
  const csrf = $("#_csrf").val();

  axios({
      method: "post",
      url: "/project/auth",
      headers: {
        "CSRF-Token": csrf
      },
      data: {
        userToBeAdd: user,
        projectId: projectid
      }
    })
    .then(res => {
      Swal.fire({
          icon: "success",
          title: "The user is authorized!"
        }, authList.append(`
      <div class="authListItem">
      <h5><span class="badge bg-secondary">${user}<img
      src="/static/image/list/delete-auth.svg" class="removeAuthBtn"
      data-projectid="${projectid}" data-useraccount="${user}"></img></span></h5>
      </div>`),
        projectAuthInput.val("")
      );
    }).catch(err => {
      const addAuthStatus = err.response.data.addAuthStatus;
      addAuthStatus === "User exist" ?
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The user has already been authorized.",
        }) :
        addAuthStatus === "No user" ?
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The user does not exist, please make sure the account is correct."
        }) :
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        })
    });
  e.stopImmediatePropagation();
});

//remove authorization
$(document).on("click", ".removeAuthBtn", (e) => {
  const authListItem = $(e.target).closest(".authListItem");
  const userToBeRemove = e.target.dataset.useraccount;
  const projectid = e.target.dataset.projectid;
  const csrf = $("#_csrf").val();

  axios({
      method: "delete",
      url: "/project/auth",
      headers: {
        "CSRF-Token": csrf
      },
      data: {
        userToBeRemove: userToBeRemove,
        projectId: projectid
      }
    })
    .then(res => {
      res.data ?
        Swal.fire({
          icon: "success",
          title: "The user is removed."
        }, authListItem.remove()) :
        Swal.fire({
          icon: "error",
          title: "Uh-oh!",
          text: "Something goes wrong. Please try again!",
        })
    })
  e.stopImmediatePropagation();
});

// scroll to top
$(".scrollToTop").click(() => {
  $("html").scrollTop(0);
});
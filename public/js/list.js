
//check list item
$(document).on("click", ".checkBox", (e) => {
    const that = $(e.target);
    const list = that.closest(".listItem");
    const checkBox = list.find(".checkBox");
    const checkedText = list.find(".currentList");
    const listId = e.target.dataset.listid;
    const csrf = $("#_csrf").val();
    axios({
            method: "patch",
            url: `/list/${listId}`,
            headers: {
                "CSRF-Token": csrf
            }
        })
        .then(res => {
            checkBox.toggleClass("checked");
            checkedText.toggleClass("checkedText");
        })
        .catch((err) => {
            console.log(err)
        });

    e.stopImmediatePropagation();
});

//add list button
$(document).on("click", ".newList", (e) => {
    const newListInputBox = $(".newListBox");
    newListInputBox.show("fast");
    $(".newList").hide("fast");
    $(".cancelNewListBtn").click((e) => {
        newListInputBox.hide();
        $(".newList").show("fast");
    })
    e.stopImmediatePropagation();
});

//add list item
$(document).on("click", ".newListBtn", (e) => {
    const newList = $(".newList");
    const projectNum = window.location.pathname.split("/")[2];
    const newListInput = $(".newListInput");
    const newListDueDate = $(".newListDueDate").val();
    const csrf = $("#_csrf").val();

    axios({
        method: "post",
        url: `/list/${projectNum}`,
        headers: {
            "CSRF-Token": csrf
        },
        data: {
            newListInput: newListInput.val(),
            newListDueDate: newListDueDate
        }
    }).then(res => {
        const list = res.data.newList;
        const listDueDate = list.end.split("T")[0];
        const newListItem = `<div class="listItem">
    <span class="checkBox ${list.check ? "checked" : null }" data-listid="${list._id}"></span>
    <div class="listItemBox">
        <label class="currentList ${list.check ? "checkedText" : null}"></label>
        <button type="button" class="tooltipBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Reminder">
            <img class="listImage calendarBtn" src="/static/image/list/alarm.svg" data-num="${projectNum}"
                data-listid="${list._id}" data-bs-toggle="modal" data-bs-target="#cal${list._id}"></button>
                <div class="modal fade" id="cal${list._id}" tabindex="-1" aria-labelledby="calLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="calLabel">Due date & Reminders</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h6 class="dueDateTitle">Due date</h6>
        <div class="dueDateBox">
            <input class="dueDateInput" type="date" min="${list.createdAt}"
              value="${listDueDate}"
              name="dueDate">
            <button type="submit" value="${list._id}" class="dueDateBtn">Save</button>
        </div>
        <div class="dueDateBox">
          <h6>Google Calendar</h6>
          <img src="/static/image/list/google-calendar.svg" class="alertBtn googleNotifyBtn" alt="Google calendar"
            data-listid="${list._id}">
        </div>
        <div class="dueDateBox">
          <h6>Line notification</h6>
          <img src="/static/image/list/line.svg" class="alertBtn lineNotifyBtn" alt="Line notify"
            data-listid="${list._id}">
        </div>
      </div>
    </div>
  </div>
</div>
        <button type="button" class="tooltipBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
            <img class="listImage editListBtn" src="/static/image/list/edit.svg"
                data-listid="${list._id}"></button>
        <button type="button" class="tooltipBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
            <img class="listImage deleteListBtn" src="/static/image/list/delete.svg"
                data-num="${projectNum}" data-listid="${list._id}"></button>
    </div>
</div>`
        if (res.data.listNum != 0) {
            $(".noListText").remove();
        }
        if (res.data.newList) {
            newList.before(newListItem);
            $(".currentList").last().text(list.content);
            newListInput.val("");
        }
    })
})

//edit list item
$(document).on("click", ".editListBtn", (e) => {
    let that = $(e.target);
    let listTextBox = that.closest(".listItemBox");
    let listItem = that.closest(".listItem");
    let currentList = listTextBox.find(".currentList");
    let text = currentList.text();
    let projectNum = e.target.dataset.num;
    let listId = e.target.dataset.listid;
    let editMode = (`
    <div class="editlistBox"> 
    <input class="editListInput"> 
    <button type="button" class="tooltipBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Send">
    <img src="/static/image/list/send.svg" class="listImage sendListBtn">
    </button>
    <button type="button" class="tooltipBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="Cancel">
    <img src="/static/image/list/cancel.svg" class="listImage cancelEditBtn">
    </button>
    </div> 
    `)
    listTextBox.hide();
    listItem.append(editMode);
    $(".editListInput").val(text);

    const editList = (e) => {
        let editlistBox = listItem.find(".editlistBox");
        let newList = listItem.find(".editListInput");
        let csrf = $("#_csrf").val();
        newList = newList.val();

        axios({
                method: "patch",
                url: `/list/${projectNum}/${listId}`,
                headers: {
                    "CSRF-Token": csrf
                },
                data: {
                    editListInput: newList
                }
            })
            .then(res => {
                if (res.data.editStatus) {
                    editlistBox.remove();
                    listTextBox.show();
                    listTextBox.find(".currentList").text(newList);
                }
            })
            .catch(err => {
                console.log(err)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                });
            })

        e.stopImmediatePropagation();
    };

    const cancelEdit = (e) => {
        let editlistBox = listItem.find(".editlistBox");
        editlistBox.remove();
        listTextBox.show();
        e.stopImmediatePropagation();
    };

    // event triggered by clicking button
    $(".sendListBtn").on("click", editList);

    // cancel edit event
    $(".cancelEditBtn").on("click", cancelEdit);

    // event triggered by clicking enter/escape
    $(".editListInput").on("keyup", (e) => {
        if (e.which == 13) {
            editList(e);
        } else if (e.which == 27) {
            cancelEdit(e);
        }
    });
});

//set due date
let newDueDate;
$(document).on("change", ".dueDateInput", (e) => {
    newDueDate = $(e.target).val();
});

$(document).on("click", ".dueDateBtn", (e) => {
    const listId = $(e.target).val();
    const csrf = $("#_csrf").val();
    axios({
            method: "put",
            url: `/list/${listId}`,
            headers: {
                "CSRF-Token": csrf
            },
            data: {
                newDueDate: newDueDate
            }
        }).then((res) => {
            res.data.setStatus ?
                Swal.fire({
                    icon: "success",
                    title: "Your date has been saved.",
                    showConfirmButton: false,
                    timer: 1500
                }) :
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                })
        })
        .catch((err) => {
            console.log(err)
        });
    e.stopImmediatePropagation();
});

//delete list item
$(document).on("click", ".deleteListBtn", (e) => {

    const listItem = e.target.closest(".listItem");
    const listBox = $("#v-pills-list");
    const projectNum = e.target.dataset.num;
    const listId = e.target.dataset.listid;
    const noListText = `<h6 class="noListText">You have no task yet :)</h6>`;
    const csrf = $("#_csrf").val();
    axios({
        method: "delete",
        url: `/list/${projectNum}/${listId}`,
        headers: {
            "CSRF-Token": csrf
        }})
        .then(res => {
            res.data.deleteStatus ?
                listItem.remove() :
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                });

            if (res.data.remainingListNum === 0) {
                listBox.prepend(noListText);
            }

        })
        .catch((err) => {
            console.log(err)
        })
    e.stopImmediatePropagation();
});
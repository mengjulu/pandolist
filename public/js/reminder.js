//line notify
$(document).on("click", ".lineNotifyBtn", (e) => {
  const listid = e.target.dataset.listid;
  axios.get(`/line-notify/${listid}`)
    .then(res => {
        res.data.scheduleStatus === true ?
          Swal.fire(
            "Good job!",
            "The message will be sent by the due date! If you'd like to cancel, please click again.",
            "success"
          ) :
          res.data.statusCode === 401 ?
          window.location.replace(`${res.data.authUrl}`) :
          res.data.scheduleStatus === `invalid` ?
          Swal.fire({
            icon: "error",
            title: "The date is invalid!",
            text: "Reminder must be set at least 1 day before the due date."
          }):
          res.data.scheduleStatus === false ?
          Swal.fire({
            icon: "success",
            title: "The notification is canceled!",
            text: "If you need notification, please click it again.",
          }) :
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          })
    })
    e.stopImmediatePropagation();
});

// google notify
$(document).on("click", ".googleNotifyBtn", (e) => {
  const listid = e.target.dataset.listid;
  axios.get(`/google/calendar/${listid}`)
    .then(res => {
        res.data.statusCode === 200 ?
          Swal.fire({
            title: "Success!",
            text: `The reminder will be sent by the due date.`,
            icon: "success"
          }) :
          res.data.statusCode === `invalid` ? 
          Swal.fire({
            icon: "error",
            title: "The date is invalid!",
            text: "Reminder must be set at least 1 day before the due date."
          }) :
          res.data.statusCode === 400 ?
          window.location.replace(`${res.data.authUrl}`) :
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          })
    }) 
    e.stopImmediatePropagation();
});
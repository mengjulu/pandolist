$(document).ready((e) => {
    axios.get("/mylist")
        .then(res => {
            let list = res.data.allUndoneLists;
            mainCal.setEventsData(list);
        });
    });

const mainCal = new Calendar({
    id: "#mainCal",
    calendarSize: "large",
    fontFamilyHeader: "Amatic SC, cursive",
    fontFamilyWeekdays: "Amatic SC, cursive",
    fontFamilyBody: "Satisfy, cursive",
    WeekdayDisplayType: "short",
    dateChanged: (currentDate, filteredDateEvents) => {
        const listItem = $(".mycal");
        let eventsHtml = "";

        listItem.empty();
            filteredDateEvents.map(e => {
                const checkBoxStatus = e.check ? "checked" : null;
                const checkText = e.check ? "checkedText" : null;
                eventsHtml+=`
                    <div class="listItem">
                    <span class="checkBox ${checkBoxStatus}" data-listid="${e._id}"></span>
                    <a class="projectLink currentList ${checkText}"
                        href="/list/${e.project.num}"></a>
                </div>`
            });
            if (eventsHtml.length === 0) {
                listItem.append(`<h5 class="taskBoxText">No task due today :) Enjoy!</h5>`)
            } else {
                listItem.append(eventsHtml);
                $(".currentList").each(function(index){
                    $(this).text(filteredDateEvents[index].content)
                });
            };
        }
});

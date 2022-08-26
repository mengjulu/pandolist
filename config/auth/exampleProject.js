const Project = require("../../models/project");
const List = require("../../models/list");

const exampleProject = async (newUser) => {
    const newProject = new Project({
        name: "Welcome to Pandolist 🐼",
        creator: newUser._id,
        num: Math.floor(Math.random() * 10000000000)
    });

    const newLists = [{
            project: newProject._id,
            content: "You can arrange your regular routine here and set reminder for your lists.",
            creator: newUser._id
        }, {
            project: newProject._id,
            content: "Besides, you can share the project with your members and also chat in this project room. :)",
            creator: newUser._id
        },
        {
            project: newProject._id,
            content: "Enjoy! 🥳",
            creator: newUser._id
        }
    ];

    await List.insertMany(newLists)
        .then(list => {
            list.forEach(list => {newProject.list.push(list._id);});
            newProject.addAuth(newUser);
        });
};

module.exports = exampleProject;
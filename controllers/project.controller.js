const db = require("../models");
const qs = require("qs");
const Projects = db.projects;

// Create and save a new project
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
    }

    // Create a project
    const project = new Projects({
        name: req.body.description,

    });

    // Save project in the database
    project
        .save(project)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the project"
            });
        });
};

// Retrieve all projects from the database
exports.findAll = (req, res) => {
    console.log('Find all projects');

    Projects.find({})
    .populate('prioritySubmittals.submittal', 'submittalID description needDate')
    .populate('unrankedSubmittals.submittal', 'submittalID description needDate')    
    // .populate('unrankedSubmittals', ['submittalID', 'description', 'needDate'])
    .then(data => {
        // console.log(JSON.stringify(data));
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving projects"
        });
    });
};

// Find a single project with an id
exports.findOne = (req, res) => {
const id = req.params.id;

Projects.findById(id)
    .then(data => {
        if (!data)
            res.status(404).send({ message: "Project with id " + id + " not found"});
        else res.send(data);
    })
    .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving project with id " + id });
    });
};

// Update a project by the id in the request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    // console.log(req.body);

    const id = req.params.id;

    delete req.body.id;
    delete req.body._id;

    Projects.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Project with id ${id}. Maybe project was not found.`
                });
            } else res.send({ message: "Project was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating project with id ${id}`
            });
        });
};

// Update a project's submittal priorities by the id in the request
// exports.updatePriorities = (req, res) => {
//     if(!req.body) {
//         return res.status(400).send({
//             message: "Data to update cannot be empty!"
//         });
//     }

//     const projectName = req.params.name;

//     Projects.findOneAndUpdate({name: projectName}, { prioritySubmittals: [{submittalID: 'adfasdfa', priority: 2}, {submittalID: 'adfasdfa', priority: 2}] }, { useFindAndModify: false })
//         .then(data => {
//             if (!data) {
//                 res.status(404).send({
//                     message: `Cannot update project with name ${projectName}. Maybe project was not found.`
//                 });
//             } else res.send({ message: "Project was updated successfully." });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: `Error updating project with name ${projectName}`
//             });
//         });
// };

// Delete a project with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Projects.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete project with id ${id}. Maybe project was not found`
                });
            } else {
                res.send({
                    message: "Project was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete project with id ${id}`
            });
        });
};

// Delete all projects from the database.
// exports.deleteAll = (req, res) => {
//     Projects.deleteMany({})
//         .then(data => {
//             res.send({
//                 message: `${data.deletedCount} projects were deleted successfully!`
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all projects."
//             });
//         });
// };


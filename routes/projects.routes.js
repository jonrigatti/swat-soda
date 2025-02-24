const projectsController = require("../controllers/project.controller.js");

var router = require("express").Router();

// Order of these matters for some dumb reason...

// Create a new project
router.post("/", projectsController.create);

// Retrieve all projects
router.get("/", projectsController.findAll);

// Retrieve a single project with id
router.get("/:id", projectsController.findOne);

// Update a project with id
router.put("/:id", projectsController.update);

// Delete a project with id
router.delete("/:id", projectsController.delete);

// Create a new project
// router.delete("/", projects.deleteAll);

// app.use('/api/projects', router);
module.exports = router;
const submittalsController = require("../controllers/submittal.controller.js");

var router = require("express").Router();

// Order of these matters for some dumb reason...

// Create a new submittal
router.post("/", submittalsController.create);

// Find open submittals
router.get("/open", submittalsController.findOpen);

// Find closed submittals
router.get("/closed", submittalsController.findClosed);

// Find submittals with a dynamic query
router.get("/query/", submittalsController.findDynamic);

// Retrieve all submittals
router.get("/", submittalsController.findAll);

// Retrieve a single submittal with id
router.get("/:id", submittalsController.findOne);

// Find by violation
router.get("/violations/:violation", submittalsController.findByViolation);

// Find by owner
router.get("/owners/:owner", submittalsController.findByOwner);

// Update a submittal with id
router.put("/:id", submittalsController.update);

// Delete a submittal with id
router.delete("/:id", submittalsController.delete);

// Create a new submittal
// router.delete("/", submittals.deleteAll);

// app.use('/api/submittals', router);

module.exports = router;
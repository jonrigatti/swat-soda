
const server = require("../controllers/server.controller.js");

var router = require("express").Router();

// Order of these matters for some dumb reason...

router.get("/testdir", server.testDir);
router.put("/createSDF/:id", server.createSDF);
router.put("/createPDF/:id", server.createPDF);
router.put("/mergePDF/:id", server.mergePDF);

// app.use('/api/server', router);

module.exports = router;
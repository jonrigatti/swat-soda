const db = require("../models");
const qs = require("qs");
const Submittals = db.submittals;

// Create and save a new submittal
exports.create = (req, res) => {
    // Validate request
    if (!req.body.submittalID) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
    }

    // Create a submittal
    const submittal = new Submittals({
        description: req.body.description,
        // published: req.body.published ? req.body.published : false,
        submittalID: req.body.submittalID,
        needDate: req.body.needDate,        
        // priority: req.body.priority ? req.body.priority : false,
    });

    // Save submittal in the database
    submittal
        .save(submittal)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the submittal"
            });
        });
};

// Retrieve all submittals from the database
exports.findAll = (req, res) => {
    console.log('Find all submittals');
    // const submittalID = req.query.submittalID;
    // console.log(req.query.submittalID);
    // var condition = submittalID ? { submittalID: { $regex: new RegExp(submittalID), $options: "i" } } : {};

    Submittals.find({})
    .then(data => {
        // Have to run extra loop to include virtuals on individual results
        const withVirtuals = []
        data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
        res.send(withVirtuals);
        // console.log(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving submittals"
        });
    });
};

// Find a single submittal with an id
exports.findOne = (req, res) => {
const id = req.params.id;

Submittals.findById(id)
    .then(data => {
        if (!data)
            res.status(404).send({ message: "Submittal with id " + id + " not found"});
        else {
            const withVirtuals = []
            data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
            res.send(withVirtuals);
        };
    })
    .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving submittal with id " + id });
    });
};

// Update a submittal by the id in the request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    const id = req.params.id;

    delete req.body.id;
    delete req.body._id;

    Submittals.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Submittal with id ${id}. Maybe submittal was not found.`
                });
            } else res.send({ message: "Submittal was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating submittal with id ${id}. ${err.message}`
            });
        });
};

// Delete a submittal with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Submittals.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete submittal with id ${id}. Maybe submittal was not found`
                });
            } else {
                res.send({
                    message: "Submittal was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete submittal with id ${id}`
            });
        });
};

// Delete all submittals from the database.
// exports.deleteAll = (req, res) => {
//     Submittals.deleteMany({})
//         .then(data => {
//             res.send({
//                 message: `${data.deletedCount} submittals were deleted successfully!`
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all submittals."
//             });
//         });
// };

// Find submittals with a certain owner
exports.findByOwner = (req, res) => {
    const o = req.params.owner;
    console.log('Owner from Controller: ' + o);

    Submittals.find({ owner: o })
    .then(data => {
        const withVirtuals = []
        data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
        res.send(withVirtuals);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving submittals with specified owner."
        });
    });
};

// Find submittals with a certain violation type
exports.findByViolation = (req, res) => {
    const v = req.params.violation;
    console.log('Violation from Controller: ' + v);

    Submittals.find({ violations: { $elemMatch: { category: v } } })
    .then(data => {
        const withVirtuals = []
        data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
        res.send(withVirtuals);;
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving submittals with specified owner."
        });
    });
};
    
// Find open submittals
exports.findOpen = (req, res) => {
    // const v = req.params.violation;
    console.log('Find open submittals');

    Submittals.find({
        $or: [{
            dispositionDate: { $exists: false }
        }, {
            dispositionDate: null
        }
    ]
    })
    .then(data => {
        const withVirtuals = []
        data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
        // console.log(data);
        res.send(withVirtuals);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving open submittals."
        });
    });
};

// Find closed submittals
exports.findClosed = (req, res) => {
    // const v = req.params.violation;
    console.log('Find closed submittals');

    Submittals.find({ dispositionDate: { $ne: null } })
    .then(data => {
        const withVirtuals = []
        data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
        res.send(withVirtuals);;
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving closed submittals."
        });
    });
};

// Dynamic find
exports.findDynamic = (req, res) => {
    console.log('req.query: ' + JSON.stringify(req.query));
    console.log('req.params: ' + JSON.stringify(req.params));

    // qs.parse expects a string
    const queryString = decodeURIComponent(req.originalUrl.substr(req.originalUrl.indexOf('?')+1));
    var parsedQuery = qs.parse(queryString, {
        decoder: function (str) {
            if (/^(\d+|\d*\.\d+)$/.test(str)) {
                return parseFloat(str);
            }
    
            let keywords = {
                true: true,
                false: false,
                null: null,
                undefined: undefined,
            };
            if (str in keywords) {
                return keywords[str];
            }
    
            return str;
        }
    });

    console.log('parsedQuery: ' + JSON.stringify(parsedQuery));

    Submittals.find(parsedQuery)
    .then(data => {
        const withVirtuals = []
        data.forEach(d => withVirtuals.push(d.toJSON({virtuals: true})));
        res.send(withVirtuals);;
        console.log('Data: ' + JSON.stringify(data));
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving  queried submittals."
        });
    });
};
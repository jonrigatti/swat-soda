const fs = require("fs");
const path = require("path");

// Also try easy-templates-x and docx-templates (and officeparser to parse...)

// Create a test directory
exports.testDir = (req, res) => {
        console.log("Test directory in server routes?!");
        //Create folder
        fs.mkdir("C:\\Users\\jonri\\Documents\\Work\\test", {}, (err) => {
            if (err) throw err;
            console.log("folder created ...");
        });
        res.json({ message: "Test directory in server routes?!" });
    };

    
// Create a test directory
exports.createSDF = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }
    
    console.log(`Create SDF for ${req.body.submittalID}:`);
    console.log(JSON.stringify(req.body));
    
    // console.log(req.body);

    const { createReport } = require('docx-templates');
    
    const template = fs.readFileSync('C:\\Users\\jonri\\Documents\\Work\\test\\SDF Template.docx');
        
    const buffer = await createReport({
        template,
        data: req.body,
        cmdDelimiter: ['{', '}']
    });
    
    fs.writeFileSync(`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.docx`, buffer)
};

exports.createPDF = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }
    
    console.log(`Create SDF for ${req.body.submittalID}:`);
    console.log(JSON.stringify(req.body));
    
    // console.log(req.body);

    var docxConverter = require('docx-pdf');

    docxConverter(`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.docx`,`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.pdf`, function(err, result) {
        if(err){
            console.log(err);
        }
        console.log('result'+result);
    });
};

exports.mergePDF = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }
    
    console.log(`Merge SDF for ${req.body.submittalID}:`);
    console.log(JSON.stringify(req.body));
    
    // console.log(req.body);

    const PDFMerger = require('pdf-merger-js');

    var merger = new PDFMerger();

    (async () => {
        await merger.add(`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.pdf`);  //merge all pages. parameter is the path to file and filename.
        await merger.add('C:\\Users\\jonri\\Documents\\Work\\test\\SUB-ABC-0123-SDF.pdf', 1); // merge only page 1
        // await merger.add('pdf2.pdf', [1, 3]); // merge the pages 1 and 3
        // await merger.add('pdf2.pdf', '4, 7, 8'); // merge the pages 4, 7 and 8
        // await merger.add('pdf3.pdf', '3 to 5'); //merge pages 3 to 5 (3,4,5)
        // await merger.add('pdf3.pdf', '3-5'); //merge pages 3 to 5 (3,4,5)

        await merger.save(`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF-Merged.pdf`); //save under given name and reset the internal document
        
        // Export the merged PDF as a nodejs Buffer
        // const mergedPdfBuffer = await merger.saveAsBuffer();
        // fs.writeSync('merged.pdf', mergedPdfBuffer);
    })();

    var docxConverter = require('docx-pdf');
};
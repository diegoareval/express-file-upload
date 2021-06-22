const uploadFile = require("../middleware/upload");
const fs = require("fs");
const parse = require("csv-parser");
const { removeEmpty, validateAll } = require("../../helpers");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    var csvData = [];
    fs.createReadStream(req.file.path)
      .pipe(parse({ delimiter: ":" }))
      .on("data", function (csvrow) {
        //do something with csvrow
        csvData.push(csvrow);
      })
      .on("end", function () {
        //do something with csvData
        const l = [];
        for (data of csvData) {
         const obj =  removeEmpty(data);
         l.push(obj)
        }
       var newArray = l.filter(value => Object.keys(value).length !== 0);

      const result = validateAll(newArray);
      return res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        data: result
      });
      });

  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

module.exports = {
  upload
};

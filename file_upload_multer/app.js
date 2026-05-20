const express = require('express')
const multer = require('multer')

const fs = require('fs').promises
const path = require('path');

// const upload = multer({ dest: 'uploads/' })
const upload = multer()
const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

let submissions = {
    single_file_upload: [],
    multiple_files_upload: []
}

app.get('/single-file-upload', (req, res) => {
    let html =
        `
    <h1>File Upload Form</h1>
    <p>Upload only a PDF file below</p>

    <form action="/single-file-upload" enctype="multipart/form-data" method="post">
  <div class="form-group">
    <input type="file" class="form-control-file" name="uploaded_file">
    <input type="text" class="form-control" placeholder="Number of speakers" name="nspeakers">
    <input type="submit" value="Submit!" class="btn btn-default">
  </div>
</form>
  `

    html += `<a href=http://localhost:8080/single-file-upload-form-submissions>view form submissions</a>`

    res.send(html);
});

app.get('/single-file-upload-form-submissions', (req, res) => {
    let html = `
        <h2> Form Submissions </h2>
    `;

    for (i = 0; i < submissions.single_file_upload.length; i++) {
        entry = submissions.single_file_upload.at(i)

        html += `
            <h3>Entry # <b>${i + 1}</b> </h3>
            <p><b>Number of Speakers</b>: ${entry.nspeakers}</p>
            <img src="${entry.file}" />
            <hr>
        `
    }

    res.send(html)
})

app.post('/single-file-upload', upload.single('uploaded_file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any

    file_ext = path.extname(req.file.originalname)
    file_name = `file_${submissions.single_file_upload.length}`.concat(file_ext);
    file_path = "./uploads/".concat(file_name)

    if (req.file.mimetype !== 'application/pdf') {
        res.status(400).json({ message: 'Upload only a PDF file' })
    }

    fs.writeFile(file_path, req.file.buffer)

    submissions.single_file_upload.push({
        file: file_path,
        nspeakers: req.body.nspeakers
    })

    console.log("file uploaded to: ", "http://localhost:8080/uploads/".concat(file_name))
    console.log("form submission can be viewed at: ", "http://localhost:8080/single-file-upload-form-submissions")

    res.redirect('http://localhost:8080/single-file-upload-form-submissions');
});

app.get('/multiple-files-upload', (req, res) => {
    let html =
        `
    <h1>Multiple File Upload Form</h1>
    <p>Upload your files below</p>

    <form action="/multiple-files-upload" enctype="multipart/form-data" method="post">
  <div class="form-group">
    <input type="file" class="form-control-file" multiple name="uploaded_files">
    <input type="text" class="form-control" placeholder="Number of speakers" name="nspeakers">
    <input type="submit" value="Submit!" class="btn btn-default">
  </div>
</form>
  `

    html += `<a href=http://localhost:8080/multiple-files-upload-form-submissions>view form submissions</a>`

    res.send(html);
});

app.post('/multiple-files-upload', upload.array('uploaded_files', 5), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any

    console.log("Files Array Length", req.files.length)

    if (req.files.length !== 0) {
        submissions.multiple_files_upload.push({
            files: []
        })

        console.log(submissions.multiple_files_upload);
    }

    console.log(submissions.multiple_files_upload[submissions.multiple_files_upload.length - 1])

    for (i = 0; i < req.files.length; i++) {
        file = req.files[i]

        file_ext = path.extname(file.originalname)
        file_name = `file_${submissions.multiple_files_upload.length}_${i + 1}`.concat(file_ext);
        file_path = "./uploads/".concat(file_name)

        fs.writeFile(file_path, file.buffer)

        submissions.multiple_files_upload[submissions.multiple_files_upload.length - 1].files.push({
            file: file_path,
            nspeakers: req.body.nspeakers
        })

        console.log("file uploaded to: ", "http://localhost:8080/uploads/".concat(file_name))

    }

    console.log("form submission can be viewed at: ", "http://localhost:8080/multiple-files-upload-form-submissions")

    for (i = 0; i < submissions.multiple_files_upload.length; i++) {
        entries = submissions.multiple_files_upload.at(i).files

        console.log("Entry ", i)

        for (j = 0; j < entries.length; j++) {
            entry = entries.at(j)

            console.log("Speaker", entry.nspeakers)
            console.log("File", entry.file)
        }
    }

    res.redirect('http://localhost:8080/multiple-files-upload-form-submissions');
});

app.get('/multiple-files-upload-form-submissions', (req, res) => {
    let html = `
                    <h2> Form Submissions </h2>
                        `;

    for (i = 0; i < submissions.multiple_files_upload.length; i++) {
        entries = submissions.multiple_files_upload.at(i).files

        html += `
                        <h3> Entry # <b> ${i + 1}</b> </h3 >
                            `

        for (j = 0; j < entries.length; j++) {
            entry = entries.at(j)

            html += `
                            <p> <b>Number of Speakers</b>: ${entry.nspeakers}</p>
            <img src="${entry.file}" />
            <hr>
        `
        }


        html += `<br/>`
    }

    res.send(html)
})


app.listen(8080, () => {
    console.log(`Server listening at http://localhost:8080`)
})

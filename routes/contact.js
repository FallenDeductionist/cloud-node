const fs = require('fs');

const config = {
    bucketName: 'cloud-exam2',
    dirName: '', /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIAI3F3BSYQXQZWE6TA',
    secretAccessKey: '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',
    s3Url: 'https://s3.us-east-2.amazonaws.com/', /* optional */
}
 
module.exports = {
    addContactPage: (req, res) => {
        res.render('add-contact.ejs', {
            title: 'Bienvenido | Agregar un nuevo contacto'
            ,message: ''
        });
    },
    addContact: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No se subió la imagen.");
        }

        let message = '';
        let name = req.body.name;
        let surname = req.body.surname;
        let email = req.body.email;
        let birthday = req.body.birthday;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = surname + '.' + fileExtension;

        let emailQuery = "SELECT * FROM `contacts` WHERE email = '" + email + "'";

        db.query(emailQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'El correo ya existe';
                res.render('add-contact.ejs', {
                    message,
                    title: 'Bienvenido | Agregar un nuevo contacto'
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the contact's details to the database
                        let query = "INSERT INTO `contacts` (name, surname, email, birthday, image) VALUES ('" +
                            name + "', '" + surname + "', '" + email + "', '" + birthday + "', '" + image_name + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Formato invalido. Solo 'gif', 'jpeg' y 'png' estan permitidos.";
                    res.render('add-contact.ejs', {
                        message,
                        title: 'Bienvenido | Agregar un nuevo contacto'
                    });
                }
            }
        });
    },
    editContactPage: (req, res) => {
        let contactId = req.params.id;
        let query = "SELECT * FROM `contacts` WHERE id = '" + contactId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-contact.ejs', {
                title: 'Editar  Contacto'
                ,contact: result[0]
                ,message: ''
            });
        });
    },
    editContact: (req, res) => {
        let contactId = req.params.id;
        let name = req.body.name;
        let surname = req.body.surname;
        let email = req.body.email;
        let birthday = req.body.birthday;

        let query = "UPDATE `contacts` SET `name` = '" + name + "', `surname` = '" + surname + "', `email` = '" + email + "', `birthday` = '" + birthday + "' WHERE `contacts`.`id` = '" + contactId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteContact: (req, res) => {
        let contactId = req.params.id;
        let getImageQuery = 'SELECT image from `contacts` WHERE id = "' + contactId + '"';
        let deleteUserQuery = 'DELETE FROM contacts WHERE id = "' + contactId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};

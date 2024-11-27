require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const { schoolSchema, partialSchoolSchema } = require('./validators');

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

// GET SCHOOLS BASED ON LONGITUDE & LATITUDE
app.get('/listSchools', (req, res) => {
    const parseResponse = partialSchoolSchema.safeParse(req.body);

    if(!parseResponse.success) {
        return res.status(400).json({
            message: 'Invalid Inputs',
            issues: parseResponse.error.issues.map((issue) => (issue.message))
        })
    }

    try {
        const { longitude, latitude } = req.body;

        const getSchoolsQuery = 
            `SELECT *, ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) AS distance
            FROM schools
            ORDER BY distance ASC;                   
            `;

        db.query(getSchoolsQuery, [longitude, latitude], (err, result) => {
            if(err) {
                console.error('Unable to get schools from database', err);
                return res.status(500).json({
                    message: 'Unable to get schools'
                });
            }

            return res.status(200).json({
                message: 'Fetched all schools',
                schools: result
            })
        })

    } catch (err) {
        console.error(err)
    }
});

// ADD RECORD IN SCHOOLS TABLE
app.post('/addSchool', (req, res) => {
    const parseResponse = schoolSchema.safeParse(req.body);
    
    if(!parseResponse.success) {
        return res.status(400).json({
            message: 'Invalid data types',
            issues: parseResponse.error.issues.map((issue) => (issue.message))
        })
    }

    try {
        const { name, address, longitude, latitude } = req.body;

        const addSchoolQuery = "INSERT INTO `schools` (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

        db.query(addSchoolQuery, [name, address, longitude, latitude], (err, result) => {
            if(err) {
                console.error('Unable to add school into table', err);
                return res.status(500).json({
                    message: 'Unable to add school'
                })
            }

            return res.status(200).json({
                message: 'School added',
                id: result.insertId
            });
        });

    } catch (err) {
        console.error(err);
    }
})

app.listen(port, () =>  console.log('Backend running on port', port));
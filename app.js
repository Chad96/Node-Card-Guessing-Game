const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Route: Home page (Game page)
app.get('/', (req, res) => {
    res.render('index');
});

// Route: Scores page
app.get('/scores', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'scores.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading scores.json:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        const scoresData = JSON.parse(data);
        res.render('scores', { scores: scoresData.scores }); // Ensure you're passing the correct property
    });
});

// Route: Post score
app.post('/scores', (req, res) => {
    const { username, time } = req.body;
    const newScore = { username, time };

    fs.readFile(path.join(__dirname, 'data', 'scores.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading scores.json:', err);
            return res.status(500).send('Internal Server Error');
        }

        const scoresData = JSON.parse(data);
        scoresData.scores.push(newScore); // Update to push to the correct property
        fs.writeFile(path.join(__dirname, 'data', 'scores.json'), JSON.stringify(scoresData), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to scores.json:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/scores');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

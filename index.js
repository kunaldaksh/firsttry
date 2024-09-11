const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection string
const mongoUri = "mongodb+srv://DatabaseSenderBot:12345@databasesenderrbot.pexhfof.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseSenderrBot";

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define schema and model
const linkSchema = new mongoose.Schema({
    unique_id: String,
    Original_link: String,   // This holds the original link
    shortened_url: String    // This is the shortened URL
});

const Link = mongoose.model('Link', linkSchema);

// Serve static frontend files from "public"
app.use(express.static('public'));

// Endpoint to fetch the original link by unique_id
app.get('/fetch-link/:uniqueId', async (req, res) => {
    const uniqueId = req.params.uniqueId;

    try {
        // Query MongoDB for the matching unique_id
        const linkData = await Link.findOne({ unique_id: uniqueId });

        if (linkData) {
            res.json({ link: linkData.Original_link });  // Respond with original link
        } else {
            res.status(404).json({ error: 'Link not found' });
        }
    } catch (error) {
        console.error('Error fetching the link:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

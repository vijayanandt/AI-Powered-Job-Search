const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const puppeteer = require("puppeteer");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Job Matching using OpenAI
app.post("/match-jobs", async (req, res) => {
    const { resume, skills } = req.body;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI job match assistant." },
                    { role: "user", content: `Find jobs for this profile:\nResume: ${resume}\nSkills: ${skills}` }
                ],
                temperature: 0.7
            },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );

        res.json({ matches: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Web Scraping Jobs (Example: Indeed)
app.get("/scrape-jobs", async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://in.indeed.com/jobs?q=Software+Engineer&l=Bangalore");

    const jobListings = await page.evaluate(() => {
        return [...document.querySelectorAll(".jobTitle")].map(job => job.innerText);
    });

    await browser.close();
    res.json({ jobs: jobListings });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

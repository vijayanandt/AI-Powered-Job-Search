import React, { useState } from "react";
import axios from "axios";

function App() {
    const [resume, setResume] = useState("");
    const [skills, setSkills] = useState("");
    const [matches, setMatches] = useState("");

    const findJobs = async () => {
        const response = await axios.get("http://localhost:5000/match-jobs", { resume, skills });
        setMatches(response.data.matches);
    };

    return (
        <div>
            <h1>AI-Powered Job Search</h1>
            <textarea placeholder="Paste Resume Here" value={resume} onChange={(e) => setResume(e.target.value)} />
            <input type="text" placeholder="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
            <button onClick={findJobs}>Find Jobs</button>
            <h2>Matching Jobs:</h2>
            <pre>{matches}</pre>
        </div>
    );
}

export default App;
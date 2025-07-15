import React, {useState, useEffect} from 'react';
import { Container, Divider, Chip } from '@mui/material';
import './PreferencesPage.css';

const LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'TypeScript', 'C#', 'C', 'HTML/CSS', 'SQL']; 
const TAGS = ['Web Development', 'Operating Systems','Hardware', 'Compiler Design', 'AI', 'Mobile', 'Data Science', 'Game Development', 'Blockchain', 'DevOps', 'Cybersecurity', 'Cloud Computing', 'Machine Learning', 'AR/VR', 'IoT', 'Mobile Development: Swift', 'Mobile Development: Kotlin', 'APIs', 'Microservices'];


function PreferencesPage() {
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // load the specific users preferences from the api with a useEffect to prevent block the ui
    useEffect(() => {
        fetch('/user/preferences') // endpoint still needs to be created (and handle GET/POST)
            .then(res => res.json())
            .then(data => {
                setSelectedLevels(data.skill || []);
                setSelectedLanguages(data.languages || []);
                setSelectedTags(data.preferenceTags || []);
            })
            .catch(err => {
                // handle error if needed
            });
    }, []);

    const handleToggle = (item, selectedArray, setSelectedArray) => {
        setSelectedArray(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const handleSave = () => {
        // API call should go here to save user details/preferences
        const preferences = {
            levels: selectedLevels,
            languages: selectedLanguages,
            tags: selectedTags,
        };
        // example saving using stringify: { method: 'POST', body: JSON.stringify(preferences) })
        // code rn just logs the preferences
        console.log('Saving preferences as follows:', preferences);
    };

    return (

        <Container maxWidth="xl">
            <h1>Preferences Page</h1>
            <button onClick={handleSave}>Save Preferences</button>
            <p>Click tags on each section that align with your preferred level, languages, and tags! </p>
            <Divider />
            <h2>Level</h2>
            <p>Set your school level - think of 1st as freshman and 4th as senior! This will correlate to the level repositories you get in your feed.</p>
            {LEVELS.map (level => (
                <Chip
                    key={level}
                    label={level}
                    onClick={() => {
                        handleToggle(level, selectedLevels, setSelectedLevels)}}
                    color={selectedLevels.includes(level) ? 'primary' : 'default'}
                    variant={selectedLevels.includes(level) ? 'filled' : 'outlined'}
                    clickable
                    sx={({ marginRight: 1, margin: 1})}
                />
            ))}
            
            <Divider />
            <h2>Languages</h2>
            <p>Set any languages you know (or want to know) here </p>

            {LANGUAGES.map (lang => (
                <Chip
                    key={lang}
                    label={lang}
                    onClick={() => {
                        handleToggle(lang, selectedLanguages, setSelectedLanguages)}}
                    color={selectedLanguages.includes(lang) ? 'primary' : 'default'}
                    variant={selectedLanguages.includes(lang) ? 'filled' : 'outlined'}
                    clickable
                    sx={({ marginRight: 1, margin: 1})}
                />
            ))}
            <Divider />
            <h2>Tags</h2>
            <p>Set any tags of topics that you know or want to know here</p>

            {TAGS.map(tag => (
                <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleToggle(tag, selectedTags, setSelectedTags)}
                    color={selectedTags.includes(tag) ? 'primary' : 'default'}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    clickable
                    sx={{ marginRight: 1, marginBottom: 2 }}
                />
            ))}



            <Divider />



        </Container>

)
}

export default PreferencesPage;
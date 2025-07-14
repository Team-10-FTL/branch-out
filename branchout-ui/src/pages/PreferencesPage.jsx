import React, {useState} from 'react';
import { Container, Divider, Chip } from '@mui/material';
import './PreferencesPage.css';

const LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'TypeScript', 'C#', 'C', 'HTML/CSS', 'SQL']; 
const TAGS = ['Web', 'AI', 'Mobile', 'Data Science'];


function PreferencesPage() {
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const handleToggle = (item, selectedArray, setSelectedArray) => {
        setSelectedArray(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    return (

        <Container maxWidth="xl">
            <h1>Preferences Page</h1>
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

            <Divider />



        </Container>

)
}

export default PreferencesPage;
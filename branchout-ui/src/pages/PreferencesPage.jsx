import React, {useState} from 'react';
import { Container, Divider, Chip } from '@mui/material';
import './PreferencesPage.css';

const LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++']; // Example
const TAGS = ['Web', 'AI', 'Mobile', 'Data Science']; // Example


function PreferencesPage() {
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const handleClick = () => {
        setIsSelected(!isSelected); // Toggle the state
    };

    return (

        <Container maxWidth="xl">
            <h1>Preferences Page</h1>
            <p>Click tags on each section that align with your preferred level, languages, and tags! </p>
            <Divider />
            <p>Set your school level - think of 1st as freshman and 4th as senior! This will correlate to the level repositories you get in your feed.</p>

            <Divider />
            <p>Set any languages you know (or want to know) here </p>

            <Divider />
            <p>Set any tags of topics that you know or want to know here</p>

            <Divider />



        </Container>

)
}

export default PreferencesPage;
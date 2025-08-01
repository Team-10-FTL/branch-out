import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Chip, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton,
  Collapse,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  Code as CodeIcon,
  Person as PersonIcon,
  Tag as TagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Launch as LaunchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';

const SKILL_LEVELS = [
  { value: "FIRSTYEAR", label: "1st Year" },
  { value: "SECONDYEAR", label: "2nd Year" },
  { value: "THIRDYEAR", label: "3rd Year" },
  { value: "FOURTHYEAR", label: "4th Year" }
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableOwners, setAvailableOwners] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [minStars, setMinStars] = useState('');
  const [maxStars, setMaxStars] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedRepos, setSavedRepos] = useState(new Set());

  // Get current user for saved repos
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();
  const VITE_URL = import.meta.env.VITE_DATABASE_URL || 'http://localhost:3000';

  // Load all necessary data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setDataLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Load all data in parallel
        const [
          languagesResponse,
          tagsResponse,
          ownersResponse,
          savedReposResponse
        ] = await Promise.all([
          // Fetch available languages
          fetch(`${VITE_URL}/repo/languages`, { headers }),
          // Fetch available tags
          fetch(`${VITE_URL}/repo/tags`, { headers }),
          // Fetch available owners
          fetch(`${VITE_URL}/repo/owners`, { headers }),
          // Fetch user's saved repos if logged in
          user ? fetch(`${VITE_URL}/user/profile`, { headers }) : Promise.resolve(null)
        ]);

        // Process languages
        if (languagesResponse.ok) {
          const languagesData = await languagesResponse.json();
          setAvailableLanguages(languagesData.languages || []);
        }

        // Process tags
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setAvailableTags(tagsData.tags || []);
        }

        // Process owners
        if (ownersResponse.ok) {
          const ownersData = await ownersResponse.json();
          setAvailableOwners(ownersData.owners || []);
        }

        // Process saved repos
        if (savedReposResponse && savedReposResponse.ok) {
          const userData = await savedReposResponse.json();
          const savedRepoIds = new Set(userData.savedRepos?.map(repo => repo.id) || []);
          setSavedRepos(savedRepoIds);
        }

      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load filter options');
        
        // Fallback to sample data if API fails
        setAvailableLanguages([
          "JavaScript", "Python", "Java", "C++", "Ruby", "Go", "Rust", "Swift", 
          "Kotlin", "PHP", "TypeScript", "C#", "C", "HTML/CSS", "SQL"
        ]);
        setAvailableTags([
          "Web Development", "Operating Systems", "Hardware", "Compiler Design", 
          "AI", "Mobile", "Data Science", "Game Development", "Blockchain", 
          "DevOps", "Cybersecurity", "Cloud Computing", "Machine Learning", 
          "AR/VR", "IoT", "APIs", "Microservices"
        ]);
      } finally {
        setDataLoading(false);
      }
    };

    loadAllData();
  }, [user?.id]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedLanguages.length === 0 && selectedTags.length === 0 && !ownerName.trim()) {
      setError('Please enter a search query or select filters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const searchParams = new URLSearchParams();

      // Build search parameters
      if (searchQuery.trim()) searchParams.append('query', searchQuery.trim());
      if (selectedLanguages.length > 0) searchParams.append('languages', selectedLanguages.join(','));
      if (selectedTags.length > 0) searchParams.append('tags', selectedTags.join(','));
      if (ownerName.trim()) searchParams.append('owner', ownerName.trim());
      if (selectedSkillLevel) searchParams.append('skillLevel', selectedSkillLevel);
      if (minStars) searchParams.append('minStars', minStars);
      if (maxStars) searchParams.append('maxStars', maxStars);

      const response = await fetch(`${VITE_URL}/repo/search?${searchParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.repositories || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag, selectedArray, setSelectedArray) => {
    setSelectedArray(prev => 
      prev.includes(tag) 
        ? prev.filter(item => item !== tag)
        : [...prev, tag]
    );
  };

  const handleSaveRepo = async (repo) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${VITE_URL}/repo/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          repoId: repo.id,
          direction: 'RIGHT'
        })
      });

      if (response.ok) {
        setSavedRepos(prev => new Set([...prev, repo.id]));
      }
    } catch (error) {
      console.error('Error saving repo:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguages([]);
    setSelectedTags([]);
    setSelectedSkillLevel('');
    setOwnerName('');
    setMinStars('');
    setMaxStars('');
    setSearchResults([]);
    setError('');
  };

  if (dataLoading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={48} sx={{ color: '#E34714' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading search options...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        Repository Search
      </Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#111', color: 'white' }}>
        {/* Main Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search repositories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#E34714' },
                '&.Mui-focused fieldset': { borderColor: '#E34714' }
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#999', mr: 1 }} />
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundColor: '#E34714',
              '&:hover': { backgroundColor: '#d63919' },
              minWidth: '120px'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {/* Quick Filters */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              sx={{
                '& .MuiInputLabel-root': { color: '#999' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#E34714' }
                }
              }}
              InputProps={{
                startAdornment: <PersonIcon sx={{ color: '#999', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Min Stars"
              type="number"
              value={minStars}
              onChange={(e) => setMinStars(e.target.value)}
              sx={{
                '& .MuiInputLabel-root': { color: '#999' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#E34714' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Max Stars"
              type="number"
              value={maxStars}
              onChange={(e) => setMaxStars(e.target.value)}
              sx={{
                '& .MuiInputLabel-root': { color: '#999' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#E34714' }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Advanced Filters Toggle */}
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ color: '#E34714', mb: 2 }}
          endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Advanced Filters
        </Button>

        {/* Advanced Filters */}
        <Collapse in={showAdvanced}>
          <Box sx={{ mb: 3 }}>
            {/* Languages */}
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 1 }} /> Programming Languages
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {availableLanguages.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  clickable
                  onClick={() => handleTagToggle(language, selectedLanguages, setSelectedLanguages)}
                  color={selectedLanguages.includes(language) ? 'primary' : 'default'}
                  variant={selectedLanguages.includes(language) ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: '#E34714',
                    color: selectedLanguages.includes(language) ? 'white' : '#E34714',
                    backgroundColor: selectedLanguages.includes(language) ? '#E34714' : 'transparent'
                  }}
                />
              ))}
            </Box>

            {/* Tags */}
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TagIcon sx={{ mr: 1 }} /> Topics & Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {availableTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  clickable
                  onClick={() => handleTagToggle(tag, selectedTags, setSelectedTags)}
                  color={selectedTags.includes(tag) ? 'secondary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: '#0ff',
                    color: selectedTags.includes(tag) ? 'black' : '#0ff',
                    backgroundColor: selectedTags.includes(tag) ? '#0ff' : 'transparent'
                  }}
                />
              ))}
            </Box>

            {/* Skill Level */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Skill Level
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {SKILL_LEVELS.map((level) => (
                <Chip
                  key={level.value}
                  label={level.label}
                  clickable
                  onClick={() => setSelectedSkillLevel(
                    selectedSkillLevel === level.value ? '' : level.value
                  )}
                  color={selectedSkillLevel === level.value ? 'success' : 'default'}
                  variant={selectedSkillLevel === level.value ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: '#daa7e2',
                    color: selectedSkillLevel === level.value ? 'black' : '#daa7e2',
                    backgroundColor: selectedSkillLevel === level.value ? '#daa7e2' : 'transparent'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Collapse>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={clearFilters} sx={{ color: '#999' }}>
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundColor: '#E34714',
              '&:hover': { backgroundColor: '#d63919' }
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Search Results ({searchResults.length})
          </Typography>

          {searchResults.map((repo) => (
            <Card
              key={repo.id}
              sx={{
                mb: 2,
                backgroundColor: '#111',
                color: 'white',
                border: '1px solid #333',
                '&:hover': {
                  backgroundColor: '#1a1a1a',
                  borderColor: '#E34714'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    {/* Repo Name and Owner */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E34714' }}>
                        {repo.name}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 1, color: '#999' }}>
                        by {repo.owner}
                      </Typography>
                      <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ fontSize: 16, color: '#ffd700', mr: 0.5 }} />
                        <Typography variant="body2">{repo.stars?.toLocaleString()}</Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" sx={{ mb: 2, color: '#ccc' }}>
                      {repo.description}
                    </Typography>

                    {/* Languages and Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {repo.languages?.map((lang) => (
                        <Chip
                          key={lang}
                          label={lang}
                          size="small"
                          sx={{
                            backgroundColor: '#E34714',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                      {repo.tags?.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: '#0ff',
                            color: '#0ff',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                      {repo.skill && (
                        <Chip
                          label={SKILL_LEVELS.find(level => level.value === repo.skill)?.label || repo.skill}
                          size="small"
                          sx={{
                            backgroundColor: '#daa7e2',
                            color: 'black',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                    <IconButton
                      onClick={() => window.open(repo.repoLink, '_blank')}
                      sx={{ color: '#E34714' }}
                      title="View on GitHub"
                    >
                      <LaunchIcon />
                    </IconButton>
                    {user && (
                      <IconButton
                        onClick={() => handleSaveRepo(repo)}
                        sx={{ color: savedRepos.has(repo.id) ? '#ffd700' : '#999' }}
                        title={savedRepos.has(repo.id) ? 'Saved' : 'Save Repository'}
                      >
                        {savedRepos.has(repo.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* No Results */}
      {!loading && searchResults.length === 0 && (searchQuery || selectedLanguages.length > 0 || selectedTags.length > 0 || ownerName) && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#111', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No repositories found
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Try adjusting your search criteria or clearing some filters
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SearchPage;
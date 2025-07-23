import React from 'react';
import { Typography, Container, Paper, Box, Grid, Card, CardContent } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        p: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      {/* Title */}
      <Typography variant="h3" component="h1">
        🔧 Admin Dashboard
      </Typography>

      {/* Top row cards (side by side) */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        <Card sx={{ flex: 1, minWidth: 275, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body2">
              Manage user accounts, roles, and permissions
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 275, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Repository Management
            </Typography>
            <Typography variant="body2">
              Add, edit, and moderate repository content
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Full-width card */}
      <Box sx={{ display: 'flex' }}>
        <Card sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Statistics
            </Typography>
            <Typography variant="body2">
              View system metrics and usage statistics
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom note */}
      <Box sx={{ display: 'flex' }}>
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 2, backgroundColor: '#fcfcfc' }}>
          <Typography variant="body2" color="black">
            📊 This is the admin dashboard. Only users with ADMIN role can access this page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
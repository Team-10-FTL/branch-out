import React from 'react';
import { Typography, Container, Paper, Box, Grid, Card, CardContent } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🔧 Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Management
              </Typography>
              <Typography variant="body2">
                Manage user accounts, roles, and permissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Repository Management
              </Typography>
              <Typography variant="body2">
                Add, edit, and moderate repository content
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Statistics
              </Typography>
              <Typography variant="body2">
                View system metrics and usage statistics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, backgroundColor: 'black' }}>
          <Typography variant="body2" color="text.secondary">
            📊 This is the admin dashboard. Only users with ADMIN role can access this page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
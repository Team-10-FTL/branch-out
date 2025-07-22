import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Box, ListItemButton, Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";
import { Logout as LogoutIcon} from "@mui/icons-material";

import "./SettingsPage.css";

function SettingsPage(){
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const handleLogout = async () => {
    try {
      // Sign out from Clerk if using OAuth
      if (clerkUser) {
        await signOut();
      }      

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      navigate('/login');
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return(
    <>
    <h1 className = "pageTitle">Settings</h1>

    {/* Logout Button - Bottom Left */}
      <Box sx={{ p: 2, mt: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ListItemButton
            onClick={handleOpenModal}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          > Logout  
            <LogoutIcon />
          </ListItemButton>
      </Box>
       {/* Logout Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SettingsPage
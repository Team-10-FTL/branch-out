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
    <div></div>
    {/* <div className = "settingsButton">Privacy Policy</div> */}
    {/* Logout Button - Bottom Left */}
      <Box sx={{ p: 2, mt: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ListItemButton className = "settingsButton"
            onClick={handleOpenModal}
            sx={{
              color: 'white',
              // borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: '#e37106',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: "200px",
              borderRadius: "7px"
            , '&:hover': {
              backgroundColor: "#e34714",
              color: "black"
            }}}
          > Logout  
            <LogoutIcon />
          </ListItemButton>
      </Box>
       {/* Logout Confirmation Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: 'white',
            borderRadius: 3,
            p: 3,
            minWidth: 300,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem', pb: 0, textAlign: "center", marginBottom: "15px" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseModal} variant = "text" sx={{ color: 'white', backgroundColor: '#e34714', '&:hover': {
            backgroundColor: '#e37106', color:"black",
          },}}>
            Cancel
          </Button>
          <Button onClick={handleLogout} sx={{ backgroundColor: 'transparent',
          color: 'white',
          '&:hover': {
            backgroundColor: 'transparent', color:"#4c1255",
          }}}>
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
          </>
  )
}

export default SettingsPage
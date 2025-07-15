import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CardMedia from '@mui/material/CardMedia';
import { Chip } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function RepoCardModal({ open, handleClose , repo}) {

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="repo-modal-title"
        aria-describedby="repo-modal-description"
      >
        <Box sx={style}>
          <Typography id="repo-modal-title" variant="h6" component="h2">
            {repo.name}
          </Typography>
            <CardMedia
                component="img"
                height="140"
                image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
        />
        <Typography id="repo-modal-rating" sx={{ mt: 2 }}>
            Rating: {repo.rating || "N/A"}
        </Typography>
        <Typography id="repo-modal-tags" sx={{ mt: 2 }}>
            Tags: {repo.tags?.map((tag, index) => (
                        <Chip 
                        key={index} 
                        label={tag} 
                        variant="outlined" 
                        sx={{ margin: '2px' }} 
                        />
                    ))}
        </Typography>
        <Typography id="repo-modal-langyages" sx={{ mt: 2 }}>
            Languages: {repo.languages?.map((language, index) => (
                        <Chip 
                        key={index} 
                        label={language} 
                        variant="outlined" 
                        sx={{ margin: '2px' }} 
                        />
                    ))}
        </Typography>

        <Typography id="repo-modal-description" sx={{ mt: 2 }}>
            Description: {repo.description || "No description available"}
        </Typography>
        </Box>
      </Modal>
    </div>
  );
}

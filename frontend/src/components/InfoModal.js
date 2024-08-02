import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const InfoModal = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: 8,
    right: 8,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <IconButton sx={closeButtonStyle} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2">
          Welcome to the Chemistry Lab Inventory System
        </Typography>
        <Typography sx={{ mt: 2 }}>
          This program was created to help manage the inventory of chemicals, glassware, and equipment in a chemistry lab. You can add, delete, and view items in the inventory. The data is backed up regularly to ensure nothing is lost.
        </Typography>
      </Box>
    </Modal>
  );
};

export default InfoModal;

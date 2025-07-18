import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

export default function ToolTip({information, className}) {
  return (
    <Tooltip title={information}>
      <IconButton className={className}>
        <InfoOutlineIcon />
      </IconButton>
    </Tooltip>
  );
}
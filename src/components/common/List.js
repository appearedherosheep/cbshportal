import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

export default function BasicList( { items, handleListItemClick } ) {
  const listItems = items.map((item) =>
    <ListItem disablePadding key={item}>
      <ListItemButton
        onClick={(event) => handleListItemClick(event.target.innerText)}
      >
        <ListItemText primary={item} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="secondary mailbox folders">
        <List>
          {listItems}
        </List>
      </nav>
    </Box>
  );
}
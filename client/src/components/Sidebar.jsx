import {
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material'
import React from 'react'

const Sidebar = () => {
    return (
        <>
            <Typography
                sx={{
                    bgcolor: 'blue',
                    color: 'white',
                    padding: 1,
                }}>
                カテゴリ
            </Typography>
            <List component={'nav'}>
                <ListItemButton>
                    <ListItemText primary="すべて"></ListItemText>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary="映画"></ListItemText>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary="TV"></ListItemText>
                </ListItemButton>
            </List>
        </>
    )
}

export default Sidebar

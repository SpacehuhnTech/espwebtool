import React from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FavoriteIcon from '@mui/icons-material/Favorite'
import UploadIcon from '@mui/icons-material/Upload'

const Header = () => {
    return (
        <AppBar
            position='static'
            sx={{
                background: '#0276aa',
            }}
        >
            <Toolbar>
                <UploadIcon />

                <Typography
                    variant='h6'
                    component='h1'
                    noWrap
                    sx={{ 
                        flexGrow: 1,
                        fontFamily: 'Bungee',
                    }}
                >
                    &nbsp;&nbsp;ESPWebTool
                </Typography>

                <Button
                    //variant='contained'
                    //color='success'
                    sx={{ color: '#fff' }}
                    href='https://ko-fi.com/spacehuhn'
                    target='_blank'
                    startIcon={<FavoriteIcon />}>
                    Say Thanks
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header
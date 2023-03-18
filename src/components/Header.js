import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import UploadIcon from '@mui/icons-material/Upload'
import HelpIcon from '@mui/icons-material/Help'

const Header = (props) => {
    return (
        <AppBar
            position='static'
            sx={{
                ...props.sx,
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
                    href='https://blog.spacehuhn.com/espcomm'
                    target='_blank'
                    endIcon={<HelpIcon />}>
                    Help
                </Button>

                <Button
                    //variant='contained'
                    //color='success'
                    sx={{ color: '#fff' }}
                    href='https://huhn.me/'
                    target='_blank'
                    endIcon={<OpenInNewIcon />}>
                    More Tools
                </Button>
            </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    sx: PropTypes.object,
}

export default Header
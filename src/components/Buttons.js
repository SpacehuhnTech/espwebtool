import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const Buttons = () => {
    return (
        <Grid container spacing={1} direction='row' justifyContent='space-between' alignItems='flex-start'>
            <Grid item>
                <Button color='error'>Erase</Button>
            </Grid>

            <Grid item>
                <Button variant='contained' >Program</Button>
            </Grid>
        </Grid>
    )
}

export default Buttons
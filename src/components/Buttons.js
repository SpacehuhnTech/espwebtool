import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const Buttons = (props) => {
    return (
        <Grid container spacing={1} direction='row' justifyContent='space-between' alignItems='flex-start'>
            <Grid item>
                <Button
                    color='error'
                    onClick={props.erase}
                >
                    Erase
                </Button>
            </Grid>

            <Grid item>
                <Button
                    variant='contained'
                    color='success'
                    onClick={props.program}
                    disabled={props.disabled}
                >
                    Program
                </Button>
            </Grid>
        </Grid>
    )
}

Buttons.propTypes = {
    erase: PropTypes.func,
    program: PropTypes.func,
    disabled: PropTypes.bool,
}

export default Buttons
import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

const Buttons = (props) => {
    return (
        <Grid container spacing={1} direction='row' justifyContent='space-between' alignItems='flex-start'>
            <Grid item>
                <Tooltip title='Disconnect from the device'>
                    <span>
                        <Button variant='outlined' color='warning' onClick={props.disconnect} disabled={props.disabled}>
                            Disconnect
                        </Button>
                    </span>
                </Tooltip>
            </Grid>

            <Grid item>
                <Tooltip title='Read the full flash and save it as a .bin file'>
                    <span>
                        <Button variant='outlined' color='info' onClick={props.backup} disabled={props.disabled}>
                            Backup
                        </Button>
                    </span>
                </Tooltip>
            </Grid>

            <Grid item>
                <Tooltip title='Erase the entire flash memory'>
                    <span>
                        <Button variant='outlined' color='error' onClick={props.erase} disabled={props.disabled}>
                            Erase
                        </Button>
                    </span>
                </Tooltip>
            </Grid>

            <Grid item>
                <Tooltip title='Write the uploaded files to the device'>
                    <span>
                        <Button variant='contained' color='success' onClick={props.program} disabled={props.disabled}>
                            Program
                        </Button>
                    </span>
                </Tooltip>
            </Grid>
        </Grid>
    )
}

Buttons.propTypes = {
    disconnect: PropTypes.func,
    backup: PropTypes.func,
    erase: PropTypes.func,
    program: PropTypes.func,
    disabled: PropTypes.bool,
}

export default Buttons

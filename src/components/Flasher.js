import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'

import FileList from './FileList'
import Buttons from './Buttons'
import Output from './Output'

const Flasher = (props) => {
    return (
        <Grid container direction='column' alignItems='center' spacing={1}>
            <Grid item xs={12}>
                <FileList
                    uploads={props.uploads}
                    setUploads={props.setUploads}
                />
            </Grid>

            <Grid item xs={12}>
                <Output
                    received={''}
                />
            </Grid>

            <Grid item xs={12} sx={{ my: '1rem' }}>
                <Buttons
                    erase={props.erase}
                    program={props.program}
                    disabled={props.uploads.length === 0}
                />
            </Grid>
        </Grid>
    )
}

Flasher.propTypes = {
    uploads: PropTypes.array,
    setUploads: PropTypes.func,
    erase: PropTypes.func,
    program: PropTypes.func,
}

export default Flasher
import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

const baudrates = [
    115200,
    230400,
    460800,
    921600,
    //3000000,
]

const formElementCSS = {
    marginTop: 1,
    minWidth: '10em',
}

const Settings = (props) => {
    const [baudRate, setBaudRate] = React.useState(props.settings.baudRate)

    const cancel = () => {
        setBaudRate(props.settings.baudRate)
        
        props.close()
    }

    const reset = () => {
        if(!props.openPort) setBaudRate(115200)
    }

    const save = () => {
        props.save({baudRate: baudRate})
        props.close()

        props.saveToast()
    }

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Settings</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Serial Connection
                </DialogContentText>

                <FormControl variant='filled' fullWidth sx={formElementCSS}>
                    <InputLabel>Baud Rate {props.openPort && '(Requires Reconnect)'}</InputLabel>
                    <Select
                        value={baudRate}
                        onChange={(e) => setBaudRate(e.target.value)}
                        label='baudrate'
                        disabled={props.openPort}
                    >
                        {baudrates.map(baud =>
                            <MenuItem value={baud} key={baud}>{baud} baud</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={reset} color='error'>Reset</Button>
                <Button onClick={cancel} color='secondary'>Cancel</Button>
                <Button onClick={save} color='primary'>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

Settings.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    settings: PropTypes.object,
    save: PropTypes.func,
    openPort: PropTypes.bool,
    saveToast: PropTypes.func,
}

export default Settings
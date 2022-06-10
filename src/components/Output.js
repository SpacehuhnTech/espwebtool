import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'

import { setCookie, getCookie } from '../lib/cookie.js'
import styles from './Output.module.css'

const Output = (props) => {
    // Currently receieved string & list of previous receieved lines
    const received = useRef('')
    const [lines, setLines] = useState([])

    useEffect(
        () => {
            const str = `${received.current}${props.received.value}`
            const lines = str.split('\n')

            let newReceived = str
            const newLines = []

            if (lines.length > 1) {
                newReceived = lines.pop()

                lines.forEach(line => {
                    newLines.push(`${line}`)
                })
            }
            setLines((current) => current.concat(newLines))
            received.current = newReceived
        },
        [props.received],
    )

    // Output toggle Visibility
    const loadOpen = () => {
        const cookieValue = getCookie('output')
        return cookieValue ? (cookieValue === 'true') : false
    }

    const openOutput = (value) => {
        setVisible(value)
        setCookie('output', value)
    }

    const [visible, setVisible] = React.useState(loadOpen())

    return (
        <pre className={styles.pre}>
            <>
                { /* Toggle */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={visible}
                            onChange={e => openOutput(e.target.checked)}
                            icon={<ChevronRightIcon />}
                            checkedIcon={<KeyboardArrowDownIcon />}
                        />
                    }
                    label="Output"

                />

                { /* Button(s) */}
                <Button
                    endIcon={<OpenInNewIcon />}
                    sx={{ float: 'right' }}
                    href='https://serial.huhn.me/'
                >
                    Terminal
                </Button>
            </>

            { /* Actual Output */}
            {visible &&
                <Box className={styles.box}>
                    <code className={styles.code}>

                        { /* Lines */}
                        {lines.map((line, i) => (
                            <span key={i}>
                                {line}<br />
                            </span>
                        ))}

                    </code>
                </Box>
            }
        </pre>
    )
}

Output.propTypes = {
    received: PropTypes.object,
}

export default Output
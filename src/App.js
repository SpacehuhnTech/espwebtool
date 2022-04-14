import React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import Header from './components/Header'
import Home from './components/Home'
import FileList from './components/FileList'
import Output from './components/Output'
import Buttons from './components/Buttons'
import Settings from './components/Settings'
import Footer from './components/Footer'

import { setCookie, getCookie } from './modules/cookie.js'

const saveSettings = (settings) => {
  setCookie('settings', JSON.stringify(settings), 365)
}

const loadSettings = () => {
  let settings = {
    baudRate: 115200,
    lineEnding: '\\r\\n',
    echoFlag: true,
  }

  const cookieValue = getCookie('settings')

  try {
    const cookieJSON = JSON.parse(cookieValue)

    if ('baudRate' in cookieJSON) settings.baudRate = cookieJSON.baudRate
  } catch (e) {
    console.error(e)
  }

  saveSettings(settings)
  return settings
}

const formatMacAddr = (macAddr) => {
  return macAddr.map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join(':')
}

function App() {
  // Connection status
  const [connected, setConnected] = React.useState(false)

  // Connect/Disconnect Toast Open
  const [toast, setToast] = React.useState({ open: false, severity: 'info', value: '' })

  // Serial output
  const [output, setOutput] = React.useState('')

  // ESP flasher stuff
  const [espStub, setEspStub] = React.useState(undefined)

  // Uploaded Files
  const [uploads, setUploads] = React.useState([])

  // Settings Window
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  // Settings
  const settings = loadSettings()
  const [baudRate, setBaudRate] = React.useState(settings.baudRate)

  const closeToast = () => {
    setToast({ ...toast, open: false })
  }

  const handleSave = (newSettings) => {
    setBaudRate(newSettings.baudRate)

    saveSettings({
      baudRate: newSettings.baudRate,
    })
  }

  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect()
      await espStub.port.close()
      setEspStub(undefined)
      return
    }

    const esploaderMod = await window.esptoolPackage

    const esploader = await esploaderMod.connect({
      log: (...args) => {
        //console.log(...args)
        console.log(args[0])
        setOutput(`${args[0]}\n`)
      },
      debug: (...args) => console.debug(...args),
      error: (...args) => console.error(...args),
    })
    try {
      await esploader.initialize()

      setOutput(`Connected to ${esploader.chipName}\n`)
      setOutput(`MAC Address: ${formatMacAddr(esploader.macAddr())}\n`)

      const newEspStub = await esploader.runStub()
      setConnected(true)
      newEspStub.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
      })

      setEspStub(newEspStub)
    } catch (err) {
      await esploader.disconnect()
      throw err
    }
  }

  const clickErase = async () => {
    if (
      window.confirm('This will erase the entire flash. Click OK to continue.')
    ) {
      //baudRate.disabled = true;
      //butErase.disabled = true;
      //butProgram.disabled = true;
      try {
        console.log('Erasing flash memory. Please wait...');
        let stamp = Date.now();
        await espStub.eraseFlash();
        console.log('Finished. Took ' + (Date.now() - stamp) + 'ms to erase.');
      } catch (e) {
        console.error(e);
      } finally {
        //butErase.disabled = false;
        //baudRate.disabled = false;
        //butProgram.disabled = getValidFiles().length == 0;
      }
    }

  }

  const getValidFiles = () => {
    // Get a list of file and offsets
    // This will be used to check if we have valid stuff
    // and will also return a list of files to program
    let validFiles = []
    let offsetVals = []

    uploads.forEach(upload => {
      if (upload.contents.length > 0 && !offsetVals.includes(upload.offset)) {
        validFiles.push(upload.contents)
        offsetVals.push(upload.offset)
      }
    })

    return validFiles
  }

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const clickProgram = async () => {
    //baudRate.disabled = true;
    //butErase.disabled = true;
    //butProgram.disabled = true;
    //for (let i = 0; i < 4; i++) {
    //firmware[i].disabled = true;
    //offsets[i].disabled = true;
    //}

    const validFiles = getValidFiles()
    validFiles.forEach(async file => {
      //progress[file].classList.remove('hidden');
      //let binfile = 'HERE FIRMWARE'//firmware[file].files[0];
      //let contents = await readUploadedFileAsArrayBuffer(binfile);
      try {
        let offset = parseInt(0/*HERE_OFFSET offsets[file].value*/, 16);
        //const progressBar = progress[file].querySelector('div');
        await espStub.flashData(
          file.contents,
          (bytesWritten, totalBytes) => {
            setOutput(`${bytesWritten} written of ${totalBytes} total\n`)
          },
          offset
        )
        await sleep(100)
      } catch (e) {
        console.error(e)
      }
    })

    for (let i = 0; i < 4; i++) {
      //firmware[i].disabled = false;
      //offsets[i].disabled = false;
      //progress[i].classList.add('hidden');
      //progress[i].querySelector('div').style.width = '0';
    }
    //butErase.disabled = false;
    //baudRate.disabled = false;
    //butProgram.disabled = getValidFiles().length == 0;
    console.log('To run the new firmware, please reset your device.');
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header sx={{ mb: '1rem' }} />

      <Grid container direction='column' alignItems='center' spacing={1}>

        {/* Home & FileUpload Page */}
        <Grid item xs={12}>
          {connected ?
            <FileList
              uploads={uploads}
              setUploads={setUploads}
            />
            :
            <Home
              connect={clickConnect}
              supported={() => true}
              openSettings={() => setSettingsOpen(true)}
            />
          }
        </Grid>

        {/* Serial Output */}
        <Grid item xs={12}>
          <Output
            received={output}
          />
        </Grid>

        {/* Erase & Program Buttons */}
        {connected &&
          <Grid item xs={12} sx={{ my: '1rem' }}>
            <Buttons
              erase={() => clickErase()}
              program={() => clickProgram()}
              disabled={uploads.length === 0}
            />
          </Grid>
        }
      </Grid>

      {/* Settings Window */}
      <Settings
        open={settingsOpen}
        close={() => setSettingsOpen(false)}
        baudRate={baudRate}
        save={handleSave}
        openPort={connected}
        saveToast={() => setToast({ open: true, severity: 'success', value: 'Settings saved ✨' })}
      />

      {/* (Dis)connected Toast */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast}>
        <Alert onClose={closeToast} severity={toast.severity}>
          {toast.value}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App
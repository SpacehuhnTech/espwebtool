import React from 'react'

import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import Header from './components/Header'
import Flasher from './components/Flasher'
import Home from './components/Home'
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
    //serial.setBaudRate(baudRate)

    saveSettings({
      baudRate: newSettings.baudRate,
    })

    console.log(newSettings.baudRate)
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
      log: (...args) => console.log(...args),
      debug: (...args) => console.debug(...args),
      error: (...args) => console.error(...args),
    })
    try {
      await esploader.initialize()

      setOutput(`Connected to ${esploader.chipName}`)
      setOutput(`MAC Address: ${formatMacAddr(esploader.macAddr())}`)

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
    let validFiles = [];
    let offsetVals = [];
    /*for (let i = 0; i < 4; i++) {
      let offs = parseInt(offsets[i].value, 16);
      if (firmware[i].files.length > 0 && !offsetVals.includes(offs)) {
        validFiles.push(i);
        offsetVals.push(offs);
      }
    }*/
    return ['test']//validFiles;
  }

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const clickProgram = async () => {
    const readUploadedFileAsArrayBuffer = (inputFile) => {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException('Problem parsing input file.'));
        };

        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsArrayBuffer(inputFile);
      });
    };

    //baudRate.disabled = true;
    //butErase.disabled = true;
    //butProgram.disabled = true;
    for (let i = 0; i < 4; i++) {
      //firmware[i].disabled = true;
      //offsets[i].disabled = true;
    }
    for (let file of getValidFiles()) {
      //progress[file].classList.remove('hidden');
      let binfile = 'HERE FIRMWARE'//firmware[file].files[0];
      let contents = await readUploadedFileAsArrayBuffer(binfile);
      try {
        let offset = parseInt(0/*HERE_OFFSET offsets[file].value*/, 16);
        //const progressBar = progress[file].querySelector('div');
        await espStub.flashData(
          contents,
          (bytesWritten, totalBytes) => {
            console.log('written: ', bytesWritten)
            //progressBar.style.width = Math.floor((bytesWritten / totalBytes) * 100) + '%';
          },
          offset
        );
        await sleep(100);
      } catch (e) {
        console.error(e);
      }
    }
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

      {connected ?
        <Flasher
          uploads={uploads}
          setUploads={setUploads}
          erase={() => clickErase()}
          program={() => console.log('program')}
        />
        :
        <Home
          connect={clickConnect}
          supported={() => true}
          openSettings={() => setSettingsOpen(true)}
        />
      }

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

      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App
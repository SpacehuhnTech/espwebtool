import React, { useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Header from './components/Header'
import Home from './components/Home'
import FileList from './components/FileList'
import Output from './components/Output'
import Buttons from './components/Buttons'
import Settings from './components/Settings'
import ConfirmWindow from './components/ConfirmWindow'
import Footer from './components/Footer'

import { connectESP, loadFiles, supported } from './lib/esp'
import { loadSettings, defaultSettings } from './lib/settings'

const App = () => {
  const [connected, setConnected] = React.useState(false) // Connection status
  const [connecting, setConnecting] = React.useState(false)
  const [output, setOutput] = React.useState({ time: new Date(), value: 'Click Connect to start\n' }) // Serial output
  const [espStub, setEspStub] = React.useState(undefined) // ESP flasher stuff
  const [uploads, setUploads] = React.useState([]) // Uploaded Files
  const [settingsOpen, setSettingsOpen] = React.useState(false) // Settings Window
  const [settings, setSettings] = React.useState({...defaultSettings}) // Settings
  const [confirmErase, setConfirmErase] = React.useState(false) // Confirm Erase Window
  const [confirmProgram, setConfirmProgram] = React.useState(false) // Confirm Flash Window
  const [flashing, setFlashing] = React.useState(false) // Enable/Disable buttons
  const [chipName, setChipName] = React.useState('') // ESP8266 or ESP32

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  // Add new message to output
  const addOutput = (msg) => {
    setOutput({
      time: new Date(),
      value: `${msg}\n`,
    })
  }

  // Connect to ESP & init flasher stuff
  const clickConnect = async () => {
    if (espStub) {
      await espStub.transport.disconnect()
      setEspStub(undefined)
      return
    }

    let esploader

    try {
      toast.info('Connecting...', { 
        position: 'top-center', 
        autoClose: false, 
        toastId: 'connecting' 
      })
      toast.update('connecting', {
        render: 'Connecting...',
        type: toast.TYPE.INFO,
        autoClose: false
      })

      esploader = await connectESP({
        baudRate: parseInt(settings.baudRate),
        terminal: {
          clean: () => addOutput(''),
          writeLine: (data) => addOutput(data),
          write: () => {},
        },
      })

      setConnecting(true)

      // main() connects, prints chip info/MAC and uploads+runs the stub itself
      const chipDescription = await esploader.main()
      const connectedChipName = esploader.chip.CHIP_NAME

      addOutput(`Connected to ${chipDescription}`)

      setConnected(true)
      toast.update('connecting', {
        render: 'Connected 🚀',
        type: toast.TYPE.SUCCESS,
        autoClose: 3000
      })

      esploader.transport.setDeviceLostCallback(() => {
        setConnected(false)
        setEspStub(undefined)
        toast.warning('Disconnected 💔', { position: 'top-center', autoClose: 3000, toastId: 'settings' })
        addOutput(`------------------------------------------------------------`)
      })

      setEspStub(esploader)
      setUploads(await loadFiles())
      setChipName(connectedChipName)
    } catch (err) {
      // The browser port chooser was dismissed, so there is no connection to clean up
      const cancelled = err?.name === 'NotFoundError'
      const shortErrMsg = cancelled ? 'No port selected' : `${err}`.replace('Error: ','')

      toast.update('connecting', {
        render: shortErrMsg,
        type: cancelled ? toast.TYPE.INFO : toast.TYPE.ERROR,
        autoClose: 3000
      })

      addOutput(shortErrMsg)

      if (esploader) {
        try {
          await esploader.transport.disconnect()
        } catch (closeErr) {
          console.debug(closeErr)
        }
      }
    } finally {
      setConnecting(false)
    }
  }

  // Erase firmware on ESP
  const erase = async () => {
    setConfirmErase(false)
    setFlashing(true)
    toast(`Erasing flash memory. Please wait...`, { position: 'top-center', toastId: 'erase', autoClose: false })

    try {
      const stamp = Date.now()

      addOutput(`Start erasing`)
      const interval = setInterval(() => {
        addOutput(`Erasing flash memory. Please wait...`)
      }, 3000)

      await espStub.eraseFlash()

      clearInterval(interval)
      addOutput(`Finished. Took ${Date.now() - stamp}ms to erase.`)
      toast.update('erase', { render: 'Finished erasing memory.', type: toast.TYPE.INFO, autoClose: 3000 })
    } catch (e) {
      addOutput(`ERROR!\n${e}`)
      toast.update('erase', { render: `ERROR!\n${e}`, type: toast.TYPE.ERROR, autoClose: 3000 })
      console.error(e)
    } finally {
      setFlashing(false)
    }
  }

  // Flash Firmware
  const program = async () => {
    setConfirmProgram(false)

    const files = uploads.filter((file) => file.fileName && file.obj)

    if (files.length === 0) {
      addOutput(`Please add a .bin file`)
      toast.info('Please add a .bin file', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
      return
    }

    const toArrayBuffer = (inputFile) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException('Problem parsing input file.'));
        }

        reader.onload = () => {
          resolve(reader.result);
        }
        reader.readAsArrayBuffer(inputFile)
      })
    }

    setFlashing(true)
    toast(`Uploading ${files[0].fileName.substring(0, 28)}...`, { position: 'top-center', progress: 0, toastId: 'upload' })

    try {
      const fileArray = []

      for (const file of files) {
        const contents = await toArrayBuffer(file.obj)

        fileArray.push({
          data: new Uint8Array(contents),
          address: parseInt(file.offset, 16),
        })
      }

      await espStub.writeFlash({
        fileArray: fileArray,
        flashMode: 'keep',
        flashFreq: 'keep',
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const progress = (written / total)

          toast.update('upload', { progress: progress })

          addOutput(`Flashing ${files[fileIndex].fileName.substring(0, 28)}... ${Math.floor(progress * 100)}%`)
        },
      })

      addOutput(`Done!`)
      addOutput(`To run the new firmware please reset your device.`)

      toast.success('Done! Reset ESP to run new firmware.', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
    } catch (e) {
      addOutput(`ERROR!`)
      addOutput(`${e}`)
      console.error(e)
      toast.update('upload', { render: `ERROR! ${e}`, type: toast.TYPE.ERROR, autoClose: 5000 })
    } finally {
      setFlashing(false)
    }
  }

  return (
    <Box sx={{ minWidth: '25rem' }}>
      <Header sx={{ mb: '1rem' }} />

      <Grid container spacing={1} direction='column' justifyContent='space-around' alignItems='center' sx={{ minHeight: 'calc(100vh - 116px)' }}>

        {/* Home Page */}
        {!connected && !connecting &&
          <Grid item>
            <Home
              connect={clickConnect}
              supported={supported}
              openSettings={() => setSettingsOpen(true)}
            />
          </Grid>
        }

        {/* Home Page */}
        {!connected && connecting &&
          <Grid item>
            <Typography variant='h3' component='h2' sx={{ color: '#aaa' }}>
              Connecting...
            </Typography>
          </Grid>
        }

        {/* FileUpload Page */}
        {connected &&
          <Grid item>
            <FileList
              uploads={uploads}
              setUploads={setUploads}
              chipName={chipName}
            />
          </Grid>
        }

        {/* Erase & Program Buttons */}
        {connected &&
          <Grid item>
            <Buttons
              erase={() => setConfirmErase(true)}
              program={() => setConfirmProgram(true)}
              disabled={flashing}
            />
          </Grid>
        }

        {/* Serial Output */}
        {supported() &&
          <Grid item>
            <Output received={output} />
          </Grid>
        }
      </Grid>

      {/* Settings Window */}
      <Settings
        open={settingsOpen}
        close={() => setSettingsOpen(false)}
        setSettings={setSettings}
        settings={settings}
        connected={connected}
      />

      {/* Confirm Erase Window */}
      <ConfirmWindow
        open={confirmErase}
        text={'This will erase the memory of your ESP.'}
        onOk={erase}
        onCancel={() => setConfirmErase(false)}
      />

      {/* Confirm Flash/Program Window */}
      <ConfirmWindow
        open={confirmProgram}
        text={'Flashing new firmware will override the current firmware.'}
        onOk={program}
        onCancel={() => setConfirmProgram(false)}
      />

      {/* Toaster */}
      <ToastContainer />

      {/* Footer */}
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App
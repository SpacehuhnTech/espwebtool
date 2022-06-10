import React from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Header from './components/Header'
import Home from './components/Home'
import FileList from './components/FileList'
import Output from './components/Output'
import Buttons from './components/Buttons'
import Settings from './components/Settings'
import Footer from './components/Footer'

import { connectESP, formatMacAddr } from './lib/esp'
import { loadSettings, saveSettings } from './lib/settings'

function App() {
  const [connected, setConnected] = React.useState(false) // Connection status
  const [output, setOutput] = React.useState({ time: new Date(), value: '' }) // Serial output
  const [espStub, setEspStub] = React.useState(undefined) // ESP flasher stuff
  const [uploads, setUploads] = React.useState([]) // Uploaded Files
  const [settingsOpen, setSettingsOpen] = React.useState(false) // Settings Window
  const [settings, setSettings] = React.useState(loadSettings()) // Settings

  // Add new message to output
  const addOutput = (msg) => {
    setOutput({
      time: new Date(),
      value: `${msg}\n`,
    })
  }

  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect()
      await espStub.port.close()
      setEspStub(undefined)
      return
    }

    const esploader = await connectESP({
      log: (...args) => {
        //console.log(...args)
        addOutput(`${args[0]}`)
      },
      debug: (...args) => console.debug(...args),
      error: (...args) => console.error(...args),
      baudRate: parseInt(settings.baudRate),
    })

    try {
      toast.info("Connecting...", { position: 'top-center', autoClose: false, toastId: 'connecting' })

      await esploader.initialize()

      addOutput(`Connected to ${esploader.chipName}`)
      addOutput(`MAC Address: ${formatMacAddr(esploader.macAddr())}`)

      const newEspStub = await esploader.runStub()

      setConnected(true)
      toast.update('connecting', {
        render: 'Connected 🚀',
        type: toast.TYPE.SUCCESS,
        autoClose: 3000
      })

      //console.log(newEspStub)

      newEspStub.port.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
        toast.warning('Disconnected 💔', { position: 'top-center', autoClose: 3000, toastId: 'settings' })
        addOutput(`------------------------------------------------------------`)
      })
      setEspStub(newEspStub)
    } catch (err) {
      toast.update('connecting', {
        render: 'Encountered error 🙁',
        type: toast.TYPE.ERROR,
        autoClose: 3000
      })

      await esploader.disconnect()
      await esploader.port.close()
      addOutput(`${err}`)
    }
  }

  const clickErase = async () => {
    if (
      window.confirm('This will erase the entire flash. Click OK to continue.')
    ) {
      try {
        let stamp = Date.now()
        addOutput(`Start erasing`)
        let interval = setInterval(() => addOutput(`Erasing flash memory. Please wait...`), 3000)
        await espStub.eraseFlash()
        addOutput(`Finished. Took ${Date.now() - stamp}ms to erase.`)
        clearInterval(interval)
      } catch (e) {
        addOutput(`ERROR!`)
        addOutput(`${e}`)
        console.error(e)
      }
    }

  }

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const clickProgram = async () => {
    const toArrayBuffer = (inputFile) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException("Problem parsing input file."));
        }

        reader.onload = () => {
          resolve(reader.result);
        }
        reader.readAsArrayBuffer(inputFile)
      })
    }

    for (const file of uploads) {
      toast(`Uploading ${file.fileName.substring(0, 28)}...`, { position: 'top-center', progress: 0, toastId: 'upload' })

      try {
        const contents = await toArrayBuffer(file.obj)

        await espStub.flashData(
          contents,
          (bytesWritten, totalBytes) => {
            const progress = (bytesWritten / totalBytes)
            const percentage = Math.floor(progress * 100)

            toast.update('upload', { progress: progress })

            addOutput(`Flashing... ${percentage}%`)
          },
          0,//parseInt(file.offset, 16)
        )

        await sleep(100)
        addOutput(`Done!`)
        addOutput(`To run the new firmware please reset your device.`)
      } catch (e) {
        addOutput(`ERROR!`)
        addOutput(`${e}`)
        console.error(e)
      }
    }

    toast.success('Done! Reset ESP to run new firmware.', { position: 'top-center', toastId: 'uploaded', autoClose: 3000 })
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
        save={(newSettings) => { saveSettings(newSettings); setSettings(newSettings) }}
        settings={settings}
        openPort={connected}
        saveToast={() => toast.success('Settings saved ✨', { position: 'top-center', autoClose: 3000, toastId: 'settings' })}
      />

      {/* Toaster */}
      <ToastContainer />

      {/* Footer */}
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App
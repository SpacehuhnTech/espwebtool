import React from 'react'

import Box from '@mui/material/Box'

import Header from './components/Header'
import Footer from './components/Footer'
import Flasher from './components/Flasher'
import Home from './components/Home'

const formatMacAddr = (macAddr) => {
  return macAddr.map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join(':')
}

function App() {
  // Connection status
  const [connected, setConnected] = React.useState(false)

  // Serial output
  const [output, setOutput] = React.useState('')

  // ESP flasher stuff
  const [espStub, setEspStub] = React.useState(undefined)

  // Uploaded Files
  const [uploads, setUploads] = React.useState([])

  // Settings Window
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect()
      await espStub.port.close()
      //toggleUIConnected(false)
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
      //toggleUIConnected(true)
      //toggleUIToolbar(true)
      newEspStub.addEventListener('disconnect', () => {
        //toggleUIConnected(false)
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
      <Header sx={{ mb: '1rem' }}/>

      {connected ?
        <Flasher
          uploads={uploads}
          setUploads={setUploads}
          erase={() => console.log('erasing')}
          program={() => clickConnect().then(() => clickErase())}
        />
        :
        <Home
          connect={() => setConnected(true)}
          supported={() => true}
          openSettings={() => setSettingsOpen(true)}
        />
      }

      <Footer sx={{ mt: 'auto' }} />
    </Box>
  )
}

export default App
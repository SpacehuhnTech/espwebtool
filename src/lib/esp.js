import localforage from "localforage"

const connectESP = async ({ baudRate, terminal }) => {
    const { ESPLoader, Transport } = await window.esptoolPackage
    const port = await navigator.serial.requestPort()

    return new ESPLoader({
        transport: new Transport(port),
        baudrate: baudRate,
        terminal: terminal,
    })
}

const defaultFiles = (chipName) => {
    //console.log(chipName)

    if (chipName.includes('ESP32')) {
        return [
            { offset: '1000' },
            { offset: '8000' },
            { offset: 'E000' },
            { offset: '10000' }
        ]
    } else {
        return [
            { offset: 0 }
        ]
    }
}

const saveFiles = (newFiles) => {
    localforage.setItem('uploads', newFiles)
}

const loadFiles = async (chipName) => {
    const value = await localforage.getItem('uploads')

    if (value) {
        //console.log(value)
        return value
    }

    return defaultFiles(chipName)
}

const supported = () => {
    return ('serial' in navigator)
}

export { connectESP, defaultFiles, saveFiles, loadFiles, supported }
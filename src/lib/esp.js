import localforage from 'localforage'

const connectESP = async ({ baudRate, terminal }) => {
    const { ESPLoader, Transport } = await window.esptoolPackage
    const port = await navigator.serial.requestPort()

    return new ESPLoader({
        transport: new Transport(port),
        baudrate: baudRate,
        terminal: terminal,
    })
}

const mergedFile = () => {
    // Merged images (bootloader + partition table + app) always go to 0x0
    return [{ offset: 0 }]
}

// Layout of separate ESP-IDF build outputs: bootloader, partition table, boot_app0, app
const multipleFiles = (chipName) => {
    if (!chipName || !chipName.includes('ESP32')) {
        return [{ offset: 0 }, { offset: '8000' }, { offset: '10000' }]
    }

    if (chipName === 'ESP32') {
        return [{ offset: '1000' }, { offset: '8000' }, { offset: 'E000' }, { offset: '10000' }]
    }

    // ESP32-S2/S3/C2/C3/C5/C6/H2 keep the bootloader at 0x0
    return [{ offset: 0 }, { offset: '8000' }, { offset: 'E000' }, { offset: '10000' }]
}

const saveFiles = (newFiles) => {
    localforage.setItem('uploads', newFiles)
}

const loadFiles = async () => {
    const value = await localforage.getItem('uploads')

    if (value) {
        //console.log(value)
        return value
    }

    return mergedFile()
}

const supported = () => {
    return 'serial' in navigator
}

// Converts esptool-js flash size strings like "512KB" or "4MB" to bytes
const flashSizeToBytes = (size) => {
    const match = /^(\d+)(KB|MB)$/.exec(size)

    if (!match) {
        return undefined
    }

    return parseInt(match[1]) * (match[2] === 'MB' ? 1024 * 1024 : 1024)
}

export { connectESP, mergedFile, multipleFiles, saveFiles, loadFiles, supported, flashSizeToBytes }

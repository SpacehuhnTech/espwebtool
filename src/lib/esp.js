import localforage from "localforage"

const connectESP = async t => {
    const esploaderMod = await window.esptoolPackage;
    const e = await navigator.serial.requestPort();
    return t.log("Connecting..."), await e.open({
        baudRate: t.baudRate
    }), t.log("Connected successfully."), new esploaderMod.ESPLoader(e, t);
};

const formatMacAddr = (macAddr) => {
    return macAddr.map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join(':')
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

export { connectESP, formatMacAddr, sleep, defaultFiles, saveFiles, loadFiles, supported }
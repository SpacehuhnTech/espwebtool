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

export { connectESP, formatMacAddr, sleep }
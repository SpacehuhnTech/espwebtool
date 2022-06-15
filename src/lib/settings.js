
import { setCookie, getCookie } from './cookie'

const baudrates = [
    115200,
    230400,
    460800,
    921600,
    //3000000,
]

const defaultSettings = {
    baudRate: 115200,
}

const loadSettings = () => {
    let settings = {...defaultSettings}

    const cookieValue = getCookie('settings')

    try {
        const cookieJSON = JSON.parse(cookieValue)

        if ('baudRate' in cookieJSON) settings.baudRate = cookieJSON.baudRate
    } catch (e) {
        saveSettings(settings)
        console.error(e)
    }

    return settings
}

const saveSettings = (newSettings) => {
    setCookie('settings', JSON.stringify(newSettings), 365)
}

export { loadSettings, saveSettings, baudrates, defaultSettings }
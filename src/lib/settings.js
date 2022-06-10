
import { setCookie, getCookie } from './cookie'

const baudrates = [
    115200,
    230400,
    460800,
    921600,
    //3000000,
]

const loadSettings = () => {
    let settings = {
        baudRate: 115200,
    }

    const cookieValue = getCookie('settings')

    try {
        const cookieJSON = JSON.parse(cookieValue)

        if ('baudRate' in cookieJSON) settings.baudRate = cookieJSON.baudRate
    } catch (e) {
        console.error(e)
    }

    //saveSettings(settings)
    return settings
}

const saveSettings = (newSettings) => {
    setCookie('settings', JSON.stringify(newSettings), 365)
}

export { loadSettings, saveSettings, baudrates }
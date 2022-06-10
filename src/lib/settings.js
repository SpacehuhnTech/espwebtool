
import { setCookie, getCookie } from './cookie'

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

export { loadSettings, saveSettings }
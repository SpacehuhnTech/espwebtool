function setCookie(cname, cvalue) {
    const days = 365
    const d = new Date()
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = d.toUTCString()
    document.cookie = `${cname}=${cvalue};expires=${expires};path=/;SameSite=Strict;`
}

function getCookie(cname) {
    let name = `${cname}=`
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return ''
}

export { setCookie, getCookie }
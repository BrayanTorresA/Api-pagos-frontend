const BASE_URL = "http://127.0.0.1:8000/"

function validateAuth(archiveRedirect) {
    let token = localStorage.getItem("authTokens")
    if (!token) {
        window.location.href = archiveRedirect
    }
}

function validateToken(archiveRedirect) {

    let token = localStorage.getItem("authTokens")
    if (token) {
        window.location.href = archiveRedirect
    }
}


let loading = true

const upddateToken = async () => {
    console.log("UPDATING TOKEN")
    let authTokens = JSON.parse(localStorage.getItem("authTokens"))

    let response = await fetch(BASE_URL + "users/jwt/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
    })

    let data = await response.json()
    if (response.status === 200) {
        authTokens.access = data.access
        localStorage.setItem("authTokens", JSON.stringify(authTokens))
    } else {
        logoutUser()
    }

    if (loading) {
        loading = false
    }
}

function updateTokenInterval() {
    if (loading) {
        upddateToken()
    }

    let accessTime = 1000 * 60 * 60 // 1 hour
    let interval = setInterval(() => {
        updateToken();
    }, accessTime);
    return () => clearInterval(interval)
}

const logoutUser = () => {
    localStorage.removeItem("authTokens")
    localStorage.removeItem("user")
    window.location.replace("./login.html")
}

export { validateAuth, validateToken, updateTokenInterval, logoutUser, BASE_URL };
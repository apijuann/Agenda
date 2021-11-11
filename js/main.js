// FUNCIONES DE ENRUTAMIENTO
//pages:login submit onclick

// PATH CORTO PARA TODAS LAS RUTAS
// const PATH = 'http://127.0.0.1:5500/pages'

// function goTo(pages){
//     window.location.href = `${PATH}/${pages}.html`
// }

// PATH LARGO PARA CADA RUTA
function goToMainPage(userId){
    const path = "http://localhost:5500/pages/main_page.html?id=" +userId
    window.location.href = path
}

// function goToSignUp(){
//     const path = "http://localhost:5500/pages/signup.html"
//     window.location.href = path
// }

function goToLogin(){
    const path = "http://localhost:5500/pages/login.html"
    window.location.href = path
}

function goToEditPage(){
    const path = "http://localhost:5500/pages/edit_page.html"
    window.location.href = path
}

// FUNCIONES DE VALIDACION LOGIN
//input onkeyup
function validateLogin () {
    const eUsername = document.getElementById('username')
    const ePassword = document.getElementById('password')

    const eBtnLogin = document.getElementById('btn-login')

    const username = eUsername.value
    const password = ePassword.value

    const vUsername = username.length >6 && username.length < 15 && !username.includes(" ")
    const vPassword = password.length >= 8

    if (vUsername && vPassword) {
        eBtnLogin.removeAttribute('disabled')
    } else {
        eBtnLogin.setAttribute('disabled', true)
    }
}

// FUNCIONES DE VALIDACION SIGNUP
function validateSignup () {
    const eUsername = document.getElementById('username')
    const ePassword1 = document.getElementById('password1')
    const ePassword2 = document.getElementById('password2')
    const eBtnSignup = document.getElementById('btn-signup')

    const username = eUsername.value
    const password1 = ePassword1.value
    const password2 = ePassword2.value

    const vUsername = username.length >= 6 && username.length < 15 && !username.includes(" ")
    const vPassword = password1.length >= 8 && password1 === password2

    if (vUsername && vPassword) {
        eBtnSignup.removeAttribute('disabled')
    } else {
        eBtnSignup.setAttribute('disabled', true)
    }
}


// FUNCIONES DE SERVICE (CLIENTE)
function createUser() {
    const eUsername = document.getElementById("username")
    const ePassword = document.getElementById("password1")

    const username = eUsername.value
    const password = ePassword.value

    const user = api.user.create(username, password) // si se crea o se registra usuario
    if (user) {
        goToLogin()
    } else {
        alert ("No se pudo crear el usuario")
    }
}

function loginUser() {
    const eUsername = document.getElementById("username")
    const ePassword = document.getElementById("password")

    const username = eUsername.value
    const password = ePassword.value

    const user = api.user.login(username, password)
    if (user) {
        goToMainPage()
    } else {
        alert ("El usuario no existe")
    }
}

//// CARGAR PAGINA DE USUARIO ID
function onLoadMainPage() { // se lo asignamos al boton del login
    const search = window.location.search
    const urlParams = new URLSearchParams(search)
    
    const userId = +urlParams.get("id") //+ parseado a string
    if (!userId){ // si no existe usuario
        goToLogin()
    }

    const user = api.user.get(userId) // userId
    if (!user || !user.active){
        return
    }

    goToMainPage()
    
    // dibujado del usuario - recorrido
    const eUserNameTitle = document.getElementById("username-title")
    eUserNameTitle.innerHTML = user.username
}

// FUNCIONES DE SERVICE (API)
const namedb = "DB" // nombre de la base de datos
const api = {
    user: {
        create: function (username, password) {
            const user = {
                    id: 1,
                    active: false, // cuando inicie sesion, cambiar a true
                    username: username,
                    password: password,
                    notes: []
            }

            const dbLS = localStorage.getItem(namedb)
            let db = undefined
            if (dbLS) {
                db = JSON.parse(dbLS)
            } else {
                db = {
                    counter: 1,
                    users: []
                }
            }
            
            //SI EL USUARIO YA EXISTE, se puede tmb recorrer mmediante find...
            const userLen = db.users.length
            let index = 0
            let existeUsuario = false
            while(index < userLen) {
                if(db.users[index].username === username) {
                    existeUsuario = true
                }
                index = index +1
            }

            //INTERRUMPE LA EJECUCION SI USUARIO EXISTE y no hace push abajo
            if (existeUsuario === true) {
                return null
            }

            user.id = db.counter
            db.counter = db.counter + 1
            db.users.push(user)
            localStorage.setItem(namedb, JSON.stringify(db))
            return user
        },
        get (id) { //userId
            const dbLS = localStorage.getItem(namedb)
            if (!dbLS) { // si no existe bd o usuario devolver null, no abrir pagina sin usuario
                return null
            }

            const db = JSON.parse(dbLS) // si existe bd o usuario
            const userLen = db.user.length
            let user = null // inicialmente usuario no existe
            for (let index = 0; index < userLen; index++){ 
                if (db.users[index].id === id) { 
                    user = db.users[index]
                }
            } // for para recorrer array, se podria usar while
            return user //si usuario encontrado
    
            // es lo mismo: index++, index +=1, index = index +1 
        },
        login(username, password) {
            const dbLS = localStorage.getItem(namedb)
            if(!dbLS) {
                return null
            }

            const db = JSON.parse(dbLS)
            let user = null
            let index = -1
            let counter = 0
            for (const element of db.users) {
                if (element.username === username && element.password === password) {
                    index = counter
                }
                counter = counter +1
            }

            if (index > -1) {
                user = db.users[index]
                db.users[index].active = true // si usuario existe, activar y
                localStorage.setItem(namedb, JSON.stringify(db)) // guardar a la bd
            }

            return user
        }
    }
}



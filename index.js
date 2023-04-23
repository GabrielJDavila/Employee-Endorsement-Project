import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://wearethechampions-d6b62-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")
const sendersInDB = ref(database, "fromSender")
const recipientsInDB = ref(database, "toRecipient")

const textField = document.getElementById("text")
const fromText = document.getElementById("from")
const toText = document.getElementById("to")
const publish = document.getElementById("btn")
const endorsementsList = document.getElementById("endorsements")

publish.addEventListener("click", () => {
    let textValue = textField.value
    let fromValue = fromText.value
    let toValue = toText.value
    let inputsArray = [textValue, fromValue, toValue]
    
    if(textField.value && fromText.value && toText.value) {
        required(false)
        push(endorsementsInDB, inputsArray)
        clearInputFields()
    } else {
        console.log("please fill out form")
        required(true)
    }
})
// ---------------------------------------------------------------
onValue(endorsementsInDB, (snapshot) => {
    if(snapshot.exists()) {
        let endorseArray = Object.entries(snapshot.val())
        clearEndorsementListHTML()
        
        for(let i = 0; i < endorseArray.length; i++) {
            let currentEndorse = endorseArray[i]
            let endorseID = currentEndorse[0]
            let endorseValue = currentEndorse[1]
            appendToHTML(currentEndorse)
        }
    } else {
        endorsementsDiv.innerHTML = "No endorsements yet..."
    }
})

function appendToHTML(item) {
    let html = ""
    let itemID = item[0]
    let itemTextArray = item[1]
    
    let endorsementText = itemTextArray[0]
    let senderName = itemTextArray[1]
    let recipientName = itemTextArray[2]
    
    let newEl = document.createElement("li")
    html = `
        <div class="endorsement-el">
            <p class="recipient-name">To ${recipientName}</p>
            <p class="endorsement-text">${endorsementText}</p>
            <p class="sender-name">From ${senderName}</p>
        </div>
    `
    endorsementsList.insertAdjacentHTML("afterbegin", `${html}`)
    
}

// -------------------------------------------------------

function required(yes) {
    if(yes) {
        textField.classList.add("required")
        fromText.classList.add("required")
        toText.classList.add("required") 
    } else {
        textField.classList.remove("required")
        fromText.classList.remove("required")
        toText.classList.remove("required")
    }
}

function clearInputFields() {
    textField.value = ""
    fromText.value = ""
    toText.value = ""
}

function clearEndorsementListHTML() {
    endorsementsList.innerHTML = ""
}
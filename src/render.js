const tools = document.getElementsByClassName("leagueTool")
const loadingSpinner = document.getElementById("waitingLeagueSpinner")
const chatSwitch = document.getElementById("chatSwitch")
const clickMe = document.getElementById("clickMeButton")

chatSwitch.onclick = onSwitchChatClicked
  
function onSwitchChatClicked(){
    window.api.send('switchButtonClicked', chatSwitch.checked)
}

window.api.receive('applicationStart', () => {
    console.log("Received applicationStart message")
    Array.prototype.forEach.call(document.getElementsByClassName("leagueTool"), function(item){
        item.style.display = "none"
    })
})

window.api.receive('leagueFound', () => {
    console.log("Received leagueFound message")
    loadingSpinner.style.display = "none";
    Array.prototype.forEach.call(document.getElementsByClassName("leagueTool"), function(item){
        item.style.display = ""
    })
})

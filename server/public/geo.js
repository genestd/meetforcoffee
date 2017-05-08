//On load, try to get local coffee results
function getLocation(){
  if(navigator.geolocation){

    var results = document.getElementById('results')
    //Temp message while retrieving results
    var waitMsg = document.createElement("div")
    waitMsg.setAttribute("class", "row")
    waitMsg.setAttribute("id", "message")
    var ldr = document.createElement('img')
    ldr.setAttribute('class', 'loader')
    ldr.setAttribute('src', 'loader.svg')
    waitMsg.appendChild(ldr)
    waitMsg.appendChild(document.createTextNode("Finding local coffee shops"))
    results.appendChild(waitMsg)

    var position = navigator.geolocation.getCurrentPosition(
      function success(position){
        return position
      },
      function error(err){
        results.removeChild(document.getElementById('message'))
        var errMsg = document.createElement('div')
        errMsg.setAttribute("class", 'row')
        errMsg.setAttribute("id", "message")
        errMsg.appendChild(document.createTextNode("Enter your location to find local coffee shops"))
        results.appendChild(errMsg)
        console.log(err)
      }
    )
  }
}

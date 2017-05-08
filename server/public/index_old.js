
document.addEventListener('DOMContentLoaded', function init(){

  //Clicking submit sends location to google api
  var sb = document.getElementById('srchBtn')
  sb.addEventListener( 'click', getCoordinates )

  //Pressing enter submits form
  var sf = document.getElementById('search')
  sf.addEventListener( 'keypress', function keycheck(e){
    if (e.which === 13){
      e.preventDefault()
      getCoordinates(e)
    }
  })

  //if this hidden element is present, then try to get a location
  var loc = document.getElementById('location')
  if(loc){
  //On load, try to get local coffee results
    if(navigator.geolocation){
      console.log('here')
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
          axios.get('/coffee?lat='+position.coords.latitude+'&long='+position.coords.longitude)
          .then( //parseCoffeeResults
            window.location = '/'
          )
          .catch(function (error) {
            console.log('axios err', error);
          });
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
})

function parseCoffeeResults(response){
  console.log(response)
  results.removeChild(document.getElementById('message'))
  for(var i=0; i<response.data.results.length; i++){
    //add a row
    var row = document.createElement("div")
    row.setAttribute("class", "row")
    row.setAttribute("id", response.data.results[i].place_id)
    //add the business name, with link
    var name = document.createElement("span")
    name.setAttribute("class", "cafe-name")
    var link = document.createElement("a")
    link.setAttribute("href", "/details/"+response.data.results[i].place_id)
    link.appendChild(document.createTextNode(response.data.results[i].name))
    name.appendChild(link)
    row.appendChild(name)
    //add the address
    var addr = document.createElement("span")
    addr.setAttribute("class", "cafe-address"),
    addr.appendChild(document.createTextNode(response.data.results[i].vicinity))
    row.appendChild(addr)
    //add the rating
    var rating = document.createElement("span")
    rating.setAttribute("class", "cafe-rating"),
    rating.appendChild(document.createTextNode(response.data.results[i].rating))
    row.appendChild(rating)

    results.appendChild(row)
  }
}
function getCoordinates( event ){
  event.preventDefault()
  var bar = document.getElementById('searchBar')
  var val = bar.value
  bar.value = ''
  axios.get('/address?address=' + val)
    .then( response =>{
      console.log('address response: ', response)
       var location = response.data.results[0].geometry.location
       axios.get('/coffee?lat=' + location.lat + "&long=" + location.lng)
         .then( parseCoffeeResults)
         .catch( err=>{
           console.log(err)
         })
    })
    .catch( err=>{
      console.log('err', err)
    })
}

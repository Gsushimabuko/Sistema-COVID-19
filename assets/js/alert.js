
const principal = () => {
    
   

  //document.getElementById("open-popup-btn").addEventListener("click",function(){
      document.getElementsByClassName("popup")[0].classList.add("active");
    //});
    
  /* document.getElementById("dismiss-popup-btn").addEventListener("click",function(){
      document.getElementsByClassName("popup")[0].classList.remove("active");
    });
  */
    
    
  document.getElementsByClassName("popup")[0].classList.add("active");
  const btnVolver = document.getElementById("dismiss-popup-btn")

  btnVolver.onclick = volver
    
}

const volver = () =>{
  history.back()
}
  
  window.addEventListener("load", principal())
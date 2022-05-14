
const toogle = () =>{

    console.log("activando toogle...")

    const t0 = document.getElementById("toggle0")
    const t1 = document.getElementById("toggle1")
    const t2 = document.getElementById("toggle2")
    const t3 =document.getElementById("toggle3")
    const t4 =document.getElementById("toggle4")

    t0.style.display = 'none'
    t1.style.display = 'none'
    t2.style.display = 'none'
    t3.style.display = 'none'
    t4.style.display = 'none'
    
    const bt0 = document.getElementById("bt0")
    const bt1 = document.getElementById("bt1")
    const bt2 = document.getElementById("bt2")
    const bt3 = document.getElementById("bt3")
    const bt4 = document.getElementById("bt4")

        
    bt0.addEventListener('click', () =>{
        if(t0.style.display === 'none'){
            console.log("a")
            t0.style.display = 'block';
        }else{
            t0.style.display = 'none'
            console.log("b")
        }
    })
    bt1.addEventListener('click', () =>{
        if(t1.style.display === 'none'){
            console.log("a")
            t1.style.display = 'block';
        }else{
            t1.style.display = 'none'
            console.log("b")
        }
    })
    bt2.addEventListener('click', () =>{
        if(t2.style.display === 'none'){
            console.log("a")
            t2.style.display = 'block';
        }else{
            t2.style.display = 'none'
            console.log("b")
        }
    })
    bt3.addEventListener('click', () =>{
        if(t3.style.display === 'none'){
            console.log("a")
            t3.style.display = 'block';
        }else{
            t3.style.display = 'none'
            console.log("b")
        }
    })
    bt4.addEventListener('click', () =>{
        if(t4.style.display === 'none'){
            console.log("a")
            t4.style.display = 'block';
        }else{
            t4.style.display = 'none'
            console.log("b")
        }
    })
}  
    

window.addEventListener("load", toogle)
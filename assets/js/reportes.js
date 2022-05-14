const cargarTablas = () => {

   
        $(document).ready( function () {
            $('#myTable1').DataTable();    
            $('#myTable2').DataTable();    
            $('#myTable3').DataTable();    
            
           
        } 
        )
    }
    console.log("Cargando tablas")




window.addEventListener("load", cargarTablas())

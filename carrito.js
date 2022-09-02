//REFERENCIAS PRINCIPALES AL DOM Y VARIABLES PRINCIPALES
const $menu = document.querySelector('.contenedor-productos');
const $fragment = new DocumentFragment();
let $carrito = document.getElementById('carrito'); 
let $totales = document.getElementById('totales');
let data;
let carrito ={};

//FUNCIÓN ASINCRONA PARA TRAER LOS PRODUCTOS DEL ARCHIVO JSON
const getData = async()=>{
    try {
        const res = await fetch("productos.json");
        data = await res.json();
        console.log(data);
        if(!res.ok)throw{status:res.status,statusText:res.statusText};
        pintarPruductos(data);       
    } catch (error) {
        let mensajeError = error.statusText || "Ocurrio un error";
        $menu.innerHTML=`Error ${error.status}: ${mensajeError}`;
    }
}

/*FUNCIÓN PARA RENDERIZAR EN EL DOM LOS PRODUCTOS EN LA LISTA DE PRODUCTOS 
  POR MEDIO DE FOREACH Y UTILIZANDO FRAGMENT*/
const pintarPruductos =(data)=>{
    data.forEach(el => {
        let producto = document.createElement('div');
        producto.classList.add('card');
        producto.innerHTML=`
        <img src="${el.imagen}" width="200px"alt="${el.nombre}">
        <h4>${el.nombre}</h4>
        <p class="descripcion">${el.descripcion}</p>
        <p id="precio">${el.precio}</p>
        <span class="btn-agregar" data-id="${el.id}">Agregar</span>`
        $fragment.appendChild(producto);
    });
    $menu.appendChild($fragment);
}

/*FUNCION QUE VA AGREGANDO LOS PRODUCTOS AL OBJETO CARRITO, QUE LLAMA LA FUNCION
  PARA MOSTRAR EL MENSAJE CUANDO SE AGREGA UN PRODUCTO Y QUE AL FINAL
   LLAMA LA FUNCION QUE RENDERIZA EL CARRITO EN EL DOM*/
const llenarCarrito = () =>{
     document.addEventListener("click",(e)=>{
       if(e.target.classList.contains('btn-agregar')){
         console.log(e.target.parentElement);
         mostrarMensaje();
         //SI EL PRODUCTO YA EXISTE EN EL CARRITO SOLO SE MODIFICA LA CANTIDAD
         if(carrito[e.target.dataset.id]){
            carrito[e.target.dataset.id].cantidad = carrito[e.target.dataset.id].cantidad + 1
         console.log(carrito);
         pintarCarrito(carrito);
         return
       }
       //SI EL PRODUCTO AUN NO ESTA EN EL CARRITO SE CREA EL OBJETO Y SE AGREGA AL OBJETO CARRITO
         let elcarrito = {
            id: e.target.dataset.id,
            nombre: e.target.parentElement.querySelector('h4').textContent,
            precio: e.target.parentElement.querySelector('#precio').textContent,
            cantidad: 1
         }
         console.log(elcarrito);
         carrito[e.target.dataset.id] = {...elcarrito};
         console.log(carrito);
         pintarCarrito(carrito);
         }
     });
}

//FUNCION QUE RENDERIZA EN EL DOM LOS PRODUCTOS OBTENIDOS EN EL ARCHIVO JSON
const pintarCarrito = (carrito) =>{
    $carrito.textContent="";
    pintarTotales(carrito);
    Object.values(carrito).forEach(el=>{
        let elemcarrito = document.createElement('tr');
          elemcarrito.innerHTML=`
          <td class="col-1">${el.id}</td>
          <td class="col-2">${el.nombre}</td>
          <td class="col-3 td-btns" ><span data-id="${el.id}"class="btn mas">+</span><span data-id="${el.id}"class="btn menos">-</span></td>
          <td class="col-4">${el.cantidad}</td>
          <td class="col-5">${parseInt(el.precio)*el.cantidad}</td>`
          $fragment.appendChild(elemcarrito);
       });
       $carrito.appendChild($fragment);      
}

//FUNCIÓN PARA ACTIVAR LOS BOTONES DE AGREGAR Y DISMINIR PRODUCTOS EN EL CARRITO
const modificarCarrito = () =>{
    document.addEventListener("click",(e)=>{
        if(e.target.classList.contains('mas')){
            if(carrito[e.target.dataset.id]){
                carrito[e.target.dataset.id].cantidad = carrito[e.target.dataset.id].cantidad + 1
             console.log(carrito);
             pintarCarrito(carrito);
            }
            return
        }
        if(e.target.classList.contains('menos')){
            if(carrito[e.target.dataset.id]){
                carrito[e.target.dataset.id].cantidad = carrito[e.target.dataset.id].cantidad - 1
             console.log(carrito);
             if(carrito[e.target.dataset.id].cantidad<1){
                delete carrito[e.target.dataset.id];
             }
             pintarCarrito(carrito);
            }
    }});
}

//FUNCION PARA SUMAR LOS TOTALES DE PRODUCTOS Y PRECIOS AGREGADOS EN EL CARRITO
const pintarTotales =(carrito) =>{
    $totales.textContent="";
    /*SI EL CARRITO ESTA VACIO SE DESPLIEGA UN MENSAJE QUE LO INDICA Y TAMBIEN 
      QUITA EL CONTADOR DEL BOTON CARRITO*/
    if(Object.keys(carrito).length===0){
        document.querySelector('.titulos').style.opacity="0";
        $totales.innerHTML="<h2>El carrito esta vacio, comienza a comprar!!</h2>"
        document.getElementById('contadorCarrito').classList.remove('contador-carrito');
        document.getElementById('contadorCarrito').textContent="";
        return }
    //SE RENDERIZA LA SUMA DE LOS TOTALES DE PRODUCTOS Y PRECIO    
    document.querySelector('.titulos').style.opacity="1";
    const totalcantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0);
    console.log(totalcantidad);
    const totalprecio = Object.values(carrito).reduce((acc,{cantidad,precio})=>acc+cantidad*precio,0);
    console.log(totalprecio);
    $totales.innerHTML=`<hr><p class="suma-totales"><b>No. Productos:</b> ${totalcantidad} <b>Total: </b>$${totalprecio} </br> <span class="btn-vaciar">Vaciar Carrito</> </p>`
    //SE AGREGA EL CONTADOR DE PRODUCTOS EN EL BOTON CARRITO
    document.getElementById('contadorCarrito').classList.add('contador-carrito');
    document.getElementById('contadorCarrito').textContent=totalcantidad;
}

//FUNCIÓN PARA VACIAR EL CARRITO
const vaciarCarrito = () =>{
    document.addEventListener("click", (e)=>{
     if(e.target.classList.contains('btn-vaciar')){
        carrito={};
        pintarCarrito(carrito);
     }
    });
}

/*FUNCIÓN PARA CAMBIAR LOS ICONOS DEL BOTON CARRITO EN EL EVENTO CLICK POR MEDIO DE
  CLASES EN CSS*/
const toggleCarrito =()=>{
   document.addEventListener("click", e =>{
    if(e.target.classList.contains('btn-carrito')){
        document.querySelector('main').style.display="none";
        document.querySelector('section').style.display="inline-block";
        e.target.classList.add('btn-cerrar');
        e.target.classList.remove('btn-carrito');
        return;     
    }
    if(e.target.classList.contains('btn-cerrar')){
        document.querySelector('main').style.display="inline-block"; 
        document.querySelector('section').style.display="none";
        e.target.classList.add('btn-carrito');
        e.target.classList.remove('btn-cerrar');     
    }
   });
}

//FUNCION PARA DESPLEGAR LAS SECCIONES DE LA LISTA DE PRODUCTOS Y CARRITO SI NO ESTAN DESPLEGADAS
const desplegarproductos = () =>{
    if(document.getElementById("principal").style.display="none"){
    document.getElementById("principal").style.display="inline-block";
    }
    if(document.getElementById("seccion").style.display="none"){
     document.getElementById("seccion").style.display="inline-block";
    }
    }

//FUNCION PARA MOSTRAR EL MENSAJE DE PRODUCTO AGREGADO AL CARRITO CON EXITO    
const mostrarMensaje =()=>{
    const msj = document.getElementById("mensaje");
    msj.classList.add('mensaje-exitoso');
    const parrafo = document.createElement('p');
    parrafo.textContent="El producto se agrego al carrito!";
    msj.appendChild(parrafo);
    setTimeout(()=>{
    msj.classList.remove('mensaje-exitoso');
    parrafo.remove();
    },1000)
}

//FUNCION QUE DESPLIEGA EL BOTON DE REGRESAR CUANDO EL SCROLL LLEGA A 400PX
document.addEventListener("scroll",()=>{
    const botonReg =document.getElementById('regresar');
    if(document.documentElement.scrollTop>400){    
        botonReg.classList.add('btn-regresar');
    }else{
        botonReg.classList.remove('btn-regresar');
    }
})

//FUNCION DEL BOTON PARA REGRESAR EL SCROLL A CERO
document.addEventListener("click",(e)=>{
   if(e.target.classList.contains('btn-regresar')){
       document.documentElement.scrollTo({
        behavior:"smooth",
        top:0
       })
   }
})

/*FUNCION PARA DETECTAR EL MATCHMEDIA CUANDO SE AGRANDA LA PANTALLA Y VOLVER A DESPLEGAR 
  LAS SECCIONES DE LA LISTA DE PRODUCTOS Y EL CARRITO*/    
const x = window.matchMedia("(max-width:577px)");
function myFunction(x){
             if(x.matches){
               desplegarproductos();
             }
}

getData();
llenarCarrito();
modificarCarrito();
pintarTotales(carrito);
vaciarCarrito();
toggleCarrito();
myFunction(x);
x.addListener(myFunction);
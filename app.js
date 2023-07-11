    // DOM API
    // Obtenemos las etiquetas video y canvas de el html
let video = document.querySelector('.video-source');
let canvas = document.querySelector('#canvas')

    //Es como dibujamos en canvas
let context = canvas.getContext('2d')

let imagenCargada;
let botonFoto = document.querySelector('#boton-foto')

redimensionarelCavas()
solicitarPermisosCamara()
cargarImagen()
dibujar()
enlistarCamaras()


botonFoto.addEventListener('click', function(ev){
    let url = canvas.toDataURL('image/jpeg')
    let a = document.createElement('a')
    a.href = url
    a.innerHTML = "Descargar"
    a.download = 'Proyecto.jpg'
    a.click()

})

function redimensionarelCavas() {
    let camara = document.querySelector('.camara')
    canvas.width = camara.clientWidth
    canvas.height = camara.clientHeight
}


async function enlistarCamaras() {
    let camarasDisponibles = await navigator.mediaDevices.enumerateDevices()
    camarasDisponibles = camarasDisponibles.filter(divice => divice.kind === 'videoinput')
        let select = document.createElement("select")
        camarasDisponibles.forEach(camara =>{
        let option = document.createElement("option")
        console.log(camara);
        option.innerHTML = camara.label
        option.value = camara.diveceId
        select.appendChild(option)
        })

        select.addEventListener("change", function(ev){
            solicitarPermisosCamara(select.value)
        })
    document.querySelector('body').appendChild(select)
}


// Solicita permisos para el uso de la camara y audio
async function solicitarPermisosCamara(deviceId) {

    let constraints = {};
    if(deviceId){
        constraints = {
            video: { deviceId: deviceId}
        }
    }else{
        constraints = { video: true}
    }


    //getUserMedia
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    //API de video
    // Decimos que el stream sera la fuente de datos para el elemento video
    video.srcObject = mediaStream
    //Reproducir el video con Js
    video.play()
}

async function cargarImagen() {
    let image = document.createElement('img') //<img src="frame.png" alt="">
    image.src = 'frame.png'
    await image.decode()
    //Guardo la imagen en la variable
    imagenCargada = image
    
}


function dibujar() {
    //context.drawImage(video, 0, 0,canvas.width,canvas.height)
    drawImageProp(context, video);

    if(imagenCargada){
        context.drawImage(imagenCargada,0,0,canvas.width,canvas.height)
    }

    requestAnimationFrame(dibujar)
}


  /**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
*/
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.videoWidth,
      ih = img.videoHeight,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,   // new prop. width
      nh = ih * r,   // new prop. height
      cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

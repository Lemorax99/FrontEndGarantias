import ImageTools from '@/utils/ImagenTools'

export const ReSize = (arArchivos) => {
    let arArchRenombrados = [];
    arArchivos.forEach((foto, c) => {
        ImageTools.resize(foto, {
            width: 512,
            height: 512
        }, function (blob, didItResize) {
            var file = new File([blob], 'Foto-' + Date.now() + '-' + c + '.' + foto.type.split("/")[1], { type: foto.type });
            arArchRenombrados.push(file)
        })
    });
    return arArchRenombrados;
}

export const ImagenBase64 = (arArchivos) => {
    const arFotos = [];
    const arLectores = [];
    arArchivos.forEach((file, f) => {
        arLectores[f] = new FileReader();
        arLectores[f].onloadend = (e) => {
            arFotos.push(arLectores[f].result)
        }
        arLectores[f].readAsDataURL(arArchivos[f]);
    });
    return arFotos;
}

export const ToFile = (imagenes) => {
    const arFiles = [];
    imagenes.forEach(img => {
        fetch(img).then(res => res.blob()).then(blob => {
            const file = new File([blob], "File name",{ type: "image/png" })
            arFiles.push(file);
        })
    });
    return arFiles;
}



export default {
    ReSize,
    ImagenBase64,    
    ToFile
}
export default function (t){
    let type;
    if(+t === 1){
        type = "Price asc"
    }
    else if(+t === 2){
        type = "Price desc"
    }
    else if(+t === 3){
        type = "DateUpload asc"
    }
    else{
        type = "DateUpload desc"
    }

    return type;
}
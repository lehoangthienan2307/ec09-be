import distance from 'google-distance';


const getDistance = async (address, ward, district, province) => {
    const des= `${address}, ${ward}, ${district}, ${province}`
    distance.apiKey = "AIzaSyD_seiLom04fD_r8FSfrSmNFaIiZa7qk80"
    const result = distance.get(
        {	
            origin: "227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh", 
            destination: des,
            mode: 'driving',
            units: 'metric'
        }, 
        function(err, data) { 
            if (err) {
                console.error(err);
                return res.status(500).json({msg: err.message});
            }
            console.log(data);
            const shippingDistance = Math.round(data.distanceValue/1000);
            return shippingDistance

    })


    return result
}

export {
    getDistance
}
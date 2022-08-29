import db from '../utils/db.js'

export default {
    async getProvinces() {
        const result = await db('tinh').select();
        return result || null;
    },

    async getDistricts(tinhid) {
        const result = await db('quan')
            .join('tinh', 'tinh.TinhID', 'quan.TinhID')
            .where({
                'quan.TinhID': tinhid
            }).select();
        return result || null;
    },

    async getWards(tinh, quan) {
        const result = await db('phuong')
            .join('quan', 'quan.QuanID', 'phuong.QuanID')
            .join('tinh', 'tinh.TinhID', 'quan.TinhID')
            .where({
                'tinh.TinhID': tinh,
                'quan.QuanID': quan
            })
            .select(
                'phuong.PhuongID',
                'phuong.name'
            );
        return result || null;
    },


    async getProvinceById(provinceId) {
        const result = await db('tinh').where({
            'TinhID': provinceId
        }).select();
        return result[0] || null;
    },

    async getDistrictById(districtId) {
        const result = await db('quan').where({
            'QuanID': districtId
        }).select();
        return result[0] || null;
    },

    async getWardById(wardId) {
        const result = await db('phuong').where({
            'PhuongID': wardId
        }).select();
        return result[0] || null;
    },
}
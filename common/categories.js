export default {
    dataExpense: [
        {
            title: 'Ăn/Uống', data: [
                { icon: require('@/assets/Image/breakfast.png'), name: 'Ăn tiệm', type: 'expense' },
                { icon: require('@/assets/Image/coffee-cup.png'), name: 'Cafe', type: 'expense' },
                { icon: require('@/assets/Image/beer.png'), name: 'Ăn nhậu', type: 'expense' },
            ]
        },
        {
            title: 'Con cái', data: [
                { icon: require('@/assets/Image/toys.png'), name: 'Đồ chơi', type: 'expense' },
                { icon: require('@/assets/Image/money.png'), name: 'Học phí', type: 'expense' },
                { icon: require('@/assets/Image/open-book.png'), name: 'Sách vở', type: 'expense' },
                { icon: require('@/assets/Image/milk.png'), name: 'Sữa', type: 'expense' },
                { icon: require('@/assets/Image/money.png'), name: 'Tiền tiêu vặt', type: 'expense' },
            ]
        },
        {
            title: 'Dịch vụ sinh hoạt', data: [
                { icon: require('@/assets/Image/idea.png'), name: 'Điện', type: 'expense' },
                { icon: require('@/assets/Image/cellular.png'), name: 'Điện thoại cố định', type: 'expense' },
                { icon: require('@/assets/Image/smartphone.png'), name: 'Điện thoại di dộng', type: 'expense' },
                { icon: require('@/assets/Image/fire.png'), name: 'Gas', type: 'expense' },
                { icon: require('@/assets/Image/wifi.png'), name: 'Internet', type: 'expense' },
                { icon: require('@/assets/Image/drop.png'), name: 'Nước', type: 'expense' },
                { icon: require('@/assets/Image/television.png'), name: 'Truyền hình', type: 'expense' },

            ]
        },
        {
            title: 'Đi lại', data: [
                { icon: require('@/assets/Image/car-insurance.png'), name: 'Bảo hiểm xe', type: 'expense' },
                { icon: require('@/assets/Image/parking.png'), name: 'Gửi xe', type: 'expense' },
                { icon: require('@/assets/Image/car-wash.png'), name: 'Rửa xe', type: 'expense' },
                { icon: require('@/assets/Image/car-lift.png'), name: 'Sửa chữa, bảo dưỡng xe', type: 'expense' },
                { icon: require('@/assets/Image/taxi.png'), name: 'Taxi/ thuê xe', type: 'expense' },
                { icon: require('@/assets/Image/gas.png'), name: 'Xăng xe', type: 'expense' },
            ]
        },
        {
            title: 'Hiếu hỉ', data: [
                { icon: require('@/assets/Image/gift.png'), name: 'Biếu tặng', type: 'expense' },
                { icon: require('@/assets/Image/birthday-cake.png'), name: 'Sinh nhật', type: 'expense' },
                { icon: require('@/assets/Image/rings.png'), name: 'Cưới xin', type: 'expense' },
            ]
        },
        {
            title: 'Hưởng thụ', data: [
                { icon: require('@/assets/Image/world.png'), name: 'Du lịch', type: 'expense' },
                { icon: require('@/assets/Image/lipstick.png'), name: 'Làm đẹp', type: 'expense' },
                { icon: require('@/assets/Image/lipstick.png'), name: 'Mỹ phẩm', type: 'expense' },
                { icon: require('@/assets/Image/popcorn.png'), name: 'Phim ảnh, ca nhạc', type: 'expense' },
            ]
        },
        {
            title: 'Sức khoẻ', data: [
                { icon: require('@/assets/Image/stethoscope.png'), name: 'Khám, chữa bệnh', type: 'expense' },
                { icon: require('@/assets/Image/medicine.png'), name: 'Thuốc men', type: 'expense' },
            ]
        },
        {
            title: 'Trang phục', data: [
                { icon: require('@/assets/Image/shoe.png'), name: 'Giày, dép', type: 'expense' },
                { icon: require('@/assets/Image/tshirt.png'), name: 'Quần, áo', type: 'expense' },
                { icon: require('@/assets/Image/tie.png'), name: 'Phụ kiện khác', type: 'expense' },
            ]
        },

    ],
    dataIncome: [
        { icon: require('@/assets/Image/bonus.png'), name: 'Tiền thưởng', type: 'income' },
        { icon: require('@/assets/Image/salary.png'), name: 'Lương', type: 'income' },
        { icon: require('@/assets/Image/gift.png'), name: 'Được tặng', type: 'income' },
        { icon: require('@/assets/Image/sale.png'), name: 'Bán đồ', type: 'income' },
        { icon: require('@/assets/Image/money.png'), name: 'Khoản khác', type: 'income' },
    ],
    dataLentBorrow: [
        { icon: require('@/assets/Image/offer.png'), name: 'Đi vay', type: 'lend' },
        { icon: require('@/assets/Image/save-money.png'), name: 'Cho vay', type: 'borrow' },
    ]
}

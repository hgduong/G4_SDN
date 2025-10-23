import React from 'react'
import { useNavigate } from 'react-router-dom'
import roomNormal from '../assets/image/roomnormal.png';
import roomVip from '../assets/image/roomvip.png';
import tournament from '../assets/image/tournamentroom.png';
import stream from '../assets/image/stream.png';
import couple from '../assets/image/couple.png';
import  '../assets/style/productcard.css'
const RoomComponent = () => {
    const navigate = useNavigate();
  return (
    <div className='product-card'>
        <div className='item-card'>
            <h2>Phòng thường</h2>
            <img src={roomNormal} alt="Room" />
            <h3>Giá: 5.000 VND/giờ</h3>
            <div>Trạng thái: Còn 10 máy</div>
            <div>Máy cấu hình cao, ghế gaming, tai nghe chất lượng</div>
            <div><button onClick={() => navigate('/cau-hinh-may')}>Xem cấu hình máy</button></div>
            <div><button onClick={() => navigate('/chon-may')}>Chọn máy</button></div>
        </div>
        <div className='item-card'>
            <h2>Phòng VIP</h2>
            <img src={roomVip} alt="Room" />
            <h3>Giá: 10.000 VND/giờ</h3>
            <div>Trạng thái: Còn 15 máy</div>
            <div>Máy cực mạnh, màn hình lớn, ghế cao cấp</div>
            <div>Dành cho game thủ chuyên nghiệp hoặc streamer</div>
            <div><button onClick={() => navigate('/cau-hinh-may')}>Xem cấu hình máy</button></div>
            <div><button onClick={() => navigate('/chon-may')}>Chọn máy</button></div>
        </div>
        <div className='item-card'>
            <h2>Phòng thi đấu</h2>
            <img src={tournament} alt="Room" />
            <h3>Giá: 20.000 VND/giờ</h3>
            <div>Trạng thái: Còn 10 máy</div>
            <div>Thiết kế theo tiêu chuẩn thi đấu eSports</div>
            <div>Có hệ thống livestream, âm thanh ánh sáng chuyên nghiệp</div>
            <div><button onClick={() => navigate('/cau-hinh-may')}>Xem cấu hình máy</button></div>
            <div><button onClick={() => navigate('/chon-may')}>Chọn máy</button></div>
        </div>
        <div className='item-card'>
            <h2>Phòng stream cá nhân</h2>
            <img src={stream} alt="Room" />
            <h3>Giá: 15.000 VND/giờ</h3>
            <div>Trạng thái: Còn 30 máy</div>
            <div>Dành cho streamer hoặc content creator</div>
            <div>Có webcam, mic, đèn livestream, cách âm tốt</div>
            <div><button onClick={() => navigate('/cau-hinh-may')}>Xem cấu hình máy</button></div>
            <div><button onClick={() => navigate('/chon-may')}>Chọn máy</button></div>
        </div>
        <div className='item-card'>
            <h2>Phòng máy đôi</h2>
            <img src={couple} alt="Room" />
            <h3>Giá: 13.000 VND/giờ</h3>
            <div>Trạng thái: Còn 10 máy</div>
            <div>Phòng dành cho cặp đôi</div>
            <div>Máy đặt cạnh nhau, cấu hình mạnh</div>
            <div><button onClick={() => navigate('/cau-hinh-may')}>Xem cấu hình máy</button></div>
            <div><button onClick={() => navigate('/chon-may')}>Chọn máy</button></div>
        </div>
       
    </div>
  )
}

export default RoomComponent
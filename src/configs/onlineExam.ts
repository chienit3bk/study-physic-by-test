export const EXAM_OPTIONS = [
  { 'label': 'Tổng hợp', 'value': 'Tổng hợp' },
  { 'label': 'Kiểm tra theo chương', 'value': 'Kiểm tra theo chương' },
  { 'label': 'Kiểm tra chi tiết theo dạng', 'value': 'Kiểm tra chi tiết theo dạng' },
  { 'label': 'Chương 5: Sóng ánh sáng', 'value': 'Chương 5: Sóng ánh sáng' },
];

export const CHAPTERS = [
  {
    id: 1,
    name: 'Dao động cơ',
    options: [
      'Dao động điều hòa',
      'Con lắc lò xo',
      'Con lắc đơn',
      'Dao động tắt dần - Dao động cưỡng bức',
      'Tổng hợp các dao động điều hòa',
    ],
  },
  {
    id: 2,
    name: 'Sóng cơ và sóng âm',
    options: [
      'Sóng cơ và sự truyền sóng cơ',
      'Giao thoa sóng',
      'Sóng dừng',
      'Sóng âm',
    ],
  },
  {
    id: 3,
    name: 'Dòng điện xoay chiều',
    options: [
      'Đại cương về dòng điện xoay chiều',
      'Các loại điện xoay chiều',
      'Mạch có R, L, C mắc nối tiếp',
      'Công suốt của mạch điện xoay chiều',
      'Truyền tải điện năng, máy biến áp',
      'Máy phát điện, động cơ điện',
    ],
  },
  {
    id: 4,
    name: 'Dao động điện từ',
    options: [
      'Mạch dao động',
      'Điện từ trường, sóng điện từ, truyền thông',
    ],
  },
  {
    id: 5,
    name: 'Sóng ánh sáng',
    options: [
      'Tán sắc ánh sáng',
      'Nhiều xạ ánh sáng, giao thoa ánh sáng',
      'Quang phổ',
      'Tia hồng ngoại, tia tử ngoại, tia X',
    ],
  },
  {
    id: 6,
    name: 'Lượng tử ánh sáng',
    options: [
      'Hiện tượng quang điện, thuyết lượng tử ánh sáng',
      'Mẫu nguyên tử Bo',
    ],
  },
  {
    id: 7,
    name: 'Vật lý hạt nhân',
    options: [
      'Tính chất của cấu tạo hạt nhân',
      'Năng lượng liên kết, phản ứng hật nhân',
      'Phóng xạ',
      'Phản ứng phân hạch, phản ứng nhiệt hạch',
    ],
  },
];

export const EXAM_TIME = [
  3000,
  2400,
  1800,
  1200,
  900,
  600,
];

export default {};

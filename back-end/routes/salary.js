const express = require('express');
const { Salary } = require('../models/salary')
const { Timekeeping } = require('../models/timekeeping');
const { User } = require('../models/user');
const { search } = require('./tickets');
const payroll = require('./utils/payroll');
const router = express.Router()

router.get('/', async (req, res) => {

  // nếu có tháng thì lấy tháng, nếu ko thì lấy tháng hiện tại
  let year = req.query.year ? parseInt(req.query.year) : 2021
  let month = req.query.month ? parseInt(req.query.month) : 12

  // nếu ngày tháng vượt quá ngày hiện tại
  if (new Date(year, month - 1 ) > new Date()) {
    console.log(new Date(year, month - 1));
    console.log(new Date());
    return res.status(400).send(`Hiện tại mới chỉ là tháng ${new Date().getMonth() + 1}`)
  } 

  // nếu query theo tên, 
  if (req.query.name) {
    // tháng phải khác tháng hiện tại thì mới lấy trong bảng vì tháng hiện tại vẫn cập nhật
    // console.log(year, month)
    if (month != parseInt(new Date().getMonth())) {
      let salary = await Salary.find({
        name: new RegExp(`.*${req.query.name}.*`, 'i'),
        month: month + 1,
        year: year
      })

      console.log(salary)
      // nếu tìm được lương trong bảng lương thì lấy luôn
      if (salary.length != 0) return res.send(salary[0])
    }

    console.log(1111)

    const timekeepings = await Timekeeping
      .find()
      .populate({
        path: 'user_id',
        match: {
          name: new RegExp(`.*${req.query.name}.*`, 'i')
        },
        select: 'name coefficients_salary -_id'
      })
    // console.log(timekeepings)
    let time = 0
    let coefficients_salary = 0
    let name = ''
    for (let i in timekeepings) {
      // xét xem có đúng tên hay không
      if (timekeepings[i].user_id) {
        name = timekeepings[i].user_id.name
        coefficients_salary = timekeepings[i].user_id.coefficients_salary
        if (new Date(year, month, 1, 7) <= timekeepings[i].start_time &&
          new Date(year, month, 30, 7) > timekeepings[i].start_time)
          time += timekeepings[i].end_time - timekeepings[i].start_time
      }
    }

    time = time / 1000 / 60 / 60
    salary = time * coefficients_salary

    // lưu lại bảo bảng salary để lần sau k cần tính
    const new_salary = new Salary({ name: name, salary: salary, time: time, coefficients_salary: coefficients_salary, month: month + 1, year: year })
    await new_salary.save()

    return res.status(200).json({ name: name, salary: salary, time: time, coefficients_salary: coefficients_salary, month: month + 1, year: year })
  }


  console.log(month, year)

  let salary = await Salary.find({ month: month, year: year })
  // console.log(salary)
  // Nếu tìm thấy trong bảng salary đã tính rồi thì trả về kết quả luôn
  if (salary.length != 0) {
    return res.send(salary)
  }

  const users = await User.find();

  const timekeepings = await Timekeeping
    .find()
    .and([{ start_time: { $gte: new Date(year, month - 1, 1, 7) } }, { end_time: { $lte: new Date(year, month, 1, 7) } }])
    .populate({
      path: 'user_id',
    })

  console.log((timekeepings.length))
  let nowMonth = new Date(new Date().getFullYear(), new Date().getMonth())
  let searchMonth = new Date(year, month - 1)

  let result = []
  for (let key in users) {
    if (!users[key].isAdmin) {
      let user = users[key]
      // console.log(users)
      result.push({ name: user.name, time: 0, salary: 0, coefficients_salary: user.coefficients_salary, month: month, year: year })
      for (let ind_tk in timekeepings) {
        // console.log(timekeepings[ind_tk])
        if (timekeepings[ind_tk].user_id) {
          if (String(timekeepings[ind_tk].user_id._id) == String(user._id)) {
            result[result.length - 1].time += timekeepings[ind_tk].end_time - timekeepings[ind_tk].start_time
          }
        }
      }
      result[result.length - 1].time = (result[result.length - 1].time / 1000 / 60 / 60).toFixed(2)
      result[result.length - 1].salary = (result[result.length - 1].time * user.coefficients_salary).toFixed(2)
      // lưu vào db, ko phải là tháng hiện tại thì mới lưu
      if (searchMonth < nowMonth) {
        salary = new Salary(result[result.length - 1])
        await salary.save()
      }

    }
  }

  return res.status(200).send(result)

  // res.send(timekeepings)
})

module.exports = router
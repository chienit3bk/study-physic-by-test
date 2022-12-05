const { Revenue, validate } = require('../models/revenue')
const mongoose = require('mongoose');
const _ = require('lodash')
const express = require('express');
const router = express.Router();

// tinh doanh thu nhập vào ngày tháng
router.get('/', async (req, res) => {
  if (!req.query.day && !req.query.month) {
    // return res.status(400).send('No day, month')
    const result = []
    for (let month of [...Array(6).keys()]) {
      let firstDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 7)
      firstDate.setMonth(firstDate.getMonth() - month)
      let endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 7)
      endDate.setMonth(endDate.getMonth() - month)
      let revenues = await Revenue.find({
        time: {
          $gte: firstDate,
          $lt: endDate,
        }
      });

      let revenue = 0
      let day_ticket = 0
      let month_ticket = 0
      for (const i in revenues) {
        revenue = revenue + revenues[i].revenue
        if (revenues[i].ticket_type == "ngay") day_ticket += 1
        else month_ticket += 1
      }
      result.push({ revenue: revenue, month: firstDate.getMonth() + 1, year: firstDate.getFullYear(), day_ticket: day_ticket, month_ticket: month_ticket })
    }

    return res.send(result)

  }

  let month = req.query.month ? parseInt(req.query.month) - 1 : (new Date().getMonth())
  let year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear()

  if (new Date(year, month) > new Date()) return res.status(400).send(`Hiện tại mới chỉ là tháng ${new Date().getMonth() + 1}`)
  let revenues = []

  if (req.query.day) {
    let day = parseInt(req.query.day)
    revenues = await Revenue.find({
      time: {
        $gte: new Date(new Date().getFullYear(), month, day, 7),
        $lt: new Date(new Date().getFullYear(), month, day + 1, 7),
      }
    });
  }
  else {
    revenues = await Revenue.find({
      time: {
        $gte: new Date(year, month, 1, 7),
        $lt: new Date(year, month + 1, 1, 7),
      }
    });
  }
  let revenue = 0
  let day_ticket = 0
  let month_ticket = 0
  for (const i in revenues) {
    revenue = revenue + revenues[i].revenue
    if (revenues[i].ticket_type == "ngay") day_ticket += 1
    else month_ticket += 1
  }

  return res.send({ revenue: revenue, month: month + 1, year: year, day_ticket: day_ticket, month_ticket: month_ticket });
});

// thống kê số lượng vé tháng vé ngày
router.get('/statistic', async (req, res) => {
  // if (!req.query.day && !req.query.month) {
  //   return res.status(400).send('No day, month')
  // }

  let month = req.query.month ? parseInt(req.query.month) - 1 : (new Date().getMonth())
  let year = req.query.year ? parseInt(req.query.year) : (new Date().getFullYear())
  let day = req.query.day ? parseInt(req.query.day) : null

  if (day) {
    if (new Date(year, month, day) > new Date()) {
      console.log(new Date(year, month, day));
      console.log(new Date());

      return res.status(400).send(`Hiện tại mới chỉ là ngay ${new Date().getDate()}`)
    }
    revenues = await Revenue.find({
      time: {
        $gte: new Date(year, month, day, 7),
        $lt: new Date(year, month, day + 1, 7),
      }
    });
  }
  else {
    if (new Date(year, month) > new Date()) return res.status(400).send(`Hiện tại mới chỉ là tháng ${new Date().getMonth() + 1}`)
    revenues = await Revenue.find({
      time: {
        $gte: new Date(year, month, 1, 7),
        $lt: new Date(year, month, 30, 7),
      }
    });
  }

  let day_ticket = 0
  let month_ticket = 0
  for (const i in revenues) {
    if (revenues[i].ticket_type == "ngay") day_ticket += 1
    else month_ticket += 1
  }

  res.json({ day_ticket: day_ticket, month_ticket: month_ticket, day: day, month: month + 1, year: year })
})


// tạo doanh thu, chưa dùng
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let revenue = new Revenue({
    time: Date.now() + 7 * 60 * 60 * 1000,
    revenue: req.body.revenue
  });

  await revenue.save()
  res.send(revenue)
})

module.exports = router

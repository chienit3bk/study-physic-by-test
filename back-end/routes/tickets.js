const { Ticket, validate, validateMonthTicket } = require('../models/ticket')
const { Revenue } = require('../models/revenue')
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const _ = require('lodash')
const express = require('express');
const router = express.Router();

// lấy tất cả các vé
router.get('/all', async (req, res) => {
  const tickets = await Ticket.find({ used: true })
  res.send(tickets);
});

// lấy các vé theo page
router.get('/:page', async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1

  const tickets = await Ticket
    .find({ used: true })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort('-time_in');
  res.send(tickets);
});

// lấy các vé ngày chưa được sử dụng
router.get('/unused', async (req, res) => {
  const tickets = await Ticket.findOne({ used: false, ticket_type: 'ngay' })
  if (!tickets) return res.status(400).send('Out of ticket')
  res.send(tickets)
})

// lấy vé theo biển số phục vụ soát vé đầu ra
router.get('/:license_plate', async (req, res) => {
  const ticket = await Ticket.findOne({ license_plate: req.params.license_plate });

  if (!ticket) return res.status(404).send('The genre with the given ID was not found.');

  res.send(ticket);
});

// lấy vé tháng, đầu vào là IDs là số chứng minh thư
router.get('/monthlyTicket/:IDs', async (req, res) => {
  const tickets = await Ticket.findOne({ IDs: req.params.IDs })
  if (!tickets) return res.status(400).send('Out of ticket')
  res.send(tickets)
})

// tạo 1 vé mới, tạo sẵn 100 cái rồi chỉ sử dụng 100 cái đó cho cả vé tháng vé ngày
router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  let ticket = new Ticket(_.pick(req.body, ['license_plate', 'ticket_type', 'vehicle_type', 'IDs']));

  ticket = await ticket.save();

  res.send(ticket);
});

// soát vé đầu vào cho vé ngày 
router.put('/in/:IDs', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ticket = await Ticket.findOne({ IDs: req.params.IDs })
  if (!ticket) return res.status(404).send('ID vé không hợp lệ')

  if (ticket.ticket_type == 'thang') return res.status(400).send('Vé này là vé tháng')
  if (ticket.used) return res.status(400).send('Vé đã được sử dụng')

  ticket.license_plate = req.body.license_plate,
    ticket.time_in = Date.now() + 7 * 60 * 60 * 1000,
    ticket.vehicle_type = req.body.vehicle_type,
    ticket.used = true

  console.log(ticket)
  await ticket.save()

  res.send(ticket);
});

// soát vé đầu ra vào cho vé ngày 
router.put('/out/:IDs', auth, async (req, res) => {
  const ticket = await Ticket.findOne({ IDs: req.params.IDs });

  if (!ticket) return res.status(404).send('ID vé không hợp lệ');

  if (!ticket.used) return res.status(400).send('Vé chưa soát vé đầu vào');

  if (ticket.ticket_type == 'ngay') {
    let license_plate = ticket.license_plate
    ticket.license_plate = "0"
    ticket.used = false

    await ticket.save()


    const day = new Date(Date.now() + 7 * 60 * 60 * 1000).getDate() - ticket.time_in.getDate()
    // console.log(typeof day)

    const unit_price = ticket.vehicle_type == 'xe may' ? 5000 : 3000

    const price = (day + 1) * unit_price

    const revenue = new Revenue({
      revenue: price,
      ticket_type: "ngay",
      vehicle_type: ticket.vehicle_type
    })
    await revenue.save()

    ticket._doc.time_out = new Date(Date.now() + 7 * 60 * 60 * 1000)
    ticket._doc.revenue = revenue.revenue
    ticket.license_plate = license_plate

    res.send(ticket);
  }
  else if (ticket.ticket_type == 'thang') {
    const revenue = new Revenue({
      revenue: 0,
      ticket_type: "thang",
      vehicle_type: ticket.vehicle_type
    })
    await revenue.save()

    let expiry_date = ticket.due_date - new Date()

    if (expiry_date < 0) return res.status(400).send('Yêu cầu gia hạn')

    ticket.used = false
    await ticket.save()

    expiry_date = new Date(expiry_date).getDate()
    // console.log(expiry_date)
    ticket._doc.expiry_date = expiry_date
    ticket._doc.time_out = new Date(Date.now() + 7 * 60 * 60 * 1000)
    res.send(ticket);
  }

});

router.put('/monthly_in/:IDs', async (req, res) => {

  let ticket = await Ticket.findOne({ IDs: req.params.IDs, ticket_type: "thang" });

  if (!ticket) return res.status(404).send('ID vé tháng không đúng');

  // if (ticket.used) return res.status(404).send('Vé đã được sử dụng')

  let expiry_date = ticket.due_date - new Date();

  if (expiry_date < 0) return res.status(400).send('Yêu cầu gia hạn')

  ticket.used = true
  ticket.time_in = new Date(Date.now() + 7 * 60 * 60 * 1000)
  await ticket.save()

  ticket._doc.expiry_date = parseInt(expiry_date / (24*60*60*1000))
  res.send(ticket);
});

router.put('/monthly_out/:IDs', async (req, res) => {

  const ticket = await Ticket.findOne({ IDs: req.params.IDs, ticket_type: "thang" });

  if (!ticket) return res.status(404).send('The monthly ticket with the given IDs was not found.');

  let expiry_date = ticket.due_date - new Date()

  if (expiry_date < 0) return res.status(400).send('Yêu cầu gia hạn')

  ticket.used = false

  // const expiry_date = ticket.due_date.getDate() - new Date().getDate()

  await ticket.save();
  ticket._doc.expiry_date = parseInt(expiry_date / (24*60*60*1000))

  res.send(ticket);
});

// gia hạn vé tháng
router.put('/renewal/:IDs', async (req, res) => {
  const ticket = await Ticket.findOne({ IDs: req.params.IDs, ticket_type: "thang" });

  if (!ticket) return res.status(404).send('The monthly ticket with the given IDs was not found.');

  if (req.body.renewal) {
    ticket.due_date = +new Date(ticket.due_date) + 7 * 60 * 60 * 1000 + 30 * 60 * 60 * 24 * 1000

    await ticket.save()

    const price = ticket.vehicle_type === 'xe may' ? 150000 : 50000

    const revenue = new Revenue({
      revenue: price,
      ticket_type: "thang",
      vehicle_type: ticket.vehicle_type
    })

    await revenue.save()

    res.send(ticket)
  }
  else {
    ticket.ticket_type = 'ngay'
    ticket.license_plate = '0'

    await ticket.save()

    res.send(ticket)
  }

})


// tạo vé tháng: kiểm tra IDs nếu vé ngày đang được sử dụng thì báo lỗi, nếu IDs đó là vé tháng thì báo lỗi, 
// IDs đúng khi used=false và ticket_type == ngày
router.put('/create_monthly_ticket/:IDs', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ticket = await Ticket.findOne({ IDs: req.params.IDs })
  if (!ticket) return res.status(400).send('IDs is not found')

  if (ticket.used || ticket.ticket_type == 'thang') return res.status(400).send('Ticket is used')

  ticket.license_plate = req.body.license_plate
  ticket.due_date = +new Date() + 7 * 60 * 60 * 1000 + 30 * 60 * 60 * 24 * 1000
  ticket.vehicle_type = req.body.vehicle_type
  ticket.ticket_type = 'thang'

  await ticket.save()

  const price = req.body.vehicle_type === 'xe may' ? 150000 : 50000

  const revenue = new Revenue({
    revenue: price,
    ticket_type: "thang",
    vehicle_type: ticket.vehicle_type
  })

  await revenue.save()

  res.send(ticket);
});

router.delete('/:id', async (req, res) => {
  const ticket = await Ticket.findByIdAndRemove(req.params.id);

  if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');

  res.send(ticket);
});

module.exports = router;


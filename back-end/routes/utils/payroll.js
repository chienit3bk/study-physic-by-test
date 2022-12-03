const schedule = require('node-schedule');
const { Timekeeping } = require('../../models/timekeeping');
const { User } = require('../../models/user');
const { Salary } = require('../../models/salary');

const job = schedule.scheduleJob('* * * 1 * *', async () => {
  console.log("Payroll");
  const now = new Date(new Date() - 3000);
  const year = now.getFullYear();
  const month = now.getMonth();

  const users = await User.find();

  const timekeepings = await Timekeeping
    .find()
    .and([{ start_time: { $gte: new Date(year, month, 1, 7) } }, { end_time: { $lte: new Date(year, month+1, 1, 7) } }])
    .populate({
      path: 'user_id',
    })

  console.log((timekeepings.length))

  let result = []
  for (let key in users) {
    if (!users[key].isAdmin) {
      let user = users[key]
      // console.log(users)
      result.push({ name: user.name, time: 0, salary: 0, coefficients_salary: user.coefficients_salary, month: month+1, year: year })
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

      const salary = new Salary(result[result.length - 1])
      await salary.save()
    }
  }
})

module.exports = job;
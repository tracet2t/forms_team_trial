const nodemailer = require('nodemailer');

// Function to send an email notification
const sendNotificationEmail = (todo) => {
  // Configure the email transporter inside the function
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lakshanans1121@gmail.com', 
      pass: '000000000' 
    }
  });

  const mailOptions = {
    from: 'lakshanans1121@gmail.com',
    to: 's92061078@ousl.lk',
    subject: 'Reminder: Task Due Soon',
    text: `Reminder: The task "${todo.title}" is approaching its due date (${todo.dueDate}).`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); 
    } else {
      console.log('Email sent:', info.response); 
    }
  });
};

module.exports = { sendNotificationEmail };

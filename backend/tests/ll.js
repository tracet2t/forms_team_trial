const nodemailer = require('nodemailer');
const { sendNotificationEmail } = require('../notification'); // Adjust the path as necessary

// Mock nodemailer
jest.mock('nodemailer');

describe('sendNotificationEmail', () => {
  let sendMailMock;

  beforeEach(() => {
    // Clear the mock email transporter before each test
    sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock
    });
  });

  it('should send an email notification for a given todo', () => {
    const todo = {
      title: 'Test Task',
      dueDate: '2024-08-31'
    };

    // Call the function to send the notification email
    sendNotificationEmail(todo);

    // Retrieve the sent email options
    const [mailOptions] = sendMailMock.mock.calls[0];

    // Assert that an email was sent
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    // Assert the email properties
    expect(mailOptions.to).toBe('s92061078@ousl.lk');
    expect(mailOptions.subject).toBe('Reminder: Task Due Soon');
    expect(mailOptions.text).toContain('Reminder: The task "Test Task" is approaching its due date (2024-08-31).');
  });

  it('should handle errors when sending email', () => {
    const todo = {
      title: 'Error Test Task',
      dueDate: '2024-08-31'
    };

    // Simulate an error
    sendMailMock.mockImplementationOnce((mailOptions, callback) => {
      callback(new Error('Simulated email error'));
    });

    // Call the function to send the notification email
    sendNotificationEmail(todo);

    // Assert that an email was attempted to be sent
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    // Optionally, you can check the console output or error handling code here
    // You may need to add specific checks based on how you handle errors in your code
  });
});

const sendMailMock = jest.fn((mailOptions, callback) => {
    if (mailOptions.text.includes('Simulated email error')) {
      callback(new Error('Simulated email error'));
    } else {
      callback(null, { response: 'Mock email sent' });
    }
  });
  
  const createTransport = jest.fn(() => ({
    sendMail: sendMailMock
  }));
  
  module.exports = {
    createTransport,
    sendMailMock
  };
  
import nodemailer from 'nodemailer'; 

export const sendOTP = async (email, otp) => {
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email,                     
    subject: "Your OTP Code",      
    text: `Hello, your OTP code is: ${otp}`, 
    
  };

  
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error:", err);
        reject(err); 
      } else {
        console.log("Email sent:", info.response);
        resolve(info); 
      }
    });
  });
};

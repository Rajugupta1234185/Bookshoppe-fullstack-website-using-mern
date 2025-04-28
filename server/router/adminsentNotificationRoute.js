const express = require('express');
const Usernotification = require('../schema/userNotificationSchema');
const Sellernotification= require('../schema/sellerNotificationSchema');
const nodemailer = require('nodemailer');
const UserComplaint= require('../schema/userComplaintSchema');
const User= require('../schema/userSchema');

require('dotenv').config({ path: './config.env' });
const notificationRouter = express.Router();

// POST route to store notification and send email
notificationRouter.post('/usernotification', async (req, res) => {
  const { email, title, message } = req.body;

  try {
    // Save the notification to MongoDB
    const newNotification = new Usernotification({ email, title, message });
    await newNotification.save();

    // Send email to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use any other email service you prefer
      auth: {
        user:process.env.EMAIL_USER,      // ✅ Replace with your admin email
        pass:process.env.PASSWORD     // ✅ Use App Password, not your actual email password
      }
    });

    const mailOptions = {
      from:process.env.EMAIL_USER,        // Same as above
      to: email,
      subject: 'New Notification from Online Bookstore',
      text: `Hello,\n\nYou have received a new notification from the admin:\n\nTitle: ${title}\nMessage: ${message}\n\nPlease check your account for more details.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Notification sent and email delivered successfully!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to send notification or email.',
      error: error.message
    });
  }
});

//to seller notification

notificationRouter.post('/sellernotification', async(req,res)=>{
    const{email,title,message}=req.body;

    try{
        const newNotification= new Sellernotification({email,title,message});
        await newNotification.save();
        
         // Send email to the user
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use any other email service you prefer
        auth: {
          user:process.env.EMAIL_USER,      // ✅ Replace with your admin email
          pass:process.env.PASSWORD     // ✅ Use App Password, not your actual email password
        }
      });
  
      const mailOptions = {
        from:process.env.EMAIL_USER,        // Same as above
        to: email,
        subject: 'New Notification from Online Bookstore',
        text: `Hello,\n\nYou have received a new notification from Online Bookstore:\n\nTitle: ${title}\nMessage: ${message}\n\nPlease check your account for more details.`
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        message: 'Notification sent and email delivered successfully!'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Failed to send notification or email.',
        error: error.message
      });
    }
})
//end of this block of code



//get usernotification
notificationRouter.post('/getusernotification', async (req, res) => {
    const { email } = req.body;
  
    try {
      const allNotifications = await Usernotification.find({ email });
  
     
  
      res.status(200).json({
        allNotifications // <-- Array of unseen notifications
      });
    } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
//end of this block of code



const jwt = require('jsonwebtoken');


notificationRouter.post('/sendusercomplaint', async (req, res) => {
  const { token, text } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.MYSECRETTOKENKEY); // Replace with your real secret
    const email = decoded.gmail;
    console.log(email);

   

    const newComplaint = new UserComplaint({
      email,
      text,
      status:'Not Reviewed'
    });

    await newComplaint.save();

         // Send email to the admin
         const transporter = nodemailer.createTransport({
            service: 'gmail', // or use any other email service you prefer
            auth: {
              user:process.env.EMAIL_USER,      // ✅ Replace with your admin email
              pass:process.env.PASSWORD     // ✅ Use App Password, not your actual email password
            }
          });
      
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '📩 New User Complaint Received',
            text: `Hello Admin,
          
          A new complaint has been submitted by: ${email}
          
          Complaint:
          "${text}"
          
          Please check the admin panel to take action.
          
          - Your System`
          };
          
      
          await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Complaint submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});
//end of this code block


///user complaint count
notificationRouter.post('/getusercomplaintcount', async (req, res) => {
  try {
    const usercomplaintcount = await UserComplaint.countDocuments({ status: "Not Reviewed" });
    res.status(200).json({ count: usercomplaintcount });
  } catch (error) {
    console.error('Error getting complaint count:', error);
    res.status(500).json({ message: 'Error getting complaint count' });
  }
});
//end of this block of code

//usercomplaint



notificationRouter.post('/getusercomplaint', async (req, res) => {
  try {
    // Step 1: Get complaints with status "Not Reviewed"
    const complaints = await UserComplaint.find({ status: "Not Reviewed" });

    // Step 2: Enrich each complaint with fname and lname from User collection
    const enrichedComplaints = await Promise.all(
      complaints.map(async (complaint) => {
        const user = await User.findOne({ gmail: complaint.email });

        return {
          id:complaint._id,
          email: complaint.email,
          text: complaint.text,
          status: complaint.status,
          createdAt: complaint.submittedAt,
          fname: user?.fname || 'Unknown',
          lname: user?.lname || 'User',
        };
      })
    );
    console.log(enrichedComplaints);
    res.status(200).json({enrichedComplaints}); // ✅ This wraps the array inside an object

  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//end of this block of code


//update status of user complaint
notificationRouter.post('/updatestatus', async (req, res) => {
  const { _id } = req.body;

  try {
    const updatedComplaint = await UserComplaint.findByIdAndUpdate(
      _id,
      { status: "Reviewed" },
      { new: true } // returns the updated document
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Status updated successfully", updatedComplaint });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
});

//end of this block of code

module.exports = notificationRouter;

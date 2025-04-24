const express = require('express');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const DemoSeller = require('../schema/demoSellerSchema');  // Import the DemoSeller model
const Seller = require('../schema/sellerSchema');  // Import the Seller model
const sellercomplaints = require('../schema/sellerComplaintSchema');

const demosellerfullinfo = express.Router();

// Get all demo sellers (data still in DemoSeller collection)
demosellerfullinfo.get('/demosellerfullinfo', async (req, res) => {
    try {
        const sellers = await DemoSeller.find();
        res.status(200).json({ message: "All demo sellers retrieved successfully", data: sellers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving demo sellers", error: error.message });
    }
});

// Update seller status (Approve or Reject) - Changing to PUT method
demosellerfullinfo.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value. Must be 'Approved' or 'Rejected'." });
    }

    try {
        // Find the demo seller by ID
        const demoSeller = await DemoSeller.findById(id);
        if (!demoSeller) {
            return res.status(404).json({ message: "DemoSeller not found" });
        }

        if (status === "Approved") {
            // Hash the password before saving the new seller
            const hashedPassword = await bcrypt.hash(demoSeller.password, 10); // 10 is the salt rounds

            // Move the demo seller data to the Seller collection
            const newSeller = new Seller({
                fname: demoSeller.fname,
                lname: demoSeller.lname,
                gender: demoSeller.gender,
                phone: demoSeller.phone,
                email: demoSeller.email,
                password: hashedPassword, // Save the hashed password
                store: demoSeller.store,
                address: demoSeller.address,
                gstin: demoSeller.gstin,
                bankname: demoSeller.bankname,
                account: demoSeller.account,
                ifsc: demoSeller.ifsc,
                status: "Approved",  // Set approved status
                approvedAt: Date.now()  // Add approval timestamp
            });

            // Save the new seller to the Seller collection
            await newSeller.save();
            console.log("data saved in main seller");

            // Delete the demo seller from the DemoSeller collection after approval
            await DemoSeller.findByIdAndDelete(id);
            console.log("data gets deleted after saved");

            return res.status(200).json({ message: "Seller approved and moved to Seller collection", data: newSeller });
        } else if (status === "Rejected") {
            // Delete the demo seller from the DemoSeller collection (rejecting them)
            await DemoSeller.findByIdAndDelete(id);

            return res.status(200).json({ message: "Seller rejected and deleted from DemoSeller collection", data: demoSeller });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating seller status", error: error.message });
    }
});


//sellercomplaints info
  demosellerfullinfo.post('/sellercomplaintcount', async (req,res)=>{
   try{
       const complaint =await sellercomplaints.countDocuments({status:"Not Reviewed"});
       res.status(200).json({ message: "All complaints retrieved successfully", data: complaint });
   }
   catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving seller complaint", error: error.message });
}
  });
//end

demosellerfullinfo.post('/getcomplaints', async (req, res) => {
    try {
        const complaints = await sellercomplaints.find({ status: "Not Reviewed" });

        // Assuming your seller model is imported as `Seller`
        const enrichedComplaints = await Promise.all(complaints.map(async (complaint) => {
            const seller = await Seller.findOne({ email: complaint.email });

            return {
                fname: seller.fname,
                lname: seller.lname,
                email: complaint.email,
                text: complaint.text
            };
        }));
         console.log(enrichedComplaints);
        res.send(enrichedComplaints);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



module.exports = demosellerfullinfo;

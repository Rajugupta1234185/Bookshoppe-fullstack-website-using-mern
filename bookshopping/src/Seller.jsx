import React, { useState,useEffect } from "react";
import './Seller.css';
import axios from 'axios';
import SellerComplaintModal from './SellerComplaintModal';
import Cookies from 'js-cookie';


const Seller = () => {

  //define cookies for token////

  const token=Cookies.get('token');
  //end of this block of code
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectDeletebook, setselectDeletebook]= useState(null);
  const [Booklist,setbooklist]=useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [bookData, setBookData] = useState({
    bookName: '',
    author: '',
    originalPrice: '',
    description: '',
    bookImageUrl: '',
    previewPageUrls: [],
    quantity: '',
    offer: '',
    categories: '',
    email:''
  });

  const [formData, setFormData] = useState({
    bookName:       '',
    author:         '',
    originalPrice:  '',
    description:    '',
    quantity:       '',
    email:'',
    offer:          '',
    categories:     '',
    bookImageUrl:   null,
    previewPageUrls: []    // <— make sure this is an array, not undefined
  });
  

  useEffect(() => {
    if (selectedBook) {
      setFormData({
        bookName:         selectedBook.bookName,
        author:           selectedBook.author,
        originalPrice:    selectedBook.originalPrice,
        description:      selectedBook.description,
        quantity:         selectedBook.quantity,
        offer:            selectedBook.offer,
        email:            selectedBook.email,
        categories:       selectedBook.categories,
        bookImageUrl:     null,
        previewPageUrls:  []    // <— still an array
      });
    }
  }, [selectedBook]);
// 3) Update your handlers to write into formData
const handleupdateChange = (e) => {
  const { name, value } = e.target;
  setFormData(fd => ({ ...fd, [name]: value }));
};
const handleFileChange = (e) => {
  const { name, files } = e.target;
  const fileData = name === 'previewPageUrls'
    ? Array.from(files)  // multiple-preview case
    : files[0];          // single-cover case

  if (addBook) {
    // We’re in Add-New-Book mode → write into bookData
    setBookData(prev => ({
      ...prev,
      [name]: fileData
    }));
  } else {
    // We’re in Update-Book mode → write into formData
    setFormData(prev => ({
      ...prev,
      [name]: fileData
    }));
  }
};



  const [addBook, setAddBook] = useState(false);
  const [updatebook, setUpdatebook] = useState(false);

  const Updatebook = async () => {
    setUpdatebook(!updatebook);
    const response = await axios.post('http://localhost:5000/api/addbook/getBooks',{token:token},{withCredentials:true});
    setBooks(response.data);
  };

  const addNewBook = () => {
    setAddBook(!addBook);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: value
    });
  };


  const cancelbook = () => {
    setAddBook(false);
  };

  const validateForm = () => {
    if (!bookData.bookName || !bookData.author || !bookData.originalPrice || !bookData.description || !bookData.quantity) {
      alert("Please fill out all required fields.");
      return false;
    }
    if (isNaN(bookData.originalPrice) || bookData.originalPrice <= 0) {
      alert("Please enter a valid original price.");
      return false;
    }
    if (isNaN(bookData.quantity) || bookData.quantity <= 0) {
      alert("Please enter a valid quantity.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token=Cookies.get('token');   
    
    console.log("💾 bookData.bookImageUrl (should be a File):", bookData.bookImageUrl);
console.log("💾 bookData.previewPageUrls (array):", bookData.previewPageUrls);


    const formData = new FormData();
    formData.append('token',token);
    formData.append('bookName', bookData.bookName);
    formData.append('author', bookData.author);
    formData.append('originalPrice', bookData.originalPrice);
    formData.append('description', bookData.description);
    formData.append('quantity', bookData.quantity);
    formData.append('offer', bookData.offer);
    formData.append('categories', bookData.categories);


   console.log("bookdataimageurl",formData.bookImageUrl);
    if (bookData.bookImageUrl) {
      formData.append('bookImageUrl', bookData.bookImageUrl);
console.log("Pulled from FormData:", formData.get('bookImageUrl'));

    }
    console.log("previewpageurl",bookData.previewPageUrls.length);
    if (bookData.previewPageUrls.length > 0) {
      bookData.previewPageUrls.forEach(file => {
        formData.append('previewPageUrls', file);
      });
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/addbook/addBook',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true    // ← here
        }
      );
      
      console.log('Book added successfully:', response.data);

      setBookData({
        bookName: '',
        author: '',
        originalPrice: '',
        description: '',
        bookImageUrl: '',
        previewPageUrls: [],
        quantity: '',
        offer: '',
        categories: ''
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const updateapicall = async () => {
    const payload = new FormData();
  
    // 1) Append all your text fields:
    payload.append('bookName',      formData.bookName);
    payload.append('author',        formData.author);
    payload.append('originalPrice', formData.originalPrice);
    payload.append('description',   formData.description);
    payload.append('quantity',      formData.quantity);
    payload.append('offer',         formData.offer);
    payload.append('categories',    formData.categories);
  
    // 2) If they picked a new cover image, append that:
    if (formData.bookImageUrl instanceof File) {
      payload.append('bookImageUrl', formData.bookImageUrl);
    }
  
    // 3) Append each preview page image if any:
    if (Array.isArray(formData.previewPageUrls) && formData.previewPageUrls.length) {
      formData.previewPageUrls.forEach(file => {
        payload.append('previewPageUrls', file);
      });
    }
  
    // 4) Fire off the request
    try {
      const res = await axios.post(
        'http://localhost:5000/api/addbook/update',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Update success:', res.data);
      alert(res.data.message);
  
      // ---- NEW: re‐fetch the book list so you don't have to refresh manually ----
      await Updatebook();
  
      // Close the modal
      setSelectedBook(null);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const [deletebook, setdeletebook]= useState(false);
  const Deletebook=async()=>{
    setdeletebook(!deletebook);
    
  
    const response = await axios.post('http://localhost:5000/api/addbook/getBooks',{token:token},{withCredentials:true});
    setBooks(response.data);
  
  }
  const Yesdelete = async () => {
    try {
      // 1) Send delete request
      const res = await axios.post(
        'http://localhost:5000/api/addbook/delete',
        {
          email: selectDeletebook.email,
          bookName: selectDeletebook.bookName
        },
        { withCredentials: true }
      );
      alert(res.data.message);
  
      // 2) Close the modal
      setselectDeletebook(null);
      setdeletebook(false);
  
      // 3) Re‐fetch books so the deleted one disappears
      const listRes = await axios.post(
        'http://localhost:5000/api/addbook/getBooks',
        {token:token},
        { withCredentials: true }
      );
      setBooks(listRes.data);
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert(err.response?.data?.message || "Error deleting book");
    }
  };
  
  const Nodelete=()=>{
         setselectDeletebook(null);
  }


  const booklist=async()=>{
    setbooklist(!Booklist);
    const response = await axios.post('http://localhost:5000/api/addbook/getBooks',{token:token},{withCredentials:true});
    setBooks(response.data);
  }

  const[selleremail,setselleremail]=useState('');
  const getemail = async () => {
    try {
      const token = Cookies.get('token'); // 🔧 Correct way to read the token
      if (!token) {
        console.error('❌ No token found in cookies');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:5000/api/addbook/getemail',
        { token }, // 🔐 Send token in body as JSON
        { withCredentials: true } // ✅ Needed if you rely on cookies for auth
      );
      
       setselleremail(response.data.email);
      console.log('✅ Email from server:', response.data.email);
      return response.data.email;
    } catch (error) {
      console.error('❌ Error fetching email:', error.message);
    }
  };
  useEffect(()=>{
    getemail();
  },[]);


  const handleLogout = () => {
    Cookies.remove('token'); // Remove the auth token
    window.location.href = '/login'; // Redirect to login page or home
  };
  
  
  return (
    <div className="sellermain">
    <div className="sellernav">
      <div className="sellerprofile"><p>Profile</p></div>
      <div className="securityoption"><p>Security setup</p></div>

      <div
        className="sellercomplaints"
        onClick={() => setShowComplaintModal(true)}
        style={{ cursor: 'pointer' }}
      >
        <p>Complaints Box</p>
      </div>

      <div className="Notification"><p>Notifications</p></div>
      <div className="sellerlogout" onClick={handleLogout}><p>Log Out</p></div>
    </div>

    {/* 🧾 Complaint Modal */}
    <SellerComplaintModal
      isOpen={showComplaintModal}
      onClose={() => setShowComplaintModal(false)}
      sellerEmail={selleremail}
    />
 

      {!updatebook && !deletebook && !Booklist && (
        <div className="sellerdashboard">
          <div className="sellerdashboardp"><p>Seller Dashboard</p></div>
          <div className="sellercrudoperation">
            <div className="addbook" onClick={addNewBook}><p>ADD NEW BOOK</p></div>
            <div className="updatebook" onClick={Updatebook}><p>UPDATE BOOK</p></div>
            <div className="deletebook" onClick={Deletebook}><p>DELETE BOOK</p></div>
            <div className="booklist" onClick={booklist}><p>BOOKS LIST</p></div>
          </div>
        </div>
      )}

      {!updatebook&& deletebook && !Booklist && (
          <div className="Updatebook">
          <div className="book-grid">
            {books.map((book, index) => (
              <div key={index} className="book-card" onClick={() => setselectDeletebook(book)}>
                <h4>{book.bookName}</h4>
                <p>By {book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectDeletebook &&(
        <div className="modal">
        <div className="modal-content">
          <h3>Delete Book: {selectDeletebook.bookName}</h3>
    
          <p>Are you sure want to delete the book?</p>
          <button type="button" onClick={Yesdelete}>Yes</button>
          <button type="button" onClick={Nodelete}>No</button>
    
      </div>
      </div>
      )}

{!updatebook && Booklist && !deletebook && (
  <div className="BOOKLIST">
    <h2>Book List</h2>
    <table className="book-table">
      <thead>
        <tr>
          <th>Book Name</th>
          <th>Author</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Category</th>
          <th>Offer</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={index}>
            <td>{book.bookName}</td>
            <td>{book.author}</td>
            <td>{book.originalPrice}</td>
            <td>{book.quantity}</td>
            <td>{book.categories}</td>
            <td>{book.offer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {updatebook && !deletebook && !Booklist && (
        <div className="Updatebook">
          <div className="book-grid">
            {books.map((book, index) => (
              <div key={index} className="book-card" onClick={()=>setSelectedBook(book)}>
                <h4>{book.bookName}</h4>
                <p>By {book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

{selectedBook && (
  <div className="modal">
    <div className="modal-content">
      <h3>Update Book: {selectedBook.bookName}</h3>

      <p>Book Name:</p>
      <input
        type="text"
        name="bookName"
        value={formData.bookName}
        onChange={handleupdateChange}
      />

      <p>Author:</p>
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleupdateChange}
      />

      <p>Price:</p>
      <input
        type="text"
        name="originalPrice"
        value={formData.originalPrice}
        onChange={handleupdateChange}
      />

      <p>Description:</p>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleupdateChange}
      />

      <p>Cover Image:</p>
      <input
        type="file"
        name="bookImageUrl"
        accept="image/*"
        onChange={handleFileChange}
      />

      <p>Preview Pages:</p>
      <input
        type="file"
        name="previewPageUrls"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <p>Quantity:</p>
      <input
        type="text"
        name="quantity"
        value={formData.quantity}
        onChange={handleupdateChange}
      />

      <p>Offer:</p>
      <input
        type="text"
        name="offer"
        value={formData.offer}
        onChange={handleupdateChange}
      />

      <p>Categories:</p>
      <input
        type="text"
        name="categories"
        value={formData.categories}
        onChange={handleupdateChange}
      />

      <button type="button" onClick={updateapicall}>Update</button>
      <button onClick={() => setSelectedBook(null)}>Close</button>
    </div>
  </div>
)}

      {addBook && (
        <div className="bookform">
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Book Name:</label><input type="text" name="bookName" value={bookData.bookName} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Author:</label><input type="text" name="author" value={bookData.author} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Original Price:</label><input type="number" name="originalPrice" value={bookData.originalPrice} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Description:</label><textarea name="description" value={bookData.description} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Book Image:</label><input type="file" name="bookImageUrl" onChange={handleFileChange} accept="image/*" required /></div>
            <div className="form-group"><label>Preview Pages:</label><input type="file" name="previewPageUrls" onChange={handleFileChange} accept="image/*" multiple /></div>
            <div className="form-group"><label>Quantity:</label><input type="number" name="quantity" value={bookData.quantity} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Offer:</label><input type="text" name="offer" value={bookData.offer} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Categories:</label><input type="text" name="categories" value={bookData.categories} onChange={handleInputChange} /></div>
            <button type="submit">Add Book</button>
            <button type="button" onClick={cancelbook}>Cancel</button>
          </form>
        </div>
      )}

    
    </div>
  );
};

export default Seller;
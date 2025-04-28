import React, { useState, useEffect, useRef } from "react";
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // ✅ Manually list your image file names here
  const images = [
    "/sliding image/i1.png",
    "/sliding image/i2.png",
    "/sliding image/i3.png"
  
  ];

  // Image change effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const signin=()=>{
    navigate('/login');
  }

  //book code-------------------------------------
  const [fiction, setfiction] = useState([]);
  const [business, setbusiness] = useState([]);
  const [romantic, setromantic] = useState([]);
  const [kid, setkid] = useState([]);
  const [biography, setbiography] = useState([]);
  
  const fetchbooks = async () => {
    const response = await axios.post('http://localhost:5000/api/addbook/getbooksdashboard');
    
    setfiction(response.data.fictionbooks);     // not fiction
    setbusiness(response.data.businessbooks);   // not business
    setromantic(response.data.romanticbooks);
    setkid(response.data.kidbooks);
    setbiography(response.data.biographybooks);
  }

  useEffect(() => {
    fetchbooks();
  }, []);
  
  
  //end of this block of code


  //book related
  const [fictionPage, setFictionPage] = useState(0);
  const [businessPage, setBusinessPage] = useState(0);
  const [romanticPage, setRomanticPage] = useState(0);
  const [kidPage, setKidPage] = useState(0);
  const [biographyPage, setBiographyPage] = useState(0);
  
  const booksPerPage = 3;
  
  //end


    // Modal State for Book Description
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBookDescription, setCurrentBookDescription] = useState("");
  
    const openDescriptionModal = (description) => {
      setCurrentBookDescription(description);
      setIsModalOpen(true);
    };
  
    const closeDescriptionModal = () => {
      setIsModalOpen(false);
      setCurrentBookDescription("");
    };



    
  // Modal State for Quantity Selection
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const openQuantityModal = (book) => {
    setCurrentBook(book);
    setSelectedQuantity(1); // Reset to 1 when opening the modal
    setIsQuantityModalOpen(true);
  };

  const closeQuantityModal = () => {
    setIsQuantityModalOpen(false);
    setCurrentBook(null);
    setSelectedQuantity(1); // Reset the selected quantity
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity <= currentBook.quantity) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // You can handle the add-to-cart functionality here
    console.log(`Added ${selectedQuantity} of ${currentBook.bookName} to cart!`);
    closeQuantityModal(); // Close the modal after adding to cart
  };




  return (
    <div className="home-maincontent">
      <div className="firstdiv">
        <div className="home-logo">
          <img src="/logo.gif.gif" alt="Logo Animation" className="logo-gif" />
        </div>

        <div className="home-searchbar">
          <input type="text" placeholder="What do you want to Read?" id="search" />
        </div>

        <div style={{ display: "flex" }}>
          <div className="cart" onClick={()=>{navigate('/login')}} style={{ fontSize: '2rem' }}><p>🛒</p></div>
          <div className="signin" onClick={signin}  style={{ fontSize: '2rem' }}><p>👤</p></div>
        </div>
      </div>

      <div className="sliddingtemplate">
        <img
          src={images[current]}
          alt="Slide"
          className="sliding-image"
        />
      </div>

      <div className="genres">
        <div className="genreheading"><p>Genres</p></div>
        <div className="genrename">
          <div className="fiction"> </div>
          <div className="business"> </div>
          <div className="biography"> </div>
          <div className="kid"> </div>
          <div className="romantic"> </div>
         
        </div>
      </div>

            
        {/* Fiction Section */}
      <div className="category-fiction">
        <div className="category-heading"><p>Fiction</p></div>
        <div className="book-grid">
          {fiction.slice(fictionPage * booksPerPage, (fictionPage + 1) * booksPerPage).map((book, index) => (
            <div key={index} className="book-item">
              <img src={`http://localhost:5000${book.bookImageUrl}`} alt={book.bookName} className="book-image" />
              <div className="book-hover">
                <p>Book Name: {book.bookName}</p>
                <p>Author:    {book.author}</p>
                <p>Price: Rs. {book.originalPrice}</p>
                <p>{book.offer}% off in Original price</p>
                <button className="add-cart" onClick={() =>{navigate('/login')}}>Add to Cart</button>
                <button className="buy-now" onClick={()=>{navigate('/login')}}>Buy Now</button>
                <button className="description" onClick={() =>{navigate('/login')}}>Description</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-buttons">
          <button onClick={() => setFictionPage((prev) => Math.max(prev - 1, 0))}>Prev</button>
          <button onClick={() => setFictionPage((prev) => (prev + 1))}>Next</button>
        </div>
      </div>
        
      {/* Business Section */}
      <div className="category-business">
        <div className="category-heading"><p>Business</p></div>
        <div className="book-grid">
          {business.slice(businessPage * booksPerPage, (businessPage + 1) * booksPerPage).map((book, index) => (
            <div key={index} className="book-item">
              <img src={`http://localhost:5000${book.bookImageUrl}`} alt={book.bookName} className="book-image" />
              <div className="book-hover">
                <p>Book Name: {book.bookName}</p>
                <p>Author:    {book.author}</p>
                <p>Price: Rs. {book.originalPrice}</p>
                <p>{book.offer}% off in Original price</p>
                <button className="add-cart" onClick={() =>{navigate('/login')}}>Add to Cart</button>
                <button className="buy-now" onClick={()=>{navigate('/login')}}>Buy Now</button>
                <button className="description" onClick={() =>{navigate('/login')}}>Description</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-buttons">
          <button onClick={() => setBusinessPage((prev) => Math.max(prev - 1, 0))}>Prev</button>
          <button onClick={() => setBusinessPage((prev) => (prev + 1))}>Next</button>
        </div>
      </div>

      {/* Biography Section */}
      <div className="category-biography">
        <div className="category-heading"><p>Biography</p></div>
        <div className="book-grid">
          {biography.slice(biographyPage * booksPerPage, (biographyPage + 1) * booksPerPage).map((book, index) => (
            <div key={index} className="book-item">
              <img src={`http://localhost:5000${book.bookImageUrl}`} alt={book.bookName} className="book-image" />
              <div className="book-hover">
                <p>Book Name: {book.bookName}</p>
                <p>Author:    {book.author}</p>
                <p>Price: Rs. {book.originalPrice}</p>
                <p>{book.offer}% off in Original price</p>
                <button className="add-cart" onClick={() =>{navigate('/login')}}>Add to Cart</button>
                <button className="buy-now" onClick={()=>{navigate('/login')}}>Buy Now</button>
                <button className="description" onClick={() =>{navigate('/login')}}>Description</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-buttons">
          <button onClick={() => setBiographyPage((prev) => Math.max(prev - 1, 0))}>Prev</button>
          <button onClick={() => setBiographyPage((prev) => (prev + 1))}>Next</button>
        </div>
      </div>

      {/* Kid Section */}
      <div className="category-kid">
        <div className="category-heading"><p>Kids</p></div>
        <div className="book-grid">
          {kid.slice(kidPage * booksPerPage, (kidPage + 1) * booksPerPage).map((book, index) => (
            <div key={index} className="book-item">
              <img src={`http://localhost:5000${book.bookImageUrl}`} alt={book.bookName} className="book-image" />
              <div className="book-hover">
                <p>Book Name: {book.bookName}</p>
                <p>Author:    {book.author}</p>
                <p>Price: Rs. {book.originalPrice}</p>
                <p>{book.offer}% off in Original price</p>
                <button className="add-cart" onClick={() =>{navigate('/login')}}>Add to Cart</button>
                <button className="buy-now" onClick={()=>{navigate('/login')}}>Buy Now</button>
                <button className="description" onClick={() =>{navigate('/login')}}>Description</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-buttons">
          <button onClick={() => setKidPage((prev) => Math.max(prev - 1, 0))}>Prev</button>
          <button onClick={() => setKidPage((prev) => (prev + 1))}>Next</button>
        </div>
      </div>

      {/* Romantic Section */}
      <div className="category-romantic">
        <div className="category-heading"><p>Romantic</p></div>
        <div className="book-grid">
          {romantic.slice(romanticPage * booksPerPage, (romanticPage + 1) * booksPerPage).map((book, index) => (
            <div key={index} className="book-item">
              <img src={`http://localhost:5000${book.bookImageUrl}`} alt={book.bookName} className="book-image" />
              <div className="book-hover">
                <p>Book Name: {book.bookName}</p>
                <p>Author:    {book.author}</p>
                <p>Price: Rs. {book.originalPrice}</p>
                <p>{book.offer}% off in Original price</p>
                <button className="add-cart" onClick={() =>{navigate('/login')}}>Add to Cart</button>
                <button className="buy-now" onClick={()=>{navigate('/login')}}>Buy Now</button>
                <button className="description" onClick={() =>{navigate('/login')}}>Description</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-buttons">
          <button onClick={() => setRomanticPage((prev) => Math.max(prev - 1, 0))}>Prev</button>
          <button onClick={() => setRomanticPage((prev) => (prev + 1))}>Next</button>
        </div>
      </div>



        {/* Modal for Description */}
        {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeDescriptionModal}>X</button>
            <p>Description:</p>
            <p>{currentBookDescription}</p>
          </div>
        </div>
      )}


       {/* Modal for Quantity Selection */}
       {isQuantityModalOpen && currentBook && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeQuantityModal}>X</button>
            <p>Book Name: {currentBook.bookName}</p>
            <p>Available Stock: {currentBook.quantity}</p>
            <div>
              <label htmlFor="quantity">Quantity: </label>
              <input 
                type="number" 
                id="quantity" 
                value={selectedQuantity} 
                onChange={handleQuantityChange} 
                min="1" 
                max={currentBook.quantity}
                disabled={currentBook.stock === 0}
              />
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      )}
      </div>
  );
};

export default Dashboard;

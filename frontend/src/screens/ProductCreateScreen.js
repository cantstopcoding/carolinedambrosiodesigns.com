import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductForm from '../components/ProductForm';
import { Store } from '../Store';
import { getError } from '../utils';
import { saveAs } from 'file-saver';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductCreateScreen() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingCreate, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [pdfFile, setPdfFile] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to create this product?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {
            name,
            slug,
            price,
            image,
            images,
            pdfFile,
            category,
            brand,
            countInStock,
            description,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/product/${data.product.slug}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };
  const uploadFileHandler = async (e, forImages, forPdf) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      if (forImages) {
        setImages([...images, data.secure_url]);
      } else if (forPdf) {
        setPdfFile(data.secure_url);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully.');
  };

  const saveFile = () => {
    saveAs(
      'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658237017/ra2y5vsfskcj6ki1psrx.pdf',
      'example.pdf'
    );
  };

  return (
    <>
      <Container className='small-container'>
        <Helmet>
          <title>Create Product</title>
        </Helmet>
        <h1>Create Product</h1>
        <div>
          <a
            href='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            download
          >
            Click to download
          </a>
          <div>
            <button onClick={saveFile}>download</button>
          </div>
        </div>
        {loadingCreate ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <ProductForm
            submitHandler={submitHandler}
            name={name}
            slug={slug}
            price={price}
            image={image}
            images={images}
            category={category}
            brand={brand}
            countInStock={countInStock}
            description={description}
            setName={setName}
            setSlug={setSlug}
            setPrice={setPrice}
            setImage={setImage}
            setImages={setImages}
            setCategory={setCategory}
            setBrand={setBrand}
            setCountInStock={setCountInStock}
            setDescription={setDescription}
            loadingUpdate={loadingUpdate}
            loadingUpload={loadingUpload}
            uploadFileHandler={uploadFileHandler}
            deleteFileHandler={deleteFileHandler}
            createOrUpdate={'Create Product'}
          />
        )}
      </Container>
      <></>
    </>
  );
}

import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [userOrderData, setUserOrderData] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  const userOrders = userOrderData.map((o) => o.orderItems).flat();
  const userBoughtThisProduct = userOrders
    .map((order) => order.name)
    .includes(product.name);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        setPdfFile(result.data.pdfFile);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    const fetchUserOrderData = async () => {
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setUserOrderData(data);
      } catch (error) {
        dispatch({
          payload: getError(error),
        });
      }
    };

    fetchUserOrderData();
    fetchData();
  }, [slug, userInfo]);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    if (window.confirm('Are you sure you want to submit this review?')) {
      try {
        const { data } = await axios.post(
          `/api/products/${product._id}/reviews`,
          { rating, comment, name: userInfo.name },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: 'CREATE_SUCCESS',
        });
        toast.success('Review submitted successfully');
        product.reviews.unshift(data.review);
        product.numReviews = data.numReviews;
        product.rating = data.rating;
        dispatch({ type: 'REFRESH_PRODUCT', payload: product });
        window.scrollTo({
          behavior: 'smooth',
          top: reviewsRef.current.offsetTop,
        });
        setRating(0);
        setComment('');
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };

  const saveFile = () => {
    const slugifyProductName = product.name.replace(/\s+/g, '-').toLowerCase();
    saveAs(pdfFile, `${slugifyProductName}.pdf`);
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className='img-large'
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>

              {userBoughtThisProduct && product.pdfFile && (
                <Button variant='primary' onClick={saveFile}>
                  Download
                </Button>
              )}
              {userInfo && userInfo.isAdmin && product.pdfFile && (
                <Button variant='primary' onClick={saveFile}>
                  Download
                </Button>
              )}
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={4} md={2} className='g-2'>
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className='thumbnail'
                        type='button'
                        variant='light'
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant='top' src={x} alt='product' />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg='success'>In Stock</Badge>
                      ) : (
                        <Badge bg='danger'>Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button onClick={addToCartHandler} variant='primary'>
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className='my-3'></div>
    </div>
  );
}
export default ProductScreen;

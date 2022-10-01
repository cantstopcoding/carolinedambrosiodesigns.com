import React from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

export default function ProductForm(props) {
  return (
    <Form onSubmit={props.submitHandler}>
      <Form.Group className='mb-3' controlId='name'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='slug'>
        <Form.Label>Slug</Form.Label>
        <Form.Control
          value={props.slug}
          onChange={(e) => props.setSlug(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='name'>
        <Form.Label>Price</Form.Label>
        <Form.Control
          value={props.price}
          onChange={(e) => props.setPrice(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='image'>
        <Form.Label>Image File</Form.Label>
        <Form.Control
          value={props.image}
          onChange={(e) => props.setImage(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='imageFile'>
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type='file' onChange={props.uploadFileHandler} />
        {props.loadingUpload && <LoadingBox></LoadingBox>}
      </Form.Group>

      <Form.Group className='mb-3' controlId='additionalImage'>
        <Form.Label>Additional Images</Form.Label>
        {props.images.length === 0 && <MessageBox>No image</MessageBox>}
        <ListGroup variant='flush'>
          {props.images.map((x) => (
            <ListGroup.Item key={x}>
              {x}
              <Button
                variant='light'
                onClick={() => props.deleteFileHandler(x)}
              >
                <i className='fa fa-times-circle'></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>
      <Form.Group className='mb-3' controlId='additionalImageFile'>
        <Form.Label>Upload Aditional Image</Form.Label>
        <Form.Control
          type='file'
          onChange={(e) => props.uploadFileHandler(e, true, false)}
        />
        {props.loadingUpload && <LoadingBox></LoadingBox>}
      </Form.Group>

      <Form.Group className='mb-3' controlId='pdf'>
        <Form.Label>PDF File</Form.Label>
        <Form.Control
          value={props.pdfFile}
          onChange={(e) => props.setPdfFile(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='pdfFile'>
        <Form.Label>Upload PDF</Form.Label>
        <Form.Control
          type='file'
          onChange={(e) => props.uploadFileHandler(e, false, true)}
        />
        {props.loadingUpload && <LoadingBox></LoadingBox>}
      </Form.Group>

      <Form.Group className='mb-3' controlId='category'>
        <Form.Label>Category</Form.Label>
        <Form.Control
          value={props.category}
          onChange={(e) => props.setCategory(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='brand'>
        <Form.Label>Brand</Form.Label>
        <Form.Control
          value={props.brand}
          onChange={(e) => props.setBrand(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='countInStock'>
        <Form.Label>Count In Stock</Form.Label>
        <Form.Control
          value={props.countInStock}
          onChange={(e) => props.setCountInStock(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='description'>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as='textarea'
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          rows={15}
          required
        />
      </Form.Group>
      <div className='mb-3'>
        <Button disabled={props.loadingUpdate} type='submit'>
          {props.createOrUpdate}
        </Button>
        {props.loadingUpdate && <LoadingBox></LoadingBox>}
      </div>
    </Form>
  );
}

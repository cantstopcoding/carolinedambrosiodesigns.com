import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Caroline',
      email: 'c@c.com',
      password: bcrypt.hashSync('pw'),
      isAdmin: true,
    },
    {
      name: 'Rafael',
      email: 'r@r.com',
      password: bcrypt.hashSync('pw'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Logan's Run Cosplay Costume",
      slug: 'logans-run-cosplay-costume',
      category: 'Dress',
      image:
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658492779/bfwvwftyrqhwrwujrz7n.jpg',
      images: [
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658494369/qspkjvxma30guy88uru7.jpg',
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658494384/bmrn5ooe6gplge6zrfpr.jpg',
      ],
      price: 300,
      countInStock: 0,
      brand: "Logan's Run",
      rating: 4.5,
      numReviews: 10,
      description: "Custom costume of character from Logan's Run.",
    },
    {
      name: 'Jonah Hex Cosplay Costume',
      slug: 'jonah-hex-cosplay-costume',
      category: 'Dress',
      image:
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658493687/erdal05mdrbnqirjcuez.jpg',
      images: [
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658494050/mbv4eig6wt7uv1cfwx94.jpg',
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658493950/bld1rijnk0nyfmmzbarm.jpg',
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658492198/z0yjmwyhurgnzmhhgbmg.jpg',
      ],
      price: 400,
      countInStock: 0,
      brand: "Logan's Run",
      rating: 4.9,
      numReviews: 3,
      description:
        'Custom costume of the character Lilah from the film Jonah Hex.',
    },
    {
      name: 'Princess Costume',
      slug: 'princess-costume',
      category: 'Dress',
      image:
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658493227/avbcq9quy81q1w8hkbgn.jpg',
      images: [
        'https://res.cloudinary.com/caroline-dambrosio-designs/image/upload/v1658494583/xw3iixkftcpqyechuv2l.jpg',
      ],
      price: 200,
      countInStock: 0,
      brand: "Logan's Run",
      rating: 4.1,
      numReviews: 7,
      description: 'Custom princess costume.',
    },
  ],
};

export default data;

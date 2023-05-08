import Product from './model.js';
import Supplier from '../supplier/model.js';

export const Params = (req, res, next) => {
  const params = {
    heading: 'Product',
    navs: [
      { path: '/', label: 'Back' },
      { path: '/products', label: 'Home' },
      { path: '/products/create', label: 'Create' },
    ],
  };

  res.locals.params = params;
  next();
};

export const HomeController = async (req, res) => {
  const { params } = res.locals;
  const data = await Product.find()
    .select('_id name description stock price status supplier')
    .populate('supplier');

  res.render('pages/products/read', {
    title: 'Product - Home',
    data,
    ...params,
  });
};

export const CreateController = async (req, res) => {
  const { params } = res.locals;
  const suppliers = await Supplier.find();

  res.render('pages/products/create', {
    title: 'Product - Create',
    suppliers,
    ...params,
  });
};

export const StoreController = async (req, res) => {
  try {
    for (let el in req.body) {
      if (req.body[el] === '') {
        delete req.body[el];
      }
    }

    const slug = req.body.name.toLowerCase().split(' ').join('-');
    const result = await Product.create({ slug, ...req.body });

    console.log(result);
    res.redirect('/products');
  } catch (err) {
    console.log({ status: 500, message: err });
    res.render('error', {
      title: 'Error',
      navs: [{ path: '/', label: 'Back' }],
    });
  }
};

export const EditController = async (req, res) => {
  try {
    const { params } = res.locals;
    const { _id } = req.params;

    const suppliers = await Supplier.find();
    const data = await Product.findById(_id).populate('supplier');

    res.render('pages/products/update', {
      title: 'Product - Update',
      suppliers,
      data,
      ...params,
    });
  } catch (err) {
    console.log({ status: 404, message: 'Product not found' });
    res.render('error', {
      title: 'Error',
      navs: [{ path: '/', label: 'Back' }],
    });
  }
};

export const UpdateController = async (req, res) => {
  try {
    for (let el in req.body) {
      if (req.body[el] === '') {
        delete req.body[el];
      }
    }

    const slug = req.body.name.toLowerCase().split(' ').join('-');
    const result = await Product.findByIdAndUpdate(
      req.body._id,
      { slug, ...req.body },
      {
        new: true,
      }
    );

    console.log(result);
    res.redirect('/products');
  } catch (err) {
    console.log({ status: 500, message: err });
    res.render('error', {
      title: 'Error',
      navs: [{ path: '/', label: 'Back' }],
    });
  }
};

export const DeleteController = async (req, res) => {
  try {
    const { _id } = req.body;
    const result = await Product.findByIdAndDelete(_id);

    console.log(result);
    res.redirect('/products');
  } catch (err) {
    console.log({ status: 500, message: err });
    res.render('error', {
      title: 'Error',
      navs: [{ path: '/', label: 'Back' }],
    });
  }
};

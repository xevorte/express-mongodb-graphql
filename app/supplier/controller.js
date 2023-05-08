import Supplier from './model.js';

export const Params = (req, res, next) => {
  const params = {
    heading: 'Supplier',
    navs: [
      { path: '/', label: 'Back' },
      { path: '/suppliers', label: 'Home' },
      { path: '/suppliers/create', label: 'Create' },
    ],
  };

  res.locals.params = params;
  next();
};

export const HomeController = async (req, res) => {
  const { params } = res.locals;
  const data = await Supplier.find().select(
    '_id name description type sizeOfMembers address contact'
  );

  res.render('pages/suppliers/read', {
    title: 'Supplier - Home',
    data,
    ...params,
  });
};

export const CreateController = (req, res) => {
  const { params } = res.locals;

  res.render('pages/suppliers/create', {
    title: 'Supplier - Create',
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

    const result = await Supplier.create(req.body);

    console.log(result);
    res.redirect('/suppliers');
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

    const data = await Supplier.findById(_id);

    res.render('pages/suppliers/update', {
      title: 'Supplier - Update',
      data,
      ...params,
    });
  } catch (err) {
    console.log({ status: 404, message: 'Supplier not found' });
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

    const result = await Supplier.findByIdAndUpdate(req.body._id, req.body, { new: true });

    console.log(result);
    res.redirect('/suppliers');
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
    const result = await Supplier.findByIdAndDelete(_id);

    console.log(result);
    res.redirect('/suppliers');
  } catch (err) {
    console.log({ status: 500, message: err });
    res.render('error', {
      title: 'Error',
      navs: [{ path: '/', label: 'Back' }],
    });
  }
};
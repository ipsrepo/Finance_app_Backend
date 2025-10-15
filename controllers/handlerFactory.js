const qs = require('qs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // PRE DOCUMENT MIDDLEWARE EXECUTE BEFORE THIS
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newDoc,
      },
    });
    // POST DOCUMENT MIDDLEWARE EXECUTE BEFORE THIS
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // const doc = await Tour.findOne({ _id: req.params.id });

    if (!doc) {
      return next(
        new AppError(`No document found for the ID ${req.params.id}`, 404),
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document found for the ID ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: 'success',
      data: 'Document removed successfully',
    });
  });

exports.getOne = (Model, PopulateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (PopulateOptions)
      query = query.populate(PopulateOptions).populate('transactions');
    const doc = await query;
    // const doc = await Tour.findOne({ _id: req.params.id });

    if (!doc) {
      return next(
        new AppError(`No document found for the ID ${req.params.id}`, 404),
      );
    }
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To Allow nested GET reviews on tour
    const filter = {};

    // Parse query properly to handle price[lt], duration[gte], etc.
    const parsedQuery = qs.parse(req.query);

    const features = new APIFeatures(
      Model.find(filter).populate('transactions'),
      parsedQuery,
    )
      .filter()
      .sort()
      .limit()
      .pagination();

    const data = await features.query;

    // const tours = await Tour.find().where('duration').gte(10);
    res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    });
  });

// const express = require('express');
// const router = express.Router();
// const catchAsync = require('../utils/catchAsync');

// const Campground = require('../models/campground');
// const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


// router.get('/', catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds })
// }));


// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('campgrounds/new');
// })


// router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id;
//     await campground.save();
//     req.flash('success', 'Successfully made a new campground!')
//     res.redirect(`/campgrounds/${campground._id}`)
// }))


// router.get('/:id', catchAsync(async (req, res,) => {
//     const campground = await Campground.findById(req.params.id).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     console.log(campground);
//     if (!campground) {
//         req.flash('error', 'cannnot find that campground!')
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/show', { campground });
// }));


// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id)
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit', { campground });
// }));


// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {

//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     req.flash('success', 'Successfully updated campground!')
//     res.redirect(`/campgrounds/${campground._id}`)
// }));


// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash('success', 'successfully deleted campground!')
//     res.redirect('/campgrounds');
// }));

// module.exports = router;


const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.file);
    //     res.send("It worked!");
    // })
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

//.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;
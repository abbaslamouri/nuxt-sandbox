// import express from 'express';
// import errorHandler from '~/server/utils/errorHandler';
// // import { uploadVariants, deleteVariants, preSave, setRating, fetchBySlug } from '~/server/controllers/variants'
// import { protect, authorize } from '~/server/controllers/auth';
// import {
//   getAllDocs,
//   getDoc,
//   deleteManyDocs,
//   createDoc,
//   deleteDoc,
//   updateDoc,
//   getDocsCount,
// } from '~/server/controllers/factory';

// import Variant from '~/server/models/variant';

// const router = express.Router();

// router.route('/').get(getAllDocs(Variant));
// router.route('/count').get(getDocsCount(Variant));
// router.route('/:id').get(getDoc(Variant));
// // router.route('/slug/:slug').get(fetchBySlug)

// router.use(protect);
// router.use(authorize('admin', 'shop-manager'));

// router.route('/').post(createDoc(Variant));
// router.route('/delete-many').post(deleteManyDocs(Variant));

// router.route('/:id').patch(updateDoc(Variant));

// // router.route('/upload').post(uploadVariants)
// // router.route('/delete').delete(deleteVariants)
// router.route('/:id').delete(deleteDoc(Variant));
// // router.route('/rating/:id').patch(setRating)

// // router.route('/login').post(login)
// // router.route('/logout').get(logout)
// // router.route('/forgotpassword').post(forgotPassword)
// // router.route('/resetpassword/:resetToken').patch(resetPassword)
// // router.route('/me').get(protect, getMe)
// // router.route('/updateme').patch(protect, uploadUserAvatar, resizeAvatar, updateMe)
// // router.route('/updatemypassword').patch(protect, updateMyPassword)

// router.use(errorHandler);

// export default router;

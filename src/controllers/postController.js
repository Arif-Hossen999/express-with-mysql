// import db
let { db } = require("../models");
// Import the sequelize instance
const { sequelize } = require("../models");
// import userId module
const {getUserIdFromToken} = require("../services/getUserId")

// import fs and path for upload image
const fs = require("fs");
const path = require("path");

// create main Model
const Post = db.posts;
const Image = db.post_images;
const Video = db.post_videos;
const User = db.users;

// get all post
async function getPostList(req, res) {
  try {
    const getPostWithRelation = await Post.findAll({
      where: { status: 1 },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
        {
          model: Image,
          as: "post_image",
          attributes: ["imageUrl"],
        },
        {
          model: Video,
          as: "post_video",
          attributes: ["videoUrl"],
        },
      ],
    });

    // get data with join query

    //   const getPostWithJoinQuery = await sequelize.query(
    //     `
    // SELECT
    //   posts.*,
    //   users.name AS username,
    //   post_images.imageUrl,
    //   post_videos.videoUrl
    // FROM
    //   posts
    // INNER JOIN
    //   users
    // ON
    //   posts.user_id = users.id
    // LEFT JOIN
    //   post_images
    // ON
    //   posts.id = post_images.post_id
    // LEFT JOIN
    //   post_videos
    // ON
    //   posts.id = post_videos.post_id
    // WHERE
    //   posts.status = 1
    // `,
    //     {
    //       type: sequelize.QueryTypes.SELECT,
    //     }
    //   );

    // return response
    res.status(200).json(getPostWithRelation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// get single post by id
async function getPostById(req, res){
  try {
    const id = req.params.id;
    const getSinglePost = await Post.findOne({
      where: { 
        status: 1,
        id: id
       },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
        {
          model: Image,
          as: "post_image",
          attributes: ["imageUrl"],
        },
        {
          model: Video,
          as: "post_video",
          attributes: ["videoUrl"],
        },
      ],
    });
    if (!getSinglePost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(getSinglePost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// create new post
async function createNewPost(req, res) {
  // Get the token from the request header or body
  const token = req.headers.authorization || req.body.token;
  try {
    const { title, description, category_id } = req.body;
    const user_id = getUserIdFromToken(token);

    // Get the first file from the array and upload image
    const uploadedFile = req.files[0];

    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if the uploaded file is an image or video based on its MIME type or file extension
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedVideoTypes = ["video/mp4", "video/mpeg"];

    // upload image with post
    if (allowedImageTypes.includes(uploadedFile.mimetype)) {
      const imageFileName = `${
        uploadedFile.fieldname
      }_${Date.now()}${path.extname(uploadedFile.originalname)}`;
      const imagePath = path.join("./src/public/images", imageFileName);
      // Write the file to the server
      fs.writeFile(imagePath, uploadedFile.buffer, (err) => {
        if (err) {
          console.error(err);
        }
      });
      // create post
      const post = await Post.create({
        title,
        description,
        category_id,
        user_id,
      });
      const post_id = post.id;
      // insert image
      const image = await Image.create({
        imageUrl: imageFileName,
        post_id: post_id,
      });
      // return response
      return res.status(201).json({
        message: "Post created successfully",
        post,
        image,
      });
    }
    // create post with video
    else if (allowedVideoTypes.includes(uploadedFile.mimetype)) {
      const videoFileName = `${
        uploadedFile.fieldname
      }_${Date.now()}${path.extname(uploadedFile.originalname)}`;
      const imagePath = path.join("./src/public/videos", videoFileName);
      // Write the file to the server
      fs.writeFile(imagePath, uploadedFile.buffer, (err) => {
        if (err) {
          console.error(err);
        }
      });
      // create post
      const post = await Post.create({
        title,
        description,
        category_id,
        user_id,
      });
      const post_id = post.id;
      // insert video
      const video = await Video.create({
        videoUrl: videoFileName,
        post_id: post_id,
      });
      // return response
      return res.status(201).json({
        message: "Post created successfully",
        post,
        video,
      });
    } else {
      return res.status(201).json({
        message: "Upload only image or video",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// update post 
async function postUpdate(req, res){
   // Get the token from the request header or body
   const token = req.headers.authorization || req.body.token;
  try {
    const { title, description, category_id } = req.body;
    const id = req.params.id;
    const userId = getUserIdFromToken(token);
    // console.log(userId)
    if(userId == null){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Find the post by ID
    const post = await Post.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    // check post exist or not
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // check authorization
    if(userId != post.user_id){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // update post
    await post.update({
      title: title,
      description: description,
      category_id: category_id,
    });
    return res.status(200).json({
      message: "Post update successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
// post delete
async function deletePost(req, res){
  // Get the token from the request header or body
  const token = req.headers.authorization || req.body.token;
  try {
    const id = req.params.id;
    const userId = getUserIdFromToken(token);
    if(userId == null){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Find the post by ID
    const post = await Post.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // check authorization
    if(userId != post.user_id){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Delete the post
    await post.destroy();
    return res.status(200).json({
      message: "Post delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
// update post status for delete
async function postUpdateStatus(req, res){
  // Get the token from the request header or body
  const token = req.headers.authorization || req.body.token;
  try {
    const id = req.params.id;
    const userId = getUserIdFromToken(token);
    if(userId == null){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Find the post by ID
    const post = await Post.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // check authorization
    if(userId != post.user_id){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await post.update({
      status: 0,
    });
    return res.status(200).json({
      message: "Post delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// export all function
module.exports = {
  createNewPost,
  getPostById,
  getPostList,
  postUpdate,
  deletePost,
  postUpdateStatus,
};

const BlogModel = require("../model/blog.model");
const UserModel = require('../model/user.model')
const logger = require("../logger");
const Cache = require("../helpers/cache.helper")

function estimateReadingTime(body) {
  // Assuming an average reading speed of 200 words per minute
  // const words = body.split(" ").length;
  const words = body.trim().split(/\s+/).length;
  const readingSpeed = 200; // words per minute
  return Math.ceil(words / readingSpeed);
}

const GetPublished = async (req, res) => {
  try {
    const { page = 1, limit = 20, author, title, tag, order, _id } = req.query;

    const blogs = await BlogModel.find();

    // Filter and search blogs based on query parameters
    let filteredBlogs = blogs.filter((blog) => blog.state === "published");

    if (author) {
      filteredBlogs = filteredBlogs.filter(
        (blog) => blog.author.toLowerCase() === author.toLowerCase()
      );
    }

    if (title) {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (tag) {
      filteredBlogs = filteredBlogs.filter((blog) => blog.tags.includes(tag));
    }

    if (_id) {
      const blogToRead = filteredBlogs.find((blog) => blog._id === Number(id));
      if (blogToRead) {
        blogToRead.read_count += 1;
      }
    }

    // Estimate reading time and add it to each blog
    filteredBlogs.forEach((blog) => {
      blog.reading_time = estimateReadingTime(blog.body);
    });

    // Order the blogs based on the 'order' query parameter
    if (order) {
      const validOrders = ["read_count", "reading_time", "timestamp"];
      if (validOrders.includes(order)) {
        filteredBlogs.sort((a, b) => (a[order] < b[order] ? -1 : 1));
      }
    }

    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    // res.status(200).json(paginatedBlogs);

    console.log("cache miss")
    const TTL_1_DAY = 60 * 60 * 24
    Cache.set( cacheKey, blogs, TTL_1_DAY)
    // res.json({ success: true, message: "success", data: blogs})

     res.status(200).json(paginatedBlogs);

  } catch (error) {
    logger.error(`Error fetching blogs: ${error.message}`);
    return res.status(500).json({
      message: "Server error",
      data: null,
    });
  }
};


const CreateBlog = async (req, res) => {
  try {
    const blogFromRequest = req.body;

    const blog = await BlogModel.create({
      title: blogFromRequest.title,
      description: blogFromRequest.description,
      tags: blogFromRequest.tags,
      author: blogFromRequest.author,
      state: blogFromRequest.state,
      body: blogFromRequest.body,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`);
    return res.status(500).json({
      message: "Sever not found",
      data: null,
    });
  }
};




const AuthorBlog = async (req, res) => {
  try {
    const  userId  = req.params.id; // Assuming you have the user's ID in the route params
    
    // Find the user based on the userId
    const user = await UserModel.find({ _id: userId });
    // console.log(user)
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    
    const blogs = await BlogModel.find({ user_id: userId });
    
    // Check if the user is the owner of the blogs
    if (blogs.length === 0 || blogs[0].user_id !== userId) {
      return res
        .status(401)
        .json({ message: "You can only access your own blogs" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    logger.error(`Error fetching owner's blogs: ${error.message}`);
    return res.status(500).json({
      message: "Server error",
      data: null,
    });
  }
};



const UpdateBlog = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the blog ID is in the route parameters
    const update = req.body;

    // Find the blog by ID
    const blog = await BlogModel.findOne({ _id: id });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Check if the user is the owner of the blog
    if (blog.user_id !== req.user.id) {
      return res.status(401).json({
        message: "You can only update your own blog",
      });
    }

    const blogUpdate = await BlogModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!blogUpdate) {
      return res.status(404).json({
        message: "Blog not found",
        success: false,
      });
    }

    return res.status(200).json({
      blogUpdate,
    });
  } catch (error) {
    console.error(`Error updating blog: ${error.message}`);
    return res.status(500).json({
      message: "Server Error",
      data: null,
    });
  }
};

const DeleteBlog = async (req, res) => {
  try {
    const { id } = req.params; 

    // Find the blog by ID
    const blog = await BlogModel.findOne({_id:id});

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    // console.log( blog)
    // console.log( typeof id)
    // console.log( id, req.user)
    // Check if the user is the owner of the //blog
    if (blog.user_id !== req.user._id) {
      return res.status(401).json({
        message: "You can only delete your own blog",
      });
    }

    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        message: "Blog not found for deletion",
        success: true,
      });
    }

    return res.status(200).json({
      message: "Blog successfully deleted",
      success: true,
    });
  } catch (error) {
    console.error(`Error deleting blog: ${error.message}`);
    return res.status(500).json({
      message: "Server Error",
      data: null,
    });
  }
};


module.exports = {
  GetPublished,
  AuthorBlog,
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
};

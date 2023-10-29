const db = require('./db');
const BlogModel = require('./model/blog.model');

db.connect().then(async () => {
    await BlogModel.insertMany([
      {
        title: "Blog 5",
        author: "John Doe",
        description: "Jsut read through",
        state: "published",
        read_count: 100,
        reading_time: 0,
        tags: ["Node.js", "Express", "API"],
        body: "This is the body of Blog 1. It has some characters for testing read time estimation.",
        user_id: "bf59d47k-3e2c-4b26-5bbc-se551c428f5r",
      },
      {
        title: "Blog 6",
        author: "Jane Smith",
        description: "Jsut read through",
        state: "published",
        read_count: 200,
        reading_time: 0,
        tags: ["JavaScript", "Web Development"],
        body: "This is the body of Blog 2. It also has some characters for testing read time estimation.",
        user_id: "bb59d42d-3e2c-4b26-9eec-fe436c428f4b",
      },
      {
        title: "Blog 3",
        author: "John Henry",
        description: "Jsut read through",
        state: "published",
        owner: "johnHenry",
        read_count: 100,
        reading_time: 10,
        tags: ["Node.js", "Express", "API"],
        body: "This is the body of Blog 1.",
        user_id: "bb59d42d-3e2c-4b26-5bbc-fe936c428f5b",
      },
      {
        title: "Blog 4",
        author: "Henry Danger",
        description: "Jsut read through",
        state: "draft",
        owner: "henrydanger",
        read_count: 0,
        reading_time: 0,
        tags: [],
        body: "This is the body of Blog 2.",
        user_id: "b9dfbb10-2f0b-451f-j8bb-5f8d2d8ass77",
      },
    ]);
     console.log('added to db successfully')
     process.exit(1)
}).catch((err) => {
    console.log('Error seeding', err)
})


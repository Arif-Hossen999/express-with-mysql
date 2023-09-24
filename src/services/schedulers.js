const Scheduler = require("cron").CronJob;
const { db } = require("../models");

// create main Model
const Post = db.posts;

try {
  // time for 24 hours '0 0 */1 * *'
  // check scheduler ... update status for post table
  const postStatusUpdate = new Scheduler("* * * * *", async function () {
    try {
    //   const id = 2;
    //   // Find the post by ID
    //   const post = await Post.findOne({
    //     where: {
    //       id: id,
    //       status: 1,
    //     },
    //   });
    //   // check post exist or not
    //   if (!post) {
    //     return res.status(404).json({ error: "Post not found" });
    //   }
    //   await post.update({
    //     status: 0,
    //   });
    //   console.log('ok')
    } catch (err) {
      console.log(err);
    }
  });
  // starting postStatusUpdate scheduler
  postStatusUpdate.start();
} catch (schedulerError) {
  console.log(schedulerError);
}

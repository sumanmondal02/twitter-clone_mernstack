import cron from "node-cron";

import { PostModel } from "../models/PostModel.js";

// RUNS EVERY MINUTE
cron.schedule("* * * * *", async () => {

    try {

        const now = new Date();

        const postsToPublish = await PostModel.find({
            isScheduled: true,
            isPublished: false,
            scheduledFor: {
                $lte: now
            }
        });

        if (postsToPublish.length === 0) {
            return;
        }

        for (const post of postsToPublish) {

            await PostModel.collection.updateOne({
                _id: post._id
            },
                {
                    $set: {
                        isPublished: true,
                        isScheduled: false,
                        createdAt: post.scheduledFor
                    }
                }
            );

            console.log(
                `Scheduled post published: ${post._id}`
            );
        }

    } catch (err) {

        console.error(
            "Scheduled post worker error:",
            err
        );

    }

});
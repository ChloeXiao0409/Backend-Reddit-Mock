const { createTestUser } = require("../helper")
const supertest = require("supertest");
const app = require("../../src/app");
const PostModel = require("../../src/models/post.model");

describe("Post resource", () => {

    // Test for creating a post
    describe("POST /v1/posts", () => {

        let testUser;
        let authenToken;
        // Cus we clear collection each time, So for every test we need to add one user data before test
        beforeEach(async () => {
            const {user, token} = await createTestUser();
            testUser = user;
            authenToken = token;
        })

        it("should create a new post when authenticated", async() => {
            // 01 setup
            const postData = {
                title: "Test Post",
                content: "This is a test post."
            }
            // 02 execute
            const res = await supertest(app)
                .post("/v1/posts")
                .set('Authorization', `Bearer ${authenToken}`)
                .send(postData);
            // 03 compare
            expect(res.status).toBe(201);
            expect(res.body.data.title).toBe(postData.title);
            expect(res.body.data.content).toBe(postData.content);
            expect(res.body.data.user).toBe(testUser._id.toString());

            // Check if the post is saved in the database
            const post = await PostModel.findById(res.body.data._id);
            expect(post.title).toBe(postData.title);
            expect(post.content).toBe(postData.content);
            expect(post.user.toString()).toBe(testUser._id.toString());
        })
    })
})
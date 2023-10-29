const supertest = require('supertest');
const app = require('../api');
const { connect } = require('./database');
const UserModel = require('../model/user.model');

// Test suite
describe('Authentication Tests', () => {
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    })

    afterEach(async () => {
        await connection.cleanup()
    })
    
    // after hook
    afterAll(async () => {
        await connection.disconnect()
    })


    // Test case
    it('should successfully register a user', async () => {
        const response = await supertest(app)
          .post("/signup")
          .set("content-type", "application/json")
          .send({
            firstname: "Bop",
            lastname: "Daddy",
            email: "Bop@example.com",
            password: "12345678",
          });

        // expectations
        expect(response.status).toEqual(201);
        expect(response.body.user).toMatchObject({
            firstname: "Bop",
            lastname: "Daddy",
            email: "Bop@example.com",
            password: "12345678",
            
        })
    })

    // Test case
    it('should successfully login a user', async () => {
        await UserModel.create({
          email: "Bop@example.com",
          password: "12345678",
        });

        const response = await supertest(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            email: "Bop@example.com",
            password: "12345678"
        })

        // expectations
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            message: "Login successful",
            token: expect.any(String),
            user: expect.any(Object)
        })

    })

    it('should not successfully login a user, when user does not exist', async () => {
        await UserModel.create({
          firstname: "Bop",
          lastname: "Daddy",
          email: "Bop@example.com",
          password: "12345678",
        });

        const response = await supertest(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            email: "Henny@example.com",
            password: "12345678"
        })

        // expectations
        expect(response.status).toEqual(404);
        expect(response.body).toMatchObject({
            message: "User not found",
        })
    })
})

import supertest from 'supertest'
import { app } from '..'

describe('admin auth',() => {
    describe('admin register',() => {
        describe('no email',() => {
            it("should return validation error", async()=>{
                // expect(true).toBe(true)
                await supertest(app).post("/api/admin/register").expect(404)
            })
        })
    })
})
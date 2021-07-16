let token = '';
describe('Greetings.', () => {
    it('Should welcome greeting.', (done) => {
        app.get('/').expect(200, done)
    })
})
describe('Create user.', () => {
    it('Should create an user.', (done) => {
        app.post('/users')
            .send({
                email: 'juan@gmail.com',
                password: '1234567Hello?'
            })
            .expect(200, done)
    })
})
describe('Create user with email registered.', () => {
    it('Should respond with a 500 status because the email is already registered.', (done) => {
        app.post('/users')
            .send({
                email: 'juan@gmail.com',
                password: '1234567Hello?'
            })
            .expect(500, done)
    })
})
describe('Create user with email invalid.', () => {
    it('Should respond with a 500 status because the email is invalid.', (done) => {
        app.post('/users')
            .send({
                email: 'juan@gmail',
                password: '1234567Hello?'
            })
            .expect(500, done)
    })
})
describe('Create user with password invalid.', () => {
    it('Should respond with a 500 status because the password is invalid.', (done) => {
        app.post('/users')
            .send({
                email: 'juan@gmail.com',
                password: '1234567Hol*'
            })
            .expect(500, done)
    })
})
describe('Login user with valid user and password.', () => {
    it('Should login the user.', (done) => {
        app.post('/login')
            .send({
                email: 'juan@gmail.com',
                password: '1234567Hello?'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.data.token;
                done()
            })
    })
})
describe('Login user with email invalid.', () => {
    it('Should respond with a 500 status because the email is invalid.', (done) => {
        app.post('/login')
            .send({
                email: 'juan@gmail',
                password: '1234567Hello?'
            })
            .expect(500, done)
    })
})
describe('Login user with password invalid.', () => {
    it('Should respond with a 500 status because the password is invalid.', (done) => {
        app.post('/login')
            .send({
                email: 'juan@gmail.co',
                password: '1234567Hol*'
            })
            .expect(500, done)
    })
})
describe('Logged user get public pokemons list.', () => {
    it('Should respond with status code 204 no content.', (done) => {
        app.get('/pokemons/public/0')
            .set({'token': token})
            .expect(204, done)
    })
})
describe('Logged user get public pokemons list.', () => {
    it('Should respond with status code 401 unauthorized, because the user didn\'t send the token.', (done) => {
        app.get('/pokemons/public/0')
            .expect(401, done)
    })
})
describe('Create public pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons/public')
            .set({'token': token})
            .send({ name: 'Pikachu', species: 'Thunder', ability: 'Pressure', color: 'Yellow' })
            .expect(200, done)
    })
})
describe('Create public pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons/public')
            .set({'token': token})
            .send({ name: 'Chikorita', species: 'Leaf', ability: 'Overgrow', color: 'Green' })
            .expect(200, done)
    })
})
describe('Create public pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons/public')
            .set({'token': token})
            .send({ name: 'Cyndaquil', species: 'Fire Mouse', ability: 'Blaze', color: 'Yellow' })
            .expect(200, done)
    })
})
describe('Create public pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons/public')
            .set({'token': token})
            .send({ name: 'Totodile', species: 'Big Jaw', ability: 'Torrent', color: 'Blue' })
            .expect(200, done)
    })
})
describe('Create public pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons/public')
            .set({'token': token})
            .send({ name: 'Sentret', species: 'Scout', ability: 'Run Away', color: 'Brown' })
            .expect(200, done)
    })
})
describe('Create public pokemon.', () => {
    it('Should respond with status code 400 bad request.', (done) => {
        app.post('/pokemons/public')
            .set({'token': token})
            .send({ species: 'Thunder', ability: 'Pressure', color: 'Yellow' })
            .expect(400, done)
    })
})
describe('Logged user get public pokemons list.', () => {
    it('Should respond with the public pokemons.', (done) => {
        app.get('/pokemons/public/0')
            .set({'token': token})
            .expect(200, done)
    })
})
describe('Logged user get private pokemons list.', () => {
    it('Should respond with status code 204 no content.', (done) => {
        app.get('/pokemons/private/1/0')
            .set({'token': token})
            .expect(204, done)
    })
})
describe('Create private pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons')
            .set({'token': token})
            .send({ idUser: 1, name: 'Charmander', species: 'Lizard', ability: 'Blaze', color: 'Red' })
            .expect(200, done)
    })
})
describe('Create private pokemon.', () => {
    it('Should create a public pokemon.', (done) => {
        app.post('/pokemons')
            .set({'token': token})
            .send({ idUser: 1, name: 'Noctowl', species: 'Owl', ability: 'Insomnia', color: 'Brown' })
            .expect(200, done)
    })
})
describe('Logged user get private pokemons list.', () => {
    it('Should respond with private pokemons.', (done) => {
        app.get('/pokemons/private/1/0')
            .set({'token': token})
            .expect(200, done)
    })
})
describe('Update private pokemon.', () => {
    it('Should respond with status code 500 because this pokemon doesn\'t yours.', (done) => {
        app.put('/pokemons')
            .set({'token': token})
            .send({ id: '1', idUser: 1, name: 'Noctowl', species: 'Owl', ability: 'Insomnia', color: 'Brown' })
            .expect(500, done)
    })
})
describe('Update private pokemon.', () => {
    it('Should update your pokemon.', (done) => {
        app.put('/pokemons')
            .set({'token': token})
            .send({ id: '6', idUser: 1, name: 'Charmander', species: 'Lizard', ability: 'Blaze', color: 'Orange' })
            .expect(200, done)
    })
})
describe('Delete private pokemon.', () => {
    it('Should respond with status code 500 because this pokemon doesn\'t yours.', (done) => {
        app.put('/pokemons/delete/pokemon')
            .set({'token': token})
            .send({ idUser: 1, idPokemon: 1 })
            .expect(500, done)
    })
})
describe('Delete private pokemon.', () => {
    it('Should change the state of your pokemon to zero (Logical delete).', (done) => {
        app.put('/pokemons/delete/pokemon')
            .set({'token': token})
            .send({ idUser: 1, idPokemon: 6 })
            .expect(200, done)
    })
})
describe('Delete private pokemons.', () => {
    it('Should change the state of your pokemons to zero (Logical delete).', (done) => {
        app.put('/pokemons/delete/pokemons')
            .set({'token': token})
            .send({ idUser: 1 })
            .expect(200, done)
    })
})
describe('Like public pokemon.', () => {
    it('Should respond with status code 400 bad request.', (done) => {
        app.put('/pokemons/like')
            .set({'token': token})
            .send({ idUser: 1 })
            .expect(400, done)
    })
})
describe('Like public pokemon.', () => {
    it('Should like a public pokemon.', (done) => {
        app.put('/pokemons/like')
            .set({'token': token})
            .send({ idUser: 1, idPokemon: '3' })
            .expect(200, done)
    })
})
describe('Get Liked public pokemons.', () => {
    it('Should get all liked public pokemons.', (done) => {
        app.get('/pokemons/public-liked/1/0')
            .set({'token': token})
            .expect(200, done)
    })
})
describe('Get random number from other API.', () => {
    it('Should get a random number generated from other API.', (done) => {
        app.get('/randomNumber').expect(200, done)
    })
})
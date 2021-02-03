
let app = require('../app')
let socket = require('../socket');
let http = require('http');
let { connect } = require('socket.io-client');
let assert = require('assert');


describe("socket", () => {
    before(() => {
        app;
        app.set('port', 3001);
        let server = http.createServer(app);
        socket.socket.createSocketConnection(server);
        server.listen(3001);
    })

    it("should create a new server socket", (done) => {
        app;
        app.set('port', 3001);
        socket.socket.createSocketConnection(http.createServer(app));
        done()
    });

    it('it should connect to socket', (done) => {

        const client = connect("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });
        client.on("connect", () => {
            done();
        });
    });

    it('should not join class if teacher is not joined', (done) => {

        const client = connect("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });
        client.on("connect", () => {

            client.emit('joinClassRoom', { id: client.id, className: 'classA' }, (isAvailable) => {

                assert.strictEqual(isAvailable, false);
                done();
            });
        });
    });

    it('should join class if teacher joined the class', (done) => {

        const teacher = connect("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });

        const student = connect("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });
        student.on("connect", () => {
            console.log("student connected");
        });
        teacher.on("connect", () => {

            teacher.emit('startClass', { id: teacher.id, className: 'classA' }, () => {
                console.log("teacher joined the class");

                student.emit('joinClassRoom', { id: student.id, className: 'classA' }, (isAvailable) => {

                    assert.strictEqual(isAvailable, true);
                    student.disconnect(true);
                    done();
                });

            });
        });
    });



    it('teacher should end the class', (done) => {

        const teacher = connect("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });

        const student = connect("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });
        student.on("connect", () => {
            console.log("student connected");
        });
        teacher.on("connect", () => {

            teacher.emit('startClass', { id: teacher.id, className: 'classA' }, () => {
                console.log("teacher joined the class");

                student.emit('joinClassRoom', { id: student.id, className: 'classA' }, (isAvailable) => {

                    assert.strictEqual(isAvailable, true);
                    teacher.emit('endClass', { id: teacher.id, className: 'classA' }, () => {
                        done();
                    });
                });

            });
        });
    });
});
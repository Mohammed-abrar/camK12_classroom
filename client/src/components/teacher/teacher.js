import React from 'react';
import { DisplayClassRoom } from '../display/display';

export class Teacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isClassStarted: false,
            isClassEnded: false
        };

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    // handleChange(event) {
    //     this.setState({ className: event.target.value });
    // }
    render() {

        if (this.state.isClassEnded) {
            return (<div><center> <h1>Class ended</h1></center></div>)
        }
        return (
            <div>
                <center><h3>Teacher component</h3></center>
                {/* <input type="text" className="input" value={this.state.className} onChange={this.handleChange} /> */}
                <button className="button" onClick={this.start} disabled={this.state.isClassStarted}>Start Class</button>
                <button className="button" onClick={this.end}> End Class</button>
                <DisplayClassRoom classroom={this.props.classroomDetails} />
            </div>

        );
    }

    start() {
        console.log('start class');

        this.props.socket.emit('startClass', { id: this.props.socket.id, className: 'classA' }, () => {
            console.log('Ack from the startClass event');
        });
        this.setState({ isClassStarted: true });
    }

    end() {
        this.setState({ isClassEnded: true });
        this.props.socket.emit('endClass', { id: this.props.socket.id, className: 'classA' }, (data) => {

            this.props.socket.disconnect(true);
        });
    }
}


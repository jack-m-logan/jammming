import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    
    renderAction() {
        if (this.props.isRemoval) {
            return <button onClick={this.removeTrack} className="Track-action">-</button>
        } else {
            return <button onClick={this.addTrack} className="Track-action">+</button>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    {this.props.track.name} | {this.props.track.album}
                </div>
                <button className="Track-action">{this.renderAction()}</button>
            </div>
        )
    }
}
import React, { Component } from 'react';

class IndexComponent extends Component {
  render() {
    return (
      <section>
        <h2>Demos</h2>
        <ul ref="indexList" className="index-list">
          {this.props.demos.map((item, index) => {
            return (<li key={index}><a href={item.url}>{item.name}</a></li>);
          })}
        </ul>
      </section>
    );
  }
}

IndexComponent.defaultProps = {
  demos: [
    { name: 'Uptime Boxes', url: '/?uptime-boxes' }
  ]
};

export default IndexComponent;

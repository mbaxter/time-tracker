"use strict";
const React = require('react');
const TimeBlockWidget = require('../stateful/time-block-widget');

const HomePage = () => {
   return (
       <div>
          <TimeBlockWidget />
       </div>
   );
};

module.exports = HomePage;